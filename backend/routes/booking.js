const express = require("express");
const router = express.Router();
const db = require("../config/db");
const sendBookingConfirmation = require("./email");
const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('../config/paypalConfig');

router.post("/create", async (req, res) => {
  const { full_name, gender, cmnd, email, phone, address, room_id, check_in_date, check_out_date, total_price, payment_status, payment_method, services } = req.body;

  if (!full_name || !phone || !room_id || !check_in_date || !check_out_date || !total_price || !payment_status || !payment_method) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
  }

  try {
    const [room] = await db.execute("SELECT status FROM rooms WHERE room_id = ?", [room_id]);
    if (room.length === 0 || room[0].status !== "available") {
      return res.status(400).json({ message: "Phòng không khả dụng!" });
    }

    let customer_id;
    const [existingCustomer] = await db.execute("SELECT customer_id FROM customers WHERE phone_number = ?", [phone]);
    if (existingCustomer.length > 0) {
      customer_id = existingCustomer[0].customer_id;
    } else {
      const [customerResult] = await db.execute(
        "INSERT INTO customers (full_name, gender, address, phone_number, id_card, email) VALUES (?, ?, ?, ?, ?, ?)",
        [full_name, gender, address, phone, cmnd, email]
      );
      customer_id = customerResult.insertId;
    }

    const [bookingResult] = await db.execute(
      "INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date, booking_date, status, total_price, payment_status, payment_method) VALUES (?, ?, ?, ?, NOW(), 'booked', ?, ?, ?)",
      [customer_id, room_id, check_in_date, check_out_date, total_price, payment_status, payment_method]
    );
    const booking_id = bookingResult.insertId;

    await db.execute("UPDATE rooms SET status = 'booked' WHERE room_id = ?", [room_id]);

    // Lưu dịch vụ vào used_services (không có total_price)
    if (services && Array.isArray(services) && services.length > 0) {
      for (const service of services) {
        const { service_id, quantity } = service;
        if (!service_id || !quantity) {
          return res.status(400).json({ message: "Thông tin dịch vụ không hợp lệ!" });
        }
        await db.execute(
          "INSERT INTO used_services (booking_id, service_id, quantity) VALUES (?, ?, ?)",
          [booking_id, service_id, quantity]
        );
      }
    }

    if (email) {
      await sendBookingConfirmation(email, {
        booking_id,
        check_in_date,
        check_out_date,
        payment_status,
        payment_method,
      });
    }

    if (payment_method === 'paypal') {
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: 'USD', value: (total_price * 0.00004).toFixed(2) } }] // Chuyển VND sang USD nếu cần
      });

      try {
        const order = await client.execute(request);
        return res.status(201).json({ message: "Đặt phòng thành công!", booking_id, paypal_order_id: order.result.id });
      } catch (error) {
        console.error("Lỗi khi tạo đơn hàng PayPal:", error);
        return res.status(500).json({ message: "Lỗi khi tạo đơn hàng PayPal!" });
      }
    }

    res.status(201).json({ message: "Đặt phòng thành công!", booking_id });
  } catch (error) {
    console.error("Lỗi khi đặt phòng:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});
 
// API Trả phòng
router.post("/checkout", async (req, res) => {
    const { booking_id } = req.body;

    if (!booking_id) {
        return res.status(400).json({ message: "Thiếu mã đặt phòng!" });
    }

    try {
        const [booking] = await db.execute("SELECT room_id, status FROM bookings WHERE booking_id = ?", [booking_id]);

        if (booking.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng!" });
        }

        if (booking[0].status !== "checked_in") {
            return res.status(400).json({ message: "Phòng chưa được nhận!" });
        }

        const room_id = booking[0].room_id;

        await db.execute("UPDATE bookings SET status = 'checked_out' WHERE booking_id = ?", [booking_id]);

        await db.execute("UPDATE rooms SET status = 'available' WHERE room_id = ?", [room_id]);

        res.status(200).json({ message: "Trả phòng thành công!" });

    } catch (error) {
        console.error("Lỗi khi trả phòng:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// API Hủy phòng
router.post("/cancel", async (req, res) => {
    const { booking_id } = req.body;

    if (!booking_id) {
        return res.status(400).json({ message: "Vui lòng cung cấp booking_id!" });
    }

    try {
        // Gọi stored procedure để xử lý hủy phòng
        const [result] = await db.execute("CALL cancel_booking(?, NOW())", [booking_id]);

        // Cập nhật trạng thái phòng thành 'available' sau khi hủy phòng
        await db.execute(
            "UPDATE rooms SET status = 'available' WHERE room_id = (SELECT room_id FROM bookings WHERE booking_id = ?)",
            [booking_id]
        );

        res.status(200).json({ message: "Hủy đặt phòng thành công!", cancellation_fee: result[0]?.cancellation_fee || 0 });
    } catch (error) {
        console.error("Lỗi khi hủy phòng:", error);
        res.status(500).json({ message: "Lỗi server khi hủy phòng!" });
    }
});

// API Lấy danh sách đặt phòng
router.get("/getAll", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        b.*, 
        c.full_name AS full_name, 
        r.room_number 
      FROM bookings b
      LEFT JOIN customers c ON b.customer_id = c.customer_id
      LEFT JOIN rooms r ON b.room_id = r.room_id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đặt phòng', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { client } = require('../config/paypalConfig');
const paypal = require('@paypal/checkout-server-sdk');
const db = require("../config/db");
const sendBookingConfirmation = require("./email");

router.post('/create-booking', async (req, res) => {
  const { full_name, gender, address, phone, cmnd, email, room_id, check_in_date, check_out_date, total_price, currency, services } = req.body;

  if (!full_name || !phone || !room_id || !check_in_date || !check_out_date || !total_price || !currency) {
    return res.status(400).json({ error: 'Thiếu thông tin đặt phòng!' });
  }

  try {
    // Kiểm tra phòng có khả dụng không
    const [room] = await db.execute("SELECT status FROM rooms WHERE room_id = ?", [room_id]);
    if (room.length === 0 || room[0].status !== "available") {
      return res.status(400).json({ message: "Phòng không khả dụng!" });
    }

    // Kiểm tra khách hàng đã tồn tại chưa
    let customer_id;
    const [existingCustomer] = await db.execute("SELECT customer_id FROM customers WHERE full_name = ?", [full_name]);
    if (existingCustomer.length > 0) {
      customer_id = existingCustomer[0].customer_id;
    } else {
      const [customerResult] = await db.execute(
        "INSERT INTO customers (full_name, gender, address, phone_number, id_card, email) VALUES (?, ?, ?, ?, ?, ?)",
        [full_name, gender, address, phone, cmnd, email]
      );
      customer_id = customerResult.insertId;
    }

    // Tạo booking với payment_status = 'pending'
    const [bookingResult] = await db.execute(
      "INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date, booking_date, status, total_price, payment_status, payment_method) VALUES (?, ?, ?, ?, NOW(), 'booked', ?, 'pending', 'paypal')",
      [customer_id, room_id, check_in_date, check_out_date, total_price]
    );
    const booking_id = bookingResult.insertId;

    // Lưu dịch vụ vào used_service
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

    // Cập nhật trạng thái phòng thành 'booked'
    await db.execute("UPDATE rooms SET status = 'booked' WHERE room_id = ?", [room_id]);

    // Tạo đơn hàng PayPal (bỏ return_url và cancel_url)
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: total_price
        }
      }]
    });

    const order = await client.execute(request);
    if (!order.result || !order.result.id) {
      return res.status(500).json({ error: 'Không thể tạo đơn hàng PayPal!' });
    }

    const approve_url = order.result.links.find(link => link.rel === "approve")?.href;
    if (!approve_url) {
      return res.status(500).json({ error: 'Không thể lấy URL thanh toán từ PayPal!' });
    }

    // Trả về order_id, booking_id và approve_url
    res.json({ order_id: order.result.id, booking_id, approve_url });
  } catch (error) {
    console.error("Lỗi khi tạo booking:", error);
    res.status(500).json({ error: 'Không thể tạo đơn đặt phòng!' });
  }
});

router.post('/capture-order', async (req, res) => {
  console.log("Received data:", req.body);

  const { order_id, booking_id } = req.body;

  if (!order_id || !booking_id) {
    return res.status(400).json({ error: 'Thiếu thông tin thanh toán!' });
  }

  try {
    // Cập nhật trạng thái thanh toán thành 'paid'
    await db.execute("UPDATE bookings SET payment_status = 'paid' WHERE booking_id = ?", [booking_id]);

    // Gửi email xác nhận (nếu cần)
    const [booking] = await db.execute(
      "SELECT email FROM customers WHERE customer_id = (SELECT customer_id FROM bookings WHERE booking_id = ?)",
      [booking_id]
    );
    if (booking[0].email) {
      await sendBookingConfirmation(booking[0].email, {
        booking_id,
        payment_status: 'paid',
        payment_method: 'paypal',
      });
    }

    res.json({ message: 'Thanh toán thành công!' });
  } catch (error) {
    console.error("Lỗi khi xử lý thanh toán PayPal:", error);
    res.status(500).json({ error: 'Không thể xử lý thanh toán PayPal!' });
  }
});

router.post('/cancel-order', async (req, res) => {
  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ error: 'Thiếu booking_id!' });
  }

  try {
    // Kiểm tra trạng thái đơn đặt phòng
    const [booking] = await db.execute(
      "SELECT payment_status, room_id FROM bookings WHERE booking_id = ?",
      [booking_id]
    );

    if (booking.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn đặt phòng!' });
    }

    if (booking[0].payment_status === 'pending') {
      // Cập nhật trạng thái đơn đặt phòng thành 'cancelled'
      await db.execute(
        "UPDATE bookings SET payment_status = 'cancelled', status = 'cancelled', cancellation_date = NOW() WHERE booking_id = ?",
        [booking_id]
      );

      // Giải phóng phòng bằng cách cập nhật trạng thái về 'available'
      await db.execute(
        "UPDATE rooms SET status = 'available' WHERE room_id = ?",
        [booking[0].room_id]
      );

      return res.json({ message: 'Đã hủy đơn đặt phòng thành công!' });
    } else {
      return res.status(400).json({ error: 'Đơn đặt phòng không thể hủy vì đã được thanh toán hoặc hủy trước đó!' });
    }
  } catch (error) {
    console.error("Lỗi khi hủy đơn đặt phòng:", error);
    res.status(500).json({ error: 'Không thể hủy đơn đặt phòng!' });
  }
});

module.exports = router;
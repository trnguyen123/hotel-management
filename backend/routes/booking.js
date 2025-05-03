const express = require("express");
const router = express.Router();
const db = require("../config/db");
const sendBookingConfirmation = require("./email");
const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('../config/paypalConfig');

router.post("/create", async (req, res) => {
  const { full_name, gender, cmnd, email, phone, address, room_id, check_in_date, check_out_date, total_price, payment_status, payment_method, services } = req.body;

  // Kiểm tra thông tin đầu vào
  if (!full_name || !phone || !room_id || !check_in_date || !check_out_date || !total_price || !payment_status || !payment_method) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
  }

  try {
    // Chuyển đổi ngày tháng sang định dạng Date và chuẩn hóa múi giờ
    const newCheckIn = new Date(check_in_date);
    const newCheckOut = new Date(check_out_date);

    // Chuẩn hóa về cùng múi giờ (bỏ qua giờ, chỉ so sánh ngày)
    newCheckIn.setHours(0, 0, 0, 0);
    newCheckOut.setHours(0, 0, 0, 0);

    // Kiểm tra xem ngày checkout có trước ngày checkin không
    if (newCheckOut < newCheckIn) {
      return res.status(400).json({ message: "Ngày check-out không được trước ngày check-in!" });
    }

    // Kiểm tra xem phòng có tồn tại không
    const [room] = await db.execute("SELECT room_id FROM rooms WHERE room_id = ?", [room_id]);
    if (room.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phòng!" });
    }

    // Kiểm tra xung đột thời gian với các booking hiện có
    const [existingBookings] = await db.execute(
      "SELECT check_in_date, check_out_date FROM bookings WHERE room_id = ? AND status IN ('booked', 'checked_in')",
      [room_id]
    );
    console.log("Bookings hiện có của phòng:", existingBookings);

    // Kiểm tra xung đột thời gian
    let hasConflict = false;
    let conflictMessage = "";
    if (existingBookings.length > 0) {
      for (const booking of existingBookings) {
        const existingCheckIn = new Date(booking.check_in_date);
        const existingCheckOut = new Date(booking.check_out_date);

        // Chuẩn hóa múi giờ (bỏ qua giờ, chỉ so sánh ngày)
        existingCheckIn.setHours(0, 0, 0, 0);
        existingCheckOut.setHours(0, 0, 0, 0);

        // Kiểm tra xung đột thời gian
        if (newCheckIn <= existingCheckOut && newCheckOut >= existingCheckIn) {
          hasConflict = true;
          conflictMessage = `Phòng đã được đặt từ ${existingCheckIn.toLocaleDateString()} đến ${existingCheckOut.toLocaleDateString()}! Vui lòng chọn thời gian khác.`;
          break; 
        }
      }
    }

    // Nếu có xung đột, trả về thông báo lỗi và dừng lại
    if (hasConflict) {
      console.log("Conflict detected:", conflictMessage);
      return res.status(400).json({ message: conflictMessage });
    }

    // Xử lý thông tin khách hàng
    let customer_id;
    const [existingCustomer] = await db.execute(
      "SELECT customer_id FROM customers WHERE phone_number = ? AND email = ?",
      [phone, email]
    );

    if (existingCustomer.length > 0) {
      customer_id = existingCustomer[0].customer_id;
    } else {
      const [customerResult] = await db.execute(
        "INSERT INTO customers (full_name, gender, address, phone_number, id_card, email) VALUES (?, ?, ?, ?, ?, ?)",
        [full_name, gender, address, phone, cmnd, email]
      );
      customer_id = customerResult.insertId;
    }

    // Tạo booking mới
    const [bookingResult] = await db.execute(
      "INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date, booking_date, status, total_price, payment_status, payment_method) VALUES (?, ?, ?, ?, NOW(), 'booked', ?, ?, ?)",
      [customer_id, room_id, check_in_date, check_out_date, total_price, payment_status, payment_method]
    );
    const booking_id = bookingResult.insertId;

    // Cập nhật trạng thái phòng
    await db.execute("UPDATE rooms SET status = 'booked' WHERE room_id = ?", [room_id]);

    // Lưu dịch vụ (nếu có)
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

    // Gửi email xác nhận (nếu có email)
    if (email) {
      await sendBookingConfirmation(email, {
        booking_id,
        check_in_date,
        check_out_date,
        payment_status,
        payment_method,
      });
    }

    // Trả về kết quả thành công
    return res.status(201).json({ message: "Đặt phòng thành công!", booking_id });

  } catch (error) {
    console.error("Lỗi khi đặt phòng:", error);
    return res.status(500).json({ message: "Lỗi server!" });
  }
});

// API Nhận phòng
router.post("/checkin", async (req, res) => {
  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ message: "Thiếu mã đặt phòng!" });
  }

  try {
    const [booking] = await db.execute(
      "SELECT room_id, status, check_in_date, payment_method FROM bookings WHERE booking_id = ?",
      [booking_id]
    );

    if (booking.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng!" });
    }

    if (booking[0].status !== "booked") {
      return res.status(400).json({ message: "Phòng chưa được đặt hoặc đã nhận phòng!" });
    }

    // Kiểm tra ngày hiện tại so với ngày nhận phòng
    const checkInDate = new Date(booking[0].check_in_date);
    const currentDate = new Date();

    // Chuẩn hóa về cùng múi giờ (bỏ qua giờ, chỉ so sánh ngày)
    checkInDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (currentDate < checkInDate) {
      console.log("Chưa đến ngày nhận phòng với booking_id:", booking_id, "check_in_date:", checkInDate);
      return res.status(400).json({ message: "Chưa đến ngày nhận phòng, không thể check-in!" });
    }

    const room_id = booking[0].room_id;

    // Nếu payment_method là cash, cập nhật payment_status thành paid
    if (booking[0].payment_method === "cash") {
      await db.execute(
        "UPDATE bookings SET payment_status = 'paid' WHERE booking_id = ?",
        [booking_id]
      );
    }

    // Cập nhật trạng thái booking và phòng
    await db.execute("UPDATE bookings SET status = 'checked_in' WHERE booking_id = ?", [booking_id]);
    await db.execute("UPDATE rooms SET status = 'occupied' WHERE room_id = ?", [room_id]);

    res.status(200).json({ message: "Nhận phòng thành công!" });

  } catch (error) {
    console.error("Lỗi khi nhận phòng:", error);
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
    const [booking] = await db.execute(
      "SELECT room_id, status, check_in_date FROM bookings WHERE booking_id = ?",
      [booking_id]
    );

    if (booking.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng!" });
    }

    if (booking[0].status !== "checked_in") {
      return res.status(400).json({ message: "Phòng chưa được nhận!" });
    }

    const checkInDate = new Date(booking[0].check_in_date);
    const currentDate = new Date();

    if (currentDate < checkInDate) {
      console.log("Chưa đến ngày nhận phòng với booking_id:", booking_id, "check_in_date:", checkInDate);
      return res.status(400).json({ message: "Chưa đến ngày nhận phòng, không thể trả phòng!" });
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
    // Kiểm tra booking có tồn tại và lấy payment_method
    const [booking] = await db.execute(
      "SELECT payment_method FROM bookings WHERE booking_id = ?",
      [booking_id]
    );

    if (booking.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng!" });
    }

    // Nếu payment_method là cash, cập nhật payment_status thành unpaid
    if (booking[0].payment_method === "cash") {
      await db.execute(
        "UPDATE bookings SET payment_status = 'unpaid' WHERE booking_id = ?",
        [booking_id]
      );
    }

    // Gọi stored procedure để xử lý hủy phòng
    const [result] = await db.execute("CALL cancel_booking(?, NOW())", [booking_id]);

    // Cập nhật trạng thái phòng thành 'available' sau khi hủy phòng
    await db.execute(
      "UPDATE rooms SET status = 'available' WHERE room_id = (SELECT room_id FROM bookings WHERE booking_id = ?)",
      [booking_id]
    );

    res.status(200).json({ 
      message: "Hủy đặt phòng thành công!", 
      cancellation_fee: result[0]?.cancellation_fee || 0 
    });
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
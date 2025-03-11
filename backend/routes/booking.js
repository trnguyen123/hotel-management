const express = require("express");
const router = express.Router();
const db = require("../config/db");
const sendBookingConfirmation = require("./email");

router.post("/create", async (req, res) => {
  const { full_name, gender, cmnd, email, phone, address, room_id, check_in_date, check_out_date, total_price, payment_status, payment_method } = req.body;

  if (!full_name || !phone || !room_id || !check_in_date || !check_out_date || !total_price || !payment_status || !payment_method) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
  }

  try {
    let customer_id;

    const [room] = await db.execute("SELECT status FROM rooms WHERE room_id = ?", [room_id]);

    if (room.length === 0) {
      return res.status(404).json({ message: "Phòng không tồn tại!" });
    }

    if (room[0].status !== "available") {
      return res.status(400).json({ message: "Phòng đã được đặt, vui lòng chọn phòng khác!" });
    }

    const [existingCustomer] = await db.execute(
      "SELECT customer_id FROM customers WHERE phone_number = ?",
      [phone]
    );

    if (existingCustomer.length > 0) {
      customer_id = existingCustomer[0].customer_id;
    } else {
      const [customerResult] = await db.execute(
        `INSERT INTO customers (full_name, gender, address, phone_number, id_card, email) 
         VALUES (?, ?, ?, ?, ?, ?)`,

        [full_name, gender, address, phone, cmnd, email]
      );
      customer_id = customerResult.insertId;
    }

    const [bookingResult] = await db.execute(
      `INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date, booking_date, status, total_price, payment_status, payment_method)
       VALUES (?, ?, ?, ?, NOW(), 'booked', ?, ?, ?)`,
      [customer_id, room_id, check_in_date, check_out_date, total_price, payment_status, payment_method]
    );

    await db.execute("UPDATE rooms SET status = 'booked' WHERE room_id = ?", [room_id]);

    if (email) {
      await sendBookingConfirmation(email, {
        booking_id: bookingResult.insertId,
        check_in_date,
        check_out_date,
        payment_status,
        payment_method,
      });
    }

    res.status(201).json({ message: "Đặt phòng thành công!", booking_id: bookingResult.insertId });

  } catch (error) {
    console.error("Lỗi khi đặt phòng:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// API Lấy tất cả booking
router.get("/getAll", async (req, res) => {
  try {
    const [bookings] = await db.execute(`
      SELECT 
        b.booking_id,
        b.customer_id,
        b.room_id,
        b.check_in_date,
        b.check_out_date,
        b.booking_date,
        b.status,
        b.total_price,
        b.payment_status,
        b.payment_method, 
        c.full_name AS customer_name,
        c.phone_number AS customer_phone,
        r.room_number,
        r.room_type
      FROM bookings b
      JOIN customers c ON b.customer_id = c.customer_id
      JOIN rooms r ON b.room_id = r.room_id
    `);

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách booking:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;
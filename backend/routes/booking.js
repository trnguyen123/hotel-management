const express = require("express");
const router = express.Router();
const db = require("../config/db");
const sendBookingConfirmation = require("./email");

router.post("/create", async (req, res) => {
  const { full_name, gender, cmnd, email, phone, address, room_id, check_in_date, check_out_date, total_price, payment_status } = req.body;

  if (!full_name || !phone || !room_id || !check_in_date || !check_out_date || !total_price || !payment_status) {
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
      `INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date, booking_date, status, total_price, payment_status)
       VALUES (?, ?, ?, ?, NOW(), 'booked', ?, ?)`,
      [customer_id, room_id, check_in_date, check_out_date, total_price, payment_status]
    );

    await db.execute("UPDATE rooms SET status = 'booked' WHERE room_id = ?", [room_id]);

    if (email) {
      await sendBookingConfirmation(email, {
        booking_id: bookingResult.insertId,
        check_in_date,
        check_out_date,
        payment_status,
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

// API Nhận phòng
router.post("/checkin", async (req, res) => {
    const { booking_id } = req.body;

    if (!booking_id) {
        return res.status(400).json({ message: "Thiếu mã đặt phòng!" });
    }

    try {
        const [booking] = await db.execute("SELECT room_id, status FROM bookings WHERE booking_id = ?", [booking_id]);

        if (booking.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng!" });
        }

        if (booking[0].status !== "booked") {
            return res.status(400).json({ message: "Phòng chưa được đặt hoặc đã nhận phòng!" });
        }

        const room_id = booking[0].room_id;

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
        const [booking] = await db.execute("SELECT room_id, status FROM bookings WHERE booking_id = ?", [booking_id]);

        if (booking.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng!" });
        }

        if (booking[0].status !== "booked") {
            return res.status(400).json({ message: "Phòng chưa được đặt hoặc đã trả phòng!" });
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

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/db"); // Lấy db đã sửa

router.get("/getAll", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT b.booking_id, r.room_number, b.check_in_date, b.check_out_date, b.status, c.full_name, b.customer_id, b.room_id
            FROM bookings b
            JOIN customers c ON b.customer_id = c.customer_id
            JOIN rooms r ON b.room_id = r.room_id
            WHERE b.status IN ('booked', 'checked_in')
        `);

        const formattedData = rows.map(booking => ({
            booking_id: booking.booking_id,
            room: booking.room_number,
            customer: booking.full_name,
            check_in: booking.check_in_date,
            check_out: booking.check_out_date,
            status: booking.status,
            color: booking.status === 'booked' ? 'green' : 'orange',
            customer_id: booking.customer_id, 
            room_id: booking.room_id
        }));

        res.json(formattedData);
    } catch (error) {
        console.error("Lỗi API:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
});

module.exports = router;

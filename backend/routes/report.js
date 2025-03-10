const express = require("express");
const router = express.Router();
const db = require("../config/db");

// API tạo báo cáo mới
router.post("/create", async (req, res) => {
    const { report_content, room_number } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!report_content || !room_number) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    try {
         // Tìm `room_id` từ `room_number`
         const [roomResult] = await db.execute("SELECT room_id FROM rooms WHERE room_number = ?", [room_number]);

         if (roomResult.length === 0) {
             return res.status(404).json({ message: "Phòng không tồn tại!" });
         }
 
         const room_id = roomResult[0].room_id;

        // Thêm báo cáo vào bảng reports 
        const [result] = await db.execute(
            "INSERT INTO reports (report_content, room_id) VALUES (?, ?)",
            [report_content, room_id]
        );

        res.status(201).json({ message: "Báo cáo đã được tạo!", report_id: result.insertId });
    } catch (error) {
        console.error("Lỗi khi tạo báo cáo:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

// API lấy danh sách tất cả các report
router.get("/getAll", async (req, res) => {
    try {
        const [reports] = await db.execute(`
            SELECT 
                r.report_id,
                r.report_content,
                r.room_id,
                r.generated_at,
                rm.room_number
            FROM reports r
            JOIN rooms rm ON r.room_id = rm.room_id
        `);

        res.status(200).json(reports);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách báo cáo:", error);
        res.status(500).json({ message: "Lỗi server!" });
    }
});

module.exports = router;

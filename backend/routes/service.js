const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Các giá trị hợp lệ cho status (giữ nguyên vì status vẫn cần giới hạn)
const validStatuses = ["active", "inactive"];

// Lấy danh sách dịch vụ từ db
router.get("/getAll", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM services");
        res.json(results);
    } catch (error) {
        console.error("Lỗi truy vấn DB:", error);
        res.status(500).json({ error: "Lỗi khi lấy dữ liệu từ DB" });
    }
});

// API tạo dịch vụ mới
router.post("/create", async (req, res) => {
    const { service_name, price, unit, status } = req.body;

    if (!service_name || !price || !unit || !status) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Status phải là: active hoặc inactive!" });
    }

    try {
        const [result] = await db.execute(
            "INSERT INTO services (service_name, price, unit, status) VALUES (?, ?, ?, ?)",
            [service_name, price, unit, status]
        );
        res.status(201).json({ message: "Dịch vụ đã được thêm!", service_id: result.insertId });
    } catch (error) {
        console.error("Lỗi khi thêm dịch vụ:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// API sửa thông tin dịch vụ
router.put("/update/:service_id", async (req, res) => {
    const { service_id } = req.params;
    const { service_name, price, unit, status } = req.body;

    if (!service_name || !price || !unit || !status) {
        return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Status phải là: active hoặc inactive!" });
    }

    try {
        const [result] = await db.execute(
            "UPDATE services SET service_name = ?, price = ?, unit = ?, status = ? WHERE service_id = ?",
            [service_name, price, unit, status, service_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại!" });
        }
        res.json({ message: "Thông tin dịch vụ đã được cập nhật!" });
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin dịch vụ:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// API xóa dịch vụ
router.delete("/delete/:service_id", async (req, res) => {
    const { service_id } = req.params;

    try {
        const [result] = await db.execute("DELETE FROM services WHERE service_id = ?", [service_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Dịch vụ không tồn tại!" });
        }
        res.json({ message: "Dịch vụ đã được xóa!" });
    } catch (error) {
        console.error("Lỗi khi xóa dịch vụ:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;
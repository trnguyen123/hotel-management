const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// API để lấy kết quả phân cụm theo phòng
router.get("/room_clusters", (req, res) => {
    const filePath = path.join(__dirname, "../data_mining/cluster_result.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Lỗi đọc file JSON:", err);
            return res.status(500).json({ message: "Lỗi khi lấy dữ liệu phân cụm" });
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error("Lỗi parse JSON:", parseError);
            res.status(500).json({ message: "Lỗi khi phân tích dữ liệu JSON" });
        }
    });
});

// API để lấy kết quả phân cụm theo phương thức thanh toán
router.get("/payment_clusters", (req, res) => {
    const filePath = path.join(__dirname, "../data_mining/payment_cluster_result.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Lỗi đọc file JSON:", err);
            return res.status(500).json({ message: "Lỗi khi lấy dữ liệu phân cụm" });
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error("Lỗi parse JSON:", parseError);
            res.status(500).json({ message: "Lỗi khi phân tích dữ liệu JSON" });
        }
    });
});

module.exports = router;

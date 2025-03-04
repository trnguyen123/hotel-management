const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// API lấy danh sách voucher
router.get('/getAll', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM vouchers');
        res.json(rows);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách voucher:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;

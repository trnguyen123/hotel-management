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

// API thêm voucher mới
router.post('/create', async (req, res) => {
    const { voucher_code, discount_percentage, expiration_date } = req.body;

    if (!voucher_code || !discount_percentage || !expiration_date) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO vouchers (voucher_code, discount_percentage, expiration_date) VALUES (?, ?, ?)',
            [voucher_code, discount_percentage, expiration_date]
        );
        res.status(201).json({ message: 'Voucher đã được thêm!', voucher_id: result.insertId });
    } catch (error) {
        console.error('Lỗi khi thêm voucher:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API sửa thông tin voucher
router.put('/update/:voucher_id', async (req, res) => {
    const { voucher_id } = req.params;
    const { voucher_code, discount_percentage, expiration_date } = req.body;

    if (!voucher_code || !discount_percentage || !expiration_date) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        const [result] = await db.execute(
            'UPDATE vouchers SET voucher_code = ?, discount_percentage = ?, expiration_date = ? WHERE voucher_id = ?',
            [voucher_code, discount_percentage, expiration_date, voucher_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voucher không tồn tại!' });
        }
        res.json({ message: 'Thông tin voucher đã được cập nhật!' });
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin voucher:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API xóa voucher
router.delete('/delete/:voucher_id', async (req, res) => {
    const { voucher_id } = req.params;

    try {
        const [result] = await db.execute('DELETE FROM vouchers WHERE voucher_id = ?', [voucher_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Voucher không tồn tại!' });
        }
        res.json({ message: 'Voucher đã được xóa!' });
    } catch (error) {
        console.error('Lỗi khi xóa voucher:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;

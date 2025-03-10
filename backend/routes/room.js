const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// Lấy danh sách room_number và room_type 
router.get('/getNumberAndType', async (req, res) => {
    try {
        const [results] = await db.execute('SELECT room_id, room_number, room_type, price, status FROM rooms');
        res.json(results);
    } catch (err) {
        console.error('Lỗi khi lấy danh sách phòng:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Lấy thông tin chi tiết của phòng
router.get('/:room_id', async (req, res) => {
    const { room_id } = req.params;
    try {
      const [rows] = await db.execute('SELECT * FROM rooms WHERE room_id = ?', [room_id]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(rows[0]);
    } catch (err) {
        console.error('Lỗi khi lấy thông tin chi tiết của phòng:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Thêm phòng mới
router.post('/create', async (req, res) => {
    const { room_number, room_type, price, status } = req.body;
    if (!room_number || !room_type || !price || !status) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO rooms (room_number, room_type, price, status) VALUES (?, ?, ?, ?)',
            [room_number, room_type, price, status]
        );
        res.status(201).json({ message: 'Phòng đã được thêm!', room_id: result.insertId });
    } catch (err) {
        console.error('Lỗi khi thêm phòng:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Sửa thông tin phòng
router.put('/update/:room_id', async (req, res) => {
    const { room_id } = req.params;
    const { room_number, room_type, price, status } = req.body;
    if (!room_number || !room_type || !price || !status) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        const [result] = await db.execute(
            'UPDATE rooms SET room_number = ?, room_type = ?, price = ?, status = ? WHERE room_id = ?',
            [room_number, room_type, price, status, room_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Phòng không tồn tại!' });
        }
        res.json({ message: 'Thông tin phòng đã được cập nhật!' });
    } catch (err) {
        console.error('Lỗi khi cập nhật thông tin phòng:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Xóa phòng
router.delete('/delete/:room_id', async (req, res) => {
    const { room_id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM rooms WHERE room_id = ?', [room_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Phòng không tồn tại!' });
        }
        res.json({ message: 'Phòng đã được xóa!' });
    } catch (err) {
        console.error('Lỗi khi xóa phòng:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;

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

module.exports = router;

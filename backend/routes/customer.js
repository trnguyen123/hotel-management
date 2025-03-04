const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// API để lấy thông tin chi tiết của khách hàng
router.get('/:customer_id', async (req, res) => {
  const { customer_id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM customers WHERE customer_id = ?', [customer_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Lỗi khi lấy thông tin chi tiết của khách hàng:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
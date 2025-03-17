const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const bcrypt = require('bcrypt'); 

// API lấy danh sách nhân viên
router.get('/getAll', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM employees');
        res.json(rows);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// API lấy số lượng nhân viên
router.get('/count', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT COUNT(*) as count FROM employees');
      res.json({ count: rows[0].count });
    } catch (error) {
      console.error('Lỗi khi lấy số lượng nhân viên:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
});

// API thêm nhân viên mới
router.post('/create', async (req, res) => {
    const { full_name, email, password, role, phone_number } = req.body;

    if (!full_name || !email || !password || !role || !phone_number) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
    }

    try {
        // Mã hóa mật khẩu
        const saltRounds = 10; // Số vòng băm, 10 là mặc định phổ biến
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const [result] = await db.execute(
            'INSERT INTO employees (full_name, email, password, role, phone_number) VALUES (?, ?, ?, ?, ?)',
            [full_name, email, hashedPassword, role, phone_number]
        );
        res.status(201).json({ message: 'Nhân viên đã được thêm!', employee_id: result.insertId });
    } catch (error) {
        console.error('Lỗi khi thêm nhân viên:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// API cập nhật nhân viên (nếu cần mã hóa password khi cập nhật)
router.put('/update/:employee_id', async (req, res) => {
    const { employee_id } = req.params;
    const { full_name, email, password, role, phone_number } = req.body;

    if (!full_name || !email || !role || !phone_number) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin (trừ password)!' });
    }

    try {
        let query, params;
        if (password) {
            // Nếu có password, mã hóa trước khi cập nhật
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            query = 'UPDATE employees SET full_name = ?, email = ?, password = ?, role = ?, phone_number = ? WHERE employee_id = ?';
            params = [full_name, email, hashedPassword, role, phone_number, employee_id];
        } else {
            // Nếu không có password, bỏ qua
            query = 'UPDATE employees SET full_name = ?, email = ?, role = ?, phone_number = ? WHERE employee_id = ?';
            params = [full_name, email, role, phone_number, employee_id];
        }

        const [result] = await db.execute(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
        }
        res.json({ message: 'Thông tin nhân viên đã được cập nhật!' });
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin nhân viên:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// API xóa nhân viên
router.delete('/delete/:employee_id', async (req, res) => {
    const { employee_id } = req.params;

    try {
        const [result] = await db.execute('DELETE FROM employees WHERE employee_id = ?', [employee_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
        }
        res.json({ message: 'Nhân viên đã được xóa!' });
    } catch (error) {
        console.error('Lỗi khi xóa nhân viên:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;
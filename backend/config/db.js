require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise(); // ⚠ Thêm `.promise()` để có thể dùng `await`

// Kiểm tra kết nối
db.getConnection()
    .then(() => console.log('Kết nối thành công tới MySQL!'))
    .catch((err) => console.error('Lỗi kết nối MySQL:', err));

module.exports = db;

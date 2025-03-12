const express = require('express');
const app = express();
require('dotenv').config({ path: __dirname + '/.env' });

const cors = require('cors');
const session = require('express-session');
const path = require('path');
const bodyParser = require('body-parser');
const port = 5000;
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service');
const reportRoutes = require('./routes/report');
const bookingRoutes = require('./routes/booking');
const roomRoutes = require('./routes/room');
const voucherRoutes = require('./routes/voucher');
const calendarRoutes = require('./routes/calendar');
const customerRoutes = require('./routes/customer');
const paypalRoutes = require('./routes/paypal');
const vnpayRoutes = require('./routes/vnpay');

// Cấu hình CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],  
  credentials: true,  
};

app.use(cors(corsOptions));  // Áp dụng middleware CORS với cấu hình
app.options('*', cors());  // Hỗ trợ OPTIONS requests (Preflight requests)

// Cấu hình middleware express-session
app.use(session({
  secret: 'YJaRa4uuKD',   
  resave: false,               // Không lưu lại session nếu không thay đổi
  saveUninitialized: false,     // Chỉ lưu session nếu có gì thay đổi
  cookie: { secure: false },    // Nếu sử dụng https, bạn cần set secure: true
}));

// Cấu hình body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình static file cho thư mục assets
app.use(express.static(path.join(__dirname, 'assets')));

app.use('/api/auth', authRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/voucher', voucherRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/vnpay', vnpayRoutes);

// Khởi chạy server
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});

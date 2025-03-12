let express = require('express');
let router = express.Router();
const moment = require('moment');
const config = require('config');
const db = require('../config/db'); // Kết nối MySQL
const sendBookingConfirmation = require("./email");

router.post('/create_payment_url', async function (req, res, next) {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnpUrl = config.get('vnp_Url');
    let returnUrl = config.get('vnp_ReturnUrl');

    let orderId = moment(date).format('DDHHmmss');
    let { full_name, gender, address, phone, cmnd, email, room_id, check_in_date, check_out_date, total_price, payment_method } = req.body;
    
    let locale = req.body.language || 'vn';
    let currCode = 'VND';
    
    try {
        // Kiểm tra trạng thái phòng
        const [room] = await db.execute("SELECT status FROM rooms WHERE room_id = ?", [room_id]);
        if (room.length === 0 || room[0].status !== "available") {
            return res.status(400).json({ message: "Phòng không khả dụng!" });
        }

        // Kiểm tra khách hàng đã tồn tại chưa
        let customer_id;
        const [existingCustomer] = await db.execute("SELECT customer_id FROM customers WHERE phone_number = ?", [phone]);
        if (existingCustomer.length > 0) {
            customer_id = existingCustomer[0].customer_id;
        } else {
            const [customerResult] = await db.execute(
                "INSERT INTO customers (full_name, gender, address, phone_number, id_card, email) VALUES (?, ?, ?, ?, ?, ?)",
                [full_name, gender, address, phone, cmnd, email]
            );
            customer_id = customerResult.insertId;
        }

        // Thêm đơn đặt phòng với `payment_status = 'pending'`
        const [bookingResult] = await db.execute(
            "INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date, booking_date, status, total_price, payment_status, payment_method) VALUES (?, ?, ?, ?, NOW(), 'booked', ?, 'pending', ?)",
            [customer_id, room_id, check_in_date, check_out_date, total_price, payment_method]
        );

        let booking_id = bookingResult.insertId;

        // Cập nhật trạng thái phòng
        await db.execute("UPDATE rooms SET status = 'booked' WHERE room_id = ?", [room_id]);

        //Gửi email xác nhận nếu có email
        if (email) {
            await sendBookingConfirmation(email, {
                booking_id,
                check_in_date,
                check_out_date,
                payment_status: 'pending',
                payment_method
            });
        }

        // Chuẩn bị thông tin thanh toán VNPAY
        let vnp_Params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': locale,
            'vnp_CurrCode': currCode,
            'vnp_TxnRef': booking_id,
            'vnp_OrderInfo': 'Thanh toán đặt phòng #' + booking_id,
            'vnp_OrderType': 'hotel_booking',
            'vnp_Amount': total_price * 100,
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': ipAddr,
            'vnp_CreateDate': createDate
        };

        vnp_Params = sortObject(vnp_Params);
        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        res.json({ paymentUrl: vnpUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Database error", details: error });
    }
});

router.get('/vnpay_return', async function (req, res, next) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
    vnp_Params = sortObject(vnp_Params);

    let secretKey = config.get('vnp_HashSecret');
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        let booking_id = vnp_Params['vnp_TxnRef'];
        let orderStatus = vnp_Params['vnp_ResponseCode'] === '00' ? 'paid' : 'pending';

        if (orderStatus === 'paid') {
            await db.execute(
                "UPDATE bookings SET payment_status = 'paid' WHERE booking_id = ?",
                [booking_id]
            );
        }

        res.redirect(`http://localhost:3000/payment-status?status=${orderStatus}&amount=${vnp_Params['vnp_Amount'] / 100}`);
    } else {
        res.status(400).send('Invalid request.');
    }
});

function sortObject(obj) {
    let sorted = {};
    let str = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (let key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = router;

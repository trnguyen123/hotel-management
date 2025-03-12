const express = require('express');
const router = express.Router();
const { client } = require('../config/paypalConfig');
const paypal = require('@paypal/checkout-server-sdk');
const db = require("../config/db");
const sendBookingConfirmation = require("./email");

router.post('/create-booking', async (req, res) => {
  const { full_name, gender, address, phone, cmnd, email, room_id, check_in_date, check_out_date, total_price, currency } = req.body;

  if (!full_name || !phone || !room_id || !check_in_date || !check_out_date || !total_price || !currency) {
    return res.status(400).json({ error: 'Thiếu thông tin đặt phòng!' });
  }

  try {
    // Kiểm tra phòng có khả dụng không
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

    // Tạo booking với payment_status = 'pending'
    const [bookingResult] = await db.execute(
      "INSERT INTO bookings (customer_id, room_id, check_in_date, check_out_date, booking_date, status, total_price, payment_status, payment_method) VALUES (?, ?, ?, ?, NOW(), 'booked', ?, 'pending', 'paypal')",
      [customer_id, room_id, check_in_date, check_out_date, total_price]
    );

    const booking_id = bookingResult.insertId;

    // Cập nhật trạng thái phòng thành 'booked'
    await db.execute("UPDATE rooms SET status = 'booked' WHERE room_id = ?", [room_id]);

    // Tạo đơn hàng PayPal
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: total_price
        }
      }]
    });

    const order = await client.execute(request);
    if (!order.result || !order.result.id) {
      return res.status(500).json({ error: 'Không thể tạo đơn hàng PayPal!' });
    }

    res.json({ order_id: order.result.id, booking_id });
  } catch (error) {
    console.error("Lỗi khi tạo booking:", error);
    res.status(500).json({ error: 'Không thể tạo đơn đặt phòng!' });
  }
});


router.post('/capture-order', async (req, res) => {
  const { orderID, booking_id } = req.body;

  if (!orderID || !booking_id) {
    return res.status(400).json({ error: 'Thiếu thông tin thanh toán!' });
  }

  try {
    // Kiểm tra booking có tồn tại không
    const [existingBooking] = await db.execute("SELECT * FROM bookings WHERE booking_id = ?", [booking_id]);
    if (existingBooking.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn đặt phòng!' });
    }
    if (existingBooking[0].payment_status === 'paid') {
      return res.status(400).json({ error: 'Đơn hàng này đã được thanh toán!' });
    }

    // Xác nhận thanh toán qua PayPal
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    const capture = await client.execute(request);

    // Cập nhật trạng thái thanh toán trong DB
    await db.execute("UPDATE bookings SET payment_status = 'paid' WHERE booking_id = ?", [booking_id]);

    // Lấy thông tin khách hàng để gửi email
    const [customer] = await db.execute("SELECT email FROM customers WHERE customer_id = ?", [existingBooking[0].customer_id]);
    if (customer.length > 0 && customer[0].email) {
      await sendBookingConfirmation(customer[0].email, {
        booking_id: booking_id,
        check_in_date: existingBooking[0].check_in_date,
        check_out_date: existingBooking[0].check_out_date,
        payment_status: 'paid',
        payment_method: 'paypal',
      });
    }

    res.json({ message: 'Thanh toán thành công!', capture: capture.result });
  } catch (error) {
    console.error("Lỗi khi xử lý thanh toán PayPal:", error);
    res.status(500).json({ error: 'Không thể xử lý thanh toán PayPal!' });
  }
});

module.exports = router;

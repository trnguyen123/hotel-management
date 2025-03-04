const nodemailer = require("nodemailer");
const db = require("../config/db"); 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "2254810089@vaa.edu.vn", // Email của bạn
    pass: "flbjypjzldgjcihy", // Mật khẩu ứng dụng
  },
});

const sendBookingConfirmation = async (customerEmail, { booking_id, check_in_date, check_out_date, payment_status }) => {
  try {
    // Lấy thông tin chi tiết về đặt phòng và khách hàng
    const [bookingDetails] = await db.execute(
      `SELECT b.total_price, c.full_name, r.room_type 
       FROM bookings b
       JOIN customers c ON b.customer_id = c.customer_id
       JOIN rooms r ON b.room_id = r.room_id
       WHERE b.booking_id = ?`,
      [booking_id]
    );

    if (bookingDetails.length === 0) {
      console.error("Không tìm thấy thông tin đặt phòng!");
      return;
    }

    const { total_price, full_name, room_type } = bookingDetails[0];

    const mailOptions = {
      from: "2254810089@vaa.edu.vn",
      to: customerEmail,
      subject: "Xác nhận đặt phòng thành công",
      html: `
        <h3>Xin chào ${full_name},</h3>
        <p>Bạn đã đặt phòng thành công!</p>
        <p><strong>Thông tin đặt phòng:</strong></p>
        <ul>
          <li><strong>Mã đặt phòng:</strong> ${booking_id}</li>
          <li><strong>Loại phòng:</strong> ${room_type}</li>
          <li><strong>Nhận phòng:</strong> ${check_in_date}</li>
          <li><strong>Trả phòng:</strong> ${check_out_date}</li>
          <li><strong>Tổng tiền:</strong> ${total_price.toLocaleString()} VNĐ</li>
          <li><strong>Trạng thái thanh toán:</strong> ${payment_status === "pending" ? "Chưa thanh toán" : "Đã thanh toán"}</li>
        </ul>
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email xác nhận đặt phòng đã gửi thành công!");
  } catch (error) {
    console.error("Lỗi gửi email:", error);
  }
};

module.exports = sendBookingConfirmation;

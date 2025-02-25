import React, { useState } from "react";
import "../Style/ReservationModal.css";

/* Modal chi tiết booking */
const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi tiết đặt phòng</h2>
          <button type="button" className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="section">
            <h3>Thông tin khách hàng</h3>
            <p><strong>Tên:</strong> {booking.details.full_name}</p>
            <p>
              <strong>Giới tính:</strong>{" "}
              {booking.details.gender === "male" ? "Nam" : "Nữ"}
            </p>
            <p><strong>SĐT:</strong> {booking.details.phone_number}</p>
            <p><strong>Email:</strong> {booking.details.email}</p>
            <p><strong>CMND:</strong> {booking.details.id_card}</p>
            <p><strong>Địa chỉ:</strong> {booking.details.address}</p>
          </div>
          <div className="section">
            <h3>Thông tin phòng</h3>
            <p><strong>Loại phòng:</strong> {booking.details.room_type}</p>
            <p><strong>Số phòng:</strong> {booking.details.room_number}</p>
            <p><strong>Ngày nhận phòng:</strong> {booking.details.check_in_date}</p>
            <p><strong>Ngày trả phòng:</strong> {booking.details.check_out_date}</p>
          </div>
          <div className="section">
            <h3>Thanh toán</h3>
            <p>
              <strong>Phương thức:</strong>{" "}
              {booking.details.payment_method === "cash"
                ? "Tiền mặt"
                : booking.details.payment_method === "credit_card"
                ? "Thẻ tín dụng"
                : "Chuyển khoản"}
            </p>
            <p><strong>Mã giảm giá:</strong> {booking.details.voucher_code || "Không có"}</p>
          </div>
          <div className="section">
            <h3>Dịch vụ đã chọn</h3>
            {booking.details.selected_services.length > 0 ? (
              <ul>
                {booking.details.selected_services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            ) : (
              <p>Không có dịch vụ bổ sung</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReservationModal = ({
  isOpen,
  onClose,
  onBookingCreated,
  selectedBooking,
  onBookingDetailsClosed,
}) => {
  // State form để tạo booking mới
  const [formData, setFormData] = useState({
    check_in_date: "",
    check_out_date: "",
    full_name: "",
    gender: "male",
    address: "",
    phone_number: "",
    id_card: "",
    email: "",
    payment_method: "credit_card",
    room_type: "Family Room",
    room_number: "",
    voucher_code: "",
    selected_services: [],
  });

  if (!isOpen) return null;

  // Nếu có selectedBooking, hiển thị modal chi tiết booking
  if (selectedBooking) {
    return (
      <BookingDetailsModal booking={selectedBooking} onClose={onBookingDetailsClosed} />
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? [...prev.selected_services, value]
            : prev.selected_services.filter((s) => s !== value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xác định màu cho booking: nếu payment_method là "cash" thì xanh lá, ngược lại là cam
    const color = formData.payment_method === "cash" ? "#4CAF50" : "#FFA500";
    const booking = {
      guest: formData.full_name,
      color: color,
      details: { ...formData },
    };
    onBookingCreated(booking);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2>New Reservation</h2>
            <button type="button" className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="section">
              <h3>Thông Tin Khách Hàng</h3>
              <div className="form-row">
                <div className="input-group">
                  <label>Họ và tên</label>
                  <input type="text" name="full_name" required onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Giới tính</label>
                  <select name="gender" onChange={handleInputChange}>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Số CMND</label>
                  <input type="text" name="id_card" required onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" name="email" onChange={handleInputChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Số điện thoại</label>
                  <input type="tel" name="phone_number" required onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Địa chỉ</label>
                  <input type="text" name="address" onChange={handleInputChange} />
                </div>
              </div>
            </div>
            <div className="section">
              <h3>Thông Tin Phòng</h3>
              <div className="form-row">
                <div className="input-group">
                  <label>Loại phòng</label>
                  <select name="room_type" onChange={handleInputChange}>
                    <option>Family Room</option>
                    <option>Queen Room</option>
                    <option>Standard Room</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Số phòng</label>
                  <select name="room_number" required onChange={handleInputChange}>
                    <option value="">Chọn phòng</option>
                    {[...Array(8).keys()].map((i) => (
                      <option key={i + 1} value={`Room ${i + 1}`}>
                        Room {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Ngày nhận phòng</label>
                  <input type="date" name="check_in_date" required onChange={handleInputChange} />
                </div>
                <div className="input-group">
                  <label>Ngày trả phòng</label>
                  <input type="date" name="check_out_date" required onChange={handleInputChange} />
                </div>
              </div>
            </div>
            <div className="section">
              <h3>Dịch Vụ Bổ Sung</h3>
              {/* Có thể thêm dịch vụ nếu cần */}
            </div>
            <div className="section">
              <h3>Thông Tin Thanh Toán</h3>
              <div className="form-row">
                <div className="input-group">
                  <label>Phương thức</label>
                  <select name="payment_method" onChange={handleInputChange}>
                    <option value="credit_card">Thẻ tín dụng</option>
                    <option value="cash">Tiền mặt</option>
                    <option value="bank_transfer">Chuyển khoản</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Mã Voucher</label>
                  <input
                    type="text"
                    name="voucher_code"
                    onChange={handleInputChange}
                    placeholder="Nhập mã giảm giá"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose}>
              Huỷ bỏ
            </button>
            <button type="submit" className="confirm-button">
              Xác nhận đặt phòng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;

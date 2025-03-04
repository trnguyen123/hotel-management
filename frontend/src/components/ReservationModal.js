import React, { useState, useEffect } from "react";
import "../Style/ReservationModal.css";

const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;
  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2>Chi tiết đặt phòng</h2>
          <button type='button' className='close-button' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='modal-body'>
          <div className='section'>
            <h3>Thông tin khách hàng</h3>
            <p><strong>Tên:</strong> {booking.full_name}</p>
            <p>
              <strong>Giới tính:</strong>{" "}
              {booking.details.gender === "male" ? "Nam" : "Nữ"}
            </p>
            <p>
              <strong>SĐT:</strong> {booking.details.phone_number}
            </p>
            <p>
              <strong>Email:</strong> {booking.details.email}
            </p>
            <p>
              <strong>CMND:</strong> {booking.details.id_card}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {booking.details.address}
            </p>
            <p>
              <strong>Thời gian đặt phòng:</strong>{" "}
              {booking.details.booking_time}
            </p>
          </div>
          <div className='section'>
            <h3>Thông tin phòng</h3>
            <p><strong>Loại phòng:</strong> {booking.room_type}</p>
            <p><strong>Số phòng:</strong> {booking.room_number}</p>
            <p><strong>Ngày nhận phòng:</strong> {booking.check_in_date}</p>
            <p><strong>Ngày trả phòng:</strong> {booking.check_out_date}</p>
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
  roomType,
  rooms,
}) => {
  const [formData, setFormData] = useState({
    check_in_date: "",
    check_out_date: "",
    full_name: "",
    gender: "male",
    address: "",
    phone_number: "",
    id_card: "",
    email: "",
    payment_method: "vnpay",
    room_type: roomType,
    room_id: "",
    voucher_code: "",
    selected_services: [],
  });

  const [services, setServices] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      room_type: roomType,
    }));
  }, [roomType]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await fetch("http://localhost:5000/api/service/getAll");
      const data = await response.json();
      setServices(data);
    };

    const fetchVouchers = async () => {
      const response = await fetch("http://localhost:5000/api/voucher/getAll");
      const data = await response.json();
      setVouchers(data);
    };

    const fetchRooms = async () => {
      const response = await fetch("http://localhost:5000/api/room/getNumberAndType");
      const data = await response.json();
      setRoomList(data);
    };

    fetchServices();
    fetchVouchers();
    fetchRooms();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [formData, roomList, services, vouchers]);

  const calculateTotalPrice = () => {
    let roomPrice = 0;
    let servicePrice = 0;
    let discount = 0;

    // Tìm giá phòng
    const selectedRoom = roomList.find(room => String(room.room_id) === String(formData.room_id));
    console.log("Selected Room:", selectedRoom);
    if (selectedRoom && !isNaN(parseFloat(selectedRoom.price))) {
      roomPrice = parseFloat(selectedRoom.price);
    } else {
      console.warn("Không tìm thấy phòng hoặc giá phòng không hợp lệ:", selectedRoom);
    }

    // Tính tổng giá dịch vụ
    if (Array.isArray(formData.selected_services)) {
      formData.selected_services.forEach(serviceName => {
        console.log("Checking service:", serviceName);
        const service = services.find(s => s.service_name === serviceName);
        console.log("Matched Service:", service);
        if (service && !isNaN(parseFloat(service.price))) {
          servicePrice += parseFloat(service.price);
        } else {
          console.warn("Không tìm thấy dịch vụ hoặc giá dịch vụ không hợp lệ:", serviceName);
        }
      });
    } else {
      console.warn("Danh sách dịch vụ không hợp lệ:", formData.selected_services);
    }

    // Tính giảm giá
    const selectedVoucher = vouchers.find(voucher => voucher.voucher_code === formData.voucher_code);
    if (selectedVoucher && !isNaN(parseFloat(selectedVoucher.discount_percentage))) {
      discount = parseFloat(selectedVoucher.discount_percentage);
    } else {
      console.warn("Voucher không hợp lệ hoặc không có discount:", selectedVoucher);
    }

    // Tính tổng tiền, đảm bảo không bị NaN
    const total = (roomPrice + servicePrice) - ((roomPrice + servicePrice) * (discount / 100));
    console.log("Total Price:", total);

    setTotalPrice(total);
  };

  if (!isOpen) return null;

  if (selectedBooking) {
    return (
      <BookingDetailsModal
        booking={selectedBooking}
        onClose={onBookingDetailsClosed}
      />
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

  const handleRoomChange = (e) => {
    const { value } = e.target;
    const selectedRoom = roomList.find(room => room.room_number === value);
    setFormData((prev) => ({
      ...prev,
      room_number: value,
      room_id: selectedRoom ? selectedRoom.room_id : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const color = formData.payment_method === "cash" ? "#4CAF50" : "#FFA500";
    const bookingDetails = {
      full_name: formData.full_name,
      gender: formData.gender,
      cmnd: formData.id_card,
      email: formData.email,
      phone: formData.phone_number,
      address: formData.address,
      room_id: formData.room_id,
      room_type: formData.room_type,
      check_in_date: formData.check_in_date,
      check_out_date: formData.check_out_date,
      total_price: totalPrice,
      payment_status: "pending",
    };
    console.log("Booking Details:", bookingDetails); // Log the booking details

    try {
      const response = await fetch("http://localhost:5000/api/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      });

      if (response.ok) {
        const booking = await response.json();
        const bookingWithGuest = {
          ...booking,
          guest: formData.full_name,
          color: color,
        };
        onBookingCreated(bookingWithGuest);
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Failed to create booking:", errorData);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className='modal-header'>
            <h2>New Reservation</h2>
            <button type='button' className='close-button' onClick={onClose}>
              ×
            </button>
          </div>
          <div className='modal-body'>
            <div className='section'>
              <h3>Thông Tin Khách Hàng</h3>
              <div className='form-row'>
                <div className='input-group'>
                  <label>Họ và tên</label>
                  <input
                    type='text'
                    name='full_name'
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div className='input-group'>
                  <label>Giới tính</label>
                  <select name='gender' onChange={handleInputChange}>
                    <option value='male'>Nam</option>
                    <option value='female'>Nữ</option>
                  </select>
                </div>
              </div>
              <div className='form-row'>
                <div className='input-group'>
                  <label>Số CMND</label>
                  <input
                    type='text'
                    name='id_card'
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div className='input-group'>
                  <label>Email</label>
                  <input
                    type='email'
                    name='email'
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className='input-group'>
                  <label>Số điện thoại</label>
                  <input
                    type='tel'
                    name='phone_number'
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div className='input-group'>
                  <label>Địa chỉ</label>
                  <input
                    type='text'
                    name='address'
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className='section'>
              <h3>Thông Tin Phòng</h3>
              <div className='form-row'>
                <div className='input-group'>
                  <label>Loại phòng</label>
                  <select name='room_type' onChange={handleInputChange}>
                    <option>Family Room</option>
                    <option>Queen Room</option>
                    <option>Standard Room</option>
                  </select>
                </div>
                <div className='input-group'>
                  <label>Số phòng</label>
                  <select name="room_number" required onChange={handleRoomChange}>
                    <option value="">Chọn phòng</option>
                    {roomList.map((room, index) => (
                      <option key={index} value={room.room_number}>
                        {room.room_number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='form-row'>
                <div className='input-group'>
                  <label>Ngày nhận phòng</label>
                  <input
                    type='date'
                    name='check_in_date'
                    required
                    onChange={handleInputChange}
                  />
                </div>
                <div className='input-group'>
                  <label>Ngày trả phòng</label>
                  <input
                    type='date'
                    name='check_out_date'
                    required
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="section">
              <h3>Dịch Vụ Bổ Sung</h3>
              {services.length > 0 ? (
                services.map((service, index) => (
                  <div className="form-row" key={index}>
                    <div className="input-group">
                      <label>{service.service_name}</label>
                      <input
                        type="checkbox"
                        name="selected_services"
                        value={service.service_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có dịch vụ bổ sung</p>
              )}
            </div>
            <div className="section">
              <h3>Thông Tin Thanh Toán</h3>
              <div className='form-row'>
                <div className='input-group'>
                  <label>Phương thức</label>
                  <select name="payment_method" onChange={handleInputChange}>
                    <option value="vnpay">VNPay</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
                <div className="section">
                  <h3>Voucher</h3>
                  <div className="input-group">
                    <label>Mã Voucher</label>
                    <select name="voucher_code" onChange={handleInputChange}>
                      <option value="">Chọn mã giảm giá</option>
                      {vouchers.map((voucher, index) => (
                        <option key={index} value={voucher.voucher_code}>
                          {voucher.voucher_code} - {voucher.discount_percentage}%
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="section">
                <h3>Tổng Tiền</h3>
                <p>{totalPrice.toLocaleString()} VND</p>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={onClose}>
                  Huỷ bỏ
                </button>
                <button type="submit" className="confirm-button">
                  Xác nhận đặt phòng
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
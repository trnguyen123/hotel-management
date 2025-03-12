import React, { useState, useEffect } from "react";
import "../Style/ReservationModal.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const formatDateTime = (dateString) => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', options).replace(',', '');
};

const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;
  console.log("Booking Details Modal:", booking); // Log booking data

  const handleCheckout = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/booking/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking_id: booking.booking_id }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Checkout successful:", result);
        onClose(); 
        window.location.reload(); // Reload the page to reflect the changes
      } else {
        const errorData = await response.json();
        console.error("Failed to checkout:", errorData);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };
  
  const handleCheckin = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/booking/checkin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking_id: booking.booking_id }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Checkin successful:", result);
        onClose(); 
        window.location.reload(); // Reload the page to reflect the changes
      } else {
        const errorData = await response.json();
        console.error("Failed to checkin:", errorData);
      }
    } catch (error) {
      console.error("Error during checkin:", error);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/booking/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ booking_id: booking.booking_id }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Cancel successful:", result);
        onClose(); 
        window.location.reload(); // Reload the page to reflect the changes
      } else {
        const errorData = await response.json();
        console.error("Failed to cancel:", errorData);
      }
    } catch (error) {
      console.error("Error during cancellation:", error);
    }
  };

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
            <p><strong>Tên:</strong> {booking.details.full_name}</p>
            <p>
              <strong>Giới tính:</strong>{" "}
              {booking.details.gender === "male" ? "Nam" : "Nữ"}
            </p>
            <p>
              <strong>SĐT:</strong> {booking.details.phone_number}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {booking.details.address}
            </p>
          </div>
          <div className='section'>
            <h3>Thông tin phòng</h3>
            <p><strong>Loại phòng:</strong> {booking.room.room_type}</p>
            <p><strong>Số phòng:</strong> {booking.room.room_number}</p>
            <p><strong>Ngày nhận phòng:</strong> {formatDateTime(booking.check_in)}</p>
            <p><strong>Ngày trả phòng:</strong> {formatDateTime(booking.check_out)}</p>
          </div>
        </div>
        <div className='modal-footer'>
          <button type='button' onClick={handleCheckout}>
            Trả phòng
          </button>
          <button type='button' onClick={handleCancel}>
            Hủy phòng
          </button>
          <button type='button' onClick={handleCheckin}>
            Nhận phòng
          </button>
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
  const [exchangeRate, setExchangeRate] = useState(0);

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

    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/VND");
        const data = await response.json();
        setExchangeRate(data.rates.USD);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchServices();
    fetchVouchers();
    fetchRooms();
    fetchExchangeRate();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [formData, roomList, services, vouchers]);

  const calculateTotalPrice = () => {
    let roomPrice = 0;
    let servicePrice = 0;
    let discount = 0;

    const selectedRoom = roomList.find(room => String(room.room_id) === String(formData.room_id));
    if (selectedRoom && !isNaN(parseFloat(selectedRoom.price))) {
      roomPrice = parseFloat(selectedRoom.price);
    }

    const checkInDate = new Date(formData.check_in_date);
    const checkOutDate = new Date(formData.check_out_date);
    const numberOfNights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);

    formData.selected_services.forEach(serviceName => {
      const service = services.find(s => s.service_name === serviceName);
      if (service && !isNaN(parseFloat(service.price))) {
        servicePrice += parseFloat(service.price);
      }
    });

    const selectedVoucher = vouchers.find(voucher => voucher.voucher_code === formData.voucher_code);
    if (selectedVoucher && !isNaN(parseFloat(selectedVoucher.discount_percentage))) {
      discount = parseFloat(selectedVoucher.discount_percentage);
    }

    const total = (roomPrice * numberOfNights + servicePrice) - ((roomPrice * numberOfNights + servicePrice) * (discount / 100));
    setTotalPrice(total);
  };

  const totalPriceUSD = totalPrice * exchangeRate;

  if (!isOpen) return null;

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

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
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
      check_in_date: formatDate(formData.check_in_date),
      check_out_date: formatDate(formData.check_out_date),
      total_price: totalPrice,
      payment_status: "pending",
      payment_method: formData.payment_method,
    };

    if (formData.payment_method === "paypal") {
      return;
    }

    if (formData.payment_method === "vnpay") {
      try {
        const response = await fetch("http://localhost:5000/api/vnpay/create_payment_url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalPrice,
            customerId: formData.id_card,
            roomIds: [formData.room_id],
            language: "vn",
          }),
        });

        if (response.ok) {
          const { paymentUrl } = await response.json();
          window.location.href = paymentUrl;
        } else {
          const errorData = await response.json();
          console.error("Failed to create VNPay payment URL:", errorData);
        }
      } catch (error) {
        console.error("Error creating VNPay payment URL:", error);
      }
      return;
    }

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
        onBookingCreated(bookingWithGuest, totalPrice);
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Failed to create booking:", errorData);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handlePayPalSuccess = async (details, data) => {
    const bookingDetails = {
      full_name: formData.full_name,
      gender: formData.gender,
      cmnd: formData.id_card,
      email: formData.email,
      phone: formData.phone_number,
      address: formData.address,
      room_id: formData.room_id,
      room_type: formData.room_type,
      check_in_date: formatDate(formData.check_in_date),
      check_out_date: formatDate(formData.check_out_date),
      total_price: totalPrice,
      payment_status: "paid",
      payment_method: formData.payment_method,
    };

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
          color: "#FFA500",
        };
        onBookingCreated(bookingWithGuest, totalPrice);
        onClose();
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Failed to create booking:", errorData);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const filteredRooms = roomList.filter(room => room.room_type === formData.room_type);

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
                  <select name='room_type' onChange={handleInputChange} value={formData.room_type} disabled>
                    <option value="Family Room">Family Room</option>
                    <option value="Queen Room">Queen Room</option>
                    <option value="Standard Room">Standard Room</option>
                  </select>
                </div>
                <div className='input-group'>
                  <label>Số phòng</label>
                  <select name="room_number" required onChange={handleRoomChange}>
                    <option value="">Chọn phòng</option>
                    {filteredRooms.map((room, index) => (
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
            <div className="payment-section">
              <div className="payment-column">
                <h3>Thông Tin Thanh Toán</h3>
                <div className='form-row'>
                  <div className='input-group'>
                    <label>Phương thức</label>
                    <select name="payment_method" onChange={handleInputChange}>
                      <option value="vnpay">VNPay</option>
                      <option value="paypal">PayPal</option>
                      <option value="cash">Tiền mặt</option>
                    </select>
                  </div>
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
              <div className="total-price-column">
                <h3>Tổng Tiền</h3>
                <p>{totalPrice.toLocaleString()} VND</p>
                {exchangeRate > 0 && (
                  <p>{totalPriceUSD.toFixed(2)} USD</p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose}>
                Huỷ bỏ
              </button>
              {formData.payment_method === "paypal" ? (
                <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{
                          amount: {
                            value: totalPriceUSD.toFixed(2)
                          }
                        }]
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then(handlePayPalSuccess);
                    }}
                  />
                </PayPalScriptProvider>
              ) : (
                <button type="submit" className="confirm-button">
                  Xác nhận đặt phòng
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
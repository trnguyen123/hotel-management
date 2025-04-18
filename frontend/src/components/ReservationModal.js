import React, { useState, useEffect } from "react";
import "../Style/ReservationModal.css";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"; // Thêm PayPalScriptProvider, PayPalButtons

const formatDate = (date) => {
  const d = new Date(date);
  const month = `0${d.getMonth() + 1}`.slice(-2);
  const day = `0${d.getDate()}`.slice(-2);
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};

const BookingDetailsModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handleCheckout = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/booking/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: booking.booking_id }),
      });
  
      const data = await response.json(); 
      if (response.ok) {
        alert(data.message); 
        onClose(); 
        window.location.reload(); 
      } else {
        alert(data.message); 
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Không thể kết nối đến server!");
    }
  };

  const handleCheckin = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/booking/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: booking.booking_id }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        onClose();
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during checkin:", error);
      alert("Không thể kết nối đến server!");
    }
  };
  
  const handleCancel = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/booking/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: booking.booking_id }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        onClose();
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during cancellation:", error);
      alert("Không thể kết nối đến server!");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi tiết đặt phòng</h2>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="section">
            <h3>Thông tin khách hàng</h3>
            <p><strong>Tên:</strong> {booking.details.full_name}</p>
            <p><strong>Giới tính:</strong> {booking.details.gender === "male" ? "Nam" : "Nữ"}</p>
            <p><strong>SĐT:</strong> {booking.details.phone_number}</p>
            <p><strong>Địa chỉ:</strong> {booking.details.address}</p>
          </div>
          <div className="section">
            <h3>Thông tin phòng</h3>
            <p><strong>Loại phòng:</strong> {booking.room.room_type}</p>
            <p><strong>Số phòng:</strong> {booking.room.room_number}</p>
            <p><strong>Ngày nhận phòng:</strong> {formatDate(booking.check_in)}</p>
            <p><strong>Ngày trả phòng:</strong> {formatDate(booking.check_out)}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="checkout-button" onClick={handleCheckout}>Trả Phòng</button>
          <button type="button" className="cancel-booking-button" onClick={handleCancel}>Hủy Đặt Phòng</button>
          <button type="button" className="checkin-button" onClick={handleCheckin}>Nhận Phòng</button>
        </div>
      </div>
    </div>
  );
};

const ReservationModal = ({ isOpen, onClose, onBookingCreated, selectedBooking, onBookingDetailsClosed, roomType, rooms }) => {
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
    setFormData((prev) => ({ ...prev, room_type: roomType }));
  }, [roomType]);

  useEffect(() => {
    let mounted = true;
    const fetchServices = async () => {
      const response = await fetch("http://localhost:5000/api/service/getAll");
      const data = await response.json();
      if (mounted) setServices(data);
    };
    const fetchVouchers = async () => {
      const response = await fetch("http://localhost:5000/api/voucher/getAll");
      const data = await response.json();
      if (mounted) setVouchers(data);
    };
    const fetchRooms = async () => {
      const response = await fetch("http://localhost:5000/api/room/getNumberAndType");
      const data = await response.json();
      if (mounted) setRoomList(data);
    };
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/VND");
        const data = await response.json();
        if (mounted) setExchangeRate(data.rates.USD);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchServices();
    fetchVouchers();
    fetchRooms();
    fetchExchangeRate();
    return () => { mounted = false; };
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

    const roomSubTotal = roomPrice * numberOfNights;

    servicePrice = formData.selected_services.reduce((sum, service) => sum + (service.quantity * service.price || 0), 0);

    const selectedVoucher = vouchers.find(voucher => voucher.voucher_code === formData.voucher_code);
    if (selectedVoucher && !isNaN(parseFloat(selectedVoucher.discount_percentage))) {
      discount = parseFloat(selectedVoucher.discount_percentage);
    }

    const total = (roomSubTotal + servicePrice) - ((roomSubTotal + servicePrice) * (discount / 100));
    setTotalPrice(total > 0 ? total : 0);
  };

  const totalPriceUSD = totalPrice * exchangeRate;

  if (!isOpen) return null;

  if (selectedBooking) {
    return <BookingDetailsModal booking={selectedBooking} onClose={onBookingDetailsClosed} />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleServiceToggle = (e, service) => {
    const isChecked = e.target.checked;
    setFormData((prev) => {
      if (isChecked) {
        return {
          ...prev,
          selected_services: [
            ...prev.selected_services,
            { service_id: service.service_id, quantity: 1, price: service.price }
          ]
        };
      } else {
        return {
          ...prev,
          selected_services: prev.selected_services.filter(s => s.service_id !== service.service_id)
        };
      }
    });
  };

  const handleServiceQuantityChange = (serviceId, quantity, price) => {
    setFormData((prev) => {
      const updatedServices = prev.selected_services.map(s =>
        s.service_id === serviceId
          ? { ...s, quantity: Number(quantity), price }
          : s
      );
      return { ...prev, selected_services: updatedServices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.room_id || !formData.check_in_date || !formData.check_out_date) {
      alert("Vui lòng điền đầy đủ thông tin phòng và ngày!");
      return;
    }
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
      services: formData.selected_services.map(s => ({ service_id: s.service_id, quantity: s.quantity })),
    };
  
    if (formData.payment_method === "vnpay") {
      try {
        const response = await fetch("http://localhost:5000/api/vnpay/create_payment_url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: totalPrice,
            customerId: formData.id_card,
            roomIds: [formData.room_id],
            language: "vn",
          }),
        });
        const data = await response.json();
        if (response.ok) {
          window.location.href = data.paymentUrl;
        } else {
          alert(data.message || "Không thể tạo URL thanh toán VNPay!");
        }
      } catch (error) {
        console.error("Error creating VNPay payment URL:", error);
        alert("Không thể kết nối đến server khi tạo URL thanh toán VNPay!");
      }
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails),
      });
      const data = await response.json();
      if (response.ok) {
        const booking = data;
        const bookingWithGuest = { ...booking, guest: formData.full_name, color };
        onBookingCreated(bookingWithGuest, totalPrice);
        alert(data.message);
        onClose();
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Không thể kết nối đến server khi tạo đặt phòng!");
    }
  };

  const handlePayPalSuccess = async (details, data) => {
    const orderID = data.orderID;
    const booking_id = localStorage.getItem("booking_id");
    console.log("Capture details:", details);
    try {
      const response = await fetch("http://localhost:5000/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderID, booking_id }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Thanh toán thành công:", result);
        alert("Thanh toán PayPal thành công!");
        localStorage.removeItem("booking_id");
        onClose();
        window.location.reload();
      } else {
        alert("Không thể xử lý thanh toán PayPal!");
      }
    } catch (error) {
      console.error("Error capturing PayPal payment:", error);
      alert("Có lỗi xảy ra khi xử lý thanh toán PayPal!");
    }
  };

  const handlePayPalCancel = () => {
    const booking_id = localStorage.getItem("booking_id");
    fetch("http://localhost:5000/api/paypal/cancel-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id })
    })
      .then(response => response.json())
      .then(result => {
        console.log("Hủy thanh toán thành công:", result);
        alert("Đã hủy thanh toán PayPal thành công!");
        localStorage.removeItem("booking_id");
        onClose();
      })
      .catch(error => {
        console.error("Lỗi khi hủy thanh toán:", error);
        alert("Có lỗi xảy ra khi hủy thanh toán PayPal!");
      });
  };

  const filteredRooms = roomList.filter(room => room.room_type === formData.room_type);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h2>New Reservation</h2>
            <button type="button" className="close-button" onClick={onClose}>×</button>
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
                  <select name="room_type" onChange={handleInputChange} value={formData.room_type} disabled>
                    <option value="Family Room">Family Room</option>
                    <option value="Queen Room">Queen Room</option>
                    <option value="Standard Room">Standard Room</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Số phòng</label>
                  <select name="room_number" required onChange={handleRoomChange}>
                    <option value="">Chọn phòng</option>
                    {filteredRooms.map((room, index) => (
                      <option key={index} value={room.room_number}>{room.room_number}</option>
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
              {services.length > 0 ? (
                services.map((service, index) => (
                  <div className="form-row service-row" key={index}>
                    <div className="input-group service-checkbox">
                      <label>
                        <input
                          type="checkbox"
                          name="selected_services"
                          value={service.service_id}
                          checked={formData.selected_services.some(s => s.service_id === service.service_id)}
                          onChange={(e) => handleServiceToggle(e, service)}
                        />
                        {service.service_name}
                      </label>
                    </div>
                    {formData.selected_services.some(s => s.service_id === service.service_id) && (
                      <div className="input-group service-quantity">
                        <label>Số lượng</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.selected_services.find(s => s.service_id === service.service_id)?.quantity || ""}
                          onChange={(e) => handleServiceQuantityChange(service.service_id, e.target.value, service.price)}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>Không có dịch vụ bổ sung</p>
              )}
            </div>
            <div className="payment-section">
              <div className="payment-column">
                <h3>Thông Tin Thanh Toán</h3>
                <div className="form-row">
                  <div className="input-group">
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
                <p>Phòng: {(roomList.find(room => String(room.room_id) === String(formData.room_id))?.price * 
                           ((new Date(formData.check_out_date) - new Date(formData.check_in_date)) / (1000 * 60 * 60 * 24)) || 0).toLocaleString()} VND</p>
                <p>Dịch vụ: {formData.selected_services.reduce((sum, s) => sum + (s.quantity * s.price || 0), 0).toLocaleString()} VND</p>
                <p>Tổng cộng: {totalPrice.toLocaleString()} VND</p>
                {exchangeRate > 0 && <p>{totalPriceUSD.toFixed(2)} USD</p>}
              </div>
            </div>
            <div className="modal-footer">
            <button type="button" className="cancel-reservation-button" onClick={onClose}>
              Hủy Bỏ
            </button>
              {formData.payment_method === "paypal" ? (
                <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return fetch("http://localhost:5000/api/paypal/create-booking", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
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
                          total_price: totalPriceUSD.toFixed(2),
                          currency: "USD",
                          services: formData.selected_services.map(s => ({ service_id: s.service_id, quantity: s.quantity })),
                        }),
                      })
                        .then(response => response.json())
                        .then(data => {
                          localStorage.setItem("booking_id", data.booking_id);
                          return data.order_id;
                        })
                        .catch(error => {
                          console.error("Error creating order:", error);
                          throw new Error("Failed to create PayPal order");
                        });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        return handlePayPalSuccess(details, data);
                      });
                    }}
                    onCancel={() => {
                      handlePayPalCancel();
                    }}
                  />
                </PayPalScriptProvider>
              ) : (
                <button type="submit" className="confirm-reservation-button">
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
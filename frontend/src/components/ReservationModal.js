import React, { useState, useEffect } from "react";
import "../Style/ReservationModal.css";

const ReservationModal = ({ isOpen, onClose }) => {
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

  const [availableServices, setAvailableServices] = useState([]);
  const [roomPrices, setRoomPrices] = useState({});

  // Load dữ liệu từ API backend
  useEffect(() => {
    if (isOpen) {
      // Lấy danh sách dịch vụ
      fetch("http://localhost:3001/api/services")
        .then((res) => res.json())
        .then(setAvailableServices)
        .catch(console.error);

      // Lấy thông tin giá phòng
      fetch("http://localhost:3001/api/rooms")
        .then((res) => res.json())
        .then((rooms) => {
          const prices = rooms.reduce(
            (acc, room) => ({
              ...acc,
              [room.room_type]: room.price,
            }),
            {}
          );
          setRoomPrices(prices);
        })
        .catch(console.error);
    }
  }, [isOpen]);

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

  const calculateTotal = () => {
    const roomPrice = roomPrices[formData.room_type] || 0;
    const servicesTotal = formData.selected_services.reduce(
      (sum, serviceId) => {
        const service = availableServices.find(
          (s) => s.service_id == serviceId
        );
        return sum + (service?.price || 0);
      },
      0
    );
    return roomPrice + servicesTotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi dữ liệu đến backend qua API
      const response = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            full_name: formData.full_name,
            gender: formData.gender,
            address: formData.address,
            phone_number: formData.phone_number,
            id_card: formData.id_card,
            email: formData.email,
          },
          booking: {
            check_in_date: formData.check_in_date,
            check_out_date: formData.check_out_date,
            room_type: formData.room_type,
            room_number: formData.room_number,
            selected_services: formData.selected_services,
            voucher_code: formData.voucher_code,
            payment_method: formData.payment_method,
            total_amount: calculateTotal(),
          },
        }),
      });

      if (!response.ok) throw new Error("Lỗi API");
      const result = await response.json();
      console.log("Thành công:", result);
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo booking:", error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className='modal-header'>
            <h2>New Reservation</h2>
            <button type='button' className='close-button' onClick={onClose}>
              &times;
            </button>
          </div>

          <div className='modal-body'>
            {/* Phần Thông Tin Cơ Bản */}
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
            </div>

            {/* Phần Thông Tin Phòng */}
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
                  <input
                    type='text'
                    name='room_number'
                    required
                    onChange={handleInputChange}
                  />
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

            {/* Phần Dịch Vụ Bổ Sung */}
            <div className='section'>
              <h3>Dịch Vụ Bổ Sung</h3>
              <div className='services-grid'>
                {availableServices.map((service) => (
                  <label key={service.service_id} className='service-item'>
                    <input
                      type='checkbox'
                      name='selected_services'
                      value={service.service_id}
                      onChange={handleInputChange}
                    />
                    {service.service_name} (+${service.price})
                  </label>
                ))}
              </div>
            </div>

            {/* Phần Thanh Toán */}
            <div className='section'>
              <h3>Thông Tin Thanh Toán</h3>
              <div className='form-row'>
                <div className='input-group'>
                  <label>Phương thức</label>
                  <select name='payment_method' onChange={handleInputChange}>
                    <option value='credit_card'>Thẻ tín dụng</option>
                    <option value='cash'>Tiền mặt</option>
                    <option value='bank_transfer'>Chuyển khoản</option>
                  </select>
                </div>
                <div className='input-group'>
                  <label>Mã Voucher</label>
                  <input
                    type='text'
                    name='voucher_code'
                    onChange={handleInputChange}
                    placeholder='Nhập mã giảm giá'
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='modal-footer'>
            <button type='button' onClick={onClose}>
              Huỷ bỏ
            </button>
            <button type='submit' className='confirm-button'>
              Xác nhận đặt phòng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;

import React, { useState, useEffect } from "react";
import "../Style/Service.css";

function Service() {
  const [formData, setFormData] = useState({
    serviceName: "",
    quantity: "",
    roomNumber: "",
    customerName: "",
  });

  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/service/getAll")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi gọi API");
        }
        return response.json();
      })
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      service_name: formData.serviceName,
      quantity: formData.quantity,
      room_number: formData.roomNumber,
      customer_name: formData.customerName,
    };

    try {
      const response = await fetch("http://localhost:5000/api/service/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Dịch vụ đã được tạo thành công!");
        setFormData({
          serviceName: "",
          quantity: "",
          roomNumber: "",
          customerName: "",
        });
      } else {
        alert(`Lỗi: ${result.message || "Không thể tạo dịch vụ!"}`);
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      alert("Lỗi khi gửi dữ liệu, vui lòng thử lại!");
    }
  };

  return (
    <div className='service-container'>
      <div className='service-form'>
        <h2 className='service-title'>Little Hotelier</h2>
        <p className='service-subtitle'>Front desk management system</p>

        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor='serviceName'>Tên dịch vụ</label>
            <select
              id='serviceName'
              name='serviceName'
              value={formData.serviceName}
              onChange={handleChange}
              required
            >
              <option value=''>Chọn dịch vụ</option>
              {services.map((service) => (
                <option key={service.service_id} value={service.service_name}>
                  {service.service_name}
                </option>
              ))}
            </select>
          </div>

          <div className='input-group'>
            <label htmlFor='quantity'>Số lượng</label>
            <input
              type='number'
              id='quantity'
              name='quantity'
              placeholder='Nhập số lượng'
              value={formData.quantity}
              onChange={handleChange}
              min='1'
              required
            />
          </div>

          <div className='input-group'>
            <label htmlFor='roomNumber'>Số phòng</label>
            <input
              type='text'
              id='roomNumber'
              name='roomNumber'
              placeholder='Nhập số phòng'
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className='input-group'>
            <label htmlFor='customerName'>Tên khách hàng</label>
            <input
              type='text'
              id='customerName'
              name='customerName'
              placeholder='Nhập tên khách hàng'
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <button type='submit' className='service-button'>
            Tạo dịch vụ
          </button>
        </form>
      </div>
    </div>
  );
}

export default Service;
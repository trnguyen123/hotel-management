import React, { useState } from "react";
import "../Style/Service.css";

function Service() {
  const [formData, setFormData] = useState({
    serviceName: "",
    createdDate: "",
    roomNumber: "",
    customerName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý logic tạo dịch vụ ở đây, ví dụ gọi API
    console.log("Tạo dịch vụ:", formData);

    // Sau khi tạo dịch vụ xong, có thể reset form hoặc điều hướng trang
    // setFormData({
    //   serviceName: "",
    //   createdDate: "",
    //   roomNumber: "",
    //   customerName: "",
    // });
  };

  return (
    <div className="service-container">
      <div className="service-form">
        <h2 className="service-title">Little Hotelier</h2>
        <p className="service-subtitle">Front desk management system</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="serviceName">Tên dịch vụ</label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              placeholder="Nhập tên dịch vụ"
              value={formData.serviceName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="createdDate">Ngày tạo</label>
            <input
              type="date"
              id="createdDate"
              name="createdDate"
              value={formData.createdDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="roomNumber">Số phòng</label>
            <input
              type="text"
              id="roomNumber"
              name="roomNumber"
              placeholder="Nhập số phòng"
              value={formData.roomNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="customerName">Tên khách hàng</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              placeholder="Nhập tên khách hàng"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="service-button">
            Tạo dịch vụ
          </button>
        </form>
      </div>
    </div>
  );
}

export default Service;

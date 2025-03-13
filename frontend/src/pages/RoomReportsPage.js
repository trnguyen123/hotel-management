import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaRegCalendarAlt } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import '../Style/Management.css';

const RoomReportsPage = () => {
    // Khởi tạo dữ liệu mặc định
    const defaultReports = [
      { id: 1, roomNumber: '101', dateTime: new Date('2025-03-08T10:30:00'), content: 'Hỏng điều hòa, cần sửa gấp' },
      { id: 2, roomNumber: '202', dateTime: new Date('2025-03-07T14:15:00'), content: 'Bồn cầu bị nghẹt' },
      { id: 3, roomNumber: '305', dateTime: new Date('2025-03-06T09:00:00'), content: 'Tivi không hoạt động' },
      { id: 4, roomNumber: '118', dateTime: new Date('2025-03-05T16:45:00'), content: 'Thiếu khăn tắm' },
      { id: 5, roomNumber: '421', dateTime: new Date('2025-03-04T11:20:00'), content: 'Đèn phòng tắm bị cháy' },
    ];

    // Lấy dữ liệu từ localStorage khi khởi tạo
    const [reports, setReports] = useState(() => {
      const savedReports = localStorage.getItem('roomReports');
      if (savedReports) {
        try {
          // Chuyển đổi chuỗi JSON thành objects và chuyển đổi các chuỗi dateTime thành đối tượng Date
          return JSON.parse(savedReports).map(report => ({
            ...report, 
            dateTime: new Date(report.dateTime)
          }));
        } catch (error) {
          console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
          return defaultReports;
        }
      }
      return defaultReports;
    });
  
    // Lưu dữ liệu vào localStorage mỗi khi reports thay đổi
    useEffect(() => {
      localStorage.setItem('roomReports', JSON.stringify(reports));
    }, [reports]);
  
    // State cho modal
    const [showModal, setShowModal] = useState(false);
    const [currentReport, setCurrentReport] = useState({ id: null, roomNumber: '', dateTime: new Date(), content: '' });
    const [modalType, setModalType] = useState('add'); // 'add' hoặc 'edit'
    const [searchTerm, setSearchTerm] = useState('');
    
    // Sử dụng state để lưu trữ giá trị ngày tháng dưới dạng chuỗi
    const [dateTimeStr, setDateTimeStr] = useState('');
    
    // Cập nhật chuỗi ngày giờ khi currentReport thay đổi
    useEffect(() => {
      if (currentReport.dateTime) {
        const date = new Date(currentReport.dateTime);
        
        // Format date to yyyy-MM-ddThh:mm
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        setDateTimeStr(`${year}-${month}-${day}T${hours}:${minutes}`);
      }
    }, [currentReport.dateTime]);
  
    // Mở modal thêm báo cáo mới
    const openAddModal = () => {
      const now = new Date();
      setCurrentReport({ id: null, roomNumber: '', dateTime: now, content: '' });
      setModalType('add');
      setShowModal(true);
    };
  
    // Mở modal chỉnh sửa báo cáo
    const openEditModal = (report) => {
      setCurrentReport({ ...report });
      setModalType('edit');
      setShowModal(true);
    };
  
    // Đóng modal
    const closeModal = () => {
      setShowModal(false);
    };
  
    // Xử lý thay đổi form
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCurrentReport({ ...currentReport, [name]: value });
    };
  
    // Xử lý thay đổi ngày giờ
    const handleDateTimeChange = (e) => {
      const dateTimeValue = e.target.value;
      setDateTimeStr(dateTimeValue);
      setCurrentReport({ ...currentReport, dateTime: new Date(dateTimeValue) });
    };
  
    // Xử lý submit form
    const handleSubmit = (e) => {
      e.preventDefault();
      
      if (modalType === 'add') {
        // Thêm báo cáo mới
        const newReport = {
          ...currentReport,
          id: reports.length > 0 ? Math.max(...reports.map(r => r.id)) + 1 : 1
        };
        setReports([...reports, newReport]);
      } else {
        // Cập nhật báo cáo hiện có
        setReports(reports.map(report => 
          report.id === currentReport.id ? currentReport : report
        ));
      }
      
      closeModal();
    };
    
    // Xử lý xóa báo cáo
    const handleDelete = (id) => {
      if (window.confirm('Bạn có chắc chắn muốn xóa báo cáo này không?')) {
        setReports(reports.filter(report => report.id !== id));
      }
    };
  
    // Lọc báo cáo theo từ khóa tìm kiếm
    const filteredReports = reports.filter(report => 
      report.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    return (
      <div className="management-page">
        <div className="page-header">
          <h1>Quản lý Báo cáo Phòng</h1>
          <button className="btn btn-primary" onClick={openAddModal}>
            <FaPlus /> Thêm Báo cáo Mới
          </button>
        </div>
  
        <div className="card">
          <div className="search-bar">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input 
                type="text"
                className="search-input"
                placeholder="Tìm kiếm theo số phòng hoặc nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
  
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Số Phòng</th>
                  <th>Ngày Giờ</th>
                  <th>Nội Dung Báo Cáo</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.roomNumber}</td>
                    <td>{report.dateTime.toLocaleString('vi-VN')}</td>
                    <td>{report.content}</td>
                    <td className="actions">
                      <button 
                        className="btn btn-edit"
                        onClick={() => openEditModal(report)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDelete(report.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center'}}>Không tìm thấy báo cáo nào</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Modal Thêm/Sửa Báo cáo */}
        {showModal && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <h2>{modalType === 'add' ? 'Thêm Báo cáo Mới' : 'Chỉnh Sửa Báo cáo'}</h2>
                <button className="close-btn" onClick={closeModal}>&times;</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="roomNumber">Số Phòng</label>
                    <input
                      type="text"
                      id="roomNumber"
                      name="roomNumber"
                      className="form-control"
                      value={currentReport.roomNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="dateTime">Ngày Giờ</label>
                    <div style={{ position: 'relative' }}>
                      {/* Sử dụng input datetime-local */}
                      <input
                        type="datetime-local"
                        id="dateTime"
                        name="dateTime"
                        className="form-control"
                        value={dateTimeStr}
                        onChange={handleDateTimeChange}
                        required
                      />
                      <FaRegCalendarAlt style={{ 
                        position: 'absolute', 
                        right: '10px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: 'var(--secondary-color)',
                        pointerEvents: 'none'
                      }} />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="content">Nội Dung Báo Cáo</label>
                    <textarea
                      id="content"
                      name="content"
                      className="form-control"
                      value={currentReport.content}
                      onChange={handleInputChange}
                      rows="4"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn" onClick={closeModal}>Hủy</button>
                  <button type="submit" className="btn btn-primary">
                    {modalType === 'add' ? 'Thêm' : 'Cập Nhật'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default RoomReportsPage;
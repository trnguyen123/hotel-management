import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaRegCalendarAlt } from 'react-icons/fa';
import '../Style/Management.css';

const RoomReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState({ 
    room_number: '', 
    room_type: '', 
    price: '', 
    status: '' 
  });
  const [isEdit, setIsEdit] = useState(false);
  const [searchTermRooms, setSearchTermRooms] = useState('');
  const [searchTermReports, setSearchTermReports] = useState('');
  // Thêm state cho phân trang
  const [currentPageRooms, setCurrentPageRooms] = useState(1);
  const [currentPageReports, setCurrentPageReports] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReports();
    fetchRooms();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/report/getAll');
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      const formattedReports = data.map(report => ({
        ...report,
        generated_at: new Date(report.generated_at)
      }));
      setReports(formattedReports);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách báo cáo:', error);
      setReports([]);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/room/getNumberAndType');
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phòng:', error);
      setRooms([]);
    }
  };

  const handleAddRoom = () => {
    setCurrentRoom({ room_number: '', room_type: '', price: '', status: '' });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    setCurrentRoom({
      room_id: room.room_id,
      room_number: room.room_number,
      room_type: room.room_type,
      price: room.price,
      status: room.status
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDeleteRoom = async (room_id) => {
    try {
      if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        const response = await fetch(`http://localhost:5000/api/room/delete/${room_id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchRooms();
        } else {
          const errorData = await response.json();
          alert(`Xóa thất bại: ${errorData.message}`);
        }
      }
    } catch (error) {
      console.error('Lỗi khi xóa phòng:', error);
      alert('Đã xảy ra lỗi khi xóa phòng!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        room_number: currentRoom.room_number,
        room_type: currentRoom.room_type,
        price: currentRoom.price,
        status: currentRoom.status
      };

      if (isEdit) {
        const response = await fetch(`http://localhost:5000/api/room/update/${currentRoom.room_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          fetchRooms();
          setShowModal(false);
        } else {
          const errorData = await response.json();
          alert(`Cập nhật thất bại: ${errorData.message}`);
        }
      } else {
        const response = await fetch('http://localhost:5000/api/room/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          fetchRooms();
          setShowModal(false);
        } else {
          const errorData = await response.json();
          alert(`Thêm phòng thất bại: ${errorData.message}`);
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu phòng:', error);
      alert('Đã xảy ra lỗi khi lưu thông tin!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoom({ ...currentRoom, [name]: value });
  };

  const filteredRooms = rooms.filter(room => 
    (room.room_number?.toLowerCase() || '').includes(searchTermRooms.toLowerCase()) ||
    (room.room_type?.toLowerCase() || '').includes(searchTermRooms.toLowerCase())
  );

  const filteredReports = reports.filter(report => 
    (report.room_number?.toLowerCase() || '').includes(searchTermReports.toLowerCase()) ||
    (report.report_content?.toLowerCase() || '').includes(searchTermReports.toLowerCase())
  );

  // Phân trang cho Rooms
  const indexOfLastRoom = currentPageRooms * itemsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPagesRooms = Math.ceil(filteredRooms.length / itemsPerPage);

  // Phân trang cho Reports
  const indexOfLastReport = currentPageReports * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPagesReports = Math.ceil(filteredReports.length / itemsPerPage);

  const handlePageChangeRooms = (pageNumber) => setCurrentPageRooms(pageNumber);
  const handlePageChangeReports = (pageNumber) => setCurrentPageReports(pageNumber);

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Quản lý Phòng và Báo cáo</h1>
        <button className="btn btn-primary" onClick={handleAddRoom}>
          <FaPlus /> Thêm Phòng Mới
        </button>
      </div>

      {/* Bảng Rooms */}
      <div className="card">
        <div className="card-header">
          <h2>Danh sách Phòng</h2>
        </div>
        <div className="search-bar">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input 
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo số phòng hoặc loại phòng..."
              value={searchTermRooms}
              onChange={(e) => setSearchTermRooms(e.target.value)}
            />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>STT</th> 
                <th>Số Phòng</th>
                <th>Loại Phòng</th>
                <th>Giá</th>
                <th>Trạng Thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentRooms.length > 0 ? (
                currentRooms.map((room, index) => (
                  <tr key={room.room_id}>
                    <td>{indexOfFirstRoom + index + 1}</td> 
                    <td>{room.room_number}</td>
                    <td>{room.room_type}</td>
                    <td>{Number(room.price).toLocaleString('vi-VN')}</td>
                    <td>{room.status}</td>
                    <td className="actions">
                      <button className="btn btn-edit" onClick={() => handleEditRoom(room)}>
                        <FaEdit />
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDeleteRoom(room.room_id)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>Không tìm thấy phòng nào</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => handlePageChangeRooms(currentPageRooms - 1)}
              disabled={currentPageRooms === 1}
              className="pagination-button"
            >
              Trước
            </button>
            {Array.from({ length: totalPagesRooms }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChangeRooms(page)}
                className={`pagination-button ${currentPageRooms === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChangeRooms(currentPageRooms + 1)}
              disabled={currentPageRooms === totalPagesRooms}
              className="pagination-button"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Bảng Reports */}
      <div className="card">
        <div className="card-header">
          <h2>Danh sách Báo cáo</h2>
        </div>
        <div className="search-bar">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input 
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo số phòng hoặc nội dung..."
              value={searchTermReports}
              onChange={(e) => setSearchTermReports(e.target.value)}
            />
          </div>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>                     
                <th>Số Phòng</th>
                <th>Ngày Giờ</th>
                <th>Nội Dung Báo Cáo</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.length > 0 ? (
                currentReports.map((report, index) => (
                  <tr key={report.report_id}>
                    <td>{indexOfFirstReport + index + 1}</td>
                    <td>{report.room_number}</td>
                    <td>{report.generated_at.toLocaleString('vi-VN')}</td>
                    <td>{report.report_content}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>Không tìm thấy báo cáo nào</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => handlePageChangeReports(currentPageReports - 1)}
              disabled={currentPageReports === 1}
              className="pagination-button"
            >
              Trước
            </button>
            {Array.from({ length: totalPagesReports }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChangeReports(page)}
                className={`pagination-button ${currentPageReports === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChangeReports(currentPageReports + 1)}
              disabled={currentPageReports === totalPagesReports}
              className="pagination-button"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal Thêm/Sửa Phòng */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>{isEdit ? 'Cập nhật Phòng' : 'Thêm Phòng Mới'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="room_number">Số Phòng</label>
                  <input
                    type="text"
                    id="room_number"
                    name="room_number"
                    className="form-control"
                    value={currentRoom.room_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="room_type">Loại Phòng</label>
                  <input
                    type="text"
                    id="room_type"
                    name="room_type"
                    className="form-control"
                    value={currentRoom.room_type}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Giá</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    value={currentRoom.price}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Trạng Thái</label>
                  <select
                    id="status"
                    name="status"
                    className="form-control"
                    value={currentRoom.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">{isEdit ? 'Cập nhật' : 'Thêm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomReportsPage;
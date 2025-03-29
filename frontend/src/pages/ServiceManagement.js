import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import '../Style/Management.css';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState({ 
    service_id: '', 
    service_name: '', 
    price: '', 
    unit: '', // Không đặt giá trị mặc định
    status: 'active' // Giữ giá trị mặc định cho status
  });
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/service/getAll');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const addActivity = (content) => {
    const now = new Date();
    const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');
    const newActivity = { time: timeString, content };
    let activities = [];
    try {
      const savedActivities = localStorage.getItem('recentActivities');
      if (savedActivities) {
        activities = JSON.parse(savedActivities);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
    activities = [newActivity, ...activities.slice(0, 9)];
    localStorage.setItem('recentActivities', JSON.stringify(activities));
    window.dispatchEvent(new CustomEvent('activityAdded'));
  };

  const notifyServiceUpdated = () => {
    window.dispatchEvent(new CustomEvent('serviceUpdated'));
  };

  const handleAddService = () => {
    setCurrentService({ 
      service_id: '', 
      service_name: '', 
      price: '', 
      unit: '', 
      status: 'active' 
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEditService = (service) => {
    setCurrentService({
      service_id: service.service_id,
      service_name: service.service_name,
      price: service.price,
      unit: service.unit,
      status: service.status
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDeleteService = async (service_id) => {
    try {
      if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
        const response = await fetch(`http://localhost:5000/api/service/delete/${service_id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          const serviceToDelete = services.find(service => service.service_id === service_id);
          addActivity(`Dịch vụ "${serviceToDelete.service_name}" đã bị xóa`);
          notifyServiceUpdated();
          fetchServices();
        } else {
          const errorData = await response.json();
          console.error('Failed to delete service:', errorData);
          alert(`Xóa thất bại: ${errorData.message}`);
        }
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Đã xảy ra lỗi khi xóa dịch vụ!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let activityMessage = '';
      const payload = {
        service_name: currentService.service_name,
        price: currentService.price,
        unit: currentService.unit,
        status: currentService.status
      };

      if (isEdit) {
        console.log('Dữ liệu gửi đi (PUT):', payload);
        const response = await fetch(`http://localhost:5000/api/service/update/${currentService.service_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          activityMessage = `Dịch vụ "${currentService.service_name}" đã được cập nhật`;
          addActivity(activityMessage);
          notifyServiceUpdated();
          setShowModal(false);
          window.location.reload();
        } else {
          const errorData = await response.json();
          console.error('Lỗi khi cập nhật dịch vụ:', errorData);
          alert(`Cập nhật thất thất: ${errorData.message}`);
          return;
        }
      } else {
        console.log('Dữ liệu gửi đi (POST):', payload);
        const response = await fetch('http://localhost:5000/api/service/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const newService = await response.json();
          activityMessage = `Dịch vụ mới "${currentService.service_name}" đã được thêm`;
          addActivity(activityMessage);
          notifyServiceUpdated();
          setShowModal(false);
          window.location.reload();
        } else {
          const errorData = await response.json();
          console.error('Lỗi khi thêm dịch vụ:', errorData);
          alert(`Thêm dịch vụ thất bại: ${errorData.message}`);
          return;
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu dịch vụ:', error);
      alert('Đã xảy ra lỗi khi lưu thông tin!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentService({ ...currentService, [name]: value });
  };

  const filteredServices = services.filter(service => 
    (service.service_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Quản lý dịch vụ</h1>
        <button className="btn btn-primary" onClick={handleAddService}>
          <FaPlus /> Thêm dịch vụ
        </button>
      </div>

      <div className="card">
        <div className="search-bar">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm dịch vụ..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên dịch vụ</th>
                <th>Giá (VND)</th>
                <th>Đơn vị</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map(service => (
                <tr key={service.service_id}>
                  <td>{service.service_id}</td>
                  <td>{service.service_name}</td>
                  <td>{parseInt(service.price).toLocaleString()}</td>
                  <td>{service.unit}</td>
                  <td>{service.status}</td>
                  <td className="actions">
                    <button className="btn btn-edit" onClick={() => handleEditService(service)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteService(service.service_id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>{isEdit ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên dịch vụ</label>
                  <input 
                    type="text" 
                    name="service_name" 
                    value={currentService.service_name} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Giá (VND)</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={currentService.price} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Đơn vị</label>
                  <input 
                    type="text" 
                    name="unit" 
                    value={currentService.unit} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                    placeholder="Nhập đơn vị (ví dụ: lần, suất, ngày, giờ)"
                  />
                </div>
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select
                    name="status"
                    value={currentService.status}
                    onChange={handleChange}
                    required
                    className="form-control"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn" onClick={() => setShowModal(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary">{isEdit ? 'Cập nhật' : 'Thêm'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import '../Style/Management.css';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentService, setCurrentService] = useState({ id: '', name: '', description: '', price: '', duration: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // Kiểm tra xem có dữ liệu trong localStorage không
      const savedServices = localStorage.getItem('services');
      
      if (savedServices) {
        setServices(JSON.parse(savedServices));
      } else {
        // Nếu không có, sử dụng dữ liệu mẫu
        const defaultServices = [
          { id: 1, name: '@@@@@', description: 'Dịch vụ 1', price: '150000', duration: '30' },
          { id: 2, name: '@@@@@', description: 'Dịch vụ 2', price: '200000', duration: '45' },
          { id: 3, name: '@@@@@', description: 'Dịch vụ 3', price: '500000', duration: '120' },
          { id: 4, name: '@@@@@', description: 'Dịch vụ 4', price: '700000', duration: '150' },
        ];
        setServices(defaultServices);
        localStorage.setItem('services', JSON.stringify(defaultServices));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Hàm thêm hoạt động mới vào timeline
  const addActivity = (content) => {
    const now = new Date();
    const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');
    
    const newActivity = {
      time: timeString,
      content: content
    };
    
    // Lấy các hoạt động hiện tại từ localStorage
    let activities = [];
    try {
      const savedActivities = localStorage.getItem('recentActivities');
      if (savedActivities) {
        activities = JSON.parse(savedActivities);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
    
    // Thêm hoạt động mới vào đầu danh sách
    activities = [newActivity, ...activities.slice(0, 9)]; // Giữ tối đa 10 hoạt động
    
    // Lưu lại vào localStorage
    localStorage.setItem('recentActivities', JSON.stringify(activities));
    
    // Kích hoạt sự kiện để Dashboard biết có cập nhật
    const event = new CustomEvent('activityAdded');
    window.dispatchEvent(event);
  };

  // Hàm thông báo cập nhật số lượng dịch vụ
  const notifyServiceUpdated = () => {
    const event = new CustomEvent('serviceUpdated');
    window.dispatchEvent(event);
  };

  const handleAddService = () => {
    setCurrentService({ id: '', name: '', description: '', price: '', duration: '' });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEditService = (service) => {
    setCurrentService(service);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDeleteService = async (id) => {
    try {
      if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
        const serviceToDelete = services.find(service => service.id === id);
        const updatedServices = services.filter(service => service.id !== id);
        setServices(updatedServices);
        localStorage.setItem('services', JSON.stringify(updatedServices));
        
        // Thêm hoạt động xóa dịch vụ
        addActivity(`Dịch vụ "${serviceToDelete.name}" đã bị xóa`);
        notifyServiceUpdated();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedServices;
      let activityMessage = '';
      
      if (isEdit) {
        updatedServices = services.map(service => 
          service.id === currentService.id ? currentService : service
        );
        activityMessage = `Dịch vụ "${currentService.name}" đã được cập nhật`;
      } else {
        const newService = { ...currentService, id: Date.now() };
        updatedServices = [...services, newService];
        activityMessage = `Dịch vụ mới "${newService.name}" đã được thêm`;
      }
      
      setServices(updatedServices);
      localStorage.setItem('services', JSON.stringify(updatedServices));
      
      // Thêm hoạt động vào timeline
      addActivity(activityMessage);
      notifyServiceUpdated();
      
      setShowModal(false);
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentService({ ...currentService, [name]: value });
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <th>Mô tả</th>
                <th>Giá (VND)</th>
                <th>Thời gian (phút)</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map(service => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>{parseInt(service.price).toLocaleString()}</td>
                  <td>{service.duration}</td>
                  <td className="actions">
                    <button className="btn btn-edit" onClick={() => handleEditService(service)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteService(service.id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                    name="name" 
                    value={currentService.name} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea 
                    name="description" 
                    value={currentService.description} 
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
                  <label>Thời gian (phút)</label>
                  <input 
                    type="number" 
                    name="duration" 
                    value={currentService.duration} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
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
}

export default ServiceManagement;
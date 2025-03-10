import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './Management.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({ id: '', name: '', position: '', phone: '', email: '', startDate: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    try {
      const savedEmployees = localStorage.getItem('employees');
      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees));
      } else {
        // Dữ liệu mẫu ban đầu
        const initialEmployees = [
          { id: 1, name: 'Nguyễn Văn A', position: 'Quản lý', phone: '0901234567', email: 'nguyenvana@example.com', startDate: '2022-01-15' },
          // ... các nhân viên khác
        ];
        setEmployees(initialEmployees);
        localStorage.setItem('employees', JSON.stringify(initialEmployees));
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAddEmployee = () => {
    setCurrentEmployee({ id: '', name: '', position: '', phone: '', email: '', startDate: '' });
    setIsEdit(false);
    setShowModal(true);
  };
  //lưu ID ban đầu
  const [originalEmployeeId, setOriginalEmployeeId] = useState(null);

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setOriginalEmployeeId(employee.id); // Lưu ID ban đầu
    setIsEdit(true);
    setShowModal(true);
  };

  const addActivity = (content) => {
    try {
      // Lấy thời gian hiện tại
      const now = new Date();
      const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');
      
      // Tạo hoạt động mới
      const newActivity = {
        time: timeString,
        content: content
      };
      
      // Lấy danh sách hoạt động hiện có
      let activities = [];
      const savedActivities = localStorage.getItem('recentActivities');
      if (savedActivities) {
        activities = JSON.parse(savedActivities);
      }
      
      // Thêm hoạt động mới vào đầu danh sách
      activities.unshift(newActivity);
      
      // Giới hạn số lượng hoạt động hiển thị (nếu cần)
      if (activities.length > 10) {
        activities = activities.slice(0, 10);
      }
      
      // Lưu lại vào localStorage
      localStorage.setItem('recentActivities', JSON.stringify(activities));
      
      // Phát sự kiện để Dashboard cập nhật
      window.dispatchEvent(new Event('activityAdded'));
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
        const employeeToDelete = employees.find(employee => employee.id === id);
        const updatedEmployees = employees.filter(employee => employee.id !== id);
        setEmployees(updatedEmployees);
        localStorage.setItem('employees', JSON.stringify(updatedEmployees));
        
        // Thêm hoạt động khi xóa nhân viên
        if (employeeToDelete) {
          addActivity(`Đã xóa nhân viên: ${employeeToDelete.name}`);
        }
        
        // Phát sự kiện để Dashboard cập nhật số lượng nhân viên
        window.dispatchEvent(new Event('employeeUpdated'));
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedEmployees;
      if (isEdit) {
        updatedEmployees = employees.map(employee => 
          employee.id === originalEmployeeId ? currentEmployee : employee
        );
        
        // Thêm hoạt động khi cập nhật nhân viên
        addActivity(`Đã cập nhật thông tin nhân viên ${currentEmployee.name}`);
      } else {
        const newEmployee = { ...currentEmployee, id: currentEmployee.id || Date.now().toString() };
        updatedEmployees = [...employees, newEmployee];
        
        // Thêm hoạt động khi thêm nhân viên mới
        addActivity(`Đã thêm nhân viên mới: ${newEmployee.name}`);
      }
      setEmployees(updatedEmployees);
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      
      // Phát sự kiện để Dashboard cập nhật số lượng nhân viên
      window.dispatchEvent(new Event('employeeUpdated'));
      
      setShowModal(false);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee({ ...currentEmployee, [name]: value });
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Quản lý nhân viên</h1>
        <button className="btn btn-primary" onClick={handleAddEmployee}>
          <FaPlus /> Thêm nhân viên
        </button>
      </div>

      <div className="card">
        <div className="search-bar">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Tìm kiếm nhân viên..." 
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
                <th>Tên</th>
                <th>Chức vụ</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Ngày bắt đầu</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.position}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.email}</td>
                  <td>{new Date(employee.startDate).toLocaleDateString('vi-VN')}</td>
                  <td className="actions">
                    <button className="btn btn-edit" onClick={() => handleEditEmployee(employee)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteEmployee(employee.id)}>
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
              <h2>{isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên nhân viên</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={currentEmployee.name} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Chức vụ</label>
                  <input 
                    type="text" 
                    name="position" 
                    value={currentEmployee.position} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={currentEmployee.phone} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={currentEmployee.email} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Ngày bắt đầu</label>
                  <input 
                    type="date" 
                    name="startDate" 
                    value={currentEmployee.startDate} 
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

export default EmployeeManagement;
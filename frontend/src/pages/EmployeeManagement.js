import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import '../Style/Management.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({ 
    employee_id: '', 
    full_name: '', 
    role: '', 
    phone_number: '', 
    email: '', 
    password: '' 
  });
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 10; // Số nhân viên mỗi trang

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employee/getAll');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAddEmployee = () => {
    setCurrentEmployee({ 
      employee_id: '', 
      full_name: '', 
      role: '', 
      phone_number: '', 
      email: '', 
      password: '' 
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const [originalEmployeeId, setOriginalEmployeeId] = useState(null);

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setOriginalEmployeeId(employee.employee_id);
    setIsEdit(true);
    setShowModal(true);
  };

  const addActivity = (content) => {
    try {
      const now = new Date();
      const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() + ' ' + (now.getHours() >= 12 ? 'PM' : 'AM');
      const newActivity = { time: timeString, content };
      let activities = [];
      const savedActivities = localStorage.getItem('recentActivities');
      if (savedActivities) {
        activities = JSON.parse(savedActivities);
      }
      activities.unshift(newActivity);
      if (activities.length > 10) {
        activities = activities.slice(0, 10);
      }
      localStorage.setItem('recentActivities', JSON.stringify(activities));
      window.dispatchEvent(new Event('activityAdded'));
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
        const response = await fetch(`http://localhost:5000/api/employee/delete/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          const updatedEmployees = employees.filter(employee => employee.employee_id !== id);
          setEmployees(updatedEmployees);
          addActivity(`Đã xóa nhân viên: ${id}`);
          window.dispatchEvent(new Event('employeeUpdated'));
        } else {
          console.error('Failed to delete employee');
        }
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
        const payload = {
          full_name: currentEmployee.full_name,
          email: currentEmployee.email,
          role: currentEmployee.role,
          phone_number: currentEmployee.phone_number,
        };
        console.log('Dữ liệu gửi đi (PUT):', payload);
        const response = await fetch(`http://localhost:5000/api/employee/update/${originalEmployeeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          updatedEmployees = employees.map(employee =>
            employee.employee_id === originalEmployeeId ? { ...employee, ...payload } : employee
          );
          addActivity(`Đã cập nhật thông tin nhân viên ${currentEmployee.full_name}`);
          setEmployees(updatedEmployees);
          window.dispatchEvent(new Event('employeeUpdated'));
          setShowModal(false);
          window.location.reload();
        } else {
          const errorData = await response.json();
          console.error('Lỗi khi cập nhật nhân viên:', errorData);
          alert(`Cập nhật thất bại: ${errorData.message}`);
          return;
        }
      } else {
        const payload = {
          full_name: currentEmployee.full_name,
          email: currentEmployee.email,
          password: currentEmployee.password,
          role: currentEmployee.role,
          phone_number: currentEmployee.phone_number,
        };
        console.log('Dữ liệu gửi đi (POST):', payload);
        const response = await fetch('http://localhost:5000/api/employee/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const newEmployee = await response.json();
          updatedEmployees = [...employees, newEmployee];
          addActivity(`Đã thêm nhân viên mới: ${newEmployee.full_name}`);
          setEmployees(updatedEmployees);
          window.dispatchEvent(new Event('employeeUpdated'));
          setShowModal(false);
          window.location.reload();
        } else {
          const errorData = await response.json();
          console.error('Lỗi khi thêm nhân viên:', errorData);
          alert(`Thêm nhân viên thất bại: ${errorData.message}`);
          return;
        }
      }
    } catch (error) {
      console.error('Lỗi khi lưu nhân viên:', error);
      alert('Đã xảy ra lỗi khi lưu thông tin!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmployee({ ...currentEmployee, [name]: value });
  };

  const filteredEmployees = employees.filter(employee => 
    (employee.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (employee.role?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (employee.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Tính toán phân trang
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  // Hàm xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
                <th>STT</th>                     
                <th>Tên</th>
                <th>Chức vụ</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Ngày bắt đầu</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee, index) => (
                <tr key={employee.employee_id}>
                  <td>{indexOfFirstEmployee + index + 1}</td>
                  <td>{employee.full_name}</td>
                  <td>{employee.role}</td>
                  <td>{employee.phone_number}</td>
                  <td>{employee.email}</td>
                  <td>{new Date(employee.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="actions">
                    <button className="btn btn-edit" onClick={() => handleEditEmployee(employee)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDeleteEmployee(employee.employee_id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
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
              <h2>{isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tên nhân viên</label>
                  <input 
                    type="text" 
                    name="full_name" 
                    value={currentEmployee.full_name} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Chức vụ</label>
                  <input 
                    type="text" 
                    name="role" 
                    value={currentEmployee.role} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="tel" 
                    name="phone_number" 
                    value={currentEmployee.phone_number} 
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
                {!isEdit && (
                  <div className="form-group">
                    <label>Mật khẩu</label>
                    <input 
                      type="password" 
                      name="password" 
                      value={currentEmployee.password} 
                      onChange={handleChange} 
                      required 
                      className="form-control"
                    />
                  </div>
                )}
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

export default EmployeeManagement;
import React, { useState, useEffect } from 'react';
import { FaUsers, FaConciergeBell, FaTicketAlt, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import hook useNavigate
import '../Style/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate(); // Hook để điều hướng

  const [stats, setStats] = useState([
    { 
      icon: <FaUsers style={{ color: '#4361ee' }} />, 
      title: 'Nhân viên', 
      value: 4, 
      description: 'Tổng số nhân viên', 
      bgColor: 'rgba(67, 97, 238, 0.1)',
      path: '/employees' // Đường dẫn đến trang nhân viên
    },
    { 
      icon: <FaConciergeBell style={{ color: '#f0932b' }} />, 
      title: 'Dịch vụ', 
      value: 0, 
      description: 'Dịch vụ đang cung cấp', 
      bgColor: 'rgba(240, 147, 43, 0.1)',
      path: '/services' // Đường dẫn đến trang dịch vụ
    },
    { 
      icon: <FaTicketAlt style={{ color: '#eb4d4b' }} />, 
      title: 'Voucher', 
      value: 0, 
      description: 'Voucher đang hoạt động', 
      bgColor: 'rgba(235, 77, 75, 0.1)',
      path: '/vouchers' // Đường dẫn đến trang voucher
    },
    { 
      icon: <FaChartBar style={{ color: '#4cc9f0' }} />, 
      title: 'Doanh thu', 
      value: '5.2M', 
      description: 'Doanh thu tháng này', 
      bgColor: 'rgba(76, 201, 240, 0.1)',
      path: '/revenue' // Đường dẫn đến trang doanh thu
    }
  ]);
  
  const [recentActivities, setRecentActivities] = useState([
    { time: '10:25 AM', content: 'Trần Văn A đã thêm dịch vụ mới' },
    { time: '09:40 AM', content: 'Nguyễn Thị B đã cập nhật thông tin voucher' },
    { time: '08:15 AM', content: 'Lê Văn C đã thêm nhân viên mới' },
    { time: 'Hôm qua', content: 'Phạm Thị D đã tạo báo cáo doanh thu tháng' }
  ]);

  // Hàm xử lý khi click vào ô thống kê
  const handleStatClick = (path) => {
    navigate(path);
  };

  useEffect(() => { // Cập nhật số liệu thống kê từ localStorage
    const updateStats = () => {
      try {
        // Lấy số lượng nhân viên
        const savedEmployees = localStorage.getItem('employees');
        if (savedEmployees) {
          const employeesArray = JSON.parse(savedEmployees);
          
          // Cập nhật số lượng nhân viên trong stats
          setStats(prevStats => {
            const newStats = [...prevStats];
            const employeeIndex = newStats.findIndex(stat => stat.title === 'Nhân viên');
            if (employeeIndex !== -1) {
              newStats[employeeIndex] = {
                ...newStats[employeeIndex],
                value: employeesArray.length
              };
            }
            return newStats;
          });
        }
        // Lấy số lượng dịch vụ
        const savedServices = localStorage.getItem('services');
        if (savedServices) {
          const servicesArray = JSON.parse(savedServices);
          
          // Cập nhật số lượng dịch vụ trong stats
          setStats(prevStats => {
            const newStats = [...prevStats];
            const serviceIndex = newStats.findIndex(stat => stat.title === 'Dịch vụ');
            if (serviceIndex !== -1) {
              newStats[serviceIndex] = {
                ...newStats[serviceIndex],
                value: servicesArray.length
              };
            }
            return newStats;
          });
        }
        // Lấy số lượng voucher đang hoạt động
        const savedVouchers = localStorage.getItem('vouchers');
        if (savedVouchers) {
          const vouchersArray = JSON.parse(savedVouchers);
          const activeVouchers = vouchersArray.filter(voucher => voucher.status === 'active');
          
          // Cập nhật số lượng voucher trong stats
          setStats(prevStats => {
            const newStats = [...prevStats];
            const voucherIndex = newStats.findIndex(stat => stat.title === 'Voucher');
            if (voucherIndex !== -1) {
              newStats[voucherIndex] = {
                ...newStats[voucherIndex],
                value: activeVouchers.length
              };
            }
            return newStats;
          });
        }
      } catch (error) {
        console.error('Error updating stats:', error);
      }
    };

    // Lấy các hoạt động gần đây từ localStorage
    const loadRecentActivities = () => {
      try {
        const savedActivities = localStorage.getItem('recentActivities');
        if (savedActivities) {
          setRecentActivities(JSON.parse(savedActivities));
        }
      } catch (error) {
        console.error('Error loading activities:', error);
      }
    };

    // Cập nhật khi component được mount
    updateStats();
    loadRecentActivities();

    // Lắng nghe sự kiện cập nhật
    window.addEventListener('serviceUpdated', updateStats);
    window.addEventListener('voucherUpdated', updateStats);
    window.addEventListener('employeeUpdated', updateStats); // Thêm lắng nghe sự kiện này
    window.addEventListener('activityAdded', loadRecentActivities);
  
    return () => {
      window.removeEventListener('serviceUpdated', updateStats);
      window.removeEventListener('voucherUpdated', updateStats);
      window.removeEventListener('employeeUpdated', updateStats); // Đừng quên remove event listener
      window.removeEventListener('activityAdded', loadRecentActivities);
    };
  }, []);

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            className="stat-card" 
            key={index} 
            onClick={() => handleStatClick(stat.path)}
            style={{ cursor: 'pointer' }} // Thêm style cursor để hiển thị là phần tử có thể nhấn
          >
            <div className="stat-icon" style={{ background: stat.bgColor }}>
              {stat.icon}
            </div>
            <div className="stat-details">
              <h3>{stat.title}</h3>
              <p className="stat-number">{stat.value}</p>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-section">
        <div className="card">
          <h2>Hoạt động gần đây</h2>
          <div className="timeline">
            {recentActivities.map((activity, index) => (
              <div className="timeline-item" key={index}>
                <div className="time">{activity.time}</div>
                <div className="content">{activity.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
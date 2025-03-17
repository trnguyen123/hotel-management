import React, { useState, useEffect } from 'react';
import { FaUsers, FaConciergeBell, FaTicketAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../Style/Dashboard.css';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    { 
      icon: <FaUsers style={{ color: '#4361ee' }} />, 
      title: 'Nhân viên', 
      value: 0, 
      description: 'Tổng số nhân viên', 
      bgColor: 'rgba(67, 97, 238, 0.1)',
      path: '/admin/employees'
    },
    { 
      icon: <FaConciergeBell style={{ color: '#f0932b' }} />, 
      title: 'Dịch vụ', 
      value: 0, 
      description: 'Dịch vụ đang cung cấp', 
      bgColor: 'rgba(240, 147, 43, 0.1)',
      path: '/admin/services'
    },
    { 
      icon: <FaTicketAlt style={{ color: '#eb4d4b' }} />, 
      title: 'Voucher', 
      value: 0, 
      description: 'Voucher đang hoạt động', 
      bgColor: 'rgba(235, 77, 75, 0.1)',
      path: '/admin/vouchers'
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  // Hàm quy đổi sang VND
  const EXCHANGE_RATE = 25000;
  const convertToVND = (amount, paymentMethod) => {
    const isVnd = ['vnpay', 'cash'].includes(paymentMethod?.toLowerCase());
    const value = Number(amount) || 0;
    return isVnd ? value : value * EXCHANGE_RATE;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Gọi API lấy số lượng nhân viên
        const employeesResponse = await fetch('http://localhost:5000/api/employee/count');
        const employeesData = await employeesResponse.json();

        // Gọi API lấy số lượng dịch vụ
        const servicesResponse = await fetch('http://localhost:5000/api/service/count');
        const servicesData = await servicesResponse.json();

        // Gọi API lấy số lượng voucher
        const vouchersResponse = await fetch('http://localhost:5000/api/voucher/count');
        const vouchersData = await vouchersResponse.json();

        // Gọi API lấy danh sách bookings để tính tổng tiền
        const bookingsResponse = await fetch('http://localhost:5000/api/booking/getAll');
        const bookingsData = await bookingsResponse.json();

        // Cập nhật stats
        setStats(prevStats => {
          const newStats = [...prevStats];
          newStats[0].value = employeesData.count || 0; // Nhân viên
          newStats[1].value = servicesData.count || 0;  // Dịch vụ
          newStats[2].value = vouchersData.count || 0;  // Voucher
          return newStats;
        });

        // Xử lý dữ liệu bookings để tạo biểu đồ
        const revenueByMonth = {};
        bookingsData.forEach(booking => {
          const checkInDate = new Date(booking.check_in_date);
          const monthYear = `${checkInDate.getFullYear()}-${String(checkInDate.getMonth() + 1).padStart(2, '0')}`;
          const revenue = convertToVND(booking.total_price, booking.payment_method);
          revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + revenue;
        });

        // Chuẩn bị dữ liệu cho biểu đồ
        const labels = Object.keys(revenueByMonth).sort();
        const data = labels.map(month => revenueByMonth[month] / 1000000); // Quy đổi sang triệu VND

        setChartData({
          labels,
          datasets: [
            {
              label: 'Doanh thu (triệu VND)',
              data,
              backgroundColor: 'rgba(76, 201, 240, 0.6)',
              borderColor: 'rgba(76, 201, 240, 1)',
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStatClick = (path) => {
    navigate(path);
  };

  // Cấu hình biểu đồ
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê doanh thu theo tháng',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Doanh thu (triệu VND)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Tháng',
        },
      },
    },
  };

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div 
                className="stat-card" 
                key={index} 
                onClick={() => handleStatClick(stat.path)}
                style={{ cursor: 'pointer' }}
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
          {/* Biểu đồ doanh thu */}
          <div className="chart-section" style={{ marginTop: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {chartData && <Bar data={chartData} options={chartOptions} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
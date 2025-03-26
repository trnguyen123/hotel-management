import React, { useState, useEffect } from 'react';
import { FaUsers, FaConciergeBell, FaTicketAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
  const [selectedDate, setSelectedDate] = useState(null); // State for selected date
  const [bookingsData, setBookingsData] = useState([]); // Store bookings data for filtering

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
        const bookings = await bookingsResponse.json();

        // Lưu dữ liệu bookings để sử dụng cho việc lọc
        setBookingsData(bookings);

        // Cập nhật stats
        setStats(prevStats => {
          const newStats = [...prevStats];
          newStats[0].value = employeesData.count || 0; // Nhân viên
          newStats[1].value = servicesData.count || 0;  // Dịch vụ
          newStats[2].value = vouchersData.count || 0;  // Voucher
          return newStats;
        });

        // Ban đầu hiển thị dữ liệu theo tháng (giống như trước)
        updateChartData(bookings);

        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Hàm cập nhật dữ liệu biểu đồ (dựa trên booking_date)
  const updateChartData = (bookings, date = null) => {
    let labels = [];
    let data = [];
  
    if (date) {
      // Chuyển ngày được chọn sang múi giờ UTC
      const utcDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      const year = utcDate.getUTCFullYear();
      const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0, cần +1
      const day = String(utcDate.getUTCDate()).padStart(2, '0');
      const selectedDateString = `${year}-${month}-${day}`; // Định dạng YYYY-MM-DD ở UTC
  
      const filteredBookings = bookings.filter(booking => {
        const bookingDateObj = new Date(booking.booking_date);
        const bookingYear = bookingDateObj.getUTCFullYear();
        const bookingMonth = String(bookingDateObj.getUTCMonth() + 1).padStart(2, '0');
        const bookingDay = String(bookingDateObj.getUTCDate()).padStart(2, '0');
        const bookingDate = `${bookingYear}-${bookingMonth}-${bookingDay}`;
        return bookingDate === selectedDateString;
      });
  
      // Tính doanh thu cho ngày được chọn
      const dailyRevenue = filteredBookings.reduce((total, booking) => {
        return total + convertToVND(booking.total_price, booking.payment_method);
      }, 0);
  
      labels = [selectedDateString];
      data = [dailyRevenue / 1000000]; // Quy đổi sang triệu VND
    } else {
      // Hiển thị dữ liệu theo tháng (giữ nguyên logic cũ)
      const revenueByMonth = {};
      bookings.forEach(booking => {
        const bookingDate = new Date(booking.booking_date);
        const year = bookingDate.getUTCFullYear();
        const monthYear = `${year}-${String(bookingDate.getUTCMonth() + 1).padStart(2, '0')}`;
        const revenue = convertToVND(booking.total_price, booking.payment_method);
        if (booking.payment_status === 'paid') {
          revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + revenue;
        }
      });
  
      labels = Object.keys(revenueByMonth).sort();
      data = labels.map(month => revenueByMonth[month] / 1000000);
    }
  
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
  };

  // Xử lý khi người dùng chọn ngày
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      updateChartData(bookingsData, date); // Cập nhật biểu đồ theo ngày
    } else {
      updateChartData(bookingsData); // Quay lại hiển thị theo tháng nếu không chọn ngày
    }
  };

  const handleStatClick = (path) => {
    navigate(path);
  };

  // Cấu hình biểu đồ
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: "#000", // Màu chữ đen cho legend
          font: {
            weight: "bold" // Làm đậm chữ
          }
        }
      },
      title: {
        display: true,
        text: 'Thống kê doanh thu theo ' + (selectedDate ? 'ngày' : 'tháng'),
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
          text: selectedDate ? 'Ngày' : 'Tháng',
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
          {/* Thanh tìm kiếm theo ngày */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <label>Chọn ngày để xem thống kê: </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
              isClearable // Cho phép xóa ngày đã chọn
            />
          </div>
          {/* Biểu đồ doanh thu */}
          <div className="chart-section">
            {chartData && <Bar data={chartData} options={chartOptions} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
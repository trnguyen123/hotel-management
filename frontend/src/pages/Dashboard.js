import React, { useState, useEffect } from 'react';
import { FaUsers, FaConciergeBell, FaTicketAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Style/Dashboard.css';

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
  const [roomClusterData, setRoomClusterData] = useState(null);
  const [paymentClusterData, setPaymentClusterData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookingsData, setBookingsData] = useState([]);

  const EXCHANGE_RATE = 25000; // Tỷ giá: 1 USD = 25,000 VND
  const convertToVND = (amount, paymentMethod) => {
    const isVnd = ['vnpay', 'cash'].includes(paymentMethod?.toLowerCase());
    const value = Number(amount) || 0;
    return isVnd ? value : value * EXCHANGE_RATE;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const employeesResponse = await fetch('http://localhost:5000/api/employee/count');
        const employeesData = await employeesResponse.json();

        const servicesResponse = await fetch('http://localhost:5000/api/service/count');
        const servicesData = await servicesResponse.json();

        const vouchersResponse = await fetch('http://localhost:5000/api/voucher/count');
        const vouchersData = await vouchersResponse.json();

        const bookingsResponse = await fetch('http://localhost:5000/api/booking/getAll');
        const bookings = await bookingsResponse.json();

        const roomClusteringResponse = await fetch('http://localhost:5000/api/clustering/room_clusters');
        const roomClusteringData = await roomClusteringResponse.json();

        const paymentClusteringResponse = await fetch('http://localhost:5000/api/clustering/payment_clusters');
        const paymentClusteringData = await paymentClusteringResponse.json();

        setStats(prevStats => {
          const newStats = [...prevStats];
          newStats[0].value = employeesData.count || 0;
          newStats[1].value = servicesData.count || 0;
          newStats[2].value = vouchersData.count || 0;
          return newStats;
        });

        setBookingsData(bookings);
        updateChartData(bookings);
        updateRoomClusterChartData(roomClusteringData);
        updatePaymentClusterChartData(paymentClusteringData);

        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Hàm cập nhật biểu đồ doanh thu
  const updateChartData = (bookings, date = null) => {
    let labels = [];
    let data = [];
  
    if (date) {
      const utcDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      const year = utcDate.getUTCFullYear();
      const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(utcDate.getUTCDate()).padStart(2, '0');
      const selectedDateString = `${year}-${month}-${day}`;

      const filteredBookings = bookings.filter(booking => {
        const bookingDateObj = new Date(booking.booking_date);
        const bookingYear = bookingDateObj.getUTCFullYear();
        const bookingMonth = String(bookingDateObj.getUTCMonth() + 1).padStart(2, '0');
        const bookingDay = String(bookingDateObj.getUTCDate()).padStart(2, '0');
        const bookingDate = `${bookingYear}-${bookingMonth}-${bookingDay}`;
        return bookingDate === selectedDateString;
      });

      const dailyRevenue = filteredBookings.reduce((total, booking) => {
        return total + convertToVND(booking.total_price, booking.payment_method);
      }, 0);

      labels = [selectedDateString];
      data = [dailyRevenue / 1000000];
    } else {
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

  // Hàm cập nhật biểu đồ phân cụm phòng
  const updateRoomClusterChartData = (roomClusteringData) => {
    const labels = roomClusteringData.map(item => `Phòng ${item.room_id}`);
    const revenues = roomClusteringData.map(item => item.total_revenue / 1000000);
    const clusters = roomClusteringData.map(item => item.cluster);

    const clusterColors = clusters.map(cluster => {
      switch (cluster) {
        case 0: return 'rgba(255, 99, 132, 0.6)';
        case 1: return 'rgba(54, 162, 235, 0.6)';
        case 2: return 'rgba(75, 192, 192, 0.6)';
        default: return 'rgba(150, 150, 150, 0.6)';
      }
    });

    setRoomClusterData({
      labels,
      datasets: [
        {
          label: 'Doanh thu theo phòng (triệu VND)',
          data: revenues,
          backgroundColor: clusterColors,
          borderColor: clusterColors.map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    });
  };

  // Hàm cập nhật biểu đồ phân cụm phương thức thanh toán
  const updatePaymentClusterChartData = (paymentClusteringData) => {
    const labels = paymentClusteringData.map(item => item.payment_method);
    const revenues = paymentClusteringData.map(item => {
      // Quy đổi từ USD sang VND nếu là paypal
      const revenueInVND = convertToVND(item.total_revenue, item.payment_method);
      return revenueInVND / 1000000; // Chuyển sang triệu VND
    });
    const clusters = paymentClusteringData.map(item => item.cluster);

    const clusterColors = clusters.map(cluster => {
      switch (cluster) {
        case 0: return 'rgba(255, 99, 132, 0.6)';
        case 1: return 'rgba(54, 162, 235, 0.6)';
        case 2: return 'rgba(75, 192, 192, 0.6)';
        default: return 'rgba(150, 150, 150, 0.6)';
      }
    });

    setPaymentClusterData({
      labels,
      datasets: [
        {
          label: 'Doanh thu theo phương thức (triệu VND)',
          data: revenues,
          backgroundColor: clusterColors,
          borderColor: clusterColors.map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      updateChartData(bookingsData, date);
    } else {
      updateChartData(bookingsData);
    }
  };

  const handleStatClick = (path) => {
    navigate(path);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Thống kê doanh thu theo ' + (selectedDate ? 'ngày' : 'tháng') },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Doanh thu (triệu VND)' } },
      x: { title: { display: true, text: selectedDate ? 'Ngày' : 'Tháng' } },
    },
  };

  const roomClusterChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Phân cụm doanh thu theo phòng' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Doanh thu (triệu VND)' } },
      x: { title: { display: true, text: 'Phòng' } },
    },
  };

  const paymentClusterChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Phân cụm doanh thu theo phương thức thanh toán' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Doanh thu (triệu VND)' } },
      x: { title: { display: true, text: 'Phương thức thanh toán' } },
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

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <label>Chọn ngày để xem thống kê: </label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
              isClearable
            />
          </div>

          <div className="chart-section">
            {chartData && <Bar data={chartData} options={chartOptions} />}
          </div>

          <div className="chart-section" style={{ marginTop: '40px' }}>
            {roomClusterData && <Bar data={roomClusterData} options={roomClusterChartOptions} />}
          </div>

          <div className="chart-section" style={{ marginTop: '40px' }}>
            {paymentClusterData && <Bar data={paymentClusterData} options={paymentClusterChartOptions} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
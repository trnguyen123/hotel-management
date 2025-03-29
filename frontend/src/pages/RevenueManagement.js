import React, { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaTicketAlt, FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../Style/Management.css';

const RevenueManagement = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('bookings');
  const [period, setPeriod] = useState('month');
  const [date, setDate] = useState('2025-03');
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Thêm state cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10; // Số booking mỗi trang

  const EXCHANGE_RATE = 25000;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/booking/getAll');
        const data = await response.json();
        setBookingData(data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bookings:', error);
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filterDataByPeriod = (data) => {
    const selectedDate = new Date(date + '-01');
    return data.filter((item) => {
      const checkInDate = new Date(item.check_in_date);
      if (period === 'day') {
        return checkInDate.toISOString().slice(0, 10) === date;
      } else if (period === 'month') {
        return (
          checkInDate.getMonth() === selectedDate.getMonth() &&
          checkInDate.getFullYear() === selectedDate.getFullYear()
        );
      } else if (period === 'quarter') {
        const quarter = Math.ceil((selectedDate.getMonth() + 1) / 3);
        const itemQuarter = Math.ceil((checkInDate.getMonth() + 1) / 3);
        return itemQuarter === quarter && checkInDate.getFullYear() === selectedDate.getFullYear();
      } else if (period === 'year') {
        return checkInDate.getFullYear() === selectedDate.getFullYear();
      }
      return true;
    });
  };

  const convertToVND = (amount, paymentMethod) => {
    const isVnd = ['vnpay', 'cash'].includes(paymentMethod.toLowerCase());
    const value = Number(amount) || 0;
    return isVnd ? value : value * EXCHANGE_RATE;
  };

  const filteredBookings = filterDataByPeriod(bookingData);
  const totalRevenue = filteredBookings.reduce((sum, b) => 
    sum + convertToVND(b.total_price, b.payment_method), 0
  );

  // Tính toán phân trang
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const goToDashboard = () => {
    navigate('/admin/dashboard', { state: { monthlyRevenue: totalRevenue } });
  };

  // Hàm xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Quản lý báo cáo</h1>
      </div>
      <div className="card">
        <div className="report-header">
          <h2>
            {reportType === 'bookings' ? (
              <><FaBook className="report-icon" /> Báo cáo đặt phòng</>
            ) : reportType === 'revenue' ? (
              <><FaChartBar className="report-icon" /> Báo cáo doanh thu</>
            ) : reportType === 'employee' ? (
              <><FaUsers className="report-icon" /> Báo cáo nhân viên</>
            ) : (
              <><FaTicketAlt className="report-icon" /> Báo cáo dịch vụ</>
            )}
          </h2>
        </div>

        <div className="table-responsive">
          {reportType === 'bookings' && (
            loading ? (
              <p>Đang tải dữ liệu...</p>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Tên khách hàng</th>
                      <th>Số phòng</th>
                      <th>Ngày đặt</th>
                      <th>Ngày nhận</th>
                      <th>Ngày trả</th>
                      <th>Trạng thái</th>
                      <th>Tổng giá</th>
                      <th>Thanh toán</th>
                      <th>Phí hủy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBookings.map((booking) => {
                      const isVnd = ['vnpay', 'cash'].includes(booking.payment_method.toLowerCase());
                      const totalPrice = booking.total_price ? Number(booking.total_price) : 0;
                      const cancellationFee = Number(booking.cancellation_fee);

                      return (
                        <tr key={booking.booking_id}>
                          <td>{booking.booking_id}</td>
                          <td>{booking.full_name}</td>
                          <td>{booking.room_number}</td>
                          <td>{new Date(booking.booking_date).toLocaleDateString('vi-VN')}</td>
                          <td>{new Date(booking.check_in_date).toLocaleDateString('vi-VN')}</td>
                          <td>{new Date(booking.check_out_date).toLocaleDateString('vi-VN')}</td>
                          <td>{booking.status}</td>
                          <td className="text-right">
                            {isVnd
                              ? `${totalPrice.toLocaleString()} VND`
                              : `${totalPrice.toLocaleString()} USD`}
                          </td>
                          <td>{booking.payment_status}</td>
                          <td className="text-right">
                            {isVnd
                              ? `${cancellationFee.toLocaleString()} VND`
                              : `${cancellationFee.toLocaleString()} USD`}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="summary-row">
                      <td colSpan="7"><strong>Tổng</strong></td>
                      <td className="text-right">
                        <strong>{totalRevenue.toLocaleString()} VND</strong>
                      </td>
                      <td></td>
                      <td className="text-right">
                        <strong>
                          {filteredBookings
                            .reduce((sum, b) => sum + convertToVND(b.cancellation_fee, b.payment_method), 0)
                            .toLocaleString()} VND
                        </strong>
                      </td>
                    </tr>
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
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueManagement;
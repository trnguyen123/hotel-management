import React, { useState } from 'react';
import { FaDownload, FaChartBar, FaUsers, FaTicketAlt } from 'react-icons/fa';
import '../Style/Management.css';

const ReportManagement = () => {
  const [reportType, setReportType] = useState('revenue');
  const [period, setPeriod] = useState('month');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 7)); // Default to current month (YYYY-MM)

  // Sample data for demonstration
  const revenueData = [
    { date: '2023-01-01', income: 12500000, expenses: 5200000, profit: 7300000 },
    { date: '2023-01-02', income: 8700000, expenses: 3400000, profit: 5300000 },
    { date: '2023-01-03', income: 10200000, expenses: 4800000, profit: 5400000 },
    { date: '2023-01-04', income: 9500000, expenses: 4100000, profit: 5400000 },
    { date: '2023-01-05', income: 14200000, expenses: 6300000, profit: 7900000 },
  ];

  const employeeData = [
    { id: 1, name: 'Nguyễn Văn A', customers: 45, revenue: 15200000, commission: 1520000 },
    { id: 2, name: 'Trần Thị B', customers: 38, revenue: 12800000, commission: 1280000 },
    { id: 3, name: 'Lê Văn C', customers: 42, revenue: 14500000, commission: 1450000 },
    { id: 4, name: 'Phạm Thị D', customers: 36, revenue: 11900000, commission: 1190000 },
  ];

  const serviceData = [
    { id: 1, name: '@@@@@@', count: 125, revenue: 18750000 },
    { id: 2, name: '@@@@@@', count: 98, revenue: 19600000 },
    { id: 3, name: '@@@@@@', count: 65, revenue: 32500000 },
    { id: 4, name: '@@@@@@', count: 42, revenue: 29400000 },
  ];

  const handleDownload = () => {
    alert('Tính năng tải xuống báo cáo đang được phát triển.');
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Quản lý báo cáo</h1>
      </div>

      <div className="report-filters card">
        <div className="filter-group">
          <label>Loại báo cáo:</label>
          <select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
            className="form-control"
          >
            <option value="revenue">Báo cáo doanh thu</option>
            <option value="employee">Báo cáo nhân viên</option>
            <option value="service">Báo cáo dịch vụ</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Khoảng thời gian:</label>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="form-control"
          >
            <option value="day">Ngày</option>
            <option value="month">Tháng</option>
            <option value="quarter">Quý</option>
            <option value="year">Năm</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{period === 'day' ? 'Ngày:' : period === 'month' ? 'Tháng:' : period === 'quarter' ? 'Quý:' : 'Năm:'}</label>
          <input 
            type={period === 'day' ? 'date' : 'month'} 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary" onClick={handleDownload}>
          <FaDownload /> Tải xuống
        </button>
      </div>

      <div className="card">
        <div className="report-header">
          <h2>
            {reportType === 'revenue' ? (
              <><FaChartBar className="report-icon" /> Báo cáo doanh thu</>
            ) : reportType === 'employee' ? (
              <><FaUsers className="report-icon" /> Báo cáo nhân viên</>
            ) : (
              <><FaTicketAlt className="report-icon" /> Báo cáo dịch vụ</>
            )}
          </h2>
          <p className="report-period">
            {period === 'day' && `Ngày ${new Date(date).toLocaleDateString('vi-VN')}`}
            {period === 'month' && `Tháng ${new Date(date + '-01').toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`}
            {period === 'quarter' && `Quý ${Math.ceil(new Date(date + '-01').getMonth() / 3)} năm ${new Date(date + '-01').getFullYear()}`}
            {period === 'year' && `Năm ${new Date(date + '-01').getFullYear()}`}
          </p>
        </div>

        <div className="table-responsive">
          {reportType === 'revenue' && (
            <table className="table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Doanh thu</th>
                  <th>Chi phí</th>
                  <th>Lợi nhuận</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((item, index) => (
                  <tr key={index}>
                    <td>{new Date(item.date).toLocaleDateString('vi-VN')}</td>
                    <td className="text-right">{item.income.toLocaleString()} VND</td>
                    <td className="text-right">{item.expenses.toLocaleString()} VND</td>
                    <td className="text-right">{item.profit.toLocaleString()} VND</td>
                  </tr>
                ))}
                <tr className="summary-row">
                  <td><strong>Tổng</strong></td>
                  <td className="text-right"><strong>{revenueData.reduce((sum, item) => sum + item.income, 0).toLocaleString()} VND</strong></td>
                  <td className="text-right"><strong>{revenueData.reduce((sum, item) => sum + item.expenses, 0).toLocaleString()} VND</strong></td>
                  <td className="text-right"><strong>{revenueData.reduce((sum, item) => sum + item.profit, 0).toLocaleString()} VND</strong></td>
                </tr>
              </tbody>
            </table>
          )}

          {reportType === 'employee' && (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên nhân viên</th>
                  <th>Số khách hàng</th>
                  <th>Doanh thu</th>
                  <th>Hoa hồng</th>
                </tr>
              </thead>
              <tbody>
                {employeeData.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td className="text-right">{employee.customers}</td>
                    <td className="text-right">{employee.revenue.toLocaleString()} VND</td>
                    <td className="text-right">{employee.commission.toLocaleString()} VND</td>
                  </tr>
                ))}
                <tr className="summary-row">
                  <td colSpan="2"><strong>Tổng</strong></td>
                  <td className="text-right"><strong>{employeeData.reduce((sum, emp) => sum + emp.customers, 0)}</strong></td>
                  <td className="text-right"><strong>{employeeData.reduce((sum, emp) => sum + emp.revenue, 0).toLocaleString()} VND</strong></td>
                  <td className="text-right"><strong>{employeeData.reduce((sum, emp) => sum + emp.commission, 0).toLocaleString()} VND</strong></td>
                </tr>
              </tbody>
            </table>
          )}

          {reportType === 'service' && (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên dịch vụ</th>
                  <th>Số lượng</th>
                  <th>Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {serviceData.map((service) => (
                  <tr key={service.id}>
                    <td>{service.id}</td>
                    <td>{service.name}</td>
                    <td className="text-right">{service.count}</td>
                    <td className="text-right">{service.revenue.toLocaleString()} VND</td>
                  </tr>
                ))}
                <tr className="summary-row">
                  <td colSpan="2"><strong>Tổng</strong></td>
                  <td className="text-right"><strong>{serviceData.reduce((sum, service) => sum + service.count, 0)}</strong></td>
                  <td className="text-right"><strong>{serviceData.reduce((sum, service) => sum + service.revenue, 0).toLocaleString()} VND</strong></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportManagement;
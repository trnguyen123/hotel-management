import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaConciergeBell, FaTicketAlt, FaChartBar, FaBed } from 'react-icons/fa';
import '../Style/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>Admin Panel</h2>
      </div>
      <nav className="nav-menu">
        <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FaHome className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/employees" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FaUsers className="nav-icon" />
          <span>Quản lý nhân viên</span>
        </NavLink>
        <NavLink to="/admin/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FaConciergeBell className="nav-icon" />
          <span>Quản lý dịch vụ</span>
        </NavLink>
        <NavLink to="/admin/vouchers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FaTicketAlt className="nav-icon" />
          <span>Quản lý voucher</span>
        </NavLink>
        <NavLink to="/admin/room-reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FaBed className="nav-icon" />
          <span>Báo cáo phòng</span>
        </NavLink>
        <NavLink to="/admin/revenue" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FaChartBar className="nav-icon" />
          <span>Quản lý doanh thu</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
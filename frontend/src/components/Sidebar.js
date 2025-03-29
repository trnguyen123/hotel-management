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
          <span>Nhân viên</span>
        </NavLink>
        <NavLink to="/admin/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FaConciergeBell className="nav-icon" />
          <span>Dịch vụ</span>
        </NavLink>
        <NavLink to="/admin/vouchers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FaTicketAlt className="nav-icon" />
          <span>Voucher</span>
        </NavLink>
        <NavLink to="/admin/room-reports" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FaBed className="nav-icon" />
          <span>Phòng</span>
        </NavLink>
        <NavLink to="/admin/revenue" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <FaChartBar className="nav-icon" />
          <span>Doanh thu</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EmployeeManagement from './pages/EmployeeManagement';
import ServiceManagement from './pages/ServiceManagement';
import VoucherManagement from './pages/VoucherManagement';
import RoomReportsPage from './pages/RoomReportsPage';
import RevenueManagement from './pages/RevenueManagement';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<EmployeeManagement />} />
            <Route path="/services" element={<ServiceManagement />} />
            <Route path="/vouchers" element={<VoucherManagement />} />
            <Route path="/room-reports" element={<RoomReportsPage />} />
            <Route path="/revenue" element={<RevenueManagement />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header.js";
import { BookingProvider } from "./components/BookingContext.js";
import Rooms from "./components/Rooms.js";
import Footer from "./components/Footer.js";
import Login from "./components/Login.js";
import Reports from "./components/Reports.js";
import Service from "./components/Service.js";
import { CalendarProvider } from "./components/CalendarContext.js";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import EmployeeManagement from "./pages/EmployeeManagement";
import ServiceManagement from "./pages/ServiceManagement";
import VoucherManagement from "./pages/VoucherManagement";
import RoomReportsPage from "./pages/RoomReportsPage";
import RevenueManagement from "./pages/RevenueManagement";
import PaymentSuccess from "./components/PaymentSuccess";

function App() {
  const [currentPage, setCurrentPage] = useState("Calendar");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Use useNavigate to redirect after login
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);

      // Redirect to the appropriate page based on role after login
      if (parsedUser.role === "manager") {
        navigate("/admin");
      } else if (parsedUser.role === "receptionist") {
        navigate("/calendar");
      } else if (parsedUser.role === "service staff") {
        navigate("/service");
      }
    }
  }, [navigate]);

  const changePage = (pageName) => {
    setCurrentPage(pageName);
  };

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Redirect based on user role after login
    if (userData.role === "manager") {
      navigate("/admin");
    } else if (userData.role === "receptionist") {
      navigate("/calendar");
    } else if (userData.role === "service staff") {
      navigate("/service");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
    navigate("/"); // Redirect to login page after logout
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Header onChangePage={changePage} currentPage={currentPage} user={user} onLogout={handleLogout} />
      <div className="app">
        {user && user.role === "manager" && <Sidebar />}
        <div className="content">
          <Routes>
            {/* Default Route for Root Path */}
            <Route
              path="/"
              element={
                user.role === "manager"
                  ? <Dashboard />
                  : user.role === "receptionist"
                  ? (
                      <BookingProvider>
                        <CalendarProvider>
                          <Rooms />
                        </CalendarProvider>
                      </BookingProvider>
                    )
                  : <Service />
              }
            />

            {/* Vai trò Lễ tân */}
            {user && user.role === "receptionist" && (
              <>
                <Route
                  path="/calendar"
                  element={
                    <BookingProvider>
                      <CalendarProvider>
                        <Rooms />
                      </CalendarProvider>
                    </BookingProvider>
                  }
                />
                <Route path="/service" element={<Service />} />
              </>
            )}

            {/* Vai trò Nhân viên Dịch vụ */}
            {user && user.role === "service staff" && (
              <>
                <Route path="/service" element={<Service />} />
                <Route path="/reports" element={<Reports />} />
              </>
            )}

            {/* Vai trò Quản lý */}
            {user && user.role === "manager" && (
              <>
                <Route
                  path="/calendar"
                  element={
                    <BookingProvider>
                      <CalendarProvider>
                        <Rooms />
                      </CalendarProvider>
                    </BookingProvider>
                  }
                />
                <Route path="/reports" element={<Reports />} />
                <Route path="/service" element={<Service />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/admin/employees" element={<EmployeeManagement />} />
                <Route path="/admin/services" element={<ServiceManagement />} />
                <Route path="/admin/vouchers" element={<VoucherManagement />} />
                <Route path="/admin/room-reports" element={<RoomReportsPage />} />
                <Route path="/admin/revenue" element={<RevenueManagement />} />
              </>
            )}

            {/* Tuyến đường Công khai cho Payment Success */}
            <Route path="/payment-success" element={<PaymentSuccess />} />

            <Route path="*" element={<div>Bạn không có quyền truy cập trang này</div>} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// Wrap App with Router since useNavigate needs Router context
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
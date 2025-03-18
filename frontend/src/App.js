import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import PaymentSuccess from "./components/PaymentSuccess"; // Thêm import PaymentSuccess

function App() {
  const [currentPage, setCurrentPage] = useState("Calendar");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Kiểm tra localStorage khi app khởi động
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Hàm để thay đổi trang
  const changePage = (pageName) => {
    setCurrentPage(pageName);
  };

  // Hàm xử lý đăng nhập
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="App">
        <Header onChangePage={changePage} currentPage={currentPage} user={user} onLogout={handleLogout} />
        <div className="app">
          {user && user.role === "manager" && <Sidebar />}
          <div className="content">
            <Routes>
              {/* Routes cho receptionist */}
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

              {/* Routes cho service_staff */}
              {user && user.role === "service_staff" && (
                <>
                  <Route path="/service" element={<Service />} />
                  <Route path="/reports" element={<Reports />} />
                </>
              )}

              {/* Routes cho manager */}
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

              {/* Routes công khai */}
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
              <Route path="/reports" element={<Reports />} />

              {/* Route cho PaymentSuccess */}
              <Route path="/payment-success" element={<PaymentSuccess />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
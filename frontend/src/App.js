import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Login from "./components/Login.js";
import Reports from "./components/Reports.js";
import Service from "./components/Service.js";
import Rooms from "./components/Rooms.js";
import { BookingProvider } from "./components/BookingContext.js";
import { CalendarProvider } from "./components/CalendarContext.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Xử lý đăng nhập
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  // Kiểm tra `localStorage` khi ứng dụng khởi động
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Header user={user} onLogout={handleLogout} />}
        
        <Routes>
          {/* Nếu chưa đăng nhập, chuyển hướng đến trang login */}
          {!isLoggedIn ? (
            <Route path="*" element={<Login onLogin={handleLogin} />} />
          ) : (
            <>
              {/* Route dành riêng cho từng role */}
              {user.role === "receptionist" && (
                <>
                  <Route path="/calendar" element={
                    <BookingProvider>
                      <CalendarProvider>
                        <Rooms />
                      </CalendarProvider>
                    </BookingProvider>
                  } />
                  <Route path="/service" element={<Service />} />
                  <Route path="*" element={<Navigate to="/calendar" />} />
                </>
              )}

              {user.role === "service_staff" && (
                <>
                  <Route path="/service" element={<Service />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<Navigate to="/service" />} />
                </>
              )}

              {user.role === "manager" && (
                <>
                  <Route path="/calendar" element={
                    <BookingProvider>
                      <CalendarProvider>
                        <Rooms />
                      </CalendarProvider>
                    </BookingProvider>
                  } />
                  <Route path="/service" element={<Service />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="*" element={<Navigate to="/calendar" />} />
                </>
              )}
            </>
          )}
        </Routes>

        {isLoggedIn && <Footer />}
      </div>
    </Router>
  );
}

export default App;
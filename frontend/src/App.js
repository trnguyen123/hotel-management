import "./App.css";
import React, { useState } from "react";
import Header from "./components/Header.js";
import { BookingProvider } from "./components/BookingContext.js";
import Rooms from "./components/Rooms.js";
import Footer from "./components/Footer.js";
import Login from "./components/Login.js";
import Reports from "./components/Reports.js";
import Service from "./components/Service.js";
import { CalendarProvider } from "./components/CalendarContext.js";

function App() {
  // State để quản lý trang hiện tại
  const [currentPage, setCurrentPage] = useState("Calendar");
  // State để quản lý trạng thái đăng nhập và thông tin người dùng
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Hàm để thay đổi trang
  const changePage = (pageName) => {
    setCurrentPage(pageName);
  };

  // Hàm để xử lý đăng nhập
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Hàm để xử lý đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Render trang phù hợp dựa trên currentPage và vai trò của người dùng
  const renderPage = () => {
    switch (currentPage) {
      case "Calendar":
        return (
          <BookingProvider>
            <CalendarProvider>
              <Rooms />
            </CalendarProvider>
          </BookingProvider>
        );
      case "Reports":
        return <Reports />;
      case "Service":
        return <Service />;
      default:
        return (
          <BookingProvider>
            <CalendarProvider>
              <Rooms />
            </CalendarProvider>
          </BookingProvider>
        );
    }
  };

  // Nếu chưa đăng nhập, hiển thị trang đăng nhập
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Nếu đã đăng nhập, hiển thị header, footer và trang hiện tại dựa trên vai trò của người dùng
  return (
    <div className="App">
      <Header onChangePage={changePage} currentPage={currentPage} user={user} onLogout={handleLogout} />
      {user.role === "receptionist" && (currentPage === "Calendar" || currentPage === "Service") && renderPage()}
      {user.role === "service_staff" && (currentPage === "Service" || currentPage === "Reports") && renderPage()}
      {user.role === "manager" && renderPage()}
      <Footer />
    </div>
  );
}

export default App;
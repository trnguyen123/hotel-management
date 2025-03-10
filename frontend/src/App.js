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

  // Hàm để thay đổi trang
  const changePage = (pageName) => {
    setCurrentPage(pageName);
  };

  // Render trang phù hợp dựa trên currentPage
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
      case "Login":
        return <Login />;
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

  return (
    <div className='App'>
      <Header onChangePage={changePage} currentPage={currentPage} />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;

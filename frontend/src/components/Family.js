import React, { useState } from "react";
import ReservationModal from "./ReservationModal";
import "../Style/Calender.css";
import { useBooking } from "./BookingContext";

const Family = () => {
  const [currentDate, setCurrentDate] = useState("31 Aug 2021");
  const [selectedDays, setSelectedDays] = useState("14 days");
  const [isRoomSectionExpanded, setIsRoomSectionExpanded] = useState(true);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { bookings, addBooking } = useBooking();

  const days = [
    { day: "TODAY", date: "31", month: "AUG" },
    { day: "WED", date: "01", month: "SEP" },
    { day: "THU", date: "02", month: "SEP" },
    { day: "FRI", date: "03", month: "SEP" },
    { day: "SAT", date: "04", month: "SEP" },
    { day: "SUN", date: "05", month: "SEP" },
    { day: "MON", date: "06", month: "SEP" },
    { day: "TUE", date: "07", month: "SEP" },
    { day: "WED", date: "08", month: "SEP" },
    { day: "THU", date: "09", month: "SEP" },
    { day: "FRI", date: "10", month: "SEP" },
    { day: "SAT", date: "11", month: "SEP" },
    { day: "SUN", date: "12", month: "SEP" },
    { day: "MON", date: "13", month: "SEP" },
  ];

  // Danh sách phòng cố định cho Family Room
  const roomsList = [
    { id: 1, name: "Room 1" },
    { id: 2, name: "Room 2" },
    { id: 3, name: "Room 3" },
    { id: 4, name: "Room 4" },
    { id: 5, name: "Room 5" },
    { id: 6, name: "Room 6" },
    { id: 7, name: "Room 7" },
    { id: 8, name: "Room 8" },
  ];

  // Lọc booking từ context theo loại phòng và số phòng (Family Room)
  const rooms = roomsList.map((room) => ({
    ...room,
    bookings: bookings.filter(
      (b) =>
        b.details.room_type === "Family Room" &&
        b.details.room_number === room.name
    ),
  }));

  const handleDaysChange = (event) => {
    setSelectedDays(event.target.value);
  };

  const handleViewToday = () => {
    setCurrentDate("31 Aug 2021");
  };

  const toggleRoomSection = () => {
    setIsRoomSectionExpanded(!isRoomSectionExpanded);
  };

  // Phạm vi ngày: 31/08/2021 đến 13/09/2021
  const startOfCalendar = new Date(2021, 7, 31);
  const endOfCalendar = new Date(2021, 8, 13);

  function parseInputDate(dateStr) {
    if (!dateStr) return null;
    if (dateStr.includes("-")) return new Date(dateStr);
    if (dateStr.includes("/")) {
      const [mm, dd, yyyy] = dateStr.split("/");
      return new Date(`${yyyy}-${mm}-${dd}`);
    }
    return new Date(dateStr);
  }

  function getGridColumn(dateObj) {
    if (!dateObj) return 0;
    if (dateObj < startOfCalendar || dateObj > endOfCalendar) return 0;
    const diffTime = dateObj - startOfCalendar;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-controls">
          <select className="days-select" value={selectedDays} onChange={handleDaysChange}>
            <option value="14 days">14 days</option>
            <option value="30 days">30 days</option>
          </select>
          <button className="view-today" onClick={handleViewToday}>View today</button>
          <div className="navigation">
            <button>⟪</button>
            <button>⟨</button>
            <button>⟩</button>
            <span className="current-date">{currentDate}</span>
            <button>⟩</button>
            <button>⟫</button>
            <button>⟫⟫</button>
          </div>
        </div>
        <div className="right-controls">
          <button className="room-closure">○ Room closure</button>
          {/* Nút "+ Reservation" chỉ xuất hiện ở Family.js */}
          <button className="add-reservation" onClick={() => { setSelectedBooking(null); setShowReservationModal(true); }}>
            + Reservation
          </button>
        </div>
      </div>
      <div className="calendar-grid">
        <div className="expand-icon" onClick={toggleRoomSection}>
          Family Room
        </div>
        <div className="calendar-days">
          {days.map((day, index) => (
            <div key={index} className={`day-column ${day.day === "TODAY" ? "today" : ""}`}>
              <div className={`day ${day.day === "TODAY" ? "today-text" : ""}`}>{day.day}</div>
              <div className="date">{day.date}</div>
              <div className="month">{day.month}</div>
            </div>
          ))}
        </div>
        {isRoomSectionExpanded && (
          <div className="room-section">
            <div className="hotel-room">Family Room</div>
            <div className="room-grid">
              {rooms.map((room) => (
                <div key={room.id} className="room-row">
                  <div className="room-name">{room.name}</div>
                  <div className="bookings-container">
                    {room.bookings.map((booking, index) => {
                      const startDate = parseInputDate(booking.details.check_in_date);
                      const endDate = parseInputDate(booking.details.check_out_date);
                      const startCol = getGridColumn(startDate);
                      if (!endDate || isNaN(endDate.getTime())) return null;
                      let diffTime = endDate - startDate;
                      let duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      if (duration < 1) duration = 1;
                      const endCol = startCol + duration;
                      if (startCol <= 0) return null;
                      return (
                        <div
                          key={index}
                          className="booking"
                          style={{
                            backgroundColor: booking.color,
                            gridColumn: `${startCol} / ${endCol}`,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "4px",
                            padding: "4px",
                            color: "white",
                            fontWeight: "bold",
                          }}
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowReservationModal(true);
                          }}
                        >
                          <div className="booking-content">
                            <div>{booking.guest}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ReservationModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        onBookingCreated={(booking) => {
          addBooking(booking);
        }}
        selectedBooking={selectedBooking}
        onBookingDetailsClosed={() => {
          setSelectedBooking(null);
          setShowReservationModal(false);
        }}
      />
    </div>
  );
};

export default Family;

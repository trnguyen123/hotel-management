import React, { useState } from "react";
import ReservationModal from "./ReservationModal";
import "../Style/Calendar.css";
import { useBooking } from "./BookingContext";
import { useCalendar } from "./CalendarContext";

// Hàm tạo mảng ngày động từ startDate với số ngày dayRange
function generateDays(startDate, dayRange) {
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];
  const daysArray = [];
  for (let i = 0; i < dayRange; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    daysArray.push({
      dateObj: d,
      day: i === 0 ? "TODAY" : dayNames[d.getDay()],
      date: d.getDate().toString().padStart(2, "0"),
      month: monthNames[d.getMonth()],
    });
  }
  return daysArray;
}

function formatDDMMYYYY(dateObj) {
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function parseDateInput(str) {
  if (!str) return null;
  if (str.includes("-")) return new Date(str);
  if (str.includes("/")) {
    const [dd, mm, yyyy] = str.split("/");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }
  return new Date(str);
}

const Family = () => {
  const [dayRange, setDayRange] = useState(14);
  const [startDate, setStartDate] = useState(new Date());
  const days = generateDays(startDate, dayRange);
  const [inputDate, setInputDate] = useState(formatDDMMYYYY(startDate));
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { bookings, addBooking } = useBooking();

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

  const rooms = roomsList.map((room) => ({
    ...room,
    bookings: bookings.filter(
      (b) =>
        b.details.room_type === "Family Room" &&
        b.details.room_number === room.name
    ),
  }));

  const [isRoomSectionExpanded, setIsRoomSectionExpanded] = useState(true);

  const handleDateChange = (e) => {
    const value = e.target.value;
    setInputDate(value);
    const parsed = parseDateInput(value);
    if (parsed && !isNaN(parsed.getTime())) {
      setStartDate(parsed);
    }
  };

  const handleViewToday = () => {
    const today = new Date();
    setStartDate(today);
    setInputDate(formatDDMMYYYY(today));
  };

  const handlePrev = () => {
    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() - 7);
    setStartDate(newStart);
    setInputDate(formatDDMMYYYY(newStart));
  };

  const handleNext = () => {
    const newStart = new Date(startDate);
    newStart.setDate(newStart.getDate() + 7);
    setStartDate(newStart);
    setInputDate(formatDDMMYYYY(newStart));
  };

  const handleDaysChange = (e) => {
    const num = parseInt(e.target.value);
    if (!isNaN(num)) {
      setDayRange(num);
    }
  };

  const getGridColumn = (dateObj) => {
    if (!dateObj) return 0;
    const diffTime = dateObj - startDate;
    if (diffTime < 0) return 0;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= dayRange) return 0;
    return diffDays + 1;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-controls">
          <input
            type="date"
            value={parseDateInput(inputDate)?.toISOString().split("T")[0] || ""}
            onChange={handleDateChange}
            style={{ padding: "6px" }}
          />
          <button className="btn-calendar" onClick={handleViewToday}>
            Hiện tại
          </button>
          <button className="btn-calendar" onClick={handlePrev}>
            Trở về
          </button>
          <button className="btn-calendar" onClick={handleNext}>
            Tiếp
          </button>
        </div>
        <div className="right-controls">
          <select value={`${dayRange}`} onChange={handleDaysChange}>
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="30">30 days</option>
          </select>
          <button
            className="add-reservation"
            onClick={() => {
              setSelectedBooking(null);
              setShowReservationModal(true);
            }}
          >
            + Reservation
          </button>
        </div>
      </div>
      <div className="calendar-grid" style={{ overflowX: "auto" }}>
        <div
          className="calendar-days"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${dayRange}, 1fr)`,
            minWidth: `${dayRange * 90}px`,
          }}
        >
          {days.map((dayObj, index) => (
            <div key={index} className={`day-column ${index === 0 ? "today" : ""}`}>
              <div className={`day ${index === 0 ? "today-text" : ""}`}>{dayObj.day}</div>
              <div className="date">{dayObj.date}</div>
              <div className="month">{dayObj.month}</div>
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
                  <div
                    className="bookings-container"
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${dayRange}, 1fr)`,
                      minWidth: `${dayRange * 90}px`,
                    }}
                  >
                    {room.bookings.map((booking, index) => {
                      const start = parseDateInput(booking.details.check_in_date);
                      const end = parseDateInput(booking.details.check_out_date);
                      const startCol = getGridColumn(start);
                      if (!end || isNaN(end.getTime())) return null;
                      let diffTime = end - start;
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
                          <div className="booking-content">{booking.guest}</div>
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

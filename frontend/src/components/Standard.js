import React from "react";
import ReservationModal from "./ReservationModal";
import "../Style/Calender.css";
import { useBooking } from "./BookingContext";

const Standard = () => {
  const [currentDate, setCurrentDate] = React.useState("31 Aug 2021");
  const [selectedDays, setSelectedDays] = React.useState("14 days");
  const [isRoomSectionExpanded, setIsRoomSectionExpanded] = React.useState(true);
  const [showReservationModal, setShowReservationModal] = React.useState(false);
  const [selectedBooking, setSelectedBooking] = React.useState(null);
  const { bookings } = useBooking();

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

  // Lọc booking cho Standard Room
  const rooms = roomsList.map((room) => ({
    ...room,
    bookings: bookings.filter(
      (b) =>
        b.details.room_type === "Standard Room" &&
        b.details.room_number === room.name
    ),
  }));

  const toggleRoomSection = () => {
    setIsRoomSectionExpanded(!isRoomSectionExpanded);
  };

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
    <div className="calendar-container standard">
      <div className="calendar-grid">
        <div className="expand-icon" onClick={toggleRoomSection}>
          Standard Room
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
            <div className="hotel-room">↕</div>
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
                          onClick={() => { setSelectedBooking(booking); setShowReservationModal(true); }}
                        >
                          <span className="search-icon">○</span>
                          {booking.guest}
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
        onBookingCreated={() => {}}
        selectedBooking={selectedBooking}
        onBookingDetailsClosed={() => { setSelectedBooking(null); setShowReservationModal(false); }}
      />
    </div>
  );
};

export default Standard;

import React, { useState, useEffect } from "react";
import CalendarControls from "./CalendarControl";
import ReservationModal from "./ReservationModal";
import "../Style/Calendar.css";
import { useCalendar } from "./CalendarContext";

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

const RoomCalendar = ({ roomType }) => {
  const { getGridColumn } = useCalendar();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isRoomSectionExpanded, setIsRoomSectionExpanded] = useState(true);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [inputDate, setInputDate] = useState(formatDDMMYYYY(startDate));
  const [dayRange, setDayRange] = useState(14);
  const days = generateDays(startDate, dayRange);

  useEffect(() => {
    const fetchRoomsAndBookings = async () => {
      try {
        const roomResponse = await fetch("http://localhost:5000/api/room/getNumberAndType");
        const roomData = await roomResponse.json();

        const bookingResponse = await fetch("http://localhost:5000/api/calendar/getAll");
        const bookingData = await bookingResponse.json();

        console.log("Booking data:", bookingData);
        const filteredRooms = roomData.filter((room) => room.room_type === roomType);
        setRooms(filteredRooms);
        setBookings(bookingData);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng và booking:", error);
      }
    };

    fetchRoomsAndBookings();
  }, [roomType]);

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

  const toggleRoomSection = () => {
    setIsRoomSectionExpanded(!isRoomSectionExpanded);
  };

  const handleBookingClick = async (booking) => {
    try {
      const customerResponse = await fetch(`http://localhost:5000/api/customer/${booking.customer_id}`);
      const customerData = await customerResponse.json();

      const roomResponse = await fetch(`http://localhost:5000/api/room/${booking.room_id}`);
      const roomData = await roomResponse.json();

      const detailedBooking = {
        ...booking,
        customer: customerData,
        room: roomData,
      };

      setSelectedBooking(detailedBooking);
      setShowReservationModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin chi tiết booking:", error);
    }
  };

  return (
    <div className="calendar-container">
      <CalendarControls
        onDateChange={handleDateChange}
        onViewToday={handleViewToday}
        onPrev={handlePrev}
        onNext={handleNext}
        dayRange={dayRange}
        onDaysChange={handleDaysChange}
        onAddReservation={() => {
          setSelectedBooking(null);
          setShowReservationModal(true);
        }}
      />

      <div className="calendar-grid">
        <div className="expand-icon" onClick={toggleRoomSection}>
          {roomType}
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
            <div className="hotel-room">{roomType}</div>
            <div className="room-grid">
              {rooms.map((room) => (
                <div key={room.room_number} className="room-row">
                  <div className="room-name">{room.room_number}</div>
                  <div
                    className="bookings-container"
                    style={{ display: "grid", gridTemplateColumns: `repeat(${dayRange}, 1fr)` }}
                  >
                    {bookings
                      .filter((booking) => booking.room === room.room_number)
                      .map((booking, index) => {
                        const startDate = parseDateInput(booking.check_in);
                        const endDate = parseDateInput(booking.check_out);
                        const startCol = getGridColumn(startDate, startDate, dayRange);
                        if (!endDate || isNaN(endDate.getTime())) return null;
                        let duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
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
                            onClick={() => handleBookingClick(booking)}
                          >
                            <span className="search-icon">○</span>
                            {booking.customer}
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
        onBookingDetailsClosed={() => setShowReservationModal(false)}
        roomType={roomType}
        rooms={rooms.map(room => room.room_number)} 
      />
    </div>
  );
};

export default RoomCalendar;
import React, { useState } from "react";
import ReservationModal from "./ReservationModal";
import "../Style/Calendar.css";
import { useBooking } from "./BookingContext";
import { useCalendar } from "./CalendarContext";

const Queen = () => {
  // Lấy lịch động từ CalendarContext (đã được tạo trong Family.js)
  const { days, dayRange, getGridColumn } = useCalendar();
  const { bookings } = useBooking();

  // Giữ nguyên layout ban đầu
  const [isRoomSectionExpanded, setIsRoomSectionExpanded] = useState(true);

  // Danh sách phòng theo layout cũ
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

  // Lọc booking chỉ cho Queen Room
  const rooms = roomsList.map((room) => ({
    ...room,
    bookings: bookings.filter(
      (b) =>
        b.details.room_type === "Queen Room" &&
        b.details.room_number === room.name
    ),
  }));

  // Hàm parse ngày giữ nguyên logic ban đầu
  const parseInputDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("-")) return new Date(dateStr);
    if (dateStr.includes("/")) {
      const [mm, dd, yyyy] = dateStr.split("/");
      return new Date(`${yyyy}-${mm}-${dd}`);
    }
    return new Date(dateStr);
  };

  const toggleRoomSection = () => {
    setIsRoomSectionExpanded(!isRoomSectionExpanded);
  };

  return (
    <div className="calendar-container queen">
      <div className="calendar-grid">
        <div className="expand-icon" onClick={toggleRoomSection}>
          Queen Room
        </div>
        <div className="calendar-days">
          {days.map((day, index) => (
            <div
              key={index}
              className={`day-column ${day.day === "TODAY" ? "today" : ""}`}
            >
              <div className={`day ${day.day === "TODAY" ? "today-text" : ""}`}>
                {day.day}
              </div>
              <div className="date">{day.date}</div>
              <div className="month">{day.month}</div>
            </div>
          ))}
        </div>
        {isRoomSectionExpanded && (
          <div className="room-section">
            <div className="hotel-room">Queen Room</div>
            <div className="room-grid">
              {rooms.map((room) => (
                <div key={room.id} className="room-row">
                  <div className="room-name">{room.name}</div>
                  <div
                    className="bookings-container"
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${dayRange}, 1fr)`,
                    }}
                  >
                    {room.bookings.map((booking, index) => {
                      const startDate = parseInputDate(
                        booking.details.check_in_date
                      );
                      const endDate = parseInputDate(
                        booking.details.check_out_date
                      );
                      const startCol = getGridColumn(startDate);
                      if (!endDate || isNaN(endDate.getTime())) return null;
                      let diffTime = endDate - startDate;
                      let duration = Math.ceil(
                        diffTime / (1000 * 60 * 60 * 24)
                      );
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
                            // Ở Queen.js chỉ hiển thị booking (không có nút tạo mới)
                          }}
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
        isOpen={false}
        onClose={() => {}}
        onBookingCreated={() => {}}
        selectedBooking={null}
        onBookingDetailsClosed={() => {}}
      />
    </div>
  );
};

export default Queen;

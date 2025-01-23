import React, { useState } from "react";
import "../Style/Calender.css";

const Queen = () => {
  const [currentDate, setCurrentDate] = useState("31 Aug 2021");
  const [selectedDays, setSelectedDays] = useState("14 days");
  const [isRoomSectionExpanded, setIsRoomSectionExpanded] = useState(true);

  const [days] = useState([
    { day: "TODAY", date: "31", month: "AUG", weekday: "" },
    { day: "WED", date: "01", month: "SEP", weekday: "" },
    { day: "THU", date: "02", month: "SEP", weekday: "" },
    { day: "FRI", date: "03", month: "SEP", weekday: "" },
    { day: "SAT", date: "04", month: "SEP", weekday: "" },
    { day: "SUN", date: "05", month: "SEP", weekday: "" },
    { day: "MON", date: "06", month: "SEP", weekday: "" },
    { day: "TUE", date: "07", month: "SEP", weekday: "" },
    { day: "WED", date: "08", month: "SEP", weekday: "" },
    { day: "THU", date: "09", month: "SEP", weekday: "" },
    { day: "FRI", date: "10", month: "SEP", weekday: "" },
    { day: "SAT", date: "11", month: "SEP", weekday: "" },
    { day: "SUN", date: "12", month: "SEP", weekday: "" },
    { day: "MON", date: "13", month: "SEP", weekday: "" },
  ]);

  const [rooms] = useState([
    { id: 1, name: "Room 1", bookings: [] },
    { id: 2, name: "Room 2", bookings: [] },
    { id: 3, name: "Room 3", bookings: [] },
    { id: 4, name: "Room 4", bookings: [] },
    { id: 5, name: "Room 5", bookings: [] },
    { id: 6, name: "Room 6", bookings: [] },
    { id: 7, name: "Room 7", bookings: [] },
    { id: 8, name: "Room 8", bookings: [] },
  ]);

  const handleDaysChange = (event) => {
    setSelectedDays(event.target.value);
  };

  const handleViewToday = () => {
    setCurrentDate("31 Aug 2021");
  };

  const toggleRoomSection = () => {
    setIsRoomSectionExpanded(!isRoomSectionExpanded);
  };

  return (
    <div className='calendar-container'>
      <div className='calendar-grid'>
        <div className='expand-icon' onClick={toggleRoomSection}>
          ↕
        </div>
        <div className='calendar-days'>
          {days.map((day, index) => (
            <div
              key={index}
              className={`day-column ${day.day === "TODAY" ? "today" : ""}`}
            >
              <div className={`day ${day.day === "TODAY" ? "today-text" : ""}`}>
                {day.day}
              </div>
              <div className='date'>{day.date}</div>
              <div className='month'>{day.month}</div>
            </div>
          ))}
        </div>

        {isRoomSectionExpanded && (
          <div className='room-section'>
            <div className='hotel-room'> Queen Room</div>
            <div className='room-grid'>
              {rooms.map((room) => (
                <div key={room.id} className='room-row'>
                  <div className='room-name'>{room.name}</div>
                  <div className='bookings-container'>
                    {room.bookings.map((booking, index) => (
                      <div
                        key={index}
                        className='booking'
                        style={{
                          backgroundColor: booking.color,
                          gridColumn: `${booking.startDate} / ${booking.endDate}`,
                        }}
                      >
                        <span className='search-icon'>○</span>
                        {booking.guest}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Queen;

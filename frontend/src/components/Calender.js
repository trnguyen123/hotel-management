import React from "react";
import Calender from "../Style/Calender.css";

const Calendar = () => {
  const days = [
    { day: "TODAY", date: "31", month: "AUG" },
    { day: "WED", date: "01", month: "SEP" },
    // ... thêm các ngày khác
  ];

  const rooms = [
    {
      id: 1,
      name: "Room 1",
      bookings: [
        { guest: "Clark, Oliver", startDate: "31", endDate: "02" },
        { guest: "Smith, Olivia", startDate: "03", endDate: "05" },
        { guest: "Lee, Charlotte", startDate: "09", endDate: "11" },
      ],
    },
    // ... thêm các phòng khác
  ];

  return (
    <div className='calendar-container'>
      <div className='calendar-header'>
        <div className='calendar-controls'>
          <select className='days-select'>
            <option>14 days</option>
          </select>
          <button className='view-today'>View today</button>
          <div className='navigation'>
            <button>⟪</button>
            <button>⟨</button>
            <button>⟩</button>
            <span>31 Aug 2021</span>
            <button>⟩</button>
            <button>⟫</button>
            <button>⟫⟫</button>
          </div>
        </div>
        <button className='room-closure'>Room closure</button>
        <button className='add-reservation'>+ Reservation</button>
      </div>

      <div className='calendar-grid'>
        <div className='calendar-days'>
          {days.map((day, index) => (
            <div key={index} className='day-column'>
              <div className='day'>{day.day}</div>
              <div className='date'>{day.date}</div>
              <div className='month'>{day.month}</div>
            </div>
          ))}
        </div>

        <div className='room-grid'>
          <div className='room-list'>
            {rooms.map((room) => (
              <div key={room.id} className='room-row'>
                <div className='room-name'>{room.name}</div>
                <div className='bookings'>
                  {room.bookings.map((booking, index) => (
                    <div
                      key={index}
                      className='booking'
                      style={{
                        gridColumn: `${booking.startDate} / ${booking.endDate}`,
                      }}
                    >
                      {booking.guest}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

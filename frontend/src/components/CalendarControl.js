// CalendarControls.jsx
import React from "react";
import "../Style/Calendar.css";

const CalendarControls = ({ onDateChange, onViewToday, onPrev, onNext, dayRange, onDaysChange, onAddReservation }) => {
  return (
    <div className="calendar-header">
      <div className="calendar-controls">
        <input type="date" onChange={onDateChange} style={{ padding: "6px" }} />
        <button className="btn-calendar" onClick={onViewToday}>Hiện tại</button>
        <button className="btn-calendar" onClick={onPrev}>Trở về</button>
        <button className="btn-calendar" onClick={onNext}>Tiếp</button>
      </div>
      <div className="right-controls">
        <select value={dayRange} onChange={onDaysChange}>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
        </select>
        <button className="add-reservation" onClick={onAddReservation}>+ Reservation</button>
      </div>
    </div>
  );
};

export default CalendarControls;

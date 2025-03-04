import React, { createContext, useContext, useState } from "react";

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  // Ngày bắt đầu hiển thị (mặc định là hôm nay)
  const [startDate, setStartDate] = useState(new Date());
  // Số ngày hiển thị (ví dụ 14)
  const [dayRange, setDayRange] = useState(14);

  // Hàm tạo mảng ngày động từ startDate với số ngày dayRange
  const generateDays = (start, count) => {
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const monthNames = [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    const days = [];
    for (let i = 0; i < count; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      days.push({
        dateObj: date,
        day: i === 0 ? "TODAY" : dayNames[date.getDay()],
        date: date.getDate().toString().padStart(2, "0"),
        month: monthNames[date.getMonth()],
      });
    }
    return days;
  };

  const days = generateDays(startDate, dayRange);

  // Hàm tính grid column cho booking dựa vào chênh lệch ngày so với startDate
  const getGridColumn = (dateObj) => {
    if (!dateObj) return 0;
    const diffTime = dateObj - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays >= dayRange) return 0;
    return diffDays + 1;
  };

  return (
    <CalendarContext.Provider value={{ startDate, setStartDate, dayRange, setDayRange, days, getGridColumn }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => useContext(CalendarContext);
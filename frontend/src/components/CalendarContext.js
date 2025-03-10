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
  const getGridColumn = (calendarStartDate, bookingStartDate, dayRange) => {
    const start = new Date(calendarStartDate);
    const bookingStart = new Date(bookingStartDate);
    const diffTime = bookingStart - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1; // Đảm bảo giá trị trả về luôn lớn hơn 0
  };

  return (
    <CalendarContext.Provider value={{ startDate, setStartDate, dayRange, setDayRange, days, getGridColumn }}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => useContext(CalendarContext);
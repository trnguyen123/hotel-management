import React, { useEffect, useState } from "react";
import RoomCalendar from "./RoomCalendar";

const Rooms = () => {
  const [roomTypes, setRoomTypes] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/room/getNumberAndType"
        );
        const rooms = await response.json();

        // Nhóm các phòng theo loại phòng (room_type)
        const groupedRooms = {};
        rooms.forEach((room) => {
          if (!groupedRooms[room.room_type]) {
            groupedRooms[room.room_type] = [];
          }
          groupedRooms[room.room_type].push(room.room_number);
        });

        // Chuyển object thành array để dễ render
        const roomTypeList = Object.keys(groupedRooms).map((type) => ({
          type,
          rooms: groupedRooms[type],
        }));

        setRoomTypes(roomTypeList);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      {roomTypes.map((room) => (
        <RoomCalendar key={room.type} roomType={room.type} />
      ))}
    </div>
  );
};

export default Rooms;

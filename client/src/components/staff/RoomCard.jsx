import React from "react";

const getColor = (status) => {
  switch (status) {
    case "available":
      return "bg-green-500";
    case "occupied":
      return "bg-red-500";
    case "booked":
      return "bg-yellow-400";
    case "maintenance":
      return "bg-gray-400";
    default:
      return "bg-gray-200";
  }
};

const RoomCard = ({ room }) => {
  return (
    <div
      className={`p-3 rounded text-white ${getColor(
        room.status
      )} shadow`}
    >
      <h3 className="font-bold">Room {room.roomNumber}</h3>
      <p className="text-sm">{room.roomType}</p>

      <p className="text-xs mt-1 capitalize">
        {room.status}
      </p>

      {/* 👤 Guest Name */}
      {room.status === "occupied" && room.currentGuest && (
        <p className="text-xs mt-1">
          👤 {room.currentGuest.name}
        </p>
      )}
    </div>
  );
};

export default RoomCard;
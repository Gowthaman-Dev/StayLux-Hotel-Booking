import React from "react";
import RoomCard from "./RoomCard";

const FloorSection = ({ floor, rooms }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">
        Floor {floor}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default FloorSection;
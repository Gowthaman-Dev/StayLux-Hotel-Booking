import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import { showError } from "../../utils/toast";
import { FaBed, FaUser, FaWifi, FaCoffee, FaTv, FaSnowflake } from "react-icons/fa";

const RoomStatus = () => {
  const [floors, setFloors] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/rooms/floor-status");
      setFloors(res.data.data || {});
    } catch (err) {
      showError("Failed to load room status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "border-green-500 bg-green-50";
      case "occupied":
        return "border-red-500 bg-red-50";
      case "booked":
        return "border-yellow-500 bg-yellow-50";
      case "maintenance":
        return "border-gray-500 bg-gray-100";
      default:
        return "border-gray-300 bg-white";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case "available":
        return "text-green-700";
      case "occupied":
        return "text-red-700";
      case "booked":
        return "text-yellow-700";
      case "maintenance":
        return "text-gray-700";
      default:
        return "text-gray-600";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "booked":
        return "bg-yellow-500";
      case "maintenance":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  const sortedFloors = Object.keys(floors).sort((a, b) => Number(a) - Number(b));

  if (loading) return <Spinner fullScreen text="Loading room status..." />;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Room Status</h1>
        <p className="text-gray-500 text-sm mt-1">Floor-wise view of all rooms and current occupancy</p>
      </div>

      {/* Floors */}
      {sortedFloors.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3 opacity-50">🏨</div>
          <p className="text-gray-500">No room data available</p>
        </div>
      ) : (
        sortedFloors.map((floor) => (
          <div key={floor} className="space-y-4">
            {/* Floor Header */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gray-700 rounded-full"></div>
              <h2 className="text-xl font-semibold text-gray-800">Floor {floor}</h2>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {floors[floor].map((room) => (
                <div
                  key={room._id}
                  className={`rounded-xl border-l-4 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${getStatusColor(room.status)}`}
                >
                  {/* Room Number & Type */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">Room {room.roomNumber}</h3>
                      <p className="text-xs text-gray-500 capitalize">{room.roomType}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${getStatusDot(room.status)}`}></span>
                      <span className={`text-xs font-medium ${getStatusTextColor(room.status)}`}>
                        {room.status}
                      </span>
                    </div>
                  </div>

                  {/* Status specific info */}
                  {room.status === "occupied" && room.currentGuest && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FaUser size={12} className="text-gray-500" />
                        <span className="font-medium">{room.currentGuest.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 pl-5">{room.currentGuest.phone}</p>
                    </div>
                  )}

                  {room.status === "booked" && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Reserved - Awaiting check-in</p>
                    </div>
                  )}

                  {room.status === "maintenance" && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Under maintenance</p>
                    </div>
                  )}

                  {room.status === "available" && (
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Ready for booking</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RoomStatus;
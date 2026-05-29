import React from "react";
import { FaBell, FaCreditCard, FaHotel } from "react-icons/fa";

const NotificationItem = ({ notification, onClick }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "booking":
        return <FaHotel />;
      case "payment":
        return <FaCreditCard />;
      default:
        return <FaBell />;
    }
  };

  return (
    <div
      onClick={() => onClick(notification)}
      className={`p-4 border rounded cursor-pointer flex gap-3 items-start 
      ${notification.isRead ? "bg-white" : "bg-blue-50"}`}
    >
      <div className="text-xl mt-1">{getIcon()}</div>

      <div className="flex-1">
        <h3 className="font-semibold">{notification.title}</h3>
        <p className="text-gray-600 text-sm">{notification.message}</p>

        <p className="text-xs text-gray-400 mt-1">
          {new Date(notification.createdAt).toLocaleString()}
        </p>
      </div>

      {!notification.isRead && (
        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
      )}
    </div>
  );
};

export default NotificationItem;
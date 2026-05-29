import React from "react";

const Badge = ({ type, status }) => {

  const getColor = () => {

    // 🔵 BOOKING STATUS
    if (type === "booking") {
      switch (status) {
        case "confirmed":
          return "bg-blue-100 text-blue-700";
        case "cancelled":
          return "bg-red-100 text-red-700";
        case "checkedIn":
          return "bg-green-100 text-green-700";
        case "checkedOut":
          return "bg-gray-100 text-gray-700";
        default:
          return "bg-gray-100 text-gray-600";
      }
    }

    // 💳 PAYMENT STATUS
    if (type === "payment") {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-700";
        case "paid":
          return "bg-green-100 text-green-700";
        case "failed":
          return "bg-red-100 text-red-700";
        case "refunded":
          return "bg-purple-100 text-purple-700";
        default:
          return "bg-gray-100 text-gray-600";
      }
    }

    // 🏨 ROOM STATUS
    if (type === "room") {
      switch (status) {
        case "available":
          return "bg-green-100 text-green-700";
        case "booked":
          return "bg-yellow-100 text-yellow-700";
        case "occupied":
          return "bg-red-100 text-red-700";
        case "maintenance":
          return "bg-gray-100 text-gray-700";
        default:
          return "bg-gray-100 text-gray-600";
      }
    }

    // 👤 USER STATUS
    if (type === "user") {
      return status
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded ${getColor()}`}
    >
      {typeof status === "boolean"
        ? status ? "Active" : "Inactive"
        : status}
    </span>
  );
};

export default Badge;
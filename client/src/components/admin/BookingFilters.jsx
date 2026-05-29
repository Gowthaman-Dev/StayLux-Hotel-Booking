import React from "react";

const STATUS_TABS = ["all", "confirmed", "checkedIn", "checkedOut", "cancelled"];

const BookingFilters = ({ status, setStatus }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setStatus(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            status === tab
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default BookingFilters;
// components/common/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, icon, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {value}
          </p>
        </div>
        {icon && (
          <div
            className={`p-3 rounded-full ${
              colors[color] || colors.blue
            }`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
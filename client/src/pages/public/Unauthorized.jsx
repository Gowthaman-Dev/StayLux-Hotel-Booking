import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-center px-4">
      
      {/* Icon */}
      <h1 className="text-5xl font-bold text-red-600 mb-2">🚫</h1>

      {/* Title */}
      <h2 className="text-2xl font-semibold mb-2">
        Access Denied
      </h2>

      {/* Message */}
      <p className="text-gray-600 mb-6">
        You don’t have permission to view this page.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Go Home
      </button>
    </div>
  );
};

export default Unauthorized;
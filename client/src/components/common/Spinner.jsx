import React from "react";

const Spinner = ({
  size = "medium",   // small | medium | large
  fullScreen = false,
  text = "Loading..."
}) => {

  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-4",
    large: "w-16 h-16 border-4",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-black bg-opacity-30 z-50" : ""
      }`}
    >
      <div
        className={`animate-spin rounded-full border-t-transparent border-blue-500 ${sizeClasses[size]}`}
      ></div>

      {text && (
        <p className="mt-3 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

export default Spinner;
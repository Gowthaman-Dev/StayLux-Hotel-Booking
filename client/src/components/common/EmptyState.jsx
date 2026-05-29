import React from "react";

const EmptyState = ({
  title = "No Data Found",
  message = "Nothing to display here.",
  buttonText,
  onClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      
      {/* ICON */}
      <div className="text-5xl mb-4">📭</div>

      {/* TITLE */}
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>

      {/* MESSAGE */}
      <p className="text-gray-500 mt-2">{message}</p>

      {/* OPTIONAL BUTTON */}
      {buttonText && (
        <button
          onClick={onClick}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
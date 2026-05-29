import React from "react";

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-100 text-red-600 p-3 rounded text-sm">
      {message}
    </div>
  );
};

export default ErrorMessage;
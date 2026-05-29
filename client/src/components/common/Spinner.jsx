// src/components/common/Spinner.jsx
import React from "react";

const Spinner = ({ size = "medium", fullScreen = false, text = "Loading..." }) => {
  const dimensions = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const textSizes = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  const strokeWidths = {
    small: "2",
    medium: "2.5",
    large: "3",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen
          ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50"
          : "relative"
      }`}
    >
      <div className={`relative ${dimensions[size]}`}>
        <svg
          className="w-full h-full animate-spin-material"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gray track */}
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#E5E7EB"
            strokeWidth={strokeWidths[size]}
            fill="none"
          />
          {/* Animated dark arc with round caps */}
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#1F2937"
            strokeWidth={strokeWidths[size]}
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
            strokeDashoffset="10"
            fill="none"
            className="animate-dash"
          />
        </svg>
      </div>

      {text && (
        <p
          className={`mt-3 text-gray-500 font-medium ${textSizes[size]} animate-pulse-premium`}
        >
          {text}
        </p>
      )}

      <style>{`
        @keyframes spin-material {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-material {
          animation: spin-material 1.2s linear infinite;
        }
        @keyframes dash {
          0% {
            stroke-dashoffset: 31.4;
          }
          50% {
            stroke-dashoffset: 15.7;
          }
          100% {
            stroke-dashoffset: 31.4;
          }
        }
        .animate-dash {
          animation: dash 1.2s ease-in-out infinite;
        }
        @keyframes pulse-premium {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse-premium {
          animation: pulse-premium 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Spinner;
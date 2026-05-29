import React from "react";

const ToggleButton = ({ options, selected, onChange }) => {
  return (
    <div className="flex gap-2 mb-4">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded border ${
            selected === opt.value ? "bg-blue-600 text-white" : ""
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
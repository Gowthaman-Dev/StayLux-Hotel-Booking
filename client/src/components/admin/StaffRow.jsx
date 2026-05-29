import React from "react";

const StaffRow = ({ staff, onDelete }) => {
  if (!staff) return null;
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="border p-3">{staff.name || "N/A"}</td>
      <td className="border p-3">{staff.email || "N/A"}</td>
      <td className="border p-3">{staff.phone || "N/A"}</td>
      <td className="border p-3">
        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
          {staff.role || "staff"}
        </span>
      </td>
      <td className="border p-3 text-center">
        <button
          onClick={() => onDelete(staff._id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default StaffRow;
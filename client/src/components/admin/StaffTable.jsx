import React from "react";
import { FaTrash, FaUserTie } from "react-icons/fa";

const StaffTable = ({ staffList, onDelete }) => {
  const staffArray = Array.isArray(staffList) ? staffList : [];

  if (staffArray.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No staff members available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {staffArray.map((staff) => (
            <tr key={staff._id} className="group hover:bg-gray-50 transition-all duration-200">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-medium group-hover:scale-105 transition-transform">
                    {staff.name ? staff.name.charAt(0).toUpperCase() : <FaUserTie />}
                  </div>
                  <span className="font-medium text-gray-800 group-hover:text-gray-900 transition">
                    {staff.name || "—"}
                  </span>
                </div>
              </td>
              <td className="px-5 py-3 text-gray-600 group-hover:text-gray-700 transition">
                {staff.email || "—"}
              </td>
              <td className="px-5 py-3 text-gray-600 group-hover:text-gray-700 transition">
                {staff.phone || "—"}
              </td>
              <td className="px-5 py-3">
                <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-gray-200 transition">
                  {staff.role || "staff"}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => onDelete(staff._id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                    title="Delete staff"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
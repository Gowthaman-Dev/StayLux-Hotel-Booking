import React from "react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";

const GuestTable = ({ guests }) => {
  if (!guests || guests.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-2 opacity-50">👥</div>
        <p>No guests currently checked in</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room Type</th>
            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Floor</th>
            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {guests.map((guest) => (
            <tr key={guest._id} className="group hover:bg-gray-50 transition">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-sm font-medium group-hover:scale-105 transition">
                    {guest.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="font-medium text-gray-800">{guest.user?.name || "—"}</span>
                </div>
              </td>
              <td className="px-5 py-3">
                <div>
                  <p className="text-gray-600">{guest.user?.email || "—"}</p>
                  <p className="text-sm text-gray-500">{guest.user?.phone || "—"}</p>
                </div>
              </td>
              <td className="px-5 py-3 font-medium text-gray-800">{guest.room?.roomNumber || "—"}</td>
              <td className="px-5 py-3 capitalize text-gray-600">{guest.room?.roomType || "—"}</td>
              <td className="px-5 py-3 text-gray-600">{guest.room?.floor || "—"}</td>
              <td className="px-5 py-3">
                <div className="flex justify-center gap-2">
                  <a
                    href={`tel:${guest.user?.phone}`}
                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition transform hover:scale-110"
                    title="Call guest"
                  >
                    <FaPhone size={16} />
                  </a>
                  <a
                    href={`https://wa.me/${guest.user?.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition transform hover:scale-110"
                    title="WhatsApp"
                  >
                    <FaWhatsapp size={16} />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestTable;
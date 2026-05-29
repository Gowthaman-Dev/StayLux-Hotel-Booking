import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import { showError } from "../../utils/toast";
import { FaPhone, FaWhatsapp, FaUserCircle } from "react-icons/fa";

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/guests/current");
        setGuests(res.data.data || []);
      } catch {
        showError("Failed to load guests");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Spinner fullScreen text="Loading current guests..." />;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Current Guests</h1>
        <p className="text-gray-500 text-sm mt-1">Guests currently checked into the hotel</p>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-md transition">
        <div className="p-3 rounded-full bg-gray-100 text-gray-600">
          <FaUserCircle className="text-2xl" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Active Guests</p>
          <p className="text-2xl font-bold text-gray-900">{guests.length}</p>
        </div>
      </div>

      {/* Guest Table */}
      {guests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3 opacity-50">👥</div>
          <p className="text-gray-500">No guests currently checked in</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
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
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Guests;
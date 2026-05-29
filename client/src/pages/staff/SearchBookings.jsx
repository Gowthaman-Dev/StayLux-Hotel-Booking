import React, { useState } from "react";
import api from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import Badge from "../../components/common/Badge";
import { showError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchBookings = () => {
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) {
      showError("Enter search term");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/bookings/search?query=${query}`);
      setBookings(res.data.bookings || []);
      setHasSearched(true);
    } catch (err) {
      console.error("Search error:", err);
      showError(err.response?.data?.message || "Search failed");
      setBookings([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearSearch = () => {
    setQuery("");
    setBookings([]);
    setHasSearched(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Search Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">Find bookings by Booking ID, guest name, phone, or room number</p>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative group">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 text-sm" />
              <input
                type="text"
                placeholder="Booking ID / Guest name / Phone / Room number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition group-hover:border-gray-300"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Spinner /> : <FaSearch />}
              {loading ? "Searching..." : "Search"}
            </button>
            {query && (
              <button
                onClick={clearSearch}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner text="Searching bookings..." />
        </div>
      ) : hasSearched && bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3 opacity-50">🔍</div>
          <p className="text-gray-500">No bookings found for "{query}"</p>
          <button
            onClick={clearSearch}
            className="mt-3 text-gray-600 hover:text-gray-900 text-sm underline"
          >
            Clear search
          </button>
        </div>
      ) : bookings.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Floor</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  onClick={() => navigate(`/bookings/${booking._id}`)}
                  className="cursor-pointer hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-sm font-mono text-gray-500">
                    {booking.bookingId || booking._id.slice(-8)}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{booking.user?.name || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{booking.user?.phone || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{booking.room?.roomNumber || "—"}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{booking.room?.roomType || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{booking.room?.floor || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(booking.checkIn)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(booking.checkOut)}</td>
                  <td className="px-4 py-3">
                    <Badge type="booking" status={booking.bookingStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <Badge type="payment" status={booking.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

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

export default SearchBookings;
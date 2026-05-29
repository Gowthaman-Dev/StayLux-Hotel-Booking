import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import Badge from "../../components/common/Badge";
import Pagination from "../../components/common/Pagination";
import { showError } from "../../utils/toast";
import { FaSearch, FaTimes, FaCalendarAlt, FaBed } from "react-icons/fa";

const StaffBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 10);
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (statusFilter) params.append("status", statusFilter);
      
      const res = await api.get(`/bookings/all?${params.toString()}`);
      setBookings(res.data.bookings || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      showError(err.response?.data?.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, debouncedSearch, statusFilter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const clearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "confirmed", label: "Confirmed" },
    { value: "checkedIn", label: "Checked In" },
    { value: "checkedOut", label: "Checked Out" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage all hotel reservations</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative group">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 text-sm" />
              <input
                type="text"
                placeholder="Booking ID, guest name, phone, room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition group-hover:border-gray-300"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none bg-white"
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Clear button */}
          {(search || statusFilter) && (
            <button
              onClick={() => {
                clearSearch();
                setStatusFilter("");
              }}
              className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <FaTimes /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner text="Loading bookings..." />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3 opacity-50">📋</div>
          <p className="text-gray-500">No bookings found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="group hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">
                      {booking.bookingId || booking._id.slice(-12)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{booking.user?.name || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{booking.room?.roomNumber || "—"}</td>
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

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination page={page} pages={pages} onPageChange={setPage} />
            </div>
          )}
        </>
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

export default StaffBookings;
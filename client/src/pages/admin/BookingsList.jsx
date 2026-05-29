import React, { useEffect, useState } from "react";
import BookingTable from "../../components/admin/BookingTable";
import BookingFilters from "../../components/admin/BookingFilters";
import Pagination from "../../components/common/Pagination";
import { getAllBookings } from "../../components/services/bookingService";
import { showError, showSuccess } from "../../utils/toast";
import api from "../../api/axios";
import {
  FaCalendarCheck,
  FaCalendarTimes,
  FaBed,
  FaHotel,
  FaDoorOpen,
  FaChartLine,
} from "react-icons/fa";

const BookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("all");
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    todayCheckIns: 0,
    todayCheckOuts: 0,
    activeBookings: 0,
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
  });

  // Fetch stats
  const fetchStats = async () => {
    try {
      const res = await api.get("/bookings/stats");
      const statsData = res.data.stats || res.data;
      setStats({
        todayCheckIns: statsData?.todayCheckIns || 0,
        todayCheckOuts: statsData?.todayCheckOuts || 0,
        activeBookings: statsData?.activeBookings || 0,
        totalRooms: statsData?.totalRooms || 0,
        availableRooms: statsData?.availableRooms || 0,
        occupiedRooms: statsData?.occupiedRooms || 0,
      });
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = { ...filters, status: status === "all" ? "" : status };
      const res = await getAllBookings(params);
      setBookings(res.data.bookings || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      showError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [status, filters.page]);

  const handleAction = async (type, booking) => {
    try {
      if (type === "view") {
        window.location.href = `/bookings/${booking._id}`;
        return;
      }

      let endpoint = "";
      let successMessage = "";

      if (type === "checkIn") {
        endpoint = `/bookings/${booking._id}/checkin`;
        successMessage = "Checked-in successfully";
      } else if (type === "checkOut") {
        endpoint = `/bookings/${booking._id}/checkout`;
        successMessage = "Checked-out successfully";
      } else if (type === "cancel") {
        endpoint = `/bookings/${booking._id}/cancel`;
        successMessage = "Booking cancelled successfully";
      }

      await api.put(endpoint);
      showSuccess(successMessage);
      fetchBookings();
      fetchStats(); // refresh stats after action
    } catch (err) {
      showError(err.response?.data?.message || "Action failed");
    }
  };

  // Stats cards data – all grayscale
  const statCards = [
    { title: "Today's Check-ins", value: stats.todayCheckIns, icon: <FaCalendarCheck /> },
    { title: "Today's Check-outs", value: stats.todayCheckOuts, icon: <FaCalendarTimes /> },
    { title: "Active Bookings", value: stats.activeBookings, icon: <FaBed /> },
    { title: "Total Rooms", value: stats.totalRooms, icon: <FaHotel /> },
    { title: "Available Rooms", value: stats.availableRooms, icon: <FaDoorOpen /> },
    { title: "Occupied Rooms", value: stats.occupiedRooms, icon: <FaBed /> },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">All Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all hotel reservations, check-ins, and check-outs</p>
      </div>

      {/* Stats Cards Grid – Black & White Premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <div className="p-3 rounded-full bg-gray-100 text-gray-700 group-hover:bg-gray-200 transition">
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <BookingFilters
        status={status}
        setStatus={(val) => {
          setStatus(val);
          setFilters((prev) => ({ ...prev, page: 1 }));
        }}
      />

      {/* Bookings Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3 opacity-50">📋</div>
          <p className="text-gray-500">No bookings found for the selected status.</p>
        </div>
      ) : (
        <>
          <BookingTable bookings={bookings} onAction={handleAction} />
          {pages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                page={filters.page}
                pages={pages}
                onPageChange={(newPage) =>
                  setFilters((prev) => ({ ...prev, page: newPage }))
                }
              />
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

export default BookingsList;
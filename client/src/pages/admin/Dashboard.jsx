import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import { showError } from "../../utils/toast";
import {
  FaRupeeSign,
  FaCalendarCheck,
  FaUsers,
  FaBed,
  FaEye,
  FaArrowRight,
  FaChartPie,
  FaBell,
  FaSignInAlt,
  FaSignOutAlt,
  FaPlus,
  FaCalendarAlt,
  FaChartLine,
  FaMoneyBillWave,
  FaStar,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashboardRes, roomsRes, revenueRes, bookingsRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/rooms?limit=6"),
        api.get("/admin/reports/revenue?type=daily").catch(() => ({ data: { report: [] } })),
        api.get("/bookings/all?limit=5&page=1").catch(() => ({ data: { bookings: [] } })),
      ]);
      setData(dashboardRes.data.data);
      setRooms(roomsRes.data.rooms || []);
      setRevenueData(revenueRes.data.report || []);
      
      // Upcoming check-ins (today & tomorrow)
      const allBookings = bookingsRes.data.bookings || [];
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      const upcoming = allBookings.filter(b => 
        b.bookingStatus === "confirmed" && 
        (b.checkIn?.split('T')[0] === today || b.checkIn?.split('T')[0] === tomorrow)
      ).slice(0, 5);
      setUpcomingBookings(upcoming);
      
      // Recent bookings (last 5)
      setRecentBookings(allBookings.slice(0, 5));
    } catch (err) {
      console.error("Dashboard error:", err);
      showError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <Spinner fullScreen text="Loading dashboard..." />;
  if (!data) return <p className="text-center p-6">No data available</p>;

  const chartData = (data.bookingBreakdown || []).map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const COLORS = ["#1f2937", "#4b5563", "#9ca3af", "#d1d5db"];

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${baseUrl}/uploads/rooms/${imagePath}`;
  };

  const stats = [
    { title: "Total Revenue", value: `₹${data.totalRevenue || 0}`, icon: <FaRupeeSign /> },
    { title: "Bookings Today", value: data.bookingsToday || 0, icon: <FaCalendarCheck /> },
    { title: "Total Users", value: data.totalUsers || 0, icon: <FaUsers /> },
    { title: "Total Rooms", value: data.totalRooms || 0, icon: <FaBed /> },
  ];

  const quickActions = [
    { label: "New Room", icon: <FaPlus />, path: "/admin/rooms/create", color: "gray" },
    { label: "All Bookings", icon: <FaCalendarAlt />, path: "/admin/bookings", color: "gray" },
    { label: "Add Staff", icon: <FaUsers />, path: "/admin/staff", color: "gray" },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's your hotel at a glance.</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:shadow transition">
          <FaBell className="text-gray-400" />
          <span className="text-gray-600">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-5 cursor-default"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className="text-gray-400 text-xl group-hover:scale-110 transition">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Row */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => navigate(action.path)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
          >
            {action.icon} {action.label}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Rooms Gallery - Enhanced Cards */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="border-b border-gray-100 px-5 py-3 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  🏨 Hotel Rooms
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Latest rooms added</p>
              </div>
              <Link to="/admin/rooms" className="text-sm text-gray-500 hover:text-gray-900 transition flex items-center gap-1">
                View all <FaArrowRight size={12} />
              </Link>
            </div>
            <div className="p-5">
              {rooms.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">🏨</div>
                  <p className="text-gray-500">No rooms available.</p>
                  <Link
                    to="/admin/rooms/create"
                    className="inline-block mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    Add First Room →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div
                      key={room._id}
                      className="group flex flex-col sm:flex-row gap-4 border border-gray-100 rounded-xl p-4 hover:shadow-md hover:border-gray-200 transition-all duration-200"
                    >
                      <div className="w-full sm:w-28 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={getImageUrl(room.images?.[0])}
                          alt={room.roomNumber}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => (e.target.src = "https://via.placeholder.com/112?text=No+Img")}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">Room {room.roomNumber}</h3>
                            <p className="text-gray-500 text-sm capitalize">
                              {room.roomType} • Floor {room.floor}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              room.status === "available"
                                ? "bg-green-100 text-green-700"
                                : room.status === "booked"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {room.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-3">
                          <p className="text-gray-900 font-bold">
                            ₹{room.pricePerNight} <span className="text-sm font-normal text-gray-500">/night</span>
                          </p>
                          <Link
                            to={`/admin/rooms/edit/${room._id}`}
                            className="text-gray-400 hover:text-gray-900 transition p-1"
                          >
                            <FaEye />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Check-ins Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaSignInAlt className="text-gray-600" /> Upcoming Check-ins
              </h2>
              <p className="text-xs text-gray-500">Today & Tomorrow</p>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">No upcoming check-ins</p>
              ) : (
                upcomingBookings.map((booking) => (
                  <div key={booking._id} className="px-5 py-3 hover:bg-gray-50 transition flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{booking.user?.name}</p>
                      <p className="text-xs text-gray-500">Room {booking.room?.roomNumber} • {new Date(booking.checkIn).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/bookings`)}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition"
                    >
                      Check-in
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaChartLine className="text-gray-600" /> Revenue Trend (Last 7 days)
              </h2>
            </div>
            <div className="p-4">
              {revenueData.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No revenue data</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueData.slice(-7)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="_id" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                    <Line type="monotone" dataKey="totalRevenue" stroke="#1f2937" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Booking Breakdown Pie Chart */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaChartPie className="text-gray-600" /> Booking Status
              </h2>
            </div>
            <div className="p-4 flex justify-center">
              {chartData.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bookings data</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaCalendarAlt className="text-gray-600" /> Recent Bookings
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {recentBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent bookings</p>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking._id} className="px-5 py-3 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{booking.user?.name}</p>
                        <p className="text-xs text-gray-500">Room {booking.room?.roomNumber} • {new Date(booking.checkIn).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        booking.bookingStatus === "confirmed" ? "bg-gray-100 text-gray-700" :
                        booking.bookingStatus === "checkedIn" ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-500"
                      }`}>
                        {booking.bookingStatus}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">₹{booking.priceBreakdown?.totalAmount || 0}</p>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-gray-100 px-5 py-2 text-center">
              <Link to="/admin/bookings" className="text-xs text-gray-500 hover:text-gray-900 transition">
                View all bookings →
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaBell className="text-gray-600" /> Activity Feed
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {data.recentActivities?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              ) : (
                data.recentActivities.slice(0, 4).map((activity) => (
                  <div key={activity._id} className="px-5 py-3 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        {activity.type === "booking" ? <FaCalendarCheck /> : <FaBell />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{activity.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
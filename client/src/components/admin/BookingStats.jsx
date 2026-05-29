import React, { useEffect, useState } from "react";
import { getBookingStats } from "../../components/services/bookingService";
import { showError } from "../../utils/toast";
import Spinner from "../common/Spinner";

const BookingStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getBookingStats();
      
      // Handle different response structures
      const statsData = res.data?.stats || res.data;
      
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
      showError(err.response?.data?.message || "Failed to load stats");
      // Set default values to prevent UI crash
      setStats({
        todayCheckIns: 0,
        todayCheckOuts: 0,
        activeBookings: 0,
        totalRooms: 0,
        availableRooms: 0,
        occupiedRooms: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Spinner text="Loading stats..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>No stats available</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "15px",
        marginBottom: "20px",
      }}
    >
      <Card title="Today Check-ins" value={stats.todayCheckIns} color="#3b82f6" />
      <Card title="Today Check-outs" value={stats.todayCheckOuts} color="#ef4444" />
      <Card title="Active Bookings" value={stats.activeBookings} color="#10b981" />
      <Card title="Total Rooms" value={stats.totalRooms} color="#6b7280" />
      <Card title="Available Rooms" value={stats.availableRooms} color="#22c55e" />
      <Card title="Occupied Rooms" value={stats.occupiedRooms} color="#f59e0b" />
    </div>
  );
};

const Card = ({ title, value, color = "#3b82f6" }) => (
  <div
    style={{
      border: `1px solid ${color}`,
      padding: "15px",
      borderRadius: "10px",
      textAlign: "center",
      background: "#ffffff",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    }}
  >
    <h4 style={{ margin: "0 0 10px 0", color: "#666", fontSize: "14px" }}>{title}</h4>
    <h2 style={{ margin: 0, color: color, fontSize: "28px", fontWeight: "bold" }}>
      {value || 0}
    </h2>
  </div>
);

export default BookingStats;
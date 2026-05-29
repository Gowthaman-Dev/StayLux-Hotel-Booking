import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import StatCard from "../../components/common/StatCard";
import { showError } from "../../utils/toast";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings/stats");
      
      console.log("Stats response:", res.data);
      
      // Handle different response structures
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
      showError(err.response?.data?.message || "Failed to load dashboard stats");
      // Set default values
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
    return <Spinner fullScreen text="Loading dashboard..." />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Today's Check-ins" value={stats?.todayCheckIns || 0} color="blue" />
        <StatCard title="Today's Check-outs" value={stats?.todayCheckOuts || 0} color="orange" />
        <StatCard title="Active Bookings" value={stats?.activeBookings || 0} color="green" />
        <StatCard title="Total Rooms" value={stats?.totalRooms || 0} color="purple" />
        <StatCard title="Available Rooms" value={stats?.availableRooms || 0} color="green" />
        <StatCard title="Occupied Rooms" value={stats?.occupiedRooms || 0} color="red" />
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from "react";
import { getOccupancyReport } from "../../../components/services/reportService";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Spinner from "../../../components/common/Spinner";
import { showError } from "../../../utils/toast";
import { FaHotel } from "react-icons/fa";

const COLORS = ["#1f2937", "#9ca3af"];

const OccupancyReport = ({ dateRange }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getOccupancyReport();
        setData(res.data);
      } catch (err) {
        showError("Failed to load occupancy report");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  if (loading) return <div className="flex justify-center py-12"><Spinner text="Loading occupancy data..." /></div>;
  if (!data) return <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">No occupancy data available</div>;

  const totalRooms = data.totalRooms || 0;
  const occupiedRooms = data.occupiedRooms || 0;
  const availableRooms = data.availableRooms || 0;
  const occupancyRate = totalRooms ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0;

  const chartData = [
    { name: "Occupied", value: occupiedRooms },
    { name: "Available", value: availableRooms },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100 hover:shadow-md transition">
          <div className="p-2 rounded-full bg-white shadow-sm">
            <FaHotel className="text-gray-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Rooms</p>
            <p className="text-2xl font-bold text-gray-900">{totalRooms}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100 hover:shadow-md transition">
          <div className="p-2 rounded-full bg-white shadow-sm">
            <FaHotel className="text-gray-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Occupied Rooms</p>
            <p className="text-2xl font-bold text-gray-900">{occupiedRooms}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100 hover:shadow-md transition">
          <div className="p-2 rounded-full bg-white shadow-sm">
            <FaHotel className="text-gray-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Occupancy Rate</p>
            <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              <Cell fill={COLORS[0]} />
              <Cell fill={COLORS[1]} />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Progress bar */}
      <div className="pt-2">
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div className="bg-gray-700 h-2 rounded-full" style={{ width: `${occupancyRate}%` }} />
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">{occupancyRate}% occupancy rate</p>
      </div>
    </div>
  );
};

export default OccupancyReport;
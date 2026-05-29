import React, { useEffect, useState } from "react";
import { getOccupancyReport } from "../../services/reportService";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import ProgressBar from "../../components/common/ProgressBar";
import { showError } from "../../utils/toast";

const COLORS = ["#1D4ED8", "#D1D5DB"]; // occupied: blue, available: gray

const OccupancyReport = () => {
  const [data, setData] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchOccupancy = async () => {
    try {
      setLoading(true);
      const res = await getOccupancyReport();
      setData(res.data);
    } catch (err) {
      showError("Failed to fetch occupancy report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccupancy();
  }, []);

  const chartData = [
    { name: "Occupied", value: data.occupiedRooms },
    { name: "Available", value: data.availableRooms },
  ];

  const occupancyRate = data.totalRooms
    ? ((data.occupiedRooms / data.totalRooms) * 100).toFixed(1)
    : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Occupancy Report</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* 🔹 Cards */}
          <div className="flex gap-4 mb-6">
            <div className="p-4 bg-white rounded shadow w-1/3 text-center">
              <h3 className="font-semibold">Total Rooms</h3>
              <p className="text-xl">{data.totalRooms}</p>
            </div>
            <div className="p-4 bg-white rounded shadow w-1/3 text-center">
              <h3 className="font-semibold">Occupied Rooms</h3>
              <p className="text-xl">{data.occupiedRooms}</p>
            </div>
            <div className="p-4 bg-white rounded shadow w-1/3 text-center">
              <h3 className="font-semibold">Available Rooms</h3>
              <p className="text-xl">{data.availableRooms}</p>
            </div>
          </div>

          {/* 🔹 Pie Chart */}
          <div style={{ width: "100%", height: 300 }} className="mb-6">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 🔹 Occupancy Rate */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Occupancy Rate: {occupancyRate}%</h3>
            <ProgressBar percentage={occupancyRate} />
          </div>
        </>
      )}
    </div>
  );
};

export default OccupancyReport;
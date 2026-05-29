import React, { useEffect, useState } from "react";
import { getBookingReport } from "../../services/reportService";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { showError } from "../../utils/toast";

const COLORS = ["#1D4ED8", "#EF4444", "#F59E0B", "#10B981"]; // confirmed, cancelled, checkedIn, checkedOut

const BookingReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookingReport = async () => {
    try {
      setLoading(true);
      const res = await getBookingReport();
      // Expected response: [{ status: "confirmed", count: 20 }, ...]
      setData(res.data);
    } catch (err) {
      showError("Failed to fetch booking report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingReport();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Booking Report</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* 🔹 Pie Chart */}
          <div style={{ width: "100%", height: 300 }} className="mb-6">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 🔹 Bar Chart */}
          <div style={{ width: "100%", height: 300 }} className="mb-6">
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1D4ED8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🔹 Table */}
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.status}>
                  <td className="border px-4 py-2">{item.status}</td>
                  <td className="border px-4 py-2">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default BookingReport;
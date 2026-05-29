import React, { useEffect, useState } from "react";
import { getBookingReport } from "../../../components/services/reportService";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Spinner from "../../../components/common/Spinner";
import { showError } from "../../../utils/toast";
import { FaCalendarCheck } from "react-icons/fa";

// Monochrome grayscale colors
const COLORS = ["#1f2937", "#4b5563", "#9ca3af", "#d1d5db", "#e5e7eb"];

const BookingReport = ({ dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getBookingReport();
        
        // Handle response structure
        let reportData = res.data?.report || res.data || [];
        
        const formattedData = reportData.map(item => ({
          name: item._id,
          value: item.total || item.count || 0,
        }));
        
        setData(formattedData);
      } catch (err) {
        console.error(err);
        showError("Failed to load booking data");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const totalBookings = data.reduce((sum, item) => sum + (item.value || 0), 0);

  if (loading) return (
    <div className="flex justify-center py-12">
      <Spinner text="Loading Booking Data..." />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100 hover:shadow-md transition">
        <div className="p-2 rounded-full bg-white shadow-sm">
          <FaCalendarCheck className="text-gray-700" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
        </div>
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-4xl mb-2 opacity-50">📊</div>
          <p>No booking data available</p>
        </div>
      ) : (
        <>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
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
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 font-medium text-gray-800 capitalize">{d.name}</td>
                    <td className="px-4 py-2 text-gray-900">{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingReport;
import React, { useEffect, useState } from "react";
import { getRevenueReport } from "../../../components/services/reportService";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Spinner from "../../../components/common/Spinner";
import { showError } from "../../../utils/toast";
import { FaRupeeSign, FaMoneyBillWave } from "react-icons/fa";

const RevenueReport = ({ dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getRevenueReport();
        
        let reportData = res.data?.report || res.data || [];
        
        if (dateRange?.startDate && dateRange?.endDate && Array.isArray(reportData)) {
          reportData = reportData.filter((d) => {
            const date = new Date(d._id);
            return (
              date >= new Date(dateRange.startDate) &&
              date <= new Date(dateRange.endDate)
            );
          });
        }

        const formattedData = reportData.map(item => ({
          date: item._id,
          totalRevenue: item.totalRevenue || 0,
          totalPayments: item.totalPayments || 0,
        }));

        setData(formattedData);
      } catch (err) {
        console.error(err);
        showError("Failed to load revenue data");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const totalRevenue = data.reduce((sum, d) => sum + d.totalRevenue, 0);
  const totalPayments = data.reduce((sum, d) => sum + d.totalPayments, 0);

  if (loading) return (
    <div className="flex justify-center py-12">
      <Spinner text="Loading Revenue Data..." />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100 hover:shadow-md transition">
          <div className="p-2 rounded-full bg-white shadow-sm">
            <FaRupeeSign className="text-gray-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalRevenue}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100 hover:shadow-md transition">
          <div className="p-2 rounded-full bg-white shadow-sm">
            <FaMoneyBillWave className="text-gray-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Payments</p>
            <p className="text-2xl font-bold text-gray-900">{totalPayments}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-4xl mb-2 opacity-50">📊</div>
          <p>No revenue data available for selected date range</p>
        </div>
      ) : (
        <>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Line 
                  type="monotone" 
                  dataKey="totalRevenue" 
                  stroke="#1f2937"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#1f2937" }}
                  name="Revenue (₹)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Revenue (₹)</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((d, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 font-medium text-gray-800">{d.date}</td>
                    <td className="px-4 py-2 text-gray-900 font-semibold">₹{d.totalRevenue}</td>
                    <td className="px-4 py-2 text-gray-600">{d.totalPayments}</td>
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

export default RevenueReport;
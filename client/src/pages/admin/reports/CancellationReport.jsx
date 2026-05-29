import React, { useEffect, useState } from "react";
import { getCancellationReport } from "../../../components/services/reportService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import Spinner from "../../../components/common/Spinner";
import { showError } from "../../../utils/toast";
import { FaTimesCircle } from "react-icons/fa";

const CancellationReport = ({ dateRange }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getCancellationReport();
        let reportData = res.data?.report || res.data || [];
        // Apply frontend date filter if dates provided
        if (dateRange?.startDate && dateRange?.endDate && Array.isArray(reportData)) {
          reportData = reportData.filter(item => {
            const itemDate = new Date(item._id);
            return itemDate >= new Date(dateRange.startDate) && itemDate <= new Date(dateRange.endDate);
          });
        }
        setData(reportData);
      } catch (err) {
        showError("Failed to load cancellation report");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dateRange]);

  const totalCancellations = data.reduce((sum, item) => sum + (item.totalCancelled || 0), 0);

  if (loading) return <div className="flex justify-center py-12"><Spinner text="Loading cancellation data..." /></div>;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 border border-gray-100 hover:shadow-md transition">
        <div className="p-2 rounded-full bg-white shadow-sm">
          <FaTimesCircle className="text-gray-700" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Total Cancellations (selected period)</p>
          <p className="text-2xl font-bold text-gray-900">{totalCancellations}</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
          <div className="text-4xl mb-2 opacity-50">❌</div>
          <p>No cancellation data available for selected date range</p>
        </div>
      ) : (
        <>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="_id" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="totalCancelled" fill="#1f2937" name="Cancellations" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cancellations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 font-medium text-gray-800">{item._id}</td>
                    <td className="px-4 py-2 text-gray-900">{item.totalCancelled}</td>
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

export default CancellationReport;
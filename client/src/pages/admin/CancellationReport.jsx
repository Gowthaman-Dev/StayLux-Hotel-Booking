import React, { useEffect, useState } from "react";
import { getCancellationReport } from "../../services/reportService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { showError } from "../../utils/toast";

const CancellationReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCancellationReport = async () => {
    try {
      setLoading(true);
      const res = await getCancellationReport();
      // Expected response: [{ month: "Jan", totalCancelled: 5 }, ...]
      setData(res.data);
    } catch (err) {
      showError("Failed to fetch cancellation report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancellationReport();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Cancellation Report</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* 🔹 Bar Chart */}
          <div style={{ width: "100%", height: 300 }} className="mb-6">
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalCancelled" fill="#EF4444" name="Cancellations" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 🔹 Table */}
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Month</th>
                <th className="border px-4 py-2">Total Cancelled</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.month}>
                  <td className="border px-4 py-2">{item.month}</td>
                  <td className="border px-4 py-2">{item.totalCancelled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default CancellationReport;
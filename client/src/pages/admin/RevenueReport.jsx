import React, { useEffect, useState } from "react";
import { getRevenueReport } from "../../services/reportService";
import ToggleButton from "../../components/common/ToggleButton";
import { showError } from "../../utils/toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const RevenueReport = () => {
  const [type, setType] = useState("daily"); // daily or monthly
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await getRevenueReport(type);
      setData(res.data); // expected: [{ date/month, totalRevenue, totalPayments }]
    } catch (err) {
      showError("Failed to load report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [type]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Revenue Report</h2>

      {/* 🔥 Toggle Daily / Monthly */}
      <ToggleButton
        options={[
          { label: "Daily", value: "daily" },
          { label: "Monthly", value: "monthly" },
        ]}
        selected={type}
        onChange={setType}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* 🔥 Chart */}
          <div style={{ width: "100%", height: 300 }} className="mb-6">
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey={type === "daily" ? "date" : "month"} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="totalRevenue"
                  stroke="#1D4ED8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 🔥 Table */}
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-1">
                  {type === "daily" ? "Date" : "Month"}
                </th>
                <th className="border px-3 py-1">Total Revenue</th>
                <th className="border px-3 py-1">Total Payments</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td className="border px-3 py-1">
                    {type === "daily" ? item.date : item.month}
                  </td>
                  <td className="border px-3 py-1">{item.totalRevenue}</td>
                  <td className="border px-3 py-1">{item.totalPayments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default RevenueReport;
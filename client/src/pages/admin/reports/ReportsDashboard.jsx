import React, { useState, Suspense, lazy } from "react";
import { FaChartLine, FaHotel, FaCalendarCheck, FaTimesCircle, FaTimes } from "react-icons/fa";

// Lazy load report components
const RevenueReport = lazy(() => import("./RevenueReport"));
const OccupancyReport = lazy(() => import("./OccupancyReport"));
const BookingReport = lazy(() => import("./BookingReport"));
const CancellationReport = lazy(() => import("./CancellationReport"));

const ReportsDashboard = () => {
  const [activeTab, setActiveTab] = useState("revenue");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const clearDateFilters = () => {
    setDateRange({ startDate: "", endDate: "" });
  };

  const tabs = [
    { key: "revenue", label: "Revenue Report", icon: <FaChartLine /> },
    { key: "occupancy", label: "Occupancy Report", icon: <FaHotel /> },
    { key: "bookings", label: "Booking Report", icon: <FaCalendarCheck /> },
    { key: "cancellations", label: "Cancellation Report", icon: <FaTimesCircle /> },
  ];

  const hasActiveDateFilter = dateRange.startDate || dateRange.endDate;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Analytics & insights for your hotel</p>
      </div>

      {/* Date Range Filter Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
            />
          </div>
          {hasActiveDateFilter && (
            <button
              onClick={clearDateFilters}
              className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <FaTimes /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Tabs - Modern pill design */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-gray-900 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5">
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-500">Loading report...</span>
              </div>
            }
          >
            {activeTab === "revenue" && <RevenueReport dateRange={dateRange} />}
            {activeTab === "occupancy" && <OccupancyReport dateRange={dateRange} />}
            {activeTab === "bookings" && <BookingReport dateRange={dateRange} />}
            {activeTab === "cancellations" && <CancellationReport dateRange={dateRange} />}
          </Suspense>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ReportsDashboard;
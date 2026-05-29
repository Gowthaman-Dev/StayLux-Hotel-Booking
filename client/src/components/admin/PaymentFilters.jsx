import React from "react";
import { FaTimes } from "react-icons/fa";

const PaymentFilters = ({ filters, setFilters }) => {
  const handleStatusChange = (e) => {
    setFilters({ ...filters, status: e.target.value, page: 1 });
  };

  const handleStartDateChange = (e) => {
    setFilters({ ...filters, startDate: e.target.value, page: 1 });
  };

  const handleEndDateChange = (e) => {
    setFilters({ ...filters, endDate: e.target.value, page: 1 });
  };

  const clearFilters = () => {
    setFilters({ status: "", startDate: "", endDate: "", page: filters.page, limit: filters.limit });
  };

  const hasActiveFilters = filters.status || filters.startDate || filters.endDate;

  return (
    <div className="flex flex-wrap gap-3 items-end">
      {/* Status */}
      <div className="w-36">
        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
        <select
          value={filters.status}
          onChange={handleStatusChange}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none bg-white"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Start Date */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={handleStartDateChange}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={handleEndDateChange}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
        />
      </div>

      {/* Clear button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
        >
          <FaTimes /> Clear
        </button>
      )}
    </div>
  );
};

export default PaymentFilters;
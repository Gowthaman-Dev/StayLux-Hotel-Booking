import React, { useEffect, useState } from "react";
import StaffTable from "../../components/admin/StaffTable";
import ConfirmModal from "../../components/common/ConfirmModal";
import { deleteStaff } from "../../components/services/adminService";
import api from "../../api/axios";
import { showSuccess, showError } from "../../utils/toast";
import Spinner from "../../components/common/Spinner";

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  
  // Search and filter states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 10);
      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }
      
      const res = await api.get(`/admin/staff?${params.toString()}`);
      
      console.log("Staff response:", res.data);
      
      const staffData = res.data.staff || res.data || [];
      setStaffList(Array.isArray(staffData) ? staffData : []);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
      
    } catch (err) {
      console.error("Fetch staff error:", err);
      showError(err.response?.data?.message || "Failed to load staff");
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [page, debouncedSearch]);

  const handleDeleteClick = (id) => {
    setSelectedId(id);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteStaff(selectedId);
      showSuccess("Staff deleted successfully");
      setSelectedId(null);
      fetchStaff();
    } catch (err) {
      showError(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading && staffList.length === 0) {
    return <Spinner fullScreen text="Loading staff list..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage hotel staff – view and remove team members</p>
        </div>
        <div className="text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
          Total Staff: <span className="font-semibold text-gray-900">{total}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search Staff</label>
            <div className="relative group">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all group-hover:border-gray-300"
              />
            </div>
          </div>
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
              }}
              className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Staff Table */}
      {staffList.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-gray-500">No staff members found</p>
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
              }}
              className="mt-3 text-gray-600 hover:text-gray-900 text-sm underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <StaffTable staffList={staffList} onDelete={handleDeleteClick} />
          
          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-3 py-1 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={!!selectedId}
        onClose={() => setSelectedId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
        danger={true}
      />
    </div>
  );
};

export default StaffList;
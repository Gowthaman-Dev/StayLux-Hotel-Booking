import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import ConfirmModal from "../../components/common/ConfirmModal";
import Pagination from "../../components/common/Pagination";
import { showError, showSuccess } from "../../utils/toast";
import {
  FaSearch,
  FaUserCheck,
  FaUserSlash,
  FaTrash,
  FaTimes,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 10);
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (statusFilter === "active") params.append("isActive", "true");
      if (statusFilter === "blocked") params.append("isActive", "false");
      if (roleFilter) params.append("role", roleFilter);

      const res = await axios.get(`/admin/users?${params.toString()}`);
      setUsers(res.data.users || []);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, debouncedSearch, statusFilter, roleFilter]);

  const handleStatusToggle = async (user) => {
    try {
      await axios.put(`/admin/users/${user._id}/toggle`);
      showSuccess(`User ${user.isActive ? "blocked" : "unblocked"} successfully`);
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || "Action failed");
    } finally {
      setConfirmOpen(false);
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await axios.delete(`/admin/users/${selectedUser._id}`);
      showSuccess("User deleted successfully");
      fetchUsers();
    } catch (err) {
      showError(err.response?.data?.message || "Delete failed");
    } finally {
      setConfirmOpen(false);
      setSelectedUser(null);
      setActionType(null);
    }
  };

  const openConfirmModal = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
    setConfirmOpen(true);
  };

  const getConfirmMessage = () => {
    if (actionType === "block") return `Are you sure you want to block ${selectedUser?.name || selectedUser?.email}?`;
    if (actionType === "unblock") return `Are you sure you want to unblock ${selectedUser?.name || selectedUser?.email}?`;
    if (actionType === "delete") return `Are you sure you want to delete ${selectedUser?.name || selectedUser?.email}? This action cannot be undone.`;
    return "";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setRoleFilter("");
    setPage(1);
  };

  if (loading && users.length === 0) {
    return <Spinner fullScreen text="Loading users..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all registered users, block/unblock, or delete accounts</p>
        </div>
        <div className="text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
          Total Users: <span className="font-semibold text-gray-900">{total}</span>
        </div>
      </div>

      {/* Filters Bar - Enhanced */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative group">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors text-sm" />
              <input
                type="text"
                placeholder="Name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-all duration-200 group-hover:border-gray-300"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div className="w-36">
            <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none appearance-none bg-white hover:border-gray-300 transition-colors cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
            </div>
          </div>

          {/* Status Filter */}
          <div className="w-36">
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none appearance-none bg-white hover:border-gray-300 transition-colors cursor-pointer"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
            </div>
          </div>

          {/* Clear Filters Button */}
          {(search || statusFilter || roleFilter) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm"
            >
              <FaTimes /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table - Enhanced Hover */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="group hover:bg-gray-50 transition-all duration-200 hover:shadow-inner"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium group-hover:scale-105 transition-transform duration-200">
                          {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                        </div>
                        <span className="font-medium text-gray-800 group-hover:text-gray-900 transition">
                          {user.name || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 group-hover:text-gray-700 transition">
                      {user.email || "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-600 group-hover:text-gray-700 transition">
                      {user.phone || "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          user.role === "admin"
                            ? "bg-gray-800 text-white"
                            : user.role === "staff"
                            ? "bg-gray-600 text-white"
                            : "bg-gray-100 text-gray-700 group-hover:bg-gray-200"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          user.isActive
                            ? "bg-green-100 text-green-700 group-hover:bg-green-200"
                            : "bg-red-100 text-red-700 group-hover:bg-red-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-green-500" : "bg-red-500"}`}></span>
                        {user.isActive ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-sm">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openConfirmModal(user, user.isActive ? "block" : "unblock")}
                          className={`p-1.5 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                            user.isActive
                              ? "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
                              : "text-green-600 hover:bg-green-50 hover:text-green-700"
                          }`}
                          title={user.isActive ? "Block user" : "Unblock user"}
                        >
                          {user.isActive ? <FaUserSlash size={16} /> : <FaUserCheck size={16} />}
                        </button>
                        <button
                          onClick={() => openConfirmModal(user, "delete")}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 transform hover:scale-110"
                          title="Delete user permanently"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View - Enhanced Hover */}
      <div className="md:hidden space-y-3">
        {users.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            No users found
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium hover:scale-105 transition-transform duration-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{user.name || "—"}</p>
                    <p className="text-xs text-gray-500">{user.email || "—"}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Blocked"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-gray-700">{user.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Role</p>
                  <p className="capitalize text-gray-700">{user.role || "user"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400">Joined</p>
                  <p className="text-gray-700">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => openConfirmModal(user, user.isActive ? "block" : "unblock")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 transform active:scale-95 ${
                    user.isActive
                      ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100 hover:scale-105"
                      : "text-green-600 bg-green-50 hover:bg-green-100 hover:scale-105"
                  }`}
                >
                  {user.isActive ? <FaUserSlash /> : <FaUserCheck />}
                  {user.isActive ? "Block" : "Unblock"}
                </button>
                <button
                  onClick={() => openConfirmModal(user, "delete")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination page={page} pages={pages} onPageChange={setPage} />
        </div>
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setSelectedUser(null);
          setActionType(null);
        }}
        onConfirm={actionType === "delete" ? handleDelete : () => handleStatusToggle(selectedUser)}
        title={actionType === "delete" ? "Delete User" : actionType === "block" ? "Block User" : "Unblock User"}
        message={getConfirmMessage()}
        confirmText={actionType === "delete" ? "Delete" : actionType === "block" ? "Block" : "Unblock"}
        danger={actionType === "delete" || actionType === "block"}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Users;
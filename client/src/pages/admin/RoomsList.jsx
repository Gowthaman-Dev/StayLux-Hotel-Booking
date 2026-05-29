import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaTimes, FaHotel, FaBed, FaDoorOpen, FaChartLine } from "react-icons/fa";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import Spinner from "../../components/common/Spinner";
import { getRooms, deleteRoom } from "../../components/services/roomService";
import { showError, showSuccess } from "../../utils/toast";

const RoomsList = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    roomType: "",
    status: "",
    search: "",
    page: 1,
    limit: 10,
  });
  const [pages, setPages] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0,
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getRooms(filters);
      const roomData = res.data.rooms || [];
      setRooms(roomData);
      setPages(res.data.pages || 1);
      setTotalRooms(res.data.total || roomData.length);
      const available = roomData.filter((r) => r.status === "available").length;
      const occupied = roomData.filter((r) => r.status === "occupied").length;
      const maintenance = roomData.filter((r) => r.status === "maintenance").length;
      setStats({ total: roomData.length, available, occupied, maintenance });
    } catch (err) {
      showError("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [filters]);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRoom(deleteId);
      showSuccess("Room deleted successfully");
      setDeleteId(null);
      fetchRooms();
    } catch (err) {
      showError(err.response?.data?.message || "Delete failed");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({ roomType: "", status: "", search: "", page: 1, limit: 10 });
  };

  const occupancyRate = stats.total ? Math.round((stats.occupied / stats.total) * 100) : 0;

  if (loading && rooms.length === 0) {
    return <Spinner fullScreen text="Loading rooms..." />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all hotel rooms, availability, and details</p>
        </div>
        <button
          onClick={() => navigate("/admin/rooms/create")}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <FaPlus size={14} /> Add New Room
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3 hover:shadow-md transition-all duration-200">
          <div className="p-3 bg-gray-100 rounded-full">
            <FaHotel className="text-gray-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Rooms</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3 hover:shadow-md transition-all duration-200">
          <div className="p-3 bg-green-50 rounded-full">
            <FaDoorOpen className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Available</p>
            <p className="text-2xl font-bold text-green-600">{stats.available}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3 hover:shadow-md transition-all duration-200">
          <div className="p-3 bg-red-50 rounded-full">
            <FaBed className="text-red-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Occupied</p>
            <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3 hover:shadow-md transition-all duration-200">
          <div className="p-3 bg-gray-100 rounded-full">
            <FaChartLine className="text-gray-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Occupancy Rate</p>
            <p className="text-2xl font-bold text-gray-900">{occupancyRate}%</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="w-36">
            <label className="block text-xs font-medium text-gray-500 mb-1">Room Type</label>
            <select
              value={filters.roomType}
              onChange={(e) => handleFilterChange({ ...filters, roomType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition bg-white hover:border-gray-300"
            >
              <option value="">All Types</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
            </select>
          </div>
          <div className="w-36">
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition bg-white hover:border-gray-300"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="booked">Booked</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <div className="relative group">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 text-sm" />
              <input
                type="text"
                placeholder="Room number, type..."
                value={filters.search}
                onChange={handleSearch}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition group-hover:border-gray-300"
              />
            </div>
          </div>
          {(filters.roomType || filters.status || filters.search) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <FaTimes /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Rooms Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner text="Loading rooms..." />
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-3">🏨</div>
          <p className="text-gray-500">No rooms found. Try adjusting filters or add a new room.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room No</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Floor</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price/Night</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rooms.map((room) => (
                  <tr key={room._id} className="group hover:bg-gray-50 transition-all duration-200">
                    <td className="px-5 py-3 font-medium text-gray-900">{room.roomNumber}</td>
                    <td className="px-5 py-3 capitalize text-gray-600 group-hover:text-gray-700">{room.roomType}</td>
                    <td className="px-5 py-3 text-gray-600">{room.floor}</td>
                    <td className="px-5 py-3 font-semibold text-gray-900">₹{room.pricePerNight}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                          room.status === "available"
                            ? "bg-green-100 text-green-700 group-hover:bg-green-200"
                            : room.status === "occupied"
                            ? "bg-red-100 text-red-700 group-hover:bg-red-200"
                            : room.status === "booked"
                            ? "bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200"
                            : "bg-gray-100 text-gray-700 group-hover:bg-gray-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          room.status === "available" ? "bg-green-500" :
                          room.status === "occupied" ? "bg-red-500" :
                          room.status === "booked" ? "bg-yellow-500" : "bg-gray-500"
                        }`}></span>
                        {room.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-500">⭐</span>
                        <span className="text-gray-700">{room.rating || 0}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/rooms/${room._id}`)}
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
                          title="View room"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/rooms/edit/${room._id}`)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-200 transform hover:scale-110"
                          title="Edit room"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(room._id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                          title="Delete room"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination page={filters.page} pages={pages} onPageChange={(newPage) => setFilters((prev) => ({ ...prev, page: newPage }))} />
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Room"
        message="Are you sure you want to delete this room? This action cannot be undone."
        confirmText="Delete"
        danger={true}
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

export default RoomsList;
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import Pagination from "../../components/common/Pagination";
import { showError } from "../../utils/toast";
import { getImageUrl } from "../../utils/imageUtils";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Rooms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const urlCheckIn = queryParams.get("checkIn");
  const urlCheckOut = queryParams.get("checkOut");
  const urlGuests = queryParams.get("guests");

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    roomType: "",
    priceMin: "",
    priceMax: "",
    search: "",
    sort: "",
    checkIn: urlCheckIn || "",
    checkOut: urlCheckOut || "",
    guests: urlGuests || "1",
  });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  // Track current image index for each room
  const [imageIndexes, setImageIndexes] = useState({});

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.roomType) params.append("roomType", filters.roomType);
      if (filters.priceMin) params.append("priceMin", filters.priceMin);
      if (filters.priceMax) params.append("priceMax", filters.priceMax);
      if (filters.search) params.append("search", filters.search);
      if (filters.sort) params.append("sort", filters.sort);
      if (filters.checkIn) params.append("checkIn", filters.checkIn);
      if (filters.checkOut) params.append("checkOut", filters.checkOut);
      if (filters.guests) params.append("guests", filters.guests);
      params.append("page", page);
      params.append("limit", 9);

      const res = await axios.get(`/rooms?${params.toString()}`);
      const roomData = res.data.rooms || [];
      setRooms(roomData);
      setPages(res.data.pages || 1);

      // Initialize image indexes
      const initialIndexes = {};
      roomData.forEach(room => {
        initialIndexes[room._id] = 0;
      });
      setImageIndexes(initialIndexes);
    } catch (err) {
      showError("Failed to fetch rooms");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [filters, page]);

  const handleFilterChange = (e) => {
    setPage(1);
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearDateFilters = () => {
    setFilters({ ...filters, checkIn: "", checkOut: "", guests: "1" });
    navigate("/rooms");
  };

  // Carousel navigation
  const nextImage = (roomId, imagesLength) => {
    setImageIndexes(prev => ({
      ...prev,
      [roomId]: (prev[roomId] + 1) % imagesLength
    }));
  };

  const prevImage = (roomId, imagesLength) => {
    setImageIndexes(prev => ({
      ...prev,
      [roomId]: (prev[roomId] - 1 + imagesLength) % imagesLength
    }));
  };

  if (loading) return <Spinner fullScreen text="Loading rooms..." />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Our Rooms</h1>
        <p className="text-gray-600 mb-8">Find the perfect space for your stay</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

              {/* Date filters badge */}
              {(filters.checkIn || filters.checkOut) && (
                <div className="mb-5 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-800 mb-1">Selected Dates</p>
                  <p className="text-xs text-gray-600">Check-in: {filters.checkIn || "—"}</p>
                  <p className="text-xs text-gray-600">Check-out: {filters.checkOut || "—"}</p>
                  <p className="text-xs text-gray-600">Guests: {filters.guests}</p>
                  <button
                    onClick={clearDateFilters}
                    className="text-xs text-red-500 hover:text-red-600 mt-2 underline"
                  >
                    Clear dates
                  </button>
                </div>
              )}

              {/* Room Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                <select
                  name="roomType"
                  value={filters.roomType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                >
                  <option value="">All Types</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="priceMin"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={handleFilterChange}
                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                  />
                  <input
                    type="number"
                    name="priceMax"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={handleFilterChange}
                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Room</label>
                <input
                  type="text"
                  name="search"
                  placeholder="Room number or name..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Room Grid */}
          <div className="flex-1">
            {rooms.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                <div className="text-5xl mb-3">🏨</div>
                <p className="text-gray-500">No rooms available for the selected dates.</p>
                <button
                  onClick={clearDateFilters}
                  className="mt-3 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Clear date filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rooms.map((room) => {
                    const images = room.images || [];
                    const currentIdx = imageIndexes[room._id] || 0;
                    const hasMultiple = images.length > 1;

                    return (
                      <div
                        key={room._id}
                        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
                      >
                        {/* Image Carousel */}
                        <div className="relative overflow-hidden bg-gray-100">
                          <div className="relative h-56">
                            <img
                              src={images.length > 0 ? getImageUrl(images[currentIdx]) : "https://via.placeholder.com/400x300?text=No+Image"}
                              alt={`Room ${room.roomNumber}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                              }}
                            />
                            {/* Navigation arrows (only if multiple images) */}
                            {hasMultiple && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage(room._id, images.length);
                                  }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                  aria-label="Previous image"
                                >
                                  <FaChevronLeft size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage(room._id, images.length);
                                  }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                  aria-label="Next image"
                                >
                                  <FaChevronRight size={14} />
                                </button>
                                {/* Image counter */}
                                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-md">
                                  {currentIdx + 1} / {images.length}
                                </div>
                              </>
                            )}
                          </div>
                          {/* Status badge */}
                          <span
                            className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full shadow-md ${
                              room.status === "available"
                                ? "bg-green-500 text-white"
                                : room.status === "occupied"
                                ? "bg-red-500 text-white"
                                : "bg-yellow-500 text-white"
                            }`}
                          >
                            {room.status === "available" ? "Available" : room.status === "occupied" ? "Occupied" : "Reserved"}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900">Room {room.roomNumber}</h3>
                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                              <span className="text-amber-500">⭐</span>
                              <span className="text-sm font-medium text-gray-700">{room.rating || 0}</span>
                              <span className="text-xs text-gray-500">({room.reviewCount || 0})</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 capitalize mb-1">{room.roomType}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-2">
                            ₹{room.pricePerNight}
                            <span className="text-sm font-normal text-gray-500"> / night</span>
                          </p>
                          <button
                            onClick={() => navigate(`/rooms/${room._id}`)}
                            className="mt-4 w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-1 group-hover:shadow-md"
                          >
                            View Details
                            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                <div className="mt-10">
                  <Pagination page={page} pages={pages} onPageChange={setPage} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
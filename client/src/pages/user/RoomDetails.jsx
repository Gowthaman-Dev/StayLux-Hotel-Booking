import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import { showError } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaBed, FaUsers, FaLayerGroup, FaDoorOpen, FaWifi, FaCar, FaDumbbell, FaSwimmingPool, FaCoffee, FaTv, FaHotTub, FaSnowflake } from "react-icons/fa";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`/rooms/id/${id}`);
        setRoom(res.data.room);
      } catch (err) {
        console.error("Fetch room error:", err);
        showError("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const calculateNights = () => {
    if (checkIn && checkOut) {
      return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    if (!room || !checkIn || !checkOut) return 0;
    return room.pricePerNight * calculateNights();
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!checkIn || !checkOut) {
      showError("Please select check-in and check-out dates");
      return;
    }
    if (checkIn >= checkOut) {
      showError("Check-out date must be after check-in date");
      return;
    }
    if (checkIn < new Date()) {
      showError("Check-in date cannot be in the past");
      return;
    }
    navigate(`/booking/${room._id}`, {
      state: {
        roomId: room._id,
        roomNumber: room.roomNumber,
        pricePerNight: room.pricePerNight,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      },
    });
  };

  if (loading) return <Spinner fullScreen text="Loading..." />;
  if (!room) return <p className="p-6 text-center">Room not found</p>;

  const imageBaseUrl = `${
    import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"
  }/uploads/rooms/`;

  // Amenity icon mapping
  const amenityIcons = {
    wifi: <FaWifi />,
    ac: <FaSnowflake />,
    tv: <FaTv />,
    geyser: <FaHotTub />,
    parking: <FaCar />,
    breakfast: <FaCoffee />,
    pool: <FaSwimmingPool />,
    gym: <FaDumbbell />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gallery */}
      <div className="relative bg-gray-900">
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <img
            src={
              room.images?.[selectedImage]
                ? `${imageBaseUrl}${room.images[selectedImage]}`
                : "https://via.placeholder.com/1200x800?text=No+Image"
            }
            alt={room.roomNumber}
            className="w-full h-full object-cover object-center transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>

        {/* Thumbnail strip */}
        {room.images?.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <div className="bg-black/50 backdrop-blur-md rounded-full px-3 py-2 flex gap-2 overflow-x-auto max-w-[90%]">
              {room.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`transition-all duration-200 ${
                    selectedImage === i
                      ? "ring-2 ring-amber-500 scale-105"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={`${imageBaseUrl}${img}`}
                    alt={`thumb-${i}`}
                    className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Room title overlay */}
        <div className="absolute bottom-8 left-6 md:left-12 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                room.status === "available"
                  ? "bg-green-500"
                  : room.status === "occupied"
                  ? "bg-red-500"
                  : "bg-amber-500"
              }`}
            >
              {room.status === "available" ? "Available" : room.status === "occupied" ? "Occupied" : "Reserved"}
            </span>
            <span className="text-xs bg-black/50 backdrop-blur px-3 py-1 rounded-full">
              ⭐ {room.rating || 0} ({room.reviewCount || 0} reviews)
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Room {room.roomNumber}
          </h1>
          <p className="text-gray-200 text-lg mt-1 capitalize">{room.roomType}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Room Info (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Features Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaBed className="text-amber-600 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500">Bed Type</p>
                    <p className="font-semibold capitalize">{room.bedType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaUsers className="text-amber-600 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500">Max Guests</p>
                    <p className="font-semibold">{room.maxGuests}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaLayerGroup className="text-amber-600 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500">Floor</p>
                    <p className="font-semibold">{room.floor}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FaDoorOpen className="text-amber-600 text-xl" />
                  <div>
                    <p className="text-xs text-gray-500">Room Number</p>
                    <p className="font-semibold">{room.roomNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {room.description && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 leading-relaxed">{room.description}</p>
              </div>
            )}

            {/* Amenities */}
            {room.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {room.amenities.map((a) => (
                    <span
                      key={a}
                      className="flex items-center gap-2 bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm capitalize"
                    >
                      {amenityIcons[a] || <span className="w-4" />}
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            
          </div>

          {/* Right Column - Booking Card (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Book This Room</h2>
                <p className="text-gray-300 text-sm">
                  ₹{room.pricePerNight} <span className="text-gray-400">/ night</span>
                </p>
              </div>

              {room.status === "available" ? (
                <div className="p-6">
                  {/* Date Pickers */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in Date
                      </label>
                      <DatePicker
                        selected={checkIn}
                        onChange={(date) => {
                          setCheckIn(date);
                          if (checkOut && date >= checkOut) setCheckOut(null);
                        }}
                        minDate={new Date()}
                        placeholderText="Select date"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out Date
                      </label>
                      <DatePicker
                        selected={checkOut}
                        onChange={(date) => setCheckOut(date)}
                        minDate={checkIn || new Date()}
                        placeholderText="Select date"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                        dateFormat="dd/MM/yyyy"
                      />
                    </div>
                  </div>

                  {/* Price Preview */}
                  {checkIn && checkOut && (
                    <div className="mt-5 p-4 bg-gray-50 rounded-xl">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {calculateNights()} night(s) × ₹{room.pricePerNight}
                        </span>
                        <span className="font-medium">₹{calculateTotalPrice()}</span>
                      </div>
                      <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-amber-600">₹{calculateTotalPrice()}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleBookNow}
                    disabled={bookingLoading}
                    className="w-full mt-5 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {bookingLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Book Now →"
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-3">
                    Free cancellation up to 48 hours before check-in
                  </p>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="text-red-500 text-5xl mb-3">🔒</div>
                  <p className="text-red-600 font-semibold">Room not available</p>
                  <p className="text-gray-500 text-sm mt-1">Please check other rooms</p>
                  <button
                    onClick={() => navigate("/rooms")}
                    className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Browse other rooms →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
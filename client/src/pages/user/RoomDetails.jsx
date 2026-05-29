// src/pages/user/RoomDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import { showError } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  FaBed, FaUsers, FaLayerGroup, FaDoorOpen, 
  FaWifi, FaCar, FaDumbbell, FaSwimmingPool, FaCoffee, 
  FaTv, FaHotTub, FaSnowflake, FaParking, FaConciergeBell,
  FaUtensils, FaWind, FaRegClock, FaArrowLeft, FaChevronLeft, FaChevronRight
} from "react-icons/fa";

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
  const carouselInterval = useRef(null);

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

  // Auto-slide carousel
  const startAutoSlide = (imagesLength) => {
    if (carouselInterval.current) clearInterval(carouselInterval.current);
    if (imagesLength <= 1) return;
    carouselInterval.current = setInterval(() => {
      setSelectedImage(prev => (prev + 1) % imagesLength);
    }, 4000);
  };

  useEffect(() => {
    if (room && room.images && room.images.length > 1) {
      startAutoSlide(room.images.length);
    }
    return () => {
      if (carouselInterval.current) clearInterval(carouselInterval.current);
    };
  }, [room]);

  const handlePrevImage = () => {
    if (!room?.images?.length) return;
    setSelectedImage(prev => (prev - 1 + room.images.length) % room.images.length);
    // Restart auto-slide after manual interaction
    startAutoSlide(room.images.length);
  };

  const handleNextImage = () => {
    if (!room?.images?.length) return;
    setSelectedImage(prev => (prev + 1) % room.images.length);
    startAutoSlide(room.images.length);
  };

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

  if (loading) return <Spinner fullScreen text="Loading room details..." />;
  if (!room) return <p className="p-6 text-center">Room not found</p>;

  const imageBaseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
  const images = room.images || [];
  const hasMultiple = images.length > 1;

  // Amenity icon mapping
  const amenityIcons = {
    wifi: <FaWifi />,
    ac: <FaSnowflake />,
    tv: <FaTv />,
    geyser: <FaHotTub />,
    parking: <FaParking />,
    breakfast: <FaUtensils />,
    pool: <FaSwimmingPool />,
    gym: <FaDumbbell />,
    room_service: <FaConciergeBell />,
    laundry: <FaWind />,
    balcony: <FaDoorOpen />,
    mini_bar: <FaCoffee />,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <FaArrowLeft size={16} /> Back
        </button>

        {/* Main grid: Image gallery + Details & Booking */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            <div className="relative group overflow-hidden rounded-2xl bg-gray-100 shadow-md">
              <img
                src={images.length > 0 ? `${imageBaseUrl}/uploads/rooms/${images[selectedImage]}` : "https://via.placeholder.com/800x500?text=No+Image"}
                alt={`Room ${room.roomNumber}`}
                className="w-full h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.target.src = "https://via.placeholder.com/800x500?text=No+Image"; }}
              />
              {hasMultiple && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Previous"
                  >
                    <FaChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-md transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Next"
                  >
                    <FaChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {selectedImage+1} / {images.length}
                  </div>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {hasMultiple && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? "border-gray-900" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={`${imageBaseUrl}/uploads/rooms/${img}`}
                      alt={`thumb-${idx}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/64?text=No+Img"; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Room Details + Booking Form */}
          <div className="space-y-6">
            {/* Title & Status */}
            <div>
              <div className="flex flex-wrap justify-between items-start gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Room {room.roomNumber}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  room.status === "available" ? "bg-green-100 text-green-700" : 
                  room.status === "occupied" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {room.status === "available" ? "Available" : room.status === "occupied" ? "Occupied" : "Reserved"}
                </span>
              </div>
              <p className="text-gray-500 text-sm capitalize mt-1">{room.roomType}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-amber-500">⭐</span>
                <span className="text-gray-700">{room.rating || 0}</span>
                <span className="text-gray-400 text-sm">({room.reviewCount || 0} reviews)</span>
              </div>
            </div>

            {/* Key Features Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <FeatureCard icon={<FaBed />} label="Bed Type" value={room.bedType || "single"} />
              <FeatureCard icon={<FaUsers />} label="Max Guests" value={room.maxGuests} />
              <FeatureCard icon={<FaLayerGroup />} label="Floor" value={room.floor} />
              <FeatureCard icon={<FaDoorOpen />} label="Room Number" value={room.roomNumber} />
            </div>

            {/* Description */}
            {room.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{room.description}</p>
              </div>
            )}

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span key={amenity} className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-xs capitalize">
                      {amenityIcons[amenity] || <FaWifi className="text-gray-500" />}
                      {amenity.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
              <div className="bg-gray-900 px-5 py-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">₹{room.pricePerNight}</span>
                  <span className="text-gray-300 text-sm">/ night</span>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => { setCheckIn(date); if (checkOut && date >= checkOut) setCheckOut(null); }}
                    minDate={new Date()}
                    placeholderText="Select date"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    minDate={checkIn || new Date()}
                    placeholderText="Select date"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
                {checkIn && checkOut && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{calculateNights()} night(s) × ₹{room.pricePerNight}</span>
                      <span className="font-medium">₹{calculateTotalPrice()}</span>
                    </div>
                    <div className="border-t pt-1 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-gray-900">₹{calculateTotalPrice()}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={handleBookNow}
                  disabled={bookingLoading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {bookingLoading ? "Processing..." : "Book Now →"}
                </button>
                <p className="text-xs text-gray-500 text-center">Free cancellation up to 48 hours before check-in</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for feature cards
const FeatureCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-3 text-center hover:shadow-md transition">
    <div className="text-gray-600 text-xl mb-1">{icon}</div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-semibold text-gray-800 capitalize">{value}</p>
  </div>
);

export default RoomDetails;
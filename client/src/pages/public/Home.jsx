import React, { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import { showError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [hotelName, setHotelName] = useState("Hotel Paradise");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const autoSlideInterval = useRef(null);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${baseUrl}/uploads/rooms/${imagePath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, roomsRes] = await Promise.all([
          axios.get("/settings"),
          axios.get("/rooms?limit=3"),
        ]);
        setHotelName(settingsRes.data.data?.hotelName || "Hotel Paradise");
        setRooms(roomsRes.data.rooms || []);
      } catch (err) {
        showError("Failed to load home data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const startAutoSlide = () => {
    if (autoSlideInterval.current) clearInterval(autoSlideInterval.current);
    autoSlideInterval.current = setInterval(() => {
      setCurrentRoomIndex((prev) => (prev + 1) % (rooms.length || 1));
    }, 5000);
  };

  useEffect(() => {
    if (rooms.length > 0) {
      startAutoSlide();
    }
    return () => {
      if (autoSlideInterval.current) clearInterval(autoSlideInterval.current);
    };
  }, [rooms.length]);

  const handleManualChange = (newIndex) => {
    setCurrentRoomIndex(newIndex);
    if (rooms.length > 0) {
      startAutoSlide();
    }
  };

  const goToPrevRoom = () => {
    handleManualChange((currentRoomIndex - 1 + rooms.length) % rooms.length);
  };

  const goToNextRoom = () => {
    handleManualChange((currentRoomIndex + 1) % rooms.length);
  };

  const handleSearch = () => {
    if (!search.checkIn || !search.checkOut) {
      showError("Please select check-in and check-out dates");
      return;
    }
    const checkInFormatted = new Date(search.checkIn).toISOString().split('T')[0];
    const checkOutFormatted = new Date(search.checkOut).toISOString().split('T')[0];
    navigate(`/rooms?checkIn=${checkInFormatted}&checkOut=${checkOutFormatted}&guests=${search.guests}`);
  };

  if (loading) return <Spinner fullScreen text="Loading Home..." />;

  const currentRoom = rooms[currentRoomIndex];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section – Responsive */}
      <section className="py-12 sm:py-16 md:py-20 px-4 border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-3 sm:mb-4 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold tracking-wider rounded-full">
            WELCOME TO {hotelName.toUpperCase()}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight text-black mb-3 sm:mb-4">
            Where <span className="text-gray-500">Luxury</span> Meets Comfort
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Experience world‑class hospitality, elegant rooms, and unforgettable moments.
          </p>

          {/* Search Form – Responsive */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-end">
              <div className="flex-1 text-left w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                <input
                  type="date"
                  value={search.checkIn}
                  onChange={(e) => setSearch({ ...search, checkIn: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm"
                />
              </div>
              <div className="flex-1 text-left w-full sm:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                <input
                  type="date"
                  value={search.checkOut}
                  onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition text-sm"
                />
              </div>
              <div className="w-full sm:w-32 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                <input
                  type="number"
                  min="1"
                  value={search.guests}
                  onChange={(e) => setSearch({ ...search, guests: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-gray-200 focus:ring-1 focus:ring-black focus:border-black outline-none transition"
                />
              </div>
              <button
                onClick={handleSearch}
                className="w-full sm:w-auto bg-black text-white font-medium py-2.5 px-6 rounded-xl hover:bg-gray-800 transition-all shadow-sm mt-2 sm:mt-0"
              >
                Search Rooms →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms – Fully Responsive Carousel */}
      <section className="py-12 sm:py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-gray-500 font-semibold tracking-wide uppercase text-xs sm:text-sm">Exclusive Collection</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black mt-2">Featured Rooms</h2>
          <div className="w-12 sm:w-16 h-0.5 bg-gray-300 mx-auto mt-3 sm:mt-4"></div>
          <p className="text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base px-2">
            Discover our most sought‑after accommodations, designed for your ultimate comfort.
          </p>
        </div>

        {rooms.length > 0 && currentRoom ? (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            {/* Left – Room Details (mobile first) */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full mb-2 sm:mb-3">
                {currentRoom.roomType || "Deluxe"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-1">Room {currentRoom.roomNumber}</h3>
              <p className="text-xl sm:text-2xl font-semibold text-black mt-2 mb-3">
                ₹{currentRoom.pricePerNight} <span className="text-sm font-normal text-gray-500">/ night</span>
              </p>
              <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 max-w-md mx-auto lg:mx-0 text-sm sm:text-base px-2 lg:px-0">
                {currentRoom.description || "Experience luxury and comfort in this elegantly designed room with premium amenities, plush bedding, and stunning views."}
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
                <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Free Cancellation</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-xs sm:text-sm">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Instant Confirmation</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/rooms/${currentRoom._id}`)}
                className="bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-medium hover:bg-gray-800 transition-all shadow-sm text-sm sm:text-base"
              >
                Book Now →
              </button>
            </div>

            {/* Right – Carousel (mobile first) */}
            <div className="flex-1 relative group order-1 lg:order-2 w-full">
              <div className="overflow-hidden rounded-2xl shadow-md bg-gray-100">
                <img
                  src={
                    currentRoom.images && currentRoom.images.length > 0
                      ? getImageUrl(currentRoom.images[0])
                      : "https://via.placeholder.com/600x400?text=No+Image"
                  }
                  alt={`Room ${currentRoom.roomNumber}`}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x400?text=No+Image";
                  }}
                />
              </div>

              {/* Navigation Arrows – always visible on mobile, hover on desktop */}
              {rooms.length > 1 && (
                <>
                  <button
                    onClick={goToPrevRoom}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-1.5 sm:p-2 shadow-md transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                    aria-label="Previous room"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={goToNextRoom}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-1.5 sm:p-2 shadow-md transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                    aria-label="Next room"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Dots indicator – responsive size */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                {rooms.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleManualChange(idx)}
                    className={`rounded-full transition-all duration-200 ${
                      idx === currentRoomIndex ? "bg-black w-4 sm:w-5 h-1.5 sm:h-2" : "bg-gray-400 w-1.5 sm:w-2 h-1.5 sm:h-2"
                    }`}
                    aria-label={`Go to room ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">No rooms available</div>
        )}

        <div className="text-center mt-8 sm:mt-12">
          <button
            onClick={() => navigate("/rooms")}
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-200 text-sm sm:text-base"
          >
            Explore All Rooms
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Rooms and Suites Section – Fully Responsive */}
      <section className="py-12 sm:py-20 px-4 max-w-7xl mx-auto border-y border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-medium tracking-[0.2em] text-gray-500 uppercase mb-2 sm:mb-3">LUXURY STAYS</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black mb-3 sm:mb-5">Rooms & Suites</h2>
            <p className="text-gray-800 text-base sm:text-lg leading-relaxed max-w-lg mx-auto md:mx-0 mb-3">
              Our contemporary suites are <span className="font-semibold text-black">ultra‑comfy</span> and designed for a blissful night’s sleep. 
              Pick from <span className="font-semibold text-black">5 distinct room styles</span> to suit your stay.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 text-xs sm:text-sm font-medium mt-2">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Just a stone’s throw from Gautrain Rosebank Station</span>
            </div>
            <button
              onClick={() => navigate("/rooms")}
              className="mt-5 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-black text-white text-sm font-semibold tracking-wide rounded-full hover:bg-gray-800 transition-all duration-200 shadow-sm"
            >
              Explore All Rooms →
            </button>
          </div>
          <div className="flex-1 w-full">
            <img
              src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="Luxury hotel room"
              className="rounded-2xl shadow-md object-cover w-full h-56 sm:h-64 md:h-80 hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Call to Action – Mobile friendly */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black mb-3 sm:mb-4">Ready for an Unforgettable Experience?</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-5 sm:mb-6 px-2">Book your stay today and enjoy exclusive benefits.</p>
          <button
            onClick={() => navigate("/rooms")}
            className="bg-black text-white hover:bg-gray-800 font-medium py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all shadow-sm text-sm sm:text-base"
          >
            Book Now →
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
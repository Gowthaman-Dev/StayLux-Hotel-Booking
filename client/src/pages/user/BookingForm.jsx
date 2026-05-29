import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import { showSuccess, showError } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import {
  FaHotel,
  FaBed,
  FaLayerGroup,
  FaUsers,
  FaRupeeSign,
  FaCalendarAlt,
  FaMoon,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaMobileAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { getImageUrl } from "../../utils/imageUtils";

const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const { user } = useAuth();

  const { checkIn: locationCheckIn, checkOut: locationCheckOut, roomId: stateRoomId } = location.state || {};
  const finalRoomId = roomId || stateRoomId;
  const checkIn = locationCheckIn;
  const checkOut = locationCheckOut;

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    guests: 1,
    paymentMethod: "cash",
  });

  useEffect(() => {
    if (!redirecting && (!checkIn || !checkOut)) {
      setRedirecting(true);
      showError("Please select check-in and check-out dates");
      navigate(finalRoomId ? `/rooms/${finalRoomId}` : "/rooms");
    }
  }, [checkIn, checkOut, finalRoomId, navigate, redirecting]);

  const fetchRoom = async () => {
    if (!finalRoomId) {
      showError("Room ID is missing");
      setLoading(false);
      if (!redirecting) {
        setRedirecting(true);
        navigate("/rooms");
      }
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`/rooms/id/${finalRoomId}`);
      setRoom(res.data.room);
    } catch (err) {
      console.error("Fetch room error:", err);
      showError(err.response?.data?.message || "Failed to load room details");
      if (!redirecting) navigate("/rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [finalRoomId]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!room || !checkIn || !checkOut) return 0;
    const nights = calculateNights();
    if (nights <= 0) return 0;
    const roomCharge = room.pricePerNight * nights;
    const extraGuestPrice = 500;
    const extraGuests = Math.max(0, formData.guests - (room.maxGuests || 2));
    const extraGuestCharge = extraGuests * extraGuestPrice * nights;
    const serviceCharge = 200;
    const subtotal = roomCharge + extraGuestCharge + serviceCharge;
    const gst = subtotal * 0.18;
    return Math.round(subtotal + gst);
  };

  const calculateGST = () => {
    const total = calculateTotal();
    return Math.round(total * 0.18 / 1.18);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!finalRoomId || !checkIn || !checkOut) {
      showError("Missing booking information");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        roomId: finalRoomId,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        guestDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          guests: Number(formData.guests),
        },
        paymentMethod: formData.paymentMethod,
      };
      const res = await axios.post("/bookings", payload);
      showSuccess("Booking created successfully! 🎉");
      navigate(`/payment/${res.data.booking._id}`);
    } catch (err) {
      if (err.response?.status === 400) {
        showError(err.response.data.message || "Room not available for selected dates");
      } else if (err.response?.status === 401) {
        showError("Please login to book a room");
        navigate("/login");
      } else if (err.response?.status === 404) {
        showError("Room not found");
        navigate("/rooms");
      } else {
        showError(err.response?.data?.message || "Failed to create booking. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner fullScreen text="Loading room details..." />;
  if (redirecting) return <Spinner fullScreen text="Redirecting..." />;
  if (!room) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">Room not found</p>
        <button onClick={() => navigate("/rooms")} className="bg-amber-600 text-white px-4 py-2 rounded-xl">
          Back to Rooms
        </button>
      </div>
    );
  }

  const nights = calculateNights();
  const totalAmount = calculateTotal();
  const roomCharge = room.pricePerNight * nights;
  const extraGuests = Math.max(0, formData.guests - (room.maxGuests || 2));
  const extraGuestCharge = extraGuests * 500 * nights;
  const gstAmount = calculateGST();

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-500 mt-1">Review details and confirm your reservation</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Room & Stay Info */}
          <div className="space-y-6">
            {/* Room Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-3">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <FaHotel /> Room Details
                </h2>
              </div>
              <div className="p-5">
                {room.images?.length > 0 && (
                  <img
                    src={getImageUrl(room.images[0])}
                    alt={room.roomNumber}
                    className="w-full h-48 object-cover rounded-xl mb-4 hover:scale-105 transition-transform duration-300"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/400x200?text=No+Image")}
                  />
                )}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaBed className="text-amber-500" /> <span>Room No:</span>
                    <span className="font-semibold text-gray-900">{room.roomNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaHotel className="text-amber-500" /> <span>Type:</span>
                    <span className="font-semibold capitalize text-gray-900">{room.roomType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaLayerGroup className="text-amber-500" /> <span>Floor:</span>
                    <span>{room.floor}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUsers className="text-amber-500" /> <span>Max Guests:</span>
                    <span>{room.maxGuests}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 col-span-2">
                    <FaRupeeSign className="text-amber-500" /> <span>Price/Night:</span>
                    <span className="font-bold text-amber-600">₹{room.pricePerNight}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stay Dates Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-3">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <FaCalendarAlt /> Stay Dates
                </h2>
              </div>
              <div className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center flex-1">
                    <p className="text-xs text-gray-500">Check-in</p>
                    <p className="font-semibold text-green-600">{formatDate(checkIn)}</p>
                  </div>
                  <div className="text-gray-400 text-xl">→</div>
                  <div className="text-center flex-1">
                    <p className="text-xs text-gray-500">Check-out</p>
                    <p className="font-semibold text-red-600">{formatDate(checkOut)}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t text-center">
                  <p className="text-gray-600 flex items-center justify-center gap-2">
                    <FaMoon className="text-amber-500" /> Total nights: <strong className="text-lg">{nights}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Guest Form & Price */}
          <div className="space-y-6">
            {/* Guest Details Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-3">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <FaUser /> Guest Details
                </h2>
              </div>
              <div className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                      required
                    />
                  </div>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                      required
                    />
                  </div>
                  <div className="relative">
                    <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    />
                    {formData.guests > (room.maxGuests || 2) && (
                      <p className="text-amber-600 text-xs mt-1 flex items-center gap-1">
                        ⚠️ Extra guests: ₹500 per person per night
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "cash", icon: <FaMoneyBillWave />, label: "Cash" },
                        { value: "card", icon: <FaCreditCard />, label: "Card" },
                        { value: "upi", icon: <FaMobileAlt />, label: "UPI" },
                      ].map((method) => (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: method.value })}
                          className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                            formData.paymentMethod === method.value
                              ? "border-amber-500 bg-amber-50 text-amber-700"
                              : "border-gray-200 text-gray-500 hover:border-amber-300 hover:bg-gray-50"
                          }`}
                        >
                          {method.icon}
                          <span className="text-xs">{method.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Price Breakdown Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-3">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <FaRupeeSign /> Price Breakdown
                </h2>
              </div>
              <div className="p-5">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Room charges ({nights} nights × ₹{room.pricePerNight})</span>
                    <span className="font-medium">₹{roomCharge}</span>
                  </div>
                  {extraGuests > 0 && (
                    <div className="flex justify-between text-amber-600">
                      <span>Extra guests ({extraGuests} × ₹500 × {nights} nights)</span>
                      <span>+ ₹{extraGuestCharge}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Service charge</span>
                    <span>₹200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-amber-600">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full mt-5 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Booking <FaArrowRight />
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3 flex items-center justify-center gap-1">
                  <FaCheckCircle className="text-green-500" /> Free cancellation up to 48 hours before check-in
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
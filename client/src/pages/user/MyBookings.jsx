// pages/user/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import Badge from "../../components/common/Badge";
import ConfirmModal from "../../components/common/ConfirmModal";
import { showError, showSuccess } from "../../utils/toast";
import { FaCalendarAlt, FaMoon, FaRupeeSign, FaHotel, FaEye, FaCreditCard, FaTimes, FaStar } from "react-icons/fa";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [cancelId, setCancelId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const query = status ? `?status=${status}` : "";
      const res = await axios.get(`/bookings/my${query}`);
      setBookings(res.data.bookings || []);
    } catch {
      showError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [status]);

  const handleCancel = async () => {
    try {
      await axios.put(`/bookings/${cancelId}/cancel`);
      showSuccess("Booking cancelled");
      setCancelId(null);
      fetchBookings();
    } catch (err) {
      showError(err.response?.data?.message || "Cancel failed");
    }
  };

  if (loading) return <Spinner fullScreen text="Loading your bookings..." />;

  const filterOptions = [
    { value: "", label: "All" },
    { value: "confirmed", label: "Confirmed" },
    { value: "checkedIn", label: "Checked In" },
    { value: "checkedOut", label: "Checked Out" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">View and manage your reservations</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                status === opt.value
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No bookings found</h3>
            <p className="text-gray-500 mb-6">
              {status ? `You have no ${status} bookings.` : "You haven't made any reservations yet."}
            </p>
            <button
              onClick={() => navigate("/rooms")}
              className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-2 rounded-xl transition"
            >
              Browse Rooms →
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200"
              >
                <div className="p-5 md:p-6">
                  {/* Header row: Room & Status */}
                  <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaHotel className="text-amber-600" />
                        Room {booking.room?.roomNumber}
                        <span className="text-sm font-normal text-gray-500 capitalize">
                          ({booking.room?.roomType})
                        </span>
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <Badge type="booking" status={booking.bookingStatus} />
                      <Badge type="payment" status={booking.paymentStatus} />
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaCalendarAlt className="text-amber-500" />
                      <div>
                        <p className="text-xs text-gray-400">Check‑in</p>
                        <p className="font-medium">{formatDate(booking.checkIn)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaCalendarAlt className="text-amber-500" />
                      <div>
                        <p className="text-xs text-gray-400">Check‑out</p>
                        <p className="font-medium">{formatDate(booking.checkOut)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaMoon className="text-amber-500" />
                      <div>
                        <p className="text-xs text-gray-400">Nights</p>
                        <p className="font-medium">{booking.numberOfNights || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <FaRupeeSign className="text-amber-500" />
                      <div>
                        <p className="text-xs text-gray-400">Total Amount</p>
                        <p className="font-bold text-gray-900">
                          ₹{booking.priceBreakdown?.totalAmount || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => navigate(`/bookings/${booking._id}`)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition"
                    >
                      <FaEye size={14} /> View Details
                    </button>

                    {booking.bookingStatus === "confirmed" && booking.paymentStatus === "pending" && (
                      <button
                        onClick={() => navigate(`/payment/${booking._id}`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl transition"
                      >
                        <FaCreditCard size={14} /> Pay Now
                      </button>
                    )}

                    {booking.bookingStatus === "confirmed" && (
                      <button
                        onClick={() => setCancelId(booking._id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition"
                      >
                        <FaTimes size={14} /> Cancel
                      </button>
                    )}

    
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirm Cancel Modal */}
        <ConfirmModal
          isOpen={!!cancelId}
          onClose={() => setCancelId(null)}
          onConfirm={handleCancel}
          title="Cancel Booking"
          message="Are you sure you want to cancel this booking? Refund amount depends on cancellation policy."
          confirmText="Yes, Cancel"
          cancelText="No, Keep"
          danger={true}
        />
      </div>
    </div>
  );
};

export default MyBookings;
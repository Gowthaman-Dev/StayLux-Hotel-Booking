import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import { showSuccess, showError } from "../../utils/toast";
import {
  FaHotel,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaUsers,
  FaCalendarAlt,
  FaMoon,
  FaRupeeSign,
  FaCreditCard,
  FaTimesCircle,
  FaArrowLeft,
} from "react-icons/fa";

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/bookings/${id}`);
      setBooking(res.data.booking);
    } catch (err) {
      showError("Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handlePay = async () => {
    try {
      await axios.put(`/bookings/${id}/pay`);
      showSuccess("Payment successful");
      fetchBooking();
    } catch {
      showError("Payment failed");
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await axios.put(`/bookings/${id}/cancel`);
      showSuccess(`Booking cancelled. Refund: ${res.data.refundPercentage}%`);
      setShowCancelModal(false);
      fetchBooking();
    } catch {
      showError("Cancel failed");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Spinner fullScreen text="Loading booking..." />;
  if (!booking) return <p className="p-6 text-center">No booking found</p>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
        {/* Header with back button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Booking Details</h1>
            <p className="text-gray-500 text-sm mt-1">View and manage your reservation</p>
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Header with booking ID and statuses */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 sm:px-8">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Booking ID</p>
                <p className="text-gray-900 font-mono font-medium">{booking._id}</p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    booking.bookingStatus === "confirmed"
                      ? "bg-blue-50 text-blue-700"
                      : booking.bookingStatus === "checkedIn"
                      ? "bg-green-50 text-green-700"
                      : booking.bookingStatus === "checkedOut"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    booking.bookingStatus === "confirmed" ? "bg-blue-500" :
                    booking.bookingStatus === "checkedIn" ? "bg-green-500" :
                    booking.bookingStatus === "checkedOut" ? "bg-gray-500" : "bg-red-500"
                  }`}></span>
                  {booking.bookingStatus}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    booking.paymentStatus === "paid"
                      ? "bg-green-50 text-green-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${booking.paymentStatus === "paid" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Room Information */}
            <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FaHotel className="text-gray-500" /> Room Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">Room Number</span>
                    <span className="font-medium text-gray-900">{booking.room?.roomNumber}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">Room Type</span>
                    <span className="font-medium text-gray-900 capitalize">{booking.room?.roomType}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">Floor</span>
                    <span className="font-medium text-gray-900">{booking.room?.floor}</span>
                  </div>
                </div>
                {booking.room?.images?.length > 0 && (
                  <div className="flex justify-center sm:justify-end">
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}/uploads/rooms/${booking.room.images[0]}`}
                      alt="Room"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/96?text=No+Img")}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Guest Details */}
            <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FaUser className="text-gray-500" /> Guest Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUser className="text-gray-400 w-4" />
                  <span className="text-gray-500">Name:</span>
                  <span className="font-medium text-gray-900">{booking.user?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope className="text-gray-400 w-4" />
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-900">{booking.user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhoneAlt className="text-gray-400 w-4" />
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium text-gray-900">{booking.user?.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaUsers className="text-gray-400 w-4" />
                  <span className="text-gray-500">Guests:</span>
                  <span className="font-medium text-gray-900">{booking.guests || 1}</span>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FaCalendarAlt className="text-gray-500" /> Stay Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Check-in</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.checkIn)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Check-out</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.checkOut)}</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center gap-1"><FaMoon className="text-gray-400 w-3" /> Nights</p>
                  <p className="font-medium text-gray-900">{booking.numberOfNights}</p>
                </div>
              </div>
            </div>

            {/* Price & Payment */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <FaRupeeSign className="text-gray-500" /> Price Breakdown
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">Per Night</span>
                    <span className="font-medium text-gray-900">₹{booking.priceBreakdown?.pricePerNight || 0}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-700 font-medium">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900">₹{booking.priceBreakdown?.totalAmount || 0}</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <FaCreditCard className="text-gray-500" /> Payment
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-1">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium text-gray-900 capitalize">{booking.paymentMethod || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      booking.paymentStatus === "paid" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${booking.paymentStatus === "paid" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                      {booking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              {booking.bookingStatus === "confirmed" && booking.paymentStatus === "pending" && (
                <button
                  onClick={handlePay}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition shadow-sm hover:shadow"
                >
                  <FaCreditCard /> Pay Now
                </button>
              )}
              {booking.bookingStatus === "confirmed" && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition"
                >
                  <FaTimesCircle /> Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FaTimesCircle className="text-gray-600" /> Cancel Booking
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-2">Are you sure you want to cancel this booking?</p>
              <p className="text-sm text-gray-500">Refund amount will be calculated based on our cancellation policy.</p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                disabled={cancelling}
              >
                No, Keep
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
              >
                {cancelling ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookingDetail;
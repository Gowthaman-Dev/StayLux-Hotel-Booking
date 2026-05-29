// pages/user/PaymentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import { showSuccess, showError } from "../../utils/toast";
import {
  FaHotel,
  FaCalendarAlt,
  FaRupeeSign,
  FaCreditCard,
  FaMobileAlt,
  FaMoneyBillWave,
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`/bookings/${id}`);
        setBooking(res.data.booking);
      } catch {
        showError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handlePayment = async () => {
    try {
      setPaying(true);
      await axios.put(`/bookings/${id}/pay`, { paymentMethod });
      showSuccess("Payment successful! 🎉");
      navigate("/my-bookings");
    } catch (err) {
      showError(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) return <Spinner fullScreen text="Loading payment details..." />;
  if (!booking) return <p className="p-6 text-center">Booking not found</p>;

  const totalAmount = booking.priceBreakdown?.totalAmount || booking.totalAmount || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Secure Payment</h1>
        </div>

        {/* Booking Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 hover:shadow-md transition-shadow">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-3">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <FaHotel /> Booking Summary
            </h2>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Room Number</span>
              <span className="font-semibold text-gray-900">{booking.room?.roomNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Room Type</span>
              <span className="capitalize text-gray-900">{booking.room?.roomType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-1">
                <FaCalendarAlt /> Dates
              </span>
              <span className="text-gray-900">
                {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-700 font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-amber-600">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 hover:shadow-md transition-shadow">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-5 py-3">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <FaCreditCard /> Choose Payment Method
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "card", icon: <FaCreditCard />, label: "Credit/Debit Card", color: "blue" },
                { value: "upi", icon: <FaMobileAlt />, label: "UPI", color: "green" },
                { value: "cash", icon: <FaMoneyBillWave />, label: "Cash", color: "amber" },
              ].map((method) => (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                    paymentMethod === method.value
                      ? `border-${method.color}-500 bg-${method.color}-50 text-${method.color}-700`
                      : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-xs font-medium">{method.label}</span>
                </button>
              ))}
            </div>

            {/* Secure payment note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <FaLock className="text-green-600" /> Your payment is secure and encrypted
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={paying}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          {paying ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing Payment...
            </>
          ) : (
            <>
              Pay Now <FaArrowLeft className="rotate-180" />
            </>
          )}
        </button>

        {/* Cancel info */}
        <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
          <FaCheckCircle className="text-green-500" /> You can cancel within 48 hours for a full refund
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
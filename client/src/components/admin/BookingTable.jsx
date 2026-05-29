import React from "react";

const BookingTable = ({ bookings, onAction }) => {
  if (!bookings.length) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookings.map((booking) => (
            <tr key={booking._id} className="group hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-mono text-gray-500">
                {booking.bookingId?.slice(-8) || booking._id.slice(-8)}
              </td>
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-gray-800">{booking.user?.name || "—"}</p>
                  <p className="text-xs text-gray-400">{booking.user?.email || "—"}</p>
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-gray-700">{booking.room?.roomNumber || "—"}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(booking.checkIn)}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(booking.checkOut)}</td>
              <td className="px-4 py-3 font-semibold text-gray-900">₹{booking.priceBreakdown?.totalAmount || 0}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    booking.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${booking.paymentStatus === "paid" ? "bg-green-500" : "bg-yellow-500"}`}></span>
                  {booking.paymentStatus}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    booking.bookingStatus === "confirmed"
                      ? "bg-blue-100 text-blue-700"
                      : booking.bookingStatus === "checkedIn"
                      ? "bg-green-100 text-green-700"
                      : booking.bookingStatus === "checkedOut"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    booking.bookingStatus === "confirmed" ? "bg-blue-500" :
                    booking.bookingStatus === "checkedIn" ? "bg-green-500" :
                    booking.bookingStatus === "checkedOut" ? "bg-gray-500" : "bg-red-500"
                  }`}></span>
                  {booking.bookingStatus}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-center gap-1">
                  <button
                    onClick={() => onAction("view", booking)}
                    className="p-1.5 rounded text-gray-500 hover:bg-gray-100 transition"
                    title="View"
                  >
                    👁️
                  </button>
                  {booking.bookingStatus === "confirmed" && (
                    <button
                      onClick={() => onAction("checkIn", booking)}
                      className="p-1.5 rounded text-green-600 hover:bg-green-50 transition"
                      title="Check-in"
                    >
                      ✓
                    </button>
                  )}
                  {booking.bookingStatus === "checkedIn" && (
                    <button
                      onClick={() => onAction("checkOut", booking)}
                      className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition"
                      title="Check-out"
                    >
                      →
                    </button>
                  )}
                  {!["cancelled", "checkedOut"].includes(booking.bookingStatus) && (
                    <button
                      onClick={() => onAction("cancel", booking)}
                      className="p-1.5 rounded text-red-500 hover:bg-red-50 transition"
                      title="Cancel"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
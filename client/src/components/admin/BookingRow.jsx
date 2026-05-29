const BookingRow = ({ booking, onAction }) => {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-2">
        {booking.bookingId || booking._id?.slice(-8)}
      </td>
      <td className="p-2">{booking.user?.name}</td>
      <td className="p-2">{booking.user?.email}</td>
      <td className="p-2">{booking.room?.roomNumber}</td>
      <td className="p-2">{booking.room?.roomType}</td>
      <td className="p-2">
        {booking.checkIn?.slice(0, 10)}
      </td>
      <td className="p-2">
        {booking.checkOut?.slice(0, 10)}
      </td>
      <td className="p-2">
        ₹{booking.priceBreakdown?.totalAmount || 0}
      </td>
      <td className="p-2">
        <span className={`px-2 py-1 rounded text-xs ${
          booking.paymentStatus === "paid" ? "bg-green-100 text-green-800" :
          booking.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
          "bg-red-100 text-red-800"
        }`}>
          {booking.paymentStatus}
        </span>
      </td>
      <td className="p-2">
        <span className={`px-2 py-1 rounded text-xs ${
          booking.bookingStatus === "confirmed" ? "bg-blue-100 text-blue-800" :
          booking.bookingStatus === "checkedIn" ? "bg-green-100 text-green-800" :
          booking.bookingStatus === "checkedOut" ? "bg-gray-100 text-gray-800" :
          "bg-red-100 text-red-800"
        }`}>
          {booking.bookingStatus}
        </span>
      </td>
      <td className="p-2 space-x-1">
        <button
          onClick={() => onAction("view", booking)}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          View
        </button>

        {booking.bookingStatus === "confirmed" && (
          <button
            onClick={() => onAction("checkIn", booking)}
            className="bg-green-500 text-white px-2 py-1 rounded text-xs"
          >
            Check-in
          </button>
        )}

        {booking.bookingStatus === "checkedIn" && (
          <button
            onClick={() => onAction("checkOut", booking)}
            className="bg-purple-500 text-white px-2 py-1 rounded text-xs"
          >
            Check-out
          </button>
        )}

        {!["cancelled", "checkedOut"].includes(booking.bookingStatus) && (
          <button
            onClick={() => onAction("cancel", booking)}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Cancel
          </button>
        )}
      </td>
    </tr>
  );
};

export default BookingRow;
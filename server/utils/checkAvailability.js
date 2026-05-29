import Booking from "../models/Booking.js";

export const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
  const existingBooking = await Booking.findOne({
    room: roomId,
    bookingStatus: { $ne: "cancelled" },
    $or: [
      {
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
      },
    ],
  });
  
  return !existingBooking;
};
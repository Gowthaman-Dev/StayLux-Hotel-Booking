import Booking from "../models/Booking.js";

export const getCurrentGuests = async (req, res) => {
  try {
    const guests = await Booking.find({ bookingStatus: "checkedIn" })
      .populate("user", "name email phone")
      .populate("room", "roomNumber roomType floor");

    res.status(200).json({
      success: true,
      count: guests.length,
      data: guests,
    });
  } catch (error) {
    console.error("Get current guests error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Payment from "../models/Payment.js";
import { calculatePrice } from "../utils/calculatePrice.js";
import { checkRoomAvailability } from "../utils/checkAvailability.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/User.js";
import { createNotification } from "../utils/createNotification.js";

// ✅ CREATE BOOKING (with payment record)
export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guestDetails, paymentMethod } = req.body;

    console.log("Create booking request:", { roomId, checkIn, checkOut, guestDetails, paymentMethod });

    // Validation
    if (!roomId || !checkIn || !checkOut || !guestDetails) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: roomId, checkIn, checkOut, guestDetails",
      });
    }

    if (!guestDetails.name || !guestDetails.email || !guestDetails.phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and phone number",
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Check-in date cannot be in the past",
      });
    }

    const isAvailable = await checkRoomAvailability(roomId, checkInDate, checkOutDate);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Room not available for selected dates",
      });
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const price = calculatePrice({
      pricePerNight: room.pricePerNight,
      nights,
      guests: guestDetails.guests || 1,
      maxGuests: room.maxGuests,
    });

    // Generate booking ID
    const bookingId = "BOOK-" + Date.now() + Math.floor(Math.random() * 1000);

    // Create booking
    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      room: roomId,
      guestDetails: {
        name: guestDetails.name,
        email: guestDetails.email,
        phone: guestDetails.phone,
        guests: guestDetails.guests || 1,
      },
      checkIn: checkInDate,
      checkOut: checkOutDate,
      numberOfNights: nights,
      priceBreakdown: {
        pricePerNight: room.pricePerNight,
        totalAmount: price.totalAmount,
      },
      paymentMethod: paymentMethod || "cash",
      paymentStatus: "pending",
      bookingStatus: "confirmed",
    });

    // ✅ Create pending payment record
    await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: price.totalAmount,
      paymentMethod: paymentMethod || "cash",
      status: "pending",
      transactionId: "TXN-" + Date.now() + Math.floor(Math.random() * 1000),
    });

    // Update room status
    room.status = "booked";
    await room.save();

    await createNotification({
      user: booking.user,
      title: "Booking Created",
      message: `Your booking for Room ${room.roomNumber} has been confirmed`,
      type: "booking",
      relatedBooking: booking._id,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// ✅ PROCESS PAYMENT (updates payment record)
export const processPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already processed",
      });
    }

    // Update payment record
    await Payment.findOneAndUpdate(
      { booking: id },
      {
        status: "paid",
        paidAt: new Date(),
        paymentMethod: paymentMethod || booking.paymentMethod,
      },
      { upsert: true } // create if missing (fallback)
    );

    booking.paymentStatus = "paid";
    if (paymentMethod) booking.paymentMethod = paymentMethod;
    await booking.save();

    await createNotification({
      user: booking.user,
      title: "Payment Success",
      message: `Payment of ₹${booking.priceBreakdown.totalAmount} completed successfully`,
      type: "payment",
      relatedBooking: booking._id,
    });

    res.status(200).json({
      success: true,
      message: "Payment successful, booking confirmed",
      booking,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ GET MY BOOKINGS
export const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { user: req.user._id };
    if (status) query.bookingStatus = status;

    const bookings = await Booking.find(query)
      .populate("room")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ CANCEL BOOKING
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Cancel booking request for ID:", id);

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }
    if (booking.bookingStatus === "checkedOut") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed booking",
      });
    }

    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const hours = (checkIn - now) / (1000 * 60 * 60);
    let refundPercentage = 0;
    let refundMessage = "";

    if (hours >= 48) {
      refundPercentage = 100;
      refundMessage = "Full refund will be processed";
    } else if (hours >= 24) {
      refundPercentage = 50;
      refundMessage = "50% refund will be processed";
    } else {
      refundPercentage = 0;
      refundMessage = "No refund available for last minute cancellation";
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    const room = await Room.findById(booking.room);
    if (room) {
      room.status = "available";
      await room.save();
    }

    // Update payment status to refunded (optional)
    await Payment.findOneAndUpdate(
      { booking: id },
      { status: "refunded" },
      { upsert: false }
    );

    await createNotification({
      user: booking.user,
      title: "Booking Cancelled",
      message: `Your booking has been cancelled. ${refundMessage}`,
      type: "booking",
      relatedBooking: booking._id,
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      refundPercentage,
      refundMessage,
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ CHECK-IN GUEST
export const checkInGuest = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (booking.bookingStatus !== "confirmed") {
      return res.status(400).json({ success: false, message: "Booking not confirmed" });
    }
    booking.bookingStatus = "checkedIn";
    await booking.save();

    const room = await Room.findById(booking.room);
    if (room) {
      room.status = "occupied";
      await room.save();
    }

    res.status(200).json({ success: true, message: "Checked in successfully", booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ CHECK-OUT GUEST
export const checkOutGuest = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    if (booking.bookingStatus !== "checkedIn") {
      return res.status(400).json({
        success: false,
        message: `Cannot check-out booking with status: ${booking.bookingStatus}`,
      });
    }

    booking.bookingStatus = "checkedOut";
    await booking.save();

    const room = await Room.findById(booking.room);
    if (room) {
      room.status = "available";
      await room.save();
    }

    await createNotification({
      user: booking.user,
      title: "Checked Out",
      message: `Thank you for staying with us! Hope to see you again.`,
      type: "booking",
      relatedBooking: booking._id,
    });

    res.status(200).json({
      success: true,
      message: "Guest checked out successfully",
      booking,
    });
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ GET ALL BOOKINGS (ADMIN/STAFF)
export const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};
    if (status && status !== "all") query.bookingStatus = status;

    const skip = (page - 1) * limit;
    const bookings = await Booking.find(query)
      .populate("user", "name email phone")
      .populate("room", "roomNumber roomType floor pricePerNight")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      bookings,
    });
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ GET BOOKING BY ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("room");
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ GET BOOKING STATS
export const getBookingStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todayCheckIns = await Booking.countDocuments({
      checkIn: { $gte: startOfDay, $lt: endOfDay },
      bookingStatus: "confirmed",
    });
    const todayCheckOuts = await Booking.countDocuments({
      checkOut: { $gte: startOfDay, $lt: endOfDay },
      bookingStatus: "checkedIn",
    });
    const activeBookings = await Booking.countDocuments({
      bookingStatus: { $in: ["confirmed", "checkedIn"] },
    });
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: "available" });
    const occupiedRooms = await Room.countDocuments({ status: "occupied" });

    res.status(200).json({
      success: true,
      todayCheckIns,
      todayCheckOuts,
      activeBookings,
      totalRooms,
      availableRooms,
      occupiedRooms,
    });
  } catch (error) {
    console.error("Get booking stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ SEARCH BOOKINGS
export const searchBookings = asyncHandler(async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ success: false, message: "Search query is required" });
  }

  // Find users matching name or phone
  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { phone: { $regex: query, $options: "i" } }
    ]
  }).select("_id");

  // Find rooms matching roomNumber
  const rooms = await Room.find({
    roomNumber: { $regex: query, $options: "i" }
  }).select("_id");

  // Search bookings
  const bookings = await Booking.find({
    $or: [
      { bookingId: { $regex: query, $options: "i" } },
      { user: { $in: users.map(u => u._id) } },
      { room: { $in: rooms.map(r => r._id) } }
    ]
  })
    .populate("user", "name email phone")
    .populate("room", "roomNumber roomType floor")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    bookings,  // ✅ Use 'bookings' key for consistency
  });
});

// ✅ UPDATE BOOKING STATUS (ADMIN/STAFF)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ["confirmed", "cancelled", "checkedIn", "checkedOut"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.bookingStatus = status;
    await booking.save();

    const room = await Room.findById(booking.room);
    if (room) {
      if (status === "cancelled") room.status = "available";
      else if (status === "checkedIn") room.status = "occupied";
      else if (status === "checkedOut") room.status = "available";
      await room.save();
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
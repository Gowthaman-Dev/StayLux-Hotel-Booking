import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// GET Dashboard Analytics
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // 1️⃣ Total revenue this month (sum of completed bookings)
  const revenueData = await Booking.aggregate([
    { $match: { paymentStatus: "paid", createdAt: { $gte: startOfMonth } } },
    { $group: { _id: null, totalRevenue: { $sum: "$priceBreakdown.totalAmount" } } },
  ]);
  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  // 2️⃣ Bookings today
  const bookingsToday = await Booking.countDocuments({
    createdAt: { $gte: startOfToday },
  });

  // 3️⃣ Total users
  const totalUsers = await User.countDocuments();

  // 4️⃣ Rooms count
  const totalRooms = await Room.countDocuments();

  // 5️⃣ Booking breakdown by status
  const bookingBreakdown = await Booking.aggregate([
    { $group: { _id: "$bookingStatus", count: { $sum: 1 } } },
  ]);

  // 6️⃣ Recent activities (last 10 notifications)
  const recentActivities = await Notification.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("user", "name email");

  res.status(200).json({
    success: true,
    data: {
      totalRevenue,
      bookingsToday,
      totalUsers,
      totalRooms,
      bookingBreakdown,
      recentActivities,
    },
  });
});
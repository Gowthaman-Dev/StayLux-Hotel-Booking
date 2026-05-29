import Payment from "../models/Payment.js";

// 💰 REVENUE REPORT
export const revenueReport = async (req, res) => {
  try {
    const { type = "daily" } = req.query;

    let groupFormat =
      type === "monthly"
        ? { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
        : { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };

    const report = await Payment.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: groupFormat,
          totalRevenue: { $sum: "$amount" },
          totalPayments: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


import Room from "../models/Room.js";

// 🛏️ OCCUPANCY REPORT
export const occupancyReport = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();

    const occupiedRooms = await Room.countDocuments({
      status: "occupied",  // lowercase
    });

    const availableRooms = await Room.countDocuments({
      status: "available",  // lowercase
    });

    const occupancyRate =
      totalRooms > 0
        ? ((occupiedRooms / totalRooms) * 100).toFixed(2)
        : 0;

    res.json({
      success: true,
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyRate,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


import Booking from "../models/Booking.js";

// 📅 BOOKING REPORT
export const bookingReport = async (req, res) => {
  try {
    const report = await Booking.aggregate([
      {
        $group: {
          _id: "$bookingStatus",
          total: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// ❌ CANCELLATION REPORT
export const cancellationReport = async (req, res) => {
  try {
    const report = await Booking.aggregate([
      {
       $match: { bookingStatus: "cancelled" }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          totalCancelled: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
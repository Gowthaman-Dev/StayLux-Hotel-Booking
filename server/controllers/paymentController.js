import Payment from "../models/Payment.js";
import { Parser } from "json2csv";

// ✅ GET ALL PAYMENTS
export const getAllPayments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const skip = (page - 1) * limit;

    const payments = await Payment.find(query)
      .populate("user", "name email")
      .populate("booking")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      payments,
    });
  } catch (error) {
    console.error("Get all payments error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ GET PAYMENT STATS
export const getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const paidPayments = await Payment.countDocuments({ status: "paid" });
    const pendingPayments = await Payment.countDocuments({ status: "pending" });

    const revenueData = await Payment.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      totalPayments,
      paidPayments,
      pendingPayments,
      totalRevenue,
    });
  } catch (error) {
    console.error("Get payment stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ EXPORT PAYMENTS TO CSV
export const exportPayments = async (req, res) => {
  try {
    console.log("📊 Exporting payments...");
    
    // Fetch all payments with user data
    const payments = await Payment.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${payments.length} payments`);

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payments found to export",
      });
    }

    // Format data for CSV
    const csvData = payments.map((p) => ({
      "Payment ID": p._id.toString(),
      "User Name": p.user?.name || "N/A",
      "User Email": p.user?.email || "N/A",
      "Amount (₹)": p.amount || 0,
      "Status": p.status || "pending",
      "Payment Method": p.paymentMethod || "N/A",
      "Transaction ID": p.transactionId || "N/A",
      "Date": p.createdAt ? new Date(p.createdAt).toLocaleString() : "N/A",
    }));

    // Create CSV parser
    const parser = new Parser({
      fields: [
        "Payment ID",
        "User Name",
        "User Email",
        "Amount (₹)",
        "Status",
        "Payment Method",
        "Transaction ID",
        "Date",
      ],
    });

    const csv = parser.parse(csvData);
    const filename = `payments_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.csv`;

    // Set response headers
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    
    console.log(`✅ Exporting ${csvData.length} payments to ${filename}`);
    return res.status(200).send(csv);
    
  } catch (error) {
    console.error("❌ Export payments error:", error);
    res.status(500).json({
      success: false,
      message: "Export failed",
      error: error.message,
    });
  }
};


export const testExport = async (req, res) => {
  console.log("Test endpoint hit!");
  res.json({ success: true, message: "Export endpoint is working" });
};
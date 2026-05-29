import express from "express";
import {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/adminController.js";

import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/role.js";
import { 
  exportPayments, 
  getAllPayments, 
  getPaymentStats, 
  testExport
} from "../controllers/paymentController.js";
import { 
  bookingReport, 
  cancellationReport, 
  occupancyReport, 
  revenueReport 
} from "../controllers/reportController.js";

const router = express.Router();

// ==================== USER ROUTES ====================
router.get("/users", protect, authorize("admin"), getAllUsers);
router.put("/users/:userId/toggle", protect, authorize("admin"), toggleUserStatus);
router.delete("/users/:userId", protect, authorize("admin"), deleteUser);

// ==================== STAFF ROUTES ====================
router.get("/staff", protect, authorize("admin"), getAllStaff);
router.post("/staff", protect, authorize("admin"), createStaff);
router.put("/staff/:staffId", protect, authorize("admin"), updateStaff);
router.delete("/staff/:staffId", protect, authorize("admin"), deleteStaff);

// ==================== PAYMENT ROUTES ====================
router.get("/payments", protect, authorize("admin"), getAllPayments);
router.get("/payments/stats", protect, authorize("admin"), getPaymentStats);
router.get("/payments/export", protect, authorize("admin"), exportPayments); // ✅ Must be before any /payments/:id

// ==================== REPORT ROUTES ====================
router.get("/reports/revenue", protect, authorize("admin"), revenueReport);
router.get("/reports/occupancy", protect, authorize("admin"), occupancyReport);
router.get("/reports/bookings", protect, authorize("admin"), bookingReport);
router.get("/reports/cancellations", protect, authorize("admin"), cancellationReport);
router.get("/payments/test", protect, authorize("admin"), testExport);

export default router;
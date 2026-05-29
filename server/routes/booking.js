import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  cancelBooking,
  checkInGuest,
  checkOutGuest,
  createBooking,
  getAllBookings,
  getMyBookings,
  processPayment,
  getBookingById,
  getBookingStats,
  searchBookings,
} from "../controllers/bookingController.js";
import { authorize } from "../middlewares/role.js";

const router = express.Router();

// Specific routes before dynamic :id
router.get("/search", protect, authorize("staff", "admin"), searchBookings);
router.get("/stats", protect, authorize("staff", "admin"), getBookingStats);
router.get("/all", protect, authorize("staff", "admin"), getAllBookings);
router.get("/my", protect, getMyBookings);

// Action routes
router.put("/:id/checkin", protect, authorize("staff", "admin"), checkInGuest);
router.put("/:id/checkout", protect, authorize("staff", "admin"), checkOutGuest);
router.put("/:id/cancel", protect, cancelBooking);
router.put("/:id/pay", protect, processPayment);

// Dynamic ID route LAST
router.get("/:id", protect, getBookingById);
router.post("/", protect, createBooking);

export default router;
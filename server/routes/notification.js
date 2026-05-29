import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../controllers/notificationController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get notifications
router.get("/", getNotifications);

// Mark single notification as read
router.put("/:id/read", markAsRead);

// Mark all notifications as read
router.put("/read-all", markAllAsRead);

export default router;
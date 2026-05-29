import express from "express";
import { getDashboardAnalytics } from "../controllers/dashboardController.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/role.js";

const router = express.Router();

// GET dashboard analytics (admin only)
router.get("/", protect, authorize("admin"), getDashboardAnalytics);

export default router;
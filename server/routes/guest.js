import express from "express";
import { getCurrentGuests } from "../controllers/guestController.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/role.js";

const router = express.Router();

// GET current guests (staff/admin)
router.get("/current", protect, authorize("staff", "admin"), getCurrentGuests);

export default router;
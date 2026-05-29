import express from "express";
import {  getSettings, updateSettings } from "../controllers/settingController.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/role.js";

const router = express.Router();

// GET settings (any logged-in user can view)
router.get("/",  getSettings);

// UPDATE settings (admin only)
router.put("/", protect, authorize("admin"), updateSettings);


export default router;
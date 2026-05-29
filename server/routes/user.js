import express from "express";
import { protect } from "../middlewares/auth.js";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { uploadProfile } from "../middlewares/uploadProfile.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, uploadProfile.single("profilePicture"), updateProfile);

export default router;
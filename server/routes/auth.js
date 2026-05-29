import express from "express";
import { changePassword, forgotPassword, loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/role.js";

const router = express.Router();

// ✅ Register Route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});
router.post("/create-room", protect, authorize("admin", "staff"), (req, res) => {
    res.send("Room created");
});

router.post("/forgot-password", forgotPassword);
router.put("/change-password", protect, changePassword);


export default router;
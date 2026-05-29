import express from "express";
import { createRoom, deleteRoom, getAllRooms, getFloorWiseRoomStatus, getRoomById, getRoomByNumber, updateRoom } from "../controllers/roomController.js";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/role.js";
import upload from "../middlewares/upload.js"; 


const router = express.Router();

// ✅ Get all rooms

router.get("/", getAllRooms);

// ✅ By ID
router.get("/id/:id", getRoomById);

// ✅ By Room Number
router.get("/number/:roomNumber", getRoomByNumber);

// ✅ Create Room (only staff/admin)
router.post(
    "/",
    protect,
    authorize("staff", "admin"),
    upload.array("images", 5), // 👈 ADD THIS
    createRoom
);

// ✅ Update Room
router.put("/:id", protect, authorize("staff", "admin"), updateRoom);

// ✅ Delete Room
router.delete("/:id", protect, authorize("staff", "admin"), deleteRoom);

// Floor-wise room status (staff/admin)
router.get("/floor-status", protect, authorize("staff", "admin"), getFloorWiseRoomStatus);



export default router;
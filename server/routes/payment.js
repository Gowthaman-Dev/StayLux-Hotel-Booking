import express from "express";
import { protect } from "../middlewares/auth.js";
import { authorize } from "../middlewares/role.js";
import { 
  exportPayments, 
  getAllPayments, 
  getPaymentStats 
} from "../controllers/paymentController.js";

const router = express.Router();

// All payment routes require admin authentication
router.use(protect);
router.use(authorize("admin"));

router.get("/", getAllPayments);
router.get("/stats", getPaymentStats);
router.get("/export", exportPayments);

export default router;
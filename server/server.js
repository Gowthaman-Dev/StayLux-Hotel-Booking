import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectdb from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import roomRoutes from "./routes/room.js";
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";
import dashboardRoutes from "./routes/dashboard.js";
import guestRoutes from "./routes/guest.js";
import notificationRoutes from "./routes/notification.js";
import settingRoutes from "./routes/setting.js";
import paymentRoutes from "./routes/payment.js";

// Middlewares
import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
connectdb();

const app = express();

// __dirname fix (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =======================
// JSON Middleware
// =======================
app.use(express.json());

// =======================
// CORS CONFIG (FIXED)
// =======================
const allowedOrigins = [
  "http://localhost:5173",
  "https://stay-lux-hotel-booking-nine.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow mobile apps / postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// =======================
// Logger
// =======================
app.use(logger);

// =======================
// Test Route
// =======================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// =======================
// API Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/payments", paymentRoutes);

// =======================
// Static Files
// =======================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// 404 Handler
// =======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// =======================
// Error Handler
// =======================
app.use(errorHandler);

// =======================
// Server Start
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
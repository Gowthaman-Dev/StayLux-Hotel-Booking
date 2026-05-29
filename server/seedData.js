import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectdb from "./config/db.js";
import User from "./models/User.js";
import Room from "./models/Room.js";

dotenv.config();
connectdb();

const seedData = async () => {
  try {
    // 🔥 Clear old data
    await User.deleteMany();
    await Room.deleteMany();

    // 🔐 Hash password
    const password = await bcrypt.hash("123456", 10);

    // 👑 Admin
    const admin = await User.create({
      name: "Admin",
      email: "admin@hotel.com",
      phone: "9999999999",
      password,
      role: "admin",
    });

    // 👨‍💼 Staff
    const staff1 = await User.create({
      name: "Staff One",
      email: "staff1@hotel.com",
      phone: "8888888881",
      password,
      role: "staff",
    });

    const staff2 = await User.create({
      name: "Staff Two",
      email: "staff2@hotel.com",
      phone: "8888888882",
      password,
      role: "staff",
    });

    // 🛏️ Rooms (10 rooms, 3 floors)
    const rooms = [];

    for (let i = 1; i <= 10; i++) {
      rooms.push({
        roomNumber: `10${i}`,
        roomType: ["single", "double", "deluxe"][i % 3],
        floor: i <= 3 ? 1 : i <= 6 ? 2 : 3,
        maxGuests: 2,
        pricePerNight: 1000 + i * 200,
        amenities: ["wifi", "ac"],
        status: "available",
      });
    }

    await Room.insertMany(rooms);

    console.log("✅ Seed Data Inserted Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
};

seedData();
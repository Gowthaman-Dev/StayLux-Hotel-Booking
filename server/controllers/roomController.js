import Room from "../models/Room.js";
import fs from "fs";
import path from "path";
import Booking from "../models/Booking.js";
import asyncHandler from "../middlewares/asyncHandler.js";



// ✅ GET ALL ROOMS
export const getAllRooms = async (req, res) => {
  try {
    const { roomType, status, priceMin, priceMax, search, sort, page = 1, limit = 5, checkIn, checkOut, guests } = req.query;

    let filter = {};
    if (roomType) filter.roomType = roomType;
    if (status) filter.status = status;
    if (priceMin || priceMax) {
      filter.pricePerNight = {};
      if (priceMin) filter.pricePerNight.$gte = Number(priceMin);
      if (priceMax) filter.pricePerNight.$lte = Number(priceMax);
    }
    if (search) {
      filter.$or = [
        { roomNumber: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // If dates are provided, filter rooms that are available in that period
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      // Find rooms that are NOT booked for overlapping dates
      const bookedRooms = await Booking.find({
        $or: [
          { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
          { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
          { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkOutDate } }
        ],
        bookingStatus: { $in: ["confirmed", "checkedIn"] }
      }).distinct("room");
      filter._id = { $nin: bookedRooms };
      // Also ensure room can accommodate guests
      if (guests) {
        filter.maxGuests = { $gte: Number(guests) };
      }
    }

    let sortOption = {};
    if (sort === "price_asc") sortOption.pricePerNight = 1;
    if (sort === "price_desc") sortOption.pricePerNight = -1;
    if (sort === "newest") sortOption.createdAt = -1;

    const skip = (page - 1) * limit;
    const rooms = await Room.find(filter).sort(sortOption).skip(skip).limit(Number(limit));
    const total = await Room.countDocuments(filter);

    res.status(200).json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};




// ✅ GET ROOM BY ID
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


// ✅ GET ROOM BY NUMBER
export const getRoomByNumber = async (req, res) => {
  try {
    const room = await Room.findOne({
      roomNumber: req.params.roomNumber,
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};




// ✅ CREATE ROOM (ADMIN / STAFF)
export const createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      roomType,
      floor,
      bedType,
      maxGuests,
      pricePerNight,
      amenities,
      description,
    } = req.body;

    // ✅ Parse amenities if it's a string
    let parsedAmenities = amenities;
    if (typeof amenities === 'string') {
      try {
        parsedAmenities = JSON.parse(amenities);
      } catch (e) {
        parsedAmenities = [];
      }
    }

    // ✅ Validate required fields
    if (!roomNumber || !roomType || !floor || !maxGuests || !pricePerNight) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: roomNumber, roomType, floor, maxGuests, pricePerNight",
      });
    }

    // ✅ Check duplicate room number
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: "Room already exists",
      });
    }

    // ✅ Handle images
    const images = req.files ? req.files.map(file => file.filename) : [];

    // ✅ Create room
    const room = await Room.create({
      roomNumber,
      roomType,
      floor: Number(floor),
      bedType: bedType || "single",
      maxGuests: Number(maxGuests),
      pricePerNight: Number(pricePerNight),
      amenities: parsedAmenities,
      description: description || "",
      images: images,
      status: "available",
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};




// ✅ UPDATE ROOM
export const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};




// ✅ DELETE ROOM
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // 🧹 Delete images from uploads folder
    if (room.images && room.images.length > 0) {
      room.images.forEach((img) => {
        const filePath = path.join("uploads", img);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // delete file
        }
      });
    }

    // 🗑️ Delete room from DB
    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: "Room and images deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};







// GET /api/rooms/floor-status
export const getFloorWiseRoomStatus = asyncHandler(async (req, res) => {
  // 1️⃣ Get all rooms
  const rooms = await Room.find().lean(); // lean() returns plain JS objects

  // 2️⃣ For each room, check if currently occupied
  const today = new Date();

  const roomStatusWithGuest = await Promise.all(
    rooms.map(async (room) => {
      let status = room.status; // default room status from Room model
      let currentGuest = null;

      if (status === "occupied") {  // lowercase
  const booking = await Booking.findOne({
    room: room._id,
    bookingStatus: "checkedIn",  // lowercase
    checkIn: { $lte: today },
    checkOut: { $gte: today },
  })
          .populate("user", "name email phone")
          .lean();

        if (booking) {
          currentGuest = booking.user;
        }
      }

      return {
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        status,
        currentGuest,
        floor: room.floor,
      };
    })
  );

  // 3️⃣ Group by floor
  const floorMap = {};
  roomStatusWithGuest.forEach((r) => {
    if (!floorMap[r.floor]) floorMap[r.floor] = [];
    floorMap[r.floor].push(r);
  });

  res.status(200).json({
    success: true,
    data: floorMap,
  });
});
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },

    roomType: {
      type: String,
      required: true,
      enum: ["single", "double", "deluxe", "suite"],
    },

    floor: {
      type: Number,
      required: true,
    },

    bedType: {
      type: String,
      enum: ["single", "double", "queen", "king"],
      default: "double",
    },

    maxGuests: {
      type: Number,
      required: true,
      default: 2,
    },

    pricePerNight: {
      type: Number,
      required: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["available", "booked", "occupied", "maintenance", "reserved"], // ✅ Added "reserved"
      default: "available",
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
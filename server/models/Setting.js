import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: true,
      default: "My Hotel",
    },

    gstRate: {
      type: Number,
      default: 18, // %
    },

    serviceCharge: {
      type: Number,
      default: 10, // %
    },

    checkInTime: {
      type: String,
      default: "12:00 PM",
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    refundPolicy: {
      type: String,
      default:
        "Free cancellation before 48 hours. 50% refund before 24 hours.",
    },

    // ✅ NEW FIELDS (Frontend match)
    currency: {
      type: String,
      default: "₹",
    },

    timeZone: {
      type: String,
      default: "Asia/Kolkata",
    },

    maxBookingDays: {
      type: Number,
      default: 30,
    },

    autoConfirmBooking: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ⭐ Ensure SINGLE document (Singleton)
settingSchema.statics.getSettings = async function () {
  let settings = await this.findOne();

  if (!settings) {
    settings = await this.create({});
  }

  return settings;
};

// ⭐ Optional: Update helper (BEST PRACTICE)
settingSchema.statics.updateSettings = async function (data) {
  let settings = await this.findOne();

  if (!settings) {
    settings = await this.create(data);
  } else {
    Object.assign(settings, data);
    await settings.save();
  }

  return settings;
};

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
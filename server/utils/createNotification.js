import Notification from "../models/Notification.js";

export const createNotification = async ({
  user,
  title,
  message,
  type = "system",
  relatedBooking = null,
}) => {
  try {
    await Notification.create({
      user,
      title,
      message,
      type,
      relatedBooking,
    });
  } catch (error) {
    console.log("Notification Error:", error.message);
  }
};
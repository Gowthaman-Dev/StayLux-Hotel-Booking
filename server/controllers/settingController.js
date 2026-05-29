import Setting from "../models/Setting.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// 🔹 GET settings
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await Setting.getSettings(); // ✅ use model method

  res.status(200).json({
    success: true,
    data: settings,
  });
});

// 🔹 UPDATE settings
export const updateSettings = asyncHandler(async (req, res) => {
  const updateData = req.body;

  // ✅ use model helper (clean & reusable)
  const settings = await Setting.updateSettings(updateData);

  res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    data: settings,
  });
});
// server/controllers/userController.js
import User from "../models/User.js";
import path from "path";
import fs from "fs";

// GET PROFILE (unchanged)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE PROFILE – with optional picture upload
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, state, pincode, dateOfBirth, bio } = req.body;
    const updateData = { name, phone, address, city, state, pincode, dateOfBirth, bio };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // Handle profile picture if uploaded
    if (req.file) {
      // Delete old picture if exists
      const oldUser = await User.findById(req.user._id);
      if (oldUser.profilePicture) {
        const oldPath = path.join("uploads/profile", oldUser.profilePicture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.profilePicture = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true }).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
// ✅ services/userService.js
import api from "../../api/axios.js";  // ✅ FIXED

export const getProfile = () => api.get("/users/profile");

export const updateProfile = (data) =>
  api.put("/users/profile", data);
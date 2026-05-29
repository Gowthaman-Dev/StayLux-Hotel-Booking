import api from "../../api/axios";  // ✅ Fixed path

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const changePassword = (data) =>
  api.put("/auth/change-password", data);
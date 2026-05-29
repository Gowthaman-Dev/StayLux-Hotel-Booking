import api from "../../api/axios";  // ✅ Fixed path

// Users
export const getAllUsers = (params) =>
  api.get("/admin/users", { params });

export const toggleUserStatus = (userId) =>
  api.put(`/admin/users/${userId}/toggle`);

export const deleteUser = (userId) =>
  api.delete(`/admin/users/${userId}`);

// Staff
export const getAllStaff = (params) =>
  api.get("/admin/staff", { params });

export const createStaff = (data) =>
  api.post("/admin/staff", data);

export const updateStaff = (staffId, data) =>
  api.put(`/admin/staff/${staffId}`, data);

export const deleteStaff = (staffId) =>
  api.delete(`/admin/staff/${staffId}`);
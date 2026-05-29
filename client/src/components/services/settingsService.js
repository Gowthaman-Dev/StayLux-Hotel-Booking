import api from "../../api/axios";  // ✅ Fixed path

export const getSettings = () => api.get("/settings");

export const updateSettings = (data) =>
  api.put("/settings", data);
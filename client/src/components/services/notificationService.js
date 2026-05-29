// ✅ services/notificationService.js
import api from "../../api/axios.js";  // ✅ FIXED

export const getNotifications = () =>
  api.get("/notifications");

export const markAsRead = (id) =>
  api.put(`/notifications/${id}/read`);

export const markAllAsRead = () =>
  api.put("/notifications/read-all");
// ✅ services/dashboardService.js
import api from "../../api/axios.js";  // ✅ FIXED

export const getDashboardData = () =>
  api.get("/dashboard");
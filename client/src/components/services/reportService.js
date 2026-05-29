import api from "../../api/axios";  // ✅ Fixed path

export const getRevenueReport = (type = "daily") =>
  api.get(`/admin/reports/revenue?type=${type}`);

export const getOccupancyReport = () =>
  api.get("/admin/reports/occupancy");

export const getBookingReport = () =>
  api.get("/admin/reports/bookings");

export const getCancellationReport = () =>
  api.get("/admin/reports/cancellations");
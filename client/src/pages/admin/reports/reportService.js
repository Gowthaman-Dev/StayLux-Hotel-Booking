import axios from "axios";

export const getRevenueReport = () => axios.get("/api/admin/reports/revenue");
export const getOccupancyReport = () => axios.get("/api/admin/reports/occupancy");
export const getBookingReport = () => axios.get("/api/admin/reports/bookings");
export const getCancellationReport = () => axios.get("/api/admin/reports/cancellations");
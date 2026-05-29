import api from "../../api/axios";

export const getAllBookings = (params) =>
  api.get("/bookings/all", { params });

export const getBookingById = (id) =>
  api.get(`/bookings/${id}`);

export const checkInBooking = (id) =>
  api.put(`/bookings/${id}/checkin`);

export const checkOutBooking = (id) =>
  api.put(`/bookings/${id}/checkout`);

export const cancelBooking = (id) =>
  api.put(`/bookings/${id}/cancel`);

export const payBooking = (id, data = {}) =>
  api.put(`/bookings/${id}/pay`, data);

export const getBookingStats = () =>
  api.get("/bookings/stats");

export const searchBookings = (query) =>
  api.get(`/bookings/search?query=${query}`);

export const getMyBookings = (status = "") =>
  api.get(`/bookings/my${status ? `?status=${status}` : ""}`);

export const getBookingsByRoom = (roomId) =>
  api.get(`/bookings/room/${roomId}`);

// ✅ Remove or comment out updateBookingStatus - use direct API calls instead
// export const updateBookingStatus = (id, status) =>
//   api.put(`/bookings/${id}/status`, { status }); 
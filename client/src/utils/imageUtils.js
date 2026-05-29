// utils/imageUtils.js
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
  return `${baseUrl}/uploads/rooms/${imagePath}`;
};
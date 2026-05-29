import axios from "axios";

// 🔹 GET
export const getSettings = () => axios.get("/settings");

// 🔹 UPDATE
export const updateSettings = (data) => axios.put("/settings", data);
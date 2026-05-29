import api from "../../api/axios";

export const getPayments = (params) =>
  api.get("/admin/payments", { params });

export const getPaymentStats = () =>
  api.get("/admin/payments/stats");

export const exportPaymentsCSV = async () => {
  try {
    // Try both possible endpoints
    let response;
    try {
      response = await api.get("/admin/payments/export", {
        responseType: "blob",
      });
    } catch (err) {
      // If first fails, try alternative endpoint
      console.log("Trying alternative endpoint...");
      response = await api.get("/payments/export", {
        responseType: "blob",
      });
    }
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const filename = `payments_${new Date().toISOString().slice(0, 19)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return response;
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};
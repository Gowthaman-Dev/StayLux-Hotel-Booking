import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../../components/services/settingsService";
import { showSuccess, showError } from "../../../utils/toast";
import Spinner from "../../../components/common/Spinner";
import { FaSave, FaBuilding, FaPercentage, FaMoneyBillWave, FaGlobe, FaCalendarAlt, FaEnvelope, FaFileAlt, FaToggleOn, FaToggleOff } from "react-icons/fa";

const Settings = () => {
  const [settings, setSettings] = useState({
    hotelName: "",
    gstRate: 18,
    serviceCharge: 10,
    checkInTime: "12:00 PM",
    emailNotifications: true,
    refundPolicy: "",
    currency: "₹",
    timeZone: "Asia/Kolkata",
    maxBookingDays: 30,
    autoConfirmBooking: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        const data = res.data.data || res.data;
        setSettings({
          hotelName: data.hotelName || "",
          gstRate: data.gstRate || 18,
          serviceCharge: data.serviceCharge || 10,
          checkInTime: data.checkInTime || "12:00 PM",
          emailNotifications: data.emailNotifications ?? true,
          refundPolicy: data.refundPolicy || "",
          currency: data.currency || "₹",
          timeZone: data.timeZone || "Asia/Kolkata",
          maxBookingDays: data.maxBookingDays || 30,
          autoConfirmBooking: data.autoConfirmBooking ?? false,
        });
      } catch (err) {
        showError("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(settings);
      showSuccess("Settings saved successfully");
    } catch (err) {
      showError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner fullScreen text="Loading settings..." />;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hotel Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your hotel preferences and policies</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hotel Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaBuilding className="text-gray-400" /> Hotel Name
              </label>
              <input
                type="text"
                name="hotelName"
                value={settings.hotelName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition"
                placeholder="My Hotel"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaMoneyBillWave className="text-gray-400" /> Currency
              </label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none bg-white"
              >
                <option value="₹">₹ Indian Rupee (INR)</option>
                <option value="$">$ US Dollar (USD)</option>
                <option value="€">€ Euro (EUR)</option>
                <option value="£">£ British Pound (GBP)</option>
              </select>
            </div>

            {/* GST Rate */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaPercentage className="text-gray-400" /> GST Rate (%)
              </label>
              <input
                type="number"
                name="gstRate"
                value={settings.gstRate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
              />
            </div>

            {/* Service Charge */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaPercentage className="text-gray-400" /> Service Charge (%)
              </label>
              <input
                type="number"
                name="serviceCharge"
                value={settings.serviceCharge}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
              />
            </div>

            {/* Check-In Time */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaCalendarAlt className="text-gray-400" /> Check-In Time
              </label>
              <input
                type="text"
                name="checkInTime"
                value={settings.checkInTime}
                onChange={handleChange}
                placeholder="12:00 PM"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Format: HH:MM AM/PM</p>
            </div>

            {/* Max Booking Days */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaCalendarAlt className="text-gray-400" /> Max Booking Days (advance)
              </label>
              <input
                type="number"
                name="maxBookingDays"
                value={settings.maxBookingDays}
                onChange={handleChange}
                min="1"
                max="365"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none"
              />
            </div>

            {/* Time Zone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaGlobe className="text-gray-400" /> Time Zone
              </label>
              <select
                name="timeZone"
                value={settings.timeZone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none bg-white"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
              </select>
            </div>

            {/* Email Notifications (Toggle) */}
            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                  className="focus:outline-none"
                >
                  {settings.emailNotifications ? (
                    <FaToggleOn className="text-2xl text-gray-900" />
                  ) : (
                    <FaToggleOff className="text-2xl text-gray-400" />
                  )}
                </button>
              </label>
            </div>

            {/* Auto Confirm Booking (Toggle) */}
            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Auto Confirm Booking</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, autoConfirmBooking: !prev.autoConfirmBooking }))}
                  className="focus:outline-none"
                >
                  {settings.autoConfirmBooking ? (
                    <FaToggleOn className="text-2xl text-gray-900" />
                  ) : (
                    <FaToggleOff className="text-2xl text-gray-400" />
                  )}
                </button>
              </label>
            </div>

            {/* Refund Policy (Full width) */}
            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaFileAlt className="text-gray-400" /> Refund Policy
              </label>
              <textarea
                name="refundPolicy"
                value={settings.refundPolicy}
                onChange={handleChange}
                rows="4"
                placeholder="Enter your cancellation and refund policy..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none resize-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              <FaSave size={14} />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Settings;
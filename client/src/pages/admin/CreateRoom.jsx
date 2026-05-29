import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AmenitiesSelector from "../../components/admin/AmenitiesSelector";
import api from "../../api/axios";
import { showError, showSuccess } from "../../utils/toast";
import { FaUpload, FaTimes, FaArrowLeft } from "react-icons/fa";

const CreateRoom = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "single",
    floor: "",
    bedType: "single",
    maxGuests: "",
    pricePerNight: "",
    description: "",
  });

  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      showError("Max 5 images allowed");
      return;
    }

    setImages(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPreview(previewUrls);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreview = preview.filter((_, i) => i !== index);
    setImages(newImages);
    setPreview(newPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.roomNumber) return showError("Room number is required");
    if (!form.floor) return showError("Floor number is required");
    if (!form.maxGuests) return showError("Max guests is required");
    if (!form.pricePerNight) return showError("Price per night is required");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("roomNumber", form.roomNumber);
      formData.append("roomType", form.roomType);
      formData.append("floor", form.floor);
      formData.append("bedType", form.bedType);
      formData.append("maxGuests", form.maxGuests);
      formData.append("pricePerNight", form.pricePerNight);
      formData.append("description", form.description || "");
      formData.append("amenities", JSON.stringify(amenities));

      images.forEach((img) => {
        formData.append("images", img);
      });

      await api.post("/rooms", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showSuccess("Room created successfully!");
      navigate("/admin/rooms");
    } catch (err) {
      if (err.response?.data?.message === "Room already exists") {
        showError("Room number already exists. Please use a different number.");
      } else {
        showError(err.response?.data?.message || "Failed to create room");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/rooms")}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <FaArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create New Room</h1>
          <p className="text-gray-500 text-sm mt-1">Add a new room to your hotel inventory</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Two-column grid for basic fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Room Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="roomNumber"
                placeholder="e.g., 101, 202, 305"
                value={form.roomNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition"
                required
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type <span className="text-red-500">*</span>
              </label>
              <select
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none bg-white"
                required
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
              </select>
            </div>

            {/* Floor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor Number <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="floor"
                placeholder="e.g., 1, 2, 3"
                value={form.floor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
                required
              />
            </div>

            {/* Bed Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bed Type</label>
              <select
                name="bedType"
                value={form.bedType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none bg-white"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="queen">Queen</option>
                <option value="king">King</option>
              </select>
            </div>

            {/* Max Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Guests <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxGuests"
                placeholder="e.g., 2, 3, 4"
                value={form.maxGuests}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
                required
              />
            </div>

            {/* Price Per Night */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Per Night (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="pricePerNight"
                placeholder="e.g., 1500"
                value={form.pricePerNight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Room description, facilities, view, etc."
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none resize-none"
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <AmenitiesSelector selected={amenities} setSelected={setAmenities} />
          </div>

          {/* Images Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Images <span className="text-gray-400 text-xs">(Max 5, JPG/PNG)</span>
            </label>
            <div className="flex flex-wrap gap-3 items-center">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition">
                <FaUpload size={14} />
                <span>Choose files</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {images.length} file(s) selected
              </span>
            </div>
          </div>

          {/* Image Preview */}
          {preview.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="flex flex-wrap gap-3">
                {preview.map((src, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/admin/rooms")}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Room"
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CreateRoom;
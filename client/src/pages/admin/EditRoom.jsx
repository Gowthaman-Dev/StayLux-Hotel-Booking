import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AmenitiesSelector from "../../components/admin/AmenitiesSelector";
import api from "../../api/axios";
import { showError, showSuccess } from "../../utils/toast";
import Spinner from "../../components/common/Spinner";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    roomNumber: "",
    roomType: "",
    floor: "",
    bedType: "",
    maxGuests: "",
    pricePerNight: "",
    description: "",
  });

  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch room details
  const fetchRoom = async () => {
    try {
      setLoading(true);
      // ✅ CORRECT: Don't add /api again, baseURL already has it
      const res = await api.get(`/rooms/id/${id}`);
      
      console.log("Room data:", res.data);
      
      const room = res.data.room;

      setForm({
        roomNumber: room.roomNumber || "",
        roomType: room.roomType || "",
        floor: room.floor || "",
        bedType: room.bedType || "",
        maxGuests: room.maxGuests || "",
        pricePerNight: room.pricePerNight || "",
        description: room.description || "",
      });

      setAmenities(room.amenities || []);
      setExistingImages(room.images || []);

    } catch (err) {
      console.error("Fetch room error:", err);
      showError(err.response?.data?.message || "Failed to load room");
      navigate("/admin/rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRoom();
    }
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      formData.append("amenities", JSON.stringify(amenities));

      // Append new images
      images.forEach((img) => {
        formData.append("images", img);
      });

      // ✅ CORRECT: Use proper API path
      await api.put(`/rooms/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      showSuccess("Room updated successfully");
      navigate("/admin/rooms");

    } catch (err) {
      console.error("Update room error:", err);
      showError(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
    return `${baseUrl}/uploads/rooms/${imagePath}`;
  };

  if (loading) {
    return <Spinner fullScreen text="Loading room details..." />;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Edit Room</h2>

      <form onSubmit={handleSubmit}>
        {/* Room Number */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Room Number
          </label>
          <input
            type="text"
            name="roomNumber"
            value={form.roomNumber}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            required
          />
        </div>

        {/* Room Type */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Room Type
          </label>
          <select
            name="roomType"
            value={form.roomType}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            required
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        {/* Floor */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Floor
          </label>
          <input
            type="number"
            name="floor"
            value={form.floor}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            required
          />
        </div>

        {/* Bed Type */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Bed Type
          </label>
          <select
            name="bedType"
            value={form.bedType}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="queen">Queen</option>
            <option value="king">King</option>
          </select>
        </div>

        {/* Max Guests */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Max Guests
          </label>
          <input
            type="number"
            name="maxGuests"
            value={form.maxGuests}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            required
          />
        </div>

        {/* Price Per Night */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Price Per Night (₹)
          </label>
          <input
            type="number"
            name="pricePerNight"
            value={form.pricePerNight}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
            required
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>

        {/* Amenities */}
        <AmenitiesSelector selected={amenities} setSelected={setAmenities} />

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              Current Images
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  alt={`Room ${i + 1}`}
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px", border: "1px solid #ccc" }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80?text=No+Image";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* New Images Upload */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Upload New Images (will replace existing)
          </label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleImageChange}
            style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          <small style={{ color: "#666" }}>Upload up to 5 images (JPG, PNG)</small>
        </div>

        {/* New Images Preview */}
        {preview.length > 0 && (
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
              New Images Preview:
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {preview.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Preview ${i + 1}`}
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px", border: "1px solid #ccc" }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            type="button"
            onClick={() => navigate("/admin/rooms")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? "Updating..." : "Update Room"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoom;
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import StarRating from "../../components/common/StarRating";
import { showSuccess, showError } from "../../utils/toast";

const WriteReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    overallRating: 0,
    cleanlinessRating: 0,
    serviceRating: 0,
    amenitiesRating: 0,
    valueRating: 0,
    reviewText: "",
  });

  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.overallRating === 0) {
      return showError("Please provide an overall rating");
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("bookingId", bookingId);
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      images.forEach(img => formData.append("images", img));

      await axios.post("/reviews", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      showSuccess("Review submitted!");
      navigate("/my-bookings");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Write Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { key: "overallRating", label: "Overall" },
          { key: "cleanlinessRating", label: "Cleanliness" },
          { key: "serviceRating", label: "Service" },
          { key: "amenitiesRating", label: "Amenities" },
          { key: "valueRating", label: "Value" },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block font-medium mb-1">{label}</label>
            <StarRating
              value={form[key]}
              onChange={(val) => setForm({ ...form, [key]: val })}
            />
          </div>
        ))}
        <div>
          <label className="block font-medium mb-1">Review</label>
          <textarea
            value={form.reviewText}
            onChange={(e) => setForm({ ...form, reviewText: e.target.value })}
            rows={4}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Images (max 5)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default WriteReview; 
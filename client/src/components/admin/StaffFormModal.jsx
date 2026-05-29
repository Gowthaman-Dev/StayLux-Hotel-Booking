import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { showSuccess, showError } from "../../utils/toast";
import { FaTimes } from "react-icons/fa";

const StaffFormModal = ({ open, onClose, editData, refresh }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        email: editData.email || "",
        phone: editData.phone || "",
        password: "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });
    }
  }, [editData]);

  if (!open) return null;

  const validate = () => {
    if (!form.name || !form.email || !form.phone) {
      showError("Name, email and phone are required");
      return false;
    }
    if (!editData && !form.password) {
      showError("Password is required for new staff");
      return false;
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(form.email)) {
      showError("Invalid email format");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) {
      showError("Phone must be 10 digits");
      return false;
    }
    if (form.password && form.password.length < 6) {
      showError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      if (editData) {
        await axios.put(`/admin/staff/${editData._id}`, {
          name: form.name,
          phone: form.phone,
          ...(form.password && { password: form.password }),
        });
        showSuccess("Staff updated successfully");
      } else {
        await axios.post("/admin/staff", {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
        showSuccess("Staff created successfully");
      }
      refresh();
      onClose();
    } catch (err) {
      showError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-fadeIn">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? "Edit Staff" : "Add New Staff"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-1">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" disabled={!!editData} required />
            {editData && <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{editData ? "New Password (optional)" : "Password *"}</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editData ? "Leave blank to keep current" : "Min 6 characters"} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" required={!editData} />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50">{loading ? "Saving..." : editData ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default StaffFormModal;
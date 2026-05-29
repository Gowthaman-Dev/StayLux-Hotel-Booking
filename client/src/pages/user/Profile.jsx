import React, { useEffect, useState, useRef } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError } from "../../utils/toast";
import Spinner from "../../components/common/Spinner";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCity, FaFlag, FaCode, FaCalendarAlt, FaInfoCircle, FaCamera, FaSave, FaLock } from "react-icons/fa";

const Profile = () => {
  const { user, refetchUser } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    dateOfBirth: "",
    bio: "",
    profilePicture: "",
  });
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/users/profile");
        const u = res.data.user;
        setForm({
          name: u.name || "",
          phone: u.phone || "",
          address: u.address || "",
          city: u.city || "",
          state: u.state || "",
          pincode: u.pincode || "",
          dateOfBirth: u.dateOfBirth ? u.dateOfBirth.slice(0, 10) : "",
          bio: u.bio || "",
          profilePicture: u.profilePicture || "",
        });
        if (u.profilePicture) {
          const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
          setProfilePreview(`${baseUrl}/uploads/profile/${u.profilePicture}`);
        }
      } catch {
        showError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== "profilePicture" && form[key]) formData.append(key, form[key]);
      });
      if (profileFile) formData.append("profilePicture", profileFile);
      await axios.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      showSuccess("Profile updated");
      refetchUser();
      // Refresh preview
      if (profileFile) {
        const url = URL.createObjectURL(profileFile);
        setProfilePreview(url);
      }
    } catch (err) {
      showError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) return showError("Passwords don't match");
    if (passwords.newPassword.length < 6) return showError("Password must be at least 6 characters");
    try {
      setChangingPassword(true);
      await axios.put("/auth/change-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      });
      showSuccess("Password changed");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
    } catch (err) {
      showError(err.response?.data?.message || "Password change failed");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleProfilePicClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      const preview = URL.createObjectURL(file);
      setProfilePreview(preview);
    }
  };

  if (loading) return <Spinner fullScreen text="Loading profile..." />;

  const imageUrl = profilePreview || (form.profilePicture ? `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000"}/uploads/profile/${form.profilePicture}` : null);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and password</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Card - Avatar & basic info */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="relative inline-block">
              <div
                onClick={handleProfilePicClick}
                className="w-28 h-28 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 cursor-pointer overflow-hidden hover:opacity-80 transition"
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  form.name?.charAt(0)?.toUpperCase() || "U"
                )}
              </div>
              <button
                onClick={handleProfilePicClick}
                className="absolute bottom-0 right-0 bg-gray-900 text-white p-1.5 rounded-full shadow-md hover:bg-gray-800 transition"
                title="Change photo"
              >
                <FaCamera size={14} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mt-4">{form.name || user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.role}</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <FaEnvelope className="text-gray-400" /> {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Right Card - Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-3">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaUser className="text-gray-500" /> Personal Information
              </h2>
            </div>
            <form onSubmit={handleProfileUpdate} className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea rows="2" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none resize-none" placeholder="Tell us about yourself..." />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
                  <FaSave size={14} /> {saving ? "Saving..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 px-5 py-3 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><FaLock className="text-gray-500" /> Security</h2>
              <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="text-sm text-gray-500 hover:text-gray-700 transition">
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>
            </div>
            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="p-5 space-y-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label><input type="password" value={passwords.oldPassword} onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">New Password</label><input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label><input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-400 outline-none" required /></div>
                <div className="flex justify-end"><button type="submit" disabled={changingPassword} className="px-5 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50">{changingPassword ? "Changing..." : "Change Password"}</button></div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Profile;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import WelcomeOverlay from "../../components/common/WelcomeOverlay";

const Register = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [adminCode, setAdminCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({});
  const [showWelcome, setShowWelcome] = useState(false);
  const [registeredName, setRegisteredName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFocus = (field) => setFocused({ ...focused, [field]: true });
  const handleBlur = (field) => setFocused({ ...focused, [field]: false });

  const validate = () => {
    const { name, email, phone, password, confirmPassword, role } = formData;
    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("All fields are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone must be 10 digits");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (role === "admin" || role === "staff") {
      if (!adminCode) {
        toast.error(`${role === "admin" ? "Admin" : "Staff"} registration code required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // 1. Register
      await axios.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        adminCode,
      });

      // 2. Auto‑login
      const loginRes = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      const { token, user } = loginRes.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 3. Force navbar update without refresh
      refreshAuth();

      // 4. Show welcome overlay
      setRegisteredName(formData.name);
      setShowWelcome(true);
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "User already exists");
      } else if (error.response?.status === 403) {
        toast.error(error.response.data.message || "Invalid registration code");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    toast.success(`Welcome ${registeredName}!`);
    navigate("/");
  };

  return (
    <>
      {showWelcome && <WelcomeOverlay onComplete={handleWelcomeComplete} />}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-300 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background blobs (same as before) */}
        <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>

        <div className="flex flex-col md:flex-row max-w-6xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-white/20 relative z-10">
          {/* Left Side - Image */}
          <div className="w-full md:w-2/5 relative group overflow-hidden rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="Elegant hotel receptionist"
              className="w-full h-80 md:h-full object-cover object-[center_25%] transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/30 md:to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 transform transition-all duration-500 group-hover:translate-y-[-8px]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-amber-400 rounded-full"></div>
                <span className="text-xs font-semibold tracking-wider uppercase">Warm Welcome</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold drop-shadow-lg">Welcome to Luxury Stay</h3>
              <p className="text-xs md:text-sm text-gray-200">Experience comfort, care, and premium hospitality from the moment you arrive.</p>
            </div>
            <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500/80 to-amber-600/80 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg border border-white/30">✨ Welcome</div>
          </div>

          {/* Right Side - Form (unchanged – same design) */}
          <div className="w-full md:w-3/5 p-6 md:p-8 lg:p-10 overflow-y-auto bg-white/95 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-2xl shadow-lg mb-3 transform transition-transform hover:scale-105 duration-300">🌟</div>
              <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Create Account</h2>
              <p className="text-gray-500 mt-2">Start your journey with us today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="relative group">
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${focused.name || formData.name ? "text-xs -top-2 bg-white px-1 text-amber-600" : "text-gray-500 top-3 text-base group-hover:text-amber-500"}`}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} onFocus={() => handleFocus("name")} onBlur={() => handleBlur("name")} className="w-full px-4 pt-5 pb-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 bg-white/80 group-hover:bg-white group-hover:shadow-md group-hover:border-amber-300" required />
              </div>
              {/* Email */}
              <div className="relative group">
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${focused.email || formData.email ? "text-xs -top-2 bg-white px-1 text-amber-600" : "text-gray-500 top-3 text-base group-hover:text-amber-500"}`}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} onFocus={() => handleFocus("email")} onBlur={() => handleBlur("email")} className="w-full px-4 pt-5 pb-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 bg-white/80 group-hover:bg-white group-hover:shadow-md group-hover:border-amber-300" required />
              </div>
              {/* Phone */}
              <div className="relative group">
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${focused.phone || formData.phone ? "text-xs -top-2 bg-white px-1 text-amber-600" : "text-gray-500 top-3 text-base group-hover:text-amber-500"}`}>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onFocus={() => handleFocus("phone")} onBlur={() => handleBlur("phone")} className="w-full px-4 pt-5 pb-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 bg-white/80 group-hover:bg-white group-hover:shadow-md group-hover:border-amber-300" required />
              </div>
              {/* Role */}
              <div className="relative group">
                <label className="block text-sm font-semibold text-gray-700 mb-1 transition-all duration-200 group-hover:text-amber-600">Register As</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 bg-white/80 group-hover:bg-white group-hover:shadow-md group-hover:border-amber-300 cursor-pointer">
                  <option value="user">👤 User (Book Rooms)</option>
                  <option value="staff">👨‍💼 Staff (Manage Bookings)</option>
                  <option value="admin">👑 Admin (Full Access)</option>
                </select>
              </div>
              {/* Admin/Staff Code */}
              {(formData.role === "staff" || formData.role === "admin") && (
                <div className="relative group animate-in fade-in duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-1 transition-all duration-200 group-hover:text-amber-600">{formData.role === "admin" ? "Admin Registration Code" : "Staff Registration Code"}</label>
                  <input type="password" placeholder={formData.role === "admin" ? "Enter admin code" : "Enter staff code"} value={adminCode} onChange={(e) => setAdminCode(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 bg-white/80 group-hover:bg-white group-hover:shadow-md group-hover:border-amber-300" required />
                  <small className="text-xs text-gray-500 mt-1 block">{formData.role === "admin" ? "Admin Code: ADMIN123" : "Staff Code: STAFF123"}</small>
                </div>
              )}
              {/* Password */}
              <div className="relative group">
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${focused.password || formData.password ? "text-xs -top-2 bg-white px-1 text-amber-600" : "text-gray-500 top-3 text-base group-hover:text-amber-500"}`}>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} onFocus={() => handleFocus("password")} onBlur={() => handleBlur("password")} className="w-full px-4 pt-5 pb-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 bg-white/80 group-hover:bg-white group-hover:shadow-md group-hover:border-amber-300" required />
              </div>
              {/* Confirm Password */}
              <div className="relative group">
                <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${focused.confirmPassword || formData.confirmPassword ? "text-xs -top-2 bg-white px-1 text-amber-600" : "text-gray-500 top-3 text-base group-hover:text-amber-500"}`}>Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} onFocus={() => handleFocus("confirmPassword")} onBlur={() => handleBlur("confirmPassword")} className="w-full px-4 pt-5 pb-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 bg-white/80 group-hover:bg-white group-hover:shadow-md group-hover:border-amber-300" required />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg relative overflow-hidden group">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    "Create Account →"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">Already have an account? <Link to="/login" className="text-amber-600 hover:text-amber-800 font-semibold hover:underline transition-all duration-200 inline-flex items-center gap-1">Login here <span>→</span></Link></p>
            </div>

            <div className="mt-8 p-5 bg-gradient-to-r from-gray-50/90 to-gray-100/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide"><span className="text-amber-500 text-lg">🏆</span> Demo Credentials</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2 p-1 rounded-lg hover:bg-white/70 transition-all duration-200 hover:translate-x-1"><span className="text-blue-600 font-bold">👑</span> <span><strong>Admin:</strong> admin@hotel.com / 123456 <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono text-amber-800">ADMIN123</code></span></li>
                <li className="flex items-start gap-2 p-1 rounded-lg hover:bg-white/70 transition-all duration-200 hover:translate-x-1"><span className="text-green-600 font-bold">👨‍💼</span> <span><strong>Staff:</strong> staff@hotel.com / 123456 <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono text-amber-800">STAFF123</code></span></li>
                <li className="flex items-start gap-2 p-1 rounded-lg hover:bg-white/70 transition-all duration-200 hover:translate-x-1"><span className="text-purple-600 font-bold">👤</span> <span><strong>User:</strong> user@hotel.com / 123456 <span className="bg-gray-200 px-1.5 py-0.5 rounded text-xs font-mono">No code</span></span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
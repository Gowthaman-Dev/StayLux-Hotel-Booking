import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "staff") {
        navigate("/staff/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const validate = () => {
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("All fields are required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await login(formData, navigate);
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-200 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>

      <div className="flex flex-col md:flex-row max-w-6xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-white/20 relative z-10">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-3/5 p-6 md:p-8 lg:p-10 overflow-y-auto bg-white/95 backdrop-blur-sm order-2 md:order-1">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-2xl shadow-lg mb-3 transform transition-transform hover:scale-105 duration-300">
              🔐
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Login to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative group">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focused.email || formData.email
                    ? "text-xs -top-2 bg-white px-1 text-amber-600"
                    : "text-gray-500 top-3 text-base group-hover:text-amber-500"
                }`}
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                className="w-full px-4 pt-5 pb-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 bg-white/80 group-hover:bg-white group-hover:shadow-md group-hover:border-amber-300"
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <label
                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                  focused.password || formData.password
                    ? "text-xs -top-2 bg-white px-1 text-amber-600"
                    : "text-gray-500 top-3 text-base group-hover:text-amber-500"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
                className="w-full px-4 pt-5 pb-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 bg-white/80 group-hover:bg-white group-hover:shadow-md group-hover:border-amber-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login →"
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-amber-600 hover:text-amber-800 font-semibold hover:underline transition-all duration-200 inline-flex items-center gap-1">
                Register here <span>→</span>
              </Link>
            </p>
            <p className="mt-2">
              <Link to="/forgot-password" className="text-gray-500 hover:text-amber-600 text-sm transition-colors">
                Forgot Password?
              </Link>
            </p>
          </div>

          {/* Demo Accounts Box */}
          <div className="mt-8 p-5 bg-gradient-to-r from-gray-50/90 to-gray-100/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
              <span className="text-amber-500 text-lg">🔐</span> Demo Accounts
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2 p-1 rounded-lg hover:bg-white/70 transition-all duration-200 hover:translate-x-1">
                <span className="text-blue-600 font-bold">👑</span>
                <span><strong>Admin:</strong> admin@hotel.com / 123456</span>
              </li>
              <li className="flex items-start gap-2 p-1 rounded-lg hover:bg-white/70 transition-all duration-200 hover:translate-x-1">
                <span className="text-green-600 font-bold">👨‍💼</span>
                <span><strong>Staff:</strong> staff@hotel.com / 123456</span>
              </li>
              <li className="flex items-start gap-2 p-1 rounded-lg hover:bg-white/70 transition-all duration-200 hover:translate-x-1">
                <span className="text-purple-600 font-bold">👤</span>
                <span><strong>User:</strong> user@hotel.com / 123456</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-2/5 relative group overflow-hidden rounded-2xl order-1 md:order-2">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            alt="Luxury hotel bedroom"
            className="w-full h-80 md:h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:bg-gradient-to-l md:from-black/70 md:via-black/30 md:to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 transform transition-all duration-500 group-hover:translate-y-[-8px]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-amber-400 rounded-full"></div>
              <span className="text-xs font-semibold tracking-wider uppercase">Secure Login</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold drop-shadow-lg">Access Your Dashboard</h3>
            <p className="text-xs md:text-sm text-gray-200">
              Manage bookings, view reservations, and enjoy exclusive perks.
            </p>
          </div>
          <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500/80 to-amber-600/80 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg border border-white/30">
            🔑 Secure Access
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../api/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email");
      setSuccess(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-200 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs (same as Login) */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>

      <div className="flex flex-col md:flex-row max-w-6xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-white/20 relative z-10">
        
        {/* Left Side - Forgot Password Form (60% width) */}
        <div className="w-full md:w-3/5 p-6 md:p-8 lg:p-10 overflow-y-auto bg-white/95 backdrop-blur-sm order-2 md:order-1">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-2xl shadow-lg mb-3 transform transition-transform hover:scale-105 duration-300">
              🔑
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Forgot Password?</h2>
            <p className="text-gray-500 mt-2">Enter your email to reset your password</p>
          </div>

          {success ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 rounded-xl p-5">
                <div className="text-5xl mb-3">📧</div>
                <h3 className="text-lg font-semibold text-green-700">Check Your Email</h3>
                <p className="text-gray-600 text-sm mt-2">
                  We've sent a password reset link to <br />
                  <span className="font-medium text-gray-800">{email}</span>
                </p>
                <p className="text-xs text-gray-400 mt-3 bg-white/50 inline-block px-3 py-1 rounded-full">
                  Demo mode — real email would be sent in production
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg"
              >
                Back to Login →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="relative group">
                <label
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    focused.email || email
                      ? "text-xs -top-2 bg-white px-1 text-amber-600"
                      : "text-gray-500 top-3 text-base group-hover:text-amber-500"
                  }`}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link →"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-gray-500 hover:text-amber-600 text-sm transition-colors inline-flex items-center gap-1">
              ← Back to Login
            </Link>
          </div>

          {/* Demo info box (same style as Login) */}
          <div className="mt-8 p-5 bg-gradient-to-r from-gray-50/90 to-gray-100/90 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
              <span className="text-amber-500 text-lg">🔐</span> Demo Credentials
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2 p-1 rounded-lg hover:bg-white/70 transition-all duration-200 hover:translate-x-1">
                <span className="text-blue-600 font-bold">👑</span>
                <span><strong>Admin:</strong> admin@hotel.com</span>
              </li>
              <li className="flex items-start gap-2 p-1 rounded-lg hover:bg-white/70 transition-all duration-200 hover:translate-x-1">
                <span className="text-green-600 font-bold">👨‍💼</span>
                <span><strong>Staff:</strong> staff@hotel.com</span>
              </li>
              <li className="flex items-start gap-2 p-1 rounded-lg hover:bg-white/70 transition-all duration-200 hover:translate-x-1">
                <span className="text-purple-600 font-bold">👤</span>
                <span><strong>User:</strong> user@hotel.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side - Image (40% width, email/reset themed) */}
        <div className="w-full md:w-2/5 relative group overflow-hidden rounded-2xl order-1 md:order-2">
          <img
            src="https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
            alt="Password reset illustration - email and key"
            className="w-full h-80 md:h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:bg-gradient-to-l md:from-black/70 md:via-black/30 md:to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 transform transition-all duration-500 group-hover:translate-y-[-8px]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-amber-400 rounded-full"></div>
              <span className="text-xs font-semibold tracking-wider uppercase">Reset Password</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold drop-shadow-lg">Recover Your Account</h3>
            <p className="text-xs md:text-sm text-gray-200">
              Enter your email and we'll send you a secure link to reset your password.
            </p>
          </div>
          <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500/80 to-amber-600/80 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg border border-white/30">
            🔐 Secure Reset
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
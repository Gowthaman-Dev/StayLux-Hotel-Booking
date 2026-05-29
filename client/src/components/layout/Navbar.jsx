import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBell, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth(); // ✅ use isAuthenticated

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && menuOpen) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Fetch notifications only when authenticated
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      const notifs = res.data.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.isRead).length);
    } catch (err) {
      console.log("Notification fetch error");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleNotificationClick = async (n) => {
    try {
      await axios.put(`/notifications/${n._id}/read`);
      setNotifications((prev) => prev.map((item) => (item._id === n._id ? { ...item, isRead: true } : item)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (n.relatedBooking) navigate(`/bookings/${n.relatedBooking}`);
      setNotifOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropdownOpen(false);
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  // ✅ Conditional rendering based on authentication
  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="relative">
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110 inline-block">🏨</span>
                <span className="absolute -top-1 -right-2 w-2 h-2 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  StayLux
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 -mt-0.5">Hotels & Resorts</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/" label="Home" isActive={isActive("/")} />
              <NavLink to="/rooms" label="Rooms" isActive={isActive("/rooms")} />
              {isAuthenticated && user?.role === "user" && (
                <NavLink to="/my-bookings" label="My Bookings" isActive={isActive("/my-bookings")} />
              )}
              {user?.role === "admin" && (
                <NavLink to="/admin/dashboard" label="Admin Panel" isActive={isActive("/admin/dashboard")} />
              )}
              {user?.role === "staff" && (
                <NavLink to="/staff/dashboard" label="Staff Panel" isActive={isActive("/staff/dashboard")} />
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* Notification Bell */}
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => setNotifOpen(!notifOpen)}
                      className="relative p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
                    >
                      <FaBell className="text-gray-700 text-xl transition-transform duration-200 hover:scale-105" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                    {notifOpen && (
                      <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-dropdown">
                        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">Notifications</p>
                          {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="text-xs text-gray-500 hover:text-gray-900">
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                          ) : (
                            notifications.slice(0, 10).map((n) => (
                              <div
                                key={n._id}
                                onClick={() => handleNotificationClick(n)}
                                className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                                  n.isRead ? "bg-white" : "bg-gray-50"
                                }`}
                              >
                                <p className="font-medium text-sm text-gray-900">{n.title}</p>
                                <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                              </div>
                            ))
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <div className="text-center py-2 border-t border-gray-100 bg-gray-50">
                            <Link to="/notifications" className="text-sm text-gray-600 hover:text-gray-900" onClick={() => setNotifOpen(false)}>
                              View All
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span className="hidden sm:inline text-sm font-medium text-gray-700">
                        {user?.name?.split(" ")[0]}
                      </span>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-dropdown">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <DropdownLink to="/profile" label="Profile" onClick={() => setDropdownOpen(false)} />
                          {user?.role === "user" && (
                            <DropdownLink to="/my-bookings" label="My Bookings" onClick={() => setDropdownOpen(false)} />
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-800 transition-all">
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
              >
                {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1">
            <MobileNavLink to="/" label="Home" isActive={isActive("/")} onClick={() => setMenuOpen(false)} />
            <MobileNavLink to="/rooms" label="Rooms" isActive={isActive("/rooms")} onClick={() => setMenuOpen(false)} />
            {isAuthenticated && user?.role === "user" && (
              <MobileNavLink to="/my-bookings" label="My Bookings" isActive={isActive("/my-bookings")} onClick={() => setMenuOpen(false)} />
            )}
            {user?.role === "admin" && (
              <MobileNavLink to="/admin/dashboard" label="Admin Panel" isActive={isActive("/admin/dashboard")} onClick={() => setMenuOpen(false)} />
            )}
            {user?.role === "staff" && (
              <MobileNavLink to="/staff/dashboard" label="Staff Panel" isActive={isActive("/staff/dashboard")} onClick={() => setMenuOpen(false)} />
            )}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-gray-100 mt-2">
                <MobileNavLink to="/login" label="Login" onClick={() => setMenuOpen(false)} />
                <MobileNavLink to="/register" label="Register" onClick={() => setMenuOpen(false)} />
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="h-16"></div>

      <style>{`
        @keyframes dropdown {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-dropdown { animation: dropdown 0.15s ease-out forwards; }
      `}</style>
    </>
  );
};

// Helper Components (same as before)
const NavLink = ({ to, label, isActive }) => (
  <Link
    to={to}
    className={`relative text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
    }`}
  >
    {label}
    <span
      className={`absolute bottom-[-2px] left-0 w-full h-0.5 bg-gray-900 transition-transform duration-200 origin-left ${
        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  </Link>
);

const DropdownLink = ({ to, label, onClick }) => (
  <Link to={to} onClick={onClick} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, isActive, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"
    }`}
  >
    {label}
  </Link>
);

export default Navbar;
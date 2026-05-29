import React, { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarX,
  Users,
  BookOpen,
  Search,
  Hotel,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
} from "lucide-react";

const StaffLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
    { name: "Today's Check-ins", path: "/staff/checkins", icon: CalendarCheck },
    { name: "Today's Check-outs", path: "/staff/checkouts", icon: CalendarX },
    { name: "Current Guests", path: "/staff/guests", icon: Users },
    { name: "All Bookings", path: "/staff/bookings", icon: BookOpen },
    { name: "Search Bookings", path: "/staff/search", icon: Search },
    { name: "Room Status", path: "/staff/rooms", icon: Hotel },
  ];

  const toggleCollapse = () => setCollapsed(!collapsed);
  const handleLinkClick = () => {
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 h-full bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out flex flex-col shadow-xl
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
          {!collapsed && (
            <Link to="/staff/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">🏨</span>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Staff Panel
              </span>
            </Link>
          )}
          {collapsed && (
            <Link to="/staff/dashboard" className="mx-auto">
              <span className="text-2xl">🏨</span>
            </Link>
          )}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-600 hover:text-gray-900"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  } ${collapsed ? "justify-center" : ""}`
                }
                title={collapsed ? item.name : ""}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-gray-100 p-4 space-y-3">
          <Link
            to="/"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition group ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Back to Home" : ""}
          >
            <Home size={20} />
            {!collapsed && <span className="text-sm">Back to Home</span>}
          </Link>

          {/* Profile & Logout */}
          <div className={`pt-2 ${collapsed ? "text-center" : ""}`}>
            {!collapsed && (
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || "Staff User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || "staff@example.com"}</p>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="flex justify-center mb-3">
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition group ${
                collapsed ? "justify-center" : ""
              }`}
              title={collapsed ? "Logout" : ""}
            >
              <LogOut size={20} />
              {!collapsed && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              <Menu size={22} />
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "Staff"}</p>
                  <p className="text-xs text-gray-500">Staff</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold shadow-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || "S"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
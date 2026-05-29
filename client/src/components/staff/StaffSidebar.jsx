import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaUsers,
  FaBed,
  FaSearch,
  FaHotel,
} from "react-icons/fa";

const StaffSidebar = () => {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded ${
      isActive ? "bg-blue-600 text-white" : "hover:bg-gray-100"
    }`;

  return (
    <div className="w-64 h-screen bg-white border-r p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-6">Staff Panel</h2>

      {/* Home link */}
      <Link
        to="/"
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        🏠 Back to Home
      </Link>

      <nav className="flex flex-col gap-2 flex-1">
        <NavLink to="/staff/dashboard" className={linkClass}>
          <FaTachometerAlt /> Dashboard
        </NavLink>

        <NavLink to="/staff/checkins" className={linkClass}>
          <FaSignInAlt /> Today's Check-ins
        </NavLink>

        <NavLink to="/staff/checkouts" className={linkClass}>
          <FaSignOutAlt /> Today's Check-outs
        </NavLink>

        <NavLink to="/staff/guests" className={linkClass}>
          <FaUsers /> Current Guests
        </NavLink>

        <NavLink to="/staff/bookings" className={linkClass}>
          <FaBed /> All Bookings
        </NavLink>

        <NavLink to="/staff/search" className={linkClass}>
          <FaSearch /> Search Bookings
        </NavLink>

        <NavLink to="/staff/rooms" className={linkClass}>
          <FaHotel /> Room Status
        </NavLink>
      </nav>
    </div>
  );
};

export default StaffSidebar;
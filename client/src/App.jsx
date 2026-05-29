import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/protected/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import PageLoader from "./components/loaders/PageLoader";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";
import StaffLayout from "./layouts/StaffLayout";

// Public
import Home from "./pages/public/Home";
import Rooms from "./pages/public/Rooms";
import RoomDetails from "./pages/user/RoomDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Unauthorized from "./pages/public/Unauthorized";
import NotFound from "./pages/NotFound";

// User
import Profile from "./pages/user/Profile";
import MyBookings from "./pages/user/MyBookings";
import BookingDetail from "./pages/user/BookingDetail";
import BookingForm from "./pages/user/BookingForm";
import PaymentPage from "./pages/user/PaymentPage";
import Notifications from "./pages/user/Notifications";

// Staff
import StaffDashboard from "./pages/staff/Dashboard";
import StaffBookings from "./pages/staff/Bookings";
import TodayCheckIns from "./pages/staff/TodayCheckIns";
import TodayCheckOuts from "./pages/staff/TodayCheckOuts";
import CurrentGuests from "./pages/staff/CurrentGuests";
import SearchBookings from "./pages/staff/SearchBookings";
import RoomStatus from "./pages/staff/RoomStatus";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminStaff from "./pages/admin/StaffList";
import AdminBookings from "./pages/admin/BookingsList";
import AdminPayments from "./pages/admin/PaymentsList";
import AdminSettings from "./pages/admin/Settings";
import AdminGuests from "./pages/admin/Guests";
import RoomsList from "./pages/admin/RoomsList";
import CreateRoom from "./pages/admin/CreateRoom";
import EditRoom from "./pages/admin/EditRoom";
import ReportsDashboard from "./pages/admin/reports/ReportsDashboard";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <Routes>
        {/* PUBLIC ROUTES - No Navbar/Footer wrapper for login/register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* PUBLIC ROUTES with Layout */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="rooms/:id" element={<RoomDetails />} />
        </Route>

        {/* USER ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "staff"]}>
              <PublicLayout />
            </ProtectedRoute>
          }
        >
          <Route path="profile" element={<Profile />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="booking/:roomId" element={<BookingForm />} />
          <Route path="payment/:id" element={<PaymentPage />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        {/* STAFF ROUTES */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="bookings" element={<StaffBookings />} />
          <Route path="checkins" element={<TodayCheckIns />} />
          <Route path="checkouts" element={<TodayCheckOuts />} />
          <Route path="guests" element={<CurrentGuests />} />
          <Route path="search" element={<SearchBookings />} />
          <Route path="rooms" element={<RoomStatus />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="rooms" element={<RoomsList />} />
          <Route path="rooms/create" element={<CreateRoom />} />
          <Route path="rooms/edit/:id" element={<EditRoom />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="guests" element={<AdminGuests />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reports" element={<ReportsDashboard />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
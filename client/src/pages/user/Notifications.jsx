// pages/user/Notifications.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import NotificationItem from "../../components/common/NotificationItem";
import { showError } from "../../utils/toast";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/notifications");
        setNotifications(res.data.data || []);
      } catch {
        showError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleClick = async (n) => {
    try {
      if (!n.isRead) {
        await axios.put(`/notifications/${n._id}/read`);
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === n._id
              ? { ...item, isRead: true }
              : item
          )
        );
      }

      if (n.relatedBooking) {
        navigate(`/bookings/${n.relatedBooking}`);
      }
    } catch {
      console.log("Error");
    }
  };

  if (loading) return <Spinner fullScreen />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Notifications
      </h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem
              key={n._id}
              notification={n}
              onClick={handleClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
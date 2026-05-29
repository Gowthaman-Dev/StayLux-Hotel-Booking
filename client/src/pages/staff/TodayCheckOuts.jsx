import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import ConfirmModal from "../../components/common/ConfirmModal";
import { showSuccess, showError } from "../../utils/toast";

const TodayCheckOuts = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchCheckOuts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings/all?status=checkedIn");
      
      const allBookings = res.data.bookings || [];
      const today = new Date().toDateString();

      const filtered = allBookings.filter((b) => {
        const checkOutDate = new Date(b.checkOut);
        return checkOutDate.toDateString() === today;
      });

      setBookings(filtered);
    } catch (err) {
      console.error("Fetch check-outs error:", err);
      showError(err.response?.data?.message || "Failed to load check-outs");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckOuts();
  }, []);

  const handleCheckOut = async () => {
    try {
      await api.put(`/bookings/${selectedBooking._id}/checkout`);
      showSuccess("Checked-out successfully");
      setOpenModal(false);
      setSelectedBooking(null);
      fetchCheckOuts();
    } catch (err) {
      console.error("Check-out error:", err);
      showError(err.response?.data?.message || "Check-out failed");
    }
  };

  if (loading) return <Spinner fullScreen text="Loading check-outs..." />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Today's Check-Outs</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No check-outs scheduled for today</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Guest Name</th>
                <th className="border p-3 text-left">Room No</th>
                <th className="border p-3 text-left">Phone</th>
                <th className="border p-3 text-left">Check-out Date</th>
                <th className="border p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="border p-3">{b.user?.name || "N/A"}</td>
                  <td className="border p-3">{b.room?.roomNumber || "N/A"}</td>
                  <td className="border p-3">{b.user?.phone || "N/A"}</td>
                  <td className="border p-3">{new Date(b.checkOut).toLocaleDateString()}</td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        setOpenModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    >
                      Check-Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleCheckOut}
        title="Confirm Check-Out"
        message={`Are you sure you want to check-out ${selectedBooking?.user?.name}?`}
      />
    </div>
  );
};

export default TodayCheckOuts;
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Spinner from "../../components/common/Spinner";
import GuestTable from "../../components/staff/GuestTable";
import { showError } from "../../utils/toast";

const CurrentGuests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH CURRENT GUESTS
  const fetchGuests = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/guests/current");
      setGuests(res.data.data || []);
    } catch (err) {
      showError("Failed to load guests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  if (loading) return <Spinner fullScreen text="Loading guests..." />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Current Guests</h1>

      {guests.length === 0 ? (
        <p className="text-gray-500">No active guests</p>
      ) : (
        <GuestTable guests={guests} />
      )}
    </div>
  );
};

export default CurrentGuests;
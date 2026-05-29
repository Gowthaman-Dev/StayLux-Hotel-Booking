import React from "react";

const RoomFilters = ({ filters, setFilters }) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      <input
        placeholder="Room Type"
        value={filters.roomType}
        onChange={(e) =>
          setFilters({ ...filters, roomType: e.target.value })
        }
      />

      // ✅ FIX:
      <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
        <option value="">All Status</option>
        <option value="available">Available</option>
        <option value="reserved">Reserved</option>
        <option value="occupied">Occupied</option>
        <option value="maintenance">Maintenance</option>
      </select>
    </div>
  );
};

export default RoomFilters;
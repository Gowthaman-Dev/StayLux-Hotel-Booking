import React from "react";

const AMENITIES_LIST = [
  "wifi",
  "ac",
  "tv",
  "geyser",
  "parking",
  "breakfast",
  "pool",
  "gym",
  "room_service",
  "laundry",
  "balcony",
  "mini_bar"
];

// Helper to get readable label
const getLabel = (amenity) => {
  return amenity
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AmenitiesSelector = ({ selected, setSelected }) => {
  const handleChange = (amenity) => {
    if (selected.includes(amenity)) {
      setSelected(selected.filter((a) => a !== amenity));
    } else {
      setSelected([...selected, amenity]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {AMENITIES_LIST.map((item) => (
          <label
            key={item}
            className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
              selected.includes(item)
                ? "border-gray-700 bg-gray-50 text-gray-900"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleChange(item)}
              className="w-4 h-4 rounded border-gray-300 text-gray-700 focus:ring-gray-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm capitalize">{getLabel(item)}</span>
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="text-xs text-gray-500 pt-1">
          {selected.length} amenit{selected.length === 1 ? 'y' : 'ies'} selected
        </div>
      )}
    </div>
  );
};

export default AmenitiesSelector;
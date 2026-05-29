import React from "react";

const RecentActivity = ({ notifications }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">
        Recent Activity
      </h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No activity</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className="border-b pb-2"
            >
              <p className="font-medium">
                {n.user?.name}
              </p>

              <p className="text-gray-600 text-sm">
                {n.message}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
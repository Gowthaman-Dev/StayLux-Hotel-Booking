import React from "react";

const PaymentTable = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-2 opacity-50">💰</div>
        <p>No payments found</p>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Method</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {payments.map((payment) => (
            <tr key={payment._id} className="group hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-mono text-gray-500">{payment._id?.slice(-8)}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{payment.user?.name || "—"}</td>
              <td className="px-4 py-3 text-gray-600">{payment.user?.email || "—"}</td>
              <td className="px-4 py-3 font-semibold text-gray-900">₹{payment.amount || 0}</td>
              <td className="px-4 py-3 capitalize text-gray-600">{payment.paymentMethod || "—"}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === "paid"
                      ? "bg-green-50 text-green-700"
                      : payment.status === "pending"
                      ? "bg-yellow-50 text-yellow-700"
                      : payment.status === "failed"
                      ? "bg-red-50 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      payment.status === "paid"
                        ? "bg-green-500"
                        : payment.status === "pending"
                        ? "bg-yellow-500"
                        : payment.status === "failed"
                        ? "bg-red-500"
                        : "bg-gray-500"
                    }`}
                  ></span>
                  {payment.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-sm">{formatDate(payment.createdAt)}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-500">{payment.transactionId || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
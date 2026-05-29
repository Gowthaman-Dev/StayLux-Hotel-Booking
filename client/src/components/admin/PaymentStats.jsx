import React from "react";
import { FaMoneyBillWave, FaCreditCard, FaRupeeSign, FaChartLine } from "react-icons/fa";

const PaymentStats = ({ stats }) => {
  // If stats not passed as prop, fallback to default (your existing API will populate)
  const data = stats || {
    totalPayments: 0,
    paidPayments: 0,
    pendingPayments: 0,
    totalRevenue: 0,
  };

  const cards = [
    { title: "Total Payments", value: data.totalPayments, icon: <FaMoneyBillWave /> },
    { title: "Paid Payments", value: data.paidPayments, icon: <FaCreditCard /> },
    { title: "Pending Payments", value: data.pendingPayments, icon: <FaRupeeSign /> },
    { title: "Total Revenue", value: `₹${data.totalRevenue}`, icon: <FaChartLine /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 hover:shadow-md transition-all duration-200"
        >
          <div className="p-3 rounded-full bg-gray-100 text-gray-600">
            {card.icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentStats;
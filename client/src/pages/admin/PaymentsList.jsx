import React, { useEffect, useState } from "react";
import PaymentTable from "../../components/admin/PaymentTable";
import PaymentFilters from "../../components/admin/PaymentFilters";
import Pagination from "../../components/common/Pagination";
import { getPayments } from "../../components/services/paymentService";
import PaymentStats from "../../components/admin/PaymentStats";
import { showError } from "../../utils/toast";
import Spinner from "../../components/common/Spinner";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });
  const [pages, setPages] = useState(1);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getPayments(filters);
      setPayments(res.data.payments || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("Fetch payments error:", err);
      showError(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-500 text-sm mt-1">Track and manage all financial transactions</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <PaymentStats />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <PaymentFilters filters={filters} setFilters={(newFilters) => setFilters({ ...newFilters, page: 1 })} />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner text="Loading payments..." />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <PaymentTable payments={payments} />
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Pagination page={filters.page} pages={pages} onPageChange={(newPage) => setFilters((prev) => ({ ...prev, page: newPage }))} />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PaymentsList;
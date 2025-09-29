import { useEffect, useState } from "react";
import axios from "axios";
import { DollarLineIcon, GroupIcon } from "../../icons";
import { FileIcon } from "../../icons";
import { Clock, Wallet } from "lucide-react";

export default function RegistrationMetrics() {
  const [participantsCount, setParticipantsCount] = useState(0);
  const [registrationsCount, setRegistrationsCount] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [pendingPayment, setPendingPayment] = useState(0);
  const [paidPayment, setPaidPayment] = useState(0);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const participantsRes = await axios.get(`${API_BASE_URL}/participants`);
        setParticipantsCount(participantsRes.data.totalCount || 0);

        const registrationsRes = await axios.get(
          `${API_BASE_URL}/registrations`
        );
        setRegistrationsCount(registrationsRes.data.count || 0);

        const discountRes = await axios.get(`${API_BASE_URL}/referral-codes`);
        setDiscountTotal(
          discountRes.data.summary?.grandTotalMonetaryUsage || 0
        );

        const pendingPayRes = await axios.get(`${API_BASE_URL}/programs`);
        setPendingPayment(pendingPayRes.data.summary.pendingRegistrations || 0);

        const paidPayRes = await axios.get(`${API_BASE_URL}/programs`);
        setPaidPayment(paidPayRes.data.summary.paidRegistrations || 0);

        const revenueRes = await axios.get(`${API_BASE_URL}/programs`);
        setRevenueTotal(revenueRes.data.summary.totalRevenue || 0);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* Participants Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Participants
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : participantsCount.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* Registrations Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FileIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Registrations
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : registrationsCount.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* Discount Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Referral Used
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              Rp. {loading ? "..." : discountTotal.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* Discount Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Wallet className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Paid Registrations
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : paidPayment.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* Discount Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <Clock className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pending Registrations
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {loading ? "..." : pendingPayment.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* Total Revenue Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Revenue
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              Rp. {loading ? "..." : revenueTotal.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

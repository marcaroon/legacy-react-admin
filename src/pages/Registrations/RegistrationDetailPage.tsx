import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
  AlertCircle,
  FileText,
  CreditCard,
  Building2,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  ArrowLeft,
} from "lucide-react";

interface Participant {
  name: string;
  email: string;
  phone: string;
  city?: string;
  referralCode?: string | null;
  discountAmount?: number;
}

interface Registration {
  registrationId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  program_title: string;
  duration: string;
  program_price: number;
  discount_total: number;
  grand_total: number;
  paymentStatus: string;
  paymentMethod?: string;
  paymentType?: string | null;
  bankTransferProof?: string | null;
  bankTransferVerified?: boolean;
  midtransOrderId?: string | null;
  midtransTransactionId?: string | null;
  createdAt: string;
  paidAt?: string | null;
  participants: Participant[];
  totalParticipants: number;
}

export default function RegistrationDetailPage() {
  const { registrationId } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchRegistrationDetail();
  }, [registrationId]);

  const fetchRegistrationDetail = () => {
    if (registrationId) {
      axios
        .get(`${API_BASE_URL}/registration/${registrationId}`)
        .then((res) => {
          setRegistration(res.data.data);
        })
        .catch((err) => {
          console.error("Failed to fetch registration detail", err);
          alert("Failed to load registration details");
        })
        .finally(() => setLoading(false));
    }
  };

  const handleVerifyPayment = async (verified: boolean) => {
    if (!registration) return;

    const confirmMessage = verified
      ? "Apakah Anda yakin ingin MENYETUJUI pembayaran ini? Email konfirmasi akan dikirim ke peserta."
      : "Apakah Anda yakin ingin MENOLAK pembayaran ini?";

    if (!confirm(confirmMessage)) return;

    setVerifying(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/registration/${registrationId}/verify-transfer`,
        { verified }
      );

      if (response.data.success) {
        alert(
          verified
            ? "Pembayaran berhasil diverifikasi! Email konfirmasi telah dikirim."
            : "Pembayaran ditolak."
        );
        fetchRegistrationDetail();
      } else {
        throw new Error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Gagal memverifikasi pembayaran. Silakan coba lagi.");
    } finally {
      setVerifying(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/registration/${registrationId}/invoice`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `INVOICE-${registrationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert("Failed to download invoice");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      case "failed":
        return "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "cancelled":
        return "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-3"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Registration not found
          </p>
          <button
            onClick={() => navigate("/registrations")}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Registrations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Registration Detail
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono">
            {registration.registrationId}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/registrations")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          {registration.paymentStatus === "paid" && (
            <button
              onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download size={14} />
              Invoice
            </button>
          )}
        </div>
      </div>

      {/* Alert for Bank Transfer Pending Verification */}
      {registration.paymentMethod === "bank_transfer" &&
        registration.paymentStatus === "pending" &&
        registration.bankTransferProof &&
        !registration.bankTransferVerified && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 p-3">
            <div className="flex items-start gap-2">
              <Clock
                size={16}
                className="text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-orange-900 dark:text-orange-400">
                  Pending Payment Verification
                </h3>
                <p className="text-xs text-orange-800 dark:text-orange-300 mt-0.5">
                  Pembayaran transfer bank menunggu verifikasi. Silakan cek
                  bukti transfer di bawah.
                </p>
              </div>
            </div>
          </div>
        )}

      {/* Main Info Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Registration Info Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FileText size={16} />
            Registration Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Registration ID
              </p>
              <p className="font-mono text-xs font-medium text-gray-900 dark:text-white">
                {registration.registrationId}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Status
              </p>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                  registration.paymentStatus
                )}`}
              >
                {registration.paymentStatus.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Program
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {registration.program_title}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                Duration: {registration.duration}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                Created At
              </p>
              <p className="text-xs text-gray-900 dark:text-white flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(registration.createdAt)}
              </p>
            </div>
            {registration.paidAt && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Paid At
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle size={12} />
                  {formatDate(registration.paidAt)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <User size={16} />
            Contact Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <User size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Name
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {registration.contactName}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Email
                </p>
                <p className="text-xs text-gray-900 dark:text-white break-all">
                  {registration.contactEmail}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  Phone
                </p>
                <p className="text-xs text-gray-900 dark:text-white">
                  {registration.contactPhone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Information Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <CreditCard size={16} />
          Payment Information
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Payment Method
            </p>
            <div className="flex items-center gap-1.5">
              {registration.paymentMethod === "va" ? (
                <CreditCard size={14} className="text-blue-600" />
              ) : (
                <Building2 size={14} className="text-purple-600" />
              )}
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {registration.paymentMethod === "va"
                  ? "Virtual Account"
                  : "Bank Transfer"}
              </span>
            </div>
          </div>
          {registration.paymentMethod === "va" && (
            <>
              {registration.midtransOrderId && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Midtrans Order ID
                  </p>
                  <p className="font-mono text-xs font-medium text-gray-900 dark:text-white">
                    {registration.midtransOrderId}
                  </p>
                </div>
              )}
              {registration.paymentType && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Payment Type
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {registration.paymentType}
                  </p>
                </div>
              )}
            </>
          )}
          {registration.paymentMethod === "bank_transfer" && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Verification Status
              </p>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                  registration.bankTransferVerified
                    ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
                }`}
              >
                {registration.bankTransferVerified ? (
                  <>
                    <CheckCircle size={12} />
                    Verified
                  </>
                ) : (
                  <>
                    <Clock size={12} />
                    Pending
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Program Price
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              Rp {registration.program_price.toLocaleString("id-ID")}
            </p>
            <p className="text-[10px] text-gray-500">
              × {registration.totalParticipants} participants
            </p>
          </div>
          {registration.discount_total > 0 && (
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Total Discount
              </p>
              <p className="text-base font-semibold text-green-600 dark:text-green-400">
                - Rp {registration.discount_total.toLocaleString("id-ID")}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Grand Total
            </p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              Rp {registration.grand_total.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Bank Transfer Proof Section */}
      {registration.paymentMethod === "bank_transfer" &&
        registration.bankTransferProof && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FileText size={16} />
              Payment Proof
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowProofModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <ExternalLink size={14} />
                  View Proof
                </button>
                <a
                  href={registration.bankTransferProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Download size={14} />
                  Download
                </a>
              </div>

              {!registration.bankTransferVerified &&
                registration.paymentStatus === "pending" && (
                  <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleVerifyPayment(true)}
                      disabled={verifying}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle size={14} />
                      {verifying ? "Processing..." : "Approve Payment"}
                    </button>
                    <button
                      onClick={() => handleVerifyPayment(false)}
                      disabled={verifying}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle size={14} />
                      {verifying ? "Processing..." : "Reject Payment"}
                    </button>
                  </div>
                )}

              {registration.bankTransferVerified && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                  <CheckCircle
                    size={16}
                    className="text-green-600 dark:text-green-400"
                  />
                  <span className="text-xs font-medium text-green-800 dark:text-green-400">
                    Payment has been verified and confirmed
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Participants Card */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Participants ({registration.totalParticipants})
        </h2>
        <div className="space-y-2">
          {registration.participants.map((participant, idx) => (
            <div
              key={idx}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-semibold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {participant.name}
                    </p>
                  </div>
                  <div className="ml-7 space-y-0.5">
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                      <Mail size={12} className="flex-shrink-0" />
                      <span className="truncate">{participant.email}</span>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                      <Phone size={12} className="flex-shrink-0" />
                      {participant.phone}
                    </p>
                    {participant.city && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                        <MapPin size={12} className="flex-shrink-0" />
                        {participant.city}
                      </p>
                    )}
                  </div>
                </div>
                {participant.referralCode && (
                  <div className="text-right flex-shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                      <Tag size={10} />
                      {participant.referralCode}
                    </span>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                      - Rp{" "}
                      {participant.discountAmount?.toLocaleString("id-ID") || 0}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Proof Modal */}
      {showProofModal && registration.bankTransferProof && (
        <div
          className="fixed inset-0 z-999999 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowProofModal(false)}
        >
          <div
            className="relative max-w-4xl w-full bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Payment Proof
              </h3>
              <button
                onClick={() => setShowProofModal(false)}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <XCircle size={18} />
              </button>
            </div>
            <div className="p-4 max-h-[80vh] overflow-auto">
              <img
                src={registration.bankTransferProof}
                alt="Payment Proof"
                className="w-full h-auto rounded-md"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/800x600?text=Image+Not+Found";
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Badge from "../../components/ui/badge/Badge";
interface Participant {
  name: string;
  email: string;
  phone: string;
  referralCode?: string | null;
  discountAmount?: number;
}

interface Registration {
  registrationId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  program_title: string;
  program_price: number;
  discount_total: number;
  grand_total: number;
  paymentStatus: string;
  createdAt: string;
  participants: Participant[];
}

export default function RegistrationDetailPage() {
  const { registrationId } = useParams();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (registrationId) {
      axios
        .get(`${API_BASE_URL}/registration/${registrationId}`)
        .then((res) => {
          setRegistration(res.data.data);
        })
        .catch((err) => {
          console.error("Failed to fetch registration detail", err);
        })
        .finally(() => setLoading(false));
    }
  }, [registrationId]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!registration) return <p className="p-4">No registration found</p>;

  return (
    <>
      <PageMeta
        title={`Registration ${registration.registrationId}`}
        description="Detail registration page"
      />
      <PageBreadcrumb
        items={[
          { label: "Registrations", path: "/registrations" },
          { label: `Registration ${registration.registrationId}` },
        ]}
      />

      {/* Main Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Registration Info
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Registration ID</p>
            <p className="font-medium">{registration.registrationId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge
              size="sm"
              color={
                registration.paymentStatus === "paid"
                  ? "success"
                  : registration.paymentStatus === "pending"
                  ? "warning"
                  : "error"
              }
            >
              {registration.paymentStatus}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-500">Program</p>
            <p className="font-medium">{registration.program_title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-medium">{registration.contactName}</p>
            <p className="text-sm">{registration.contactEmail}</p>
            <p className="text-sm">{registration.contactPhone}</p>
          </div>
        </div>

        {/* Payment info */}
        <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-gray-200 dark:border-gray-800">
          <span className="grid grid-row-2 gap-y-4">
            <div>
              <p className="text-sm text-gray-500">Program Price</p>
              <p className="font-medium">
                Rp {registration.program_price.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Discount</p>
              <p className="font-medium text-blue-600">
                Rp {registration.discount_total.toLocaleString()}
              </p>
            </div>
          </span>
          <div>
            <p className="text-sm text-gray-500">Grand Total</p>
            <p className="font-medium text-green-600">
              Rp {registration.grand_total.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Participants
        </h3>
        <div className="space-y-4">
          {registration.participants.map((p, idx) => (
            <div
              key={idx}
              className="p-4 border rounded-lg dark:border-gray-700"
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">{p.email}</p>
              <p className="text-sm text-gray-500">{p.phone}</p>
              {p.referralCode && (
                <p className="text-sm text-blue-600">
                  Referral: {p.referralCode} (Discount Rp{" "}
                  {p.discountAmount?.toLocaleString() || 0})
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

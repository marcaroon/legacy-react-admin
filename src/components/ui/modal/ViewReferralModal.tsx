// components/modals/ViewReferralModal.tsx
import Modal from "./Modal";
import Label from "../../form/Label";

interface ReferralCode {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  programId: number | null;
  program?: {
    id: number;
    title: string;
  };
  usageLimit: number | null;
  usedCount: number;
  description: string | null;
  status: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

interface ViewReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: ReferralCode | null;
}

export default function ViewReferralModal({
  isOpen,
  onClose,
  referralCode,
}: ViewReferralModalProps) {
  if (!referralCode) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Referral Code: ${referralCode.code}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Code</Label>
            <p className="font-medium">{referralCode.code}</p>
          </div>

          <div>
            <Label>Discount</Label>
            <p>
              {referralCode.discountType === "fixed"
                ? `Rp ${referralCode.discountValue.toLocaleString()}`
                : `${referralCode.discountValue}%`}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          <div>
            <Label>Program</Label>
            <p>
              {referralCode.program
                ? referralCode.program.title
                : "All Programs"}
            </p>
          </div>
          <div>
            <Label>Usage</Label>
            <p>
              {referralCode.usedCount}
              {referralCode.usageLimit
                ? ` / ${referralCode.usageLimit}`
                : " (Unlimited)"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          <div>
            <Label>Status</Label>
            <p
              className={
                referralCode.status === "active" && referralCode.isActive
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {referralCode.status === "active" && referralCode.isActive
                ? "Active"
                : "Inactive"}
            </p>
          </div>
          <div>
            <Label>Description</Label>
            <p>{referralCode.description || "-"}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {" "}
          <div>
            <Label>Expires Date</Label>
            <div>
              <p>
                {referralCode.expiresAt
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(referralCode.expiresAt))
                  : "No expiry"}
              </p>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                {referralCode.expiresAt
                  ? new Intl.DateTimeFormat("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(referralCode.expiresAt))
                  : "No expiry"}
              </span>
            </div>
          </div>
          <div>
            <Label>Created At</Label>
            <div>
              <p>
                {referralCode.expiresAt
                  ? new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(referralCode.createdAt))
                  : "No expiry"}
              </p>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                {referralCode.expiresAt
                  ? new Intl.DateTimeFormat("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(referralCode.createdAt))
                  : "No expiry"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

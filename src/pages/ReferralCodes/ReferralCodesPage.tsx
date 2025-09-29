import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import CreateReferralModal from "../../components/ui/modal/CreateReferralModal";
import EditReferralModal from "../../components/ui/modal/EditReferralModal";
import ViewReferralModal from "../../components/ui/modal/ViewReferralModal";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

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

export default function ReferralCodesPage() {
  const [referralCodes, setReferralCodes] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedReferral, setSelectedReferral] = useState<ReferralCode | null>(
    null
  );

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchReferralCodes();
  }, []);

  const fetchReferralCodes = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/referral-codes`)
      .then((res) => {
        setReferralCodes(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch referral codes", err);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm("Apakah Anda yakin ingin menghapus kode referral ini?")
    ) {
      try {
        await axios.delete(`${API_BASE_URL}/referral-codes/${id}`);
        fetchReferralCodes(); // Refresh data
      } catch (error) {
        console.error("Failed to delete referral code", error);
        alert("Gagal menghapus kode referral");
      }
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <>
      <PageMeta title={`Referral Codes`} description="Referral codes page" />
      <PageBreadcrumb items={[{ label: "Referral Codes" }]} />

      {/* <div className="mb-6 flex justify-end">
        <Link to="/referral-codes/create">
          <Button variant="primary">
            Create New Referral Code
          </Button>
        </Link>
      </div> */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Code
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Discount
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Program
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Usage
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Expired Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Created Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {referralCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      <p className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {code.code}
                      </p>
                      {code.description && (
                        <p className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {code.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      <p className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {code.discountType === "fixed"
                          ? `Rp ${code.discountValue.toLocaleString()}`
                          : `${code.discountValue}%`}
                      </p>
                      <p className="block text-gray-500 text-theme-xs dark:text-gray-400 capitalize">
                        {code.discountType}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {code.program ? code.program.title : "All Programs"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      <p className="font-medium">
                        {code.usedCount}
                        {code.usageLimit && ` / ${code.usageLimit}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {code.usageLimit ? "Limited" : "Unlimited"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        code.status === "active" && code.isActive
                          ? "success"
                          : "error"
                      }
                    >
                      {code.status === "active" && code.isActive
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {code.expiresAt
                        ? new Intl.DateTimeFormat("id-ID", {
                            weekday: "long",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(code.expiresAt))
                        : "No expiry"}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {code.expiresAt
                        ? new Intl.DateTimeFormat("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(code.expiresAt))
                        : "No expiry"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {new Intl.DateTimeFormat("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(code.createdAt))}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {new Intl.DateTimeFormat("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(code.createdAt))}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white-600 hover:bg-gray-100 text-gray-900"
                        onClick={() => {
                          setSelectedReferral(code);
                          setIsViewModalOpen(true);
                        }}
                      >
                        View
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white-600 hover:bg-gray-100 text-gray-900"
                        onClick={() => {
                          setSelectedReferral(code);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white-600 hover:bg-gray-100 text-gray-900"
                        onClick={() => handleDelete(code.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* Create Modal */}
            <CreateReferralModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSuccess={fetchReferralCodes}
            />

            {/* View Modal */}
            <ViewReferralModal
              isOpen={isViewModalOpen}
              onClose={() => setIsViewModalOpen(false)}
              referralCode={selectedReferral}
            />

            {/* Edit Modal */}
            {selectedReferral && (
              <EditReferralModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchReferralCodes}
                referralCode={selectedReferral}
              />
            )}
          </Table>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

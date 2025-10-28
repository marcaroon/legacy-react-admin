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
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Eye, Edit2, Trash2, Plus } from "lucide-react";

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
  const [selectedReferral, setSelectedReferral] = useState<ReferralCode | null>(null);

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
    if (window.confirm("Apakah Anda yakin ingin menghapus kode referral ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/referral-codes/${id}`);
        fetchReferralCodes();
      } catch (error) {
        console.error("Failed to delete referral code", error);
        alert("Gagal menghapus kode referral");
      }
    }
  };

  // Status badge component
  const StatusBadge = ({ status, isActive }: { status: string; isActive: boolean }) => {
    const isActiveStatus = status === "active" && isActive;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        isActiveStatus
          ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
      }`}>
        {isActiveStatus ? "Active" : "Inactive"}
      </span>
    );
  };

  if (loading) return <p className="p-4 text-sm">Loading...</p>;

  return (
    <>
      <PageMeta title="Referral Codes" description="Referral codes page" />
      <PageBreadcrumb items={[{ label: "Referral Codes" }]} />

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  Code
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  Discount
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  Program
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  Usage
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  Expires At
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  Created At
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {referralCodes.map((code) => (
                <TableRow key={code.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <TableCell className="px-3 py-2.5 text-gray-800 text-start text-xs dark:text-gray-400">
                    <div>
                      <p className="font-mono font-medium">{code.code}</p>
                      {code.description && (
                        <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-0.5 line-clamp-1">
                          {code.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-700 text-start text-xs dark:text-gray-400">
                    <div>
                      <p className="font-medium">
                        {code.discountType === "fixed"
                          ? `Rp ${code.discountValue.toLocaleString("id-ID")}`
                          : `${code.discountValue}%`}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-500 capitalize">
                        {code.discountType}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-700 text-start text-xs dark:text-gray-400">
                    <span className="line-clamp-2">
                      {code.program ? code.program.title : "All Programs"}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-700 text-start text-xs dark:text-gray-400">
                    <div>
                      <p className="font-medium">
                        {code.usedCount}
                        {code.usageLimit && ` / ${code.usageLimit}`}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-500">
                        {code.usageLimit ? "Limited" : "Unlimited"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-700 text-start text-xs dark:text-gray-400">
                    <StatusBadge status={code.status} isActive={code.isActive} />
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-700 text-start text-xs dark:text-gray-400">
                    {code.expiresAt ? (
                      <div>
                        <span className="block text-[10px]">
                          {new Intl.DateTimeFormat("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(code.expiresAt))}
                        </span>
                        <span className="block text-[10px] text-gray-500 dark:text-gray-500">
                          {new Intl.DateTimeFormat("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(code.expiresAt))}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">No expiry</span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-700 text-start text-xs dark:text-gray-400">
                    <span className="block text-[10px]">
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(code.createdAt))}
                    </span>
                    <span className="block text-[10px] text-gray-500 dark:text-gray-500">
                      {new Intl.DateTimeFormat("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(code.createdAt))}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-700 text-start text-xs dark:text-gray-400">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelectedReferral(code);
                          setIsViewModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors"
                      >
                        <Eye size={12} />
                        <span className="hidden sm:inline">View</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedReferral(code);
                          setIsEditModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-700 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30 rounded transition-colors"
                      >
                        <Edit2 size={12} />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(code.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded transition-colors"
                      >
                        <Trash2 size={12} />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all hover:scale-110"
          title="Create New Referral Code"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Modals */}
      <CreateReferralModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchReferralCodes}
      />

      <ViewReferralModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        referralCode={selectedReferral}
      />

      {selectedReferral && (
        <EditReferralModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={fetchReferralCodes}
          referralCode={selectedReferral}
        />
      )}
    </>
  );
}
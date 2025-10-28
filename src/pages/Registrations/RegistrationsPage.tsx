import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Eye, Download, CheckCircle, Clock } from "lucide-react";

interface Registration {
  id: number;
  registrationId: string;
  midtransOrderId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  program_title: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  bankTransferProof: string;
  bankTransferVerified: boolean;
  createdAt: string;
}

interface Filters {
  search: string;
  status: string;
  program: string;
  dateFrom: string;
  dateTo: string;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredData, setFilteredData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Registration>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    program: "",
    dateFrom: "",
    dateTo: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Get unique programs for filter options
  const uniquePrograms = [
    ...new Set(registrations.map((reg) => reg.program_title)),
  ].sort();

  // Fetch data
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/registrations`)
      .then((res) => {
        setRegistrations(res.data.data || []);
        setFilteredData(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch registrations", err);
      })
      .finally(() => setLoading(false));
  }, [API_BASE_URL]);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...registrations];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (reg) =>
          reg.registrationId.toLowerCase().includes(searchLower) ||
          reg.contactName.toLowerCase().includes(searchLower) ||
          reg.contactEmail.toLowerCase().includes(searchLower) ||
          reg.program_title.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((reg) => reg.paymentStatus === filters.status);
    }

    // Program filter
    if (filters.program) {
      filtered = filtered.filter(
        (reg) => reg.program_title === filters.program
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (reg) => new Date(reg.createdAt) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(
        (reg) =>
          new Date(reg.createdAt) <= new Date(filters.dateTo + "T23:59:59")
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filters, registrations]);

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "createdAt") {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  // Handle sort
  const handleSort = (field: keyof Registration) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Export to Excel
  const handleExportExcel = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.program) queryParams.append("program", filters.program);
      if (filters.dateFrom) queryParams.append("start_date", filters.dateFrom);
      if (filters.dateTo) queryParams.append("end_date", filters.dateTo);

      const response = await axios.get(
        `${API_BASE_URL}/registrations-export-excel?${queryParams}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `registrations_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export data to Excel");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      program: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      paid: "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
      pending: "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
      failed: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      cancelled: "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status}
      </span>
    );
  };

  // Payment method badge
  const PaymentMethodBadge = ({ method, hasProof, verified }: { method: string; hasProof: boolean; verified: boolean }) => {
    if (method === "va") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
          Virtual Account
        </span>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
          Bank Transfer
        </span>
        {hasProof && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
            verified 
              ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
              : "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
          }`}>
            {verified ? <CheckCircle size={10} /> : <Clock size={10} />}
            {verified ? "Verified" : "Pending"}
          </span>
        )}
      </div>
    );
  };

  if (loading) return <p className="p-4 text-sm">Loading...</p>;

  return (
    <>
      <PageMeta title="Registrations" description="Registrations page" />
      <PageBreadcrumb items={[{ label: "Registrations" }]} />

      {/* Filters */}
      <div className="mb-4 p-4 bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search by ID, name, email..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Program
            </label>
            <select
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filters.program}
              onChange={(e) =>
                setFilters({ ...filters, program: e.target.value })
              }
            >
              <option value="">All Programs</option>
              {uniquePrograms.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date From
            </label>
            <input
              type="date"
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date To
            </label>
            <input
              type="date"
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetFilters}
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-gray-300 rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results info */}
      <div className="mb-3 text-xs text-gray-600 dark:text-gray-400">
        Showing {paginatedData.length} of {filteredData.length} registrations
        {filteredData.length !== registrations.length &&
          ` (filtered from ${registrations.length} total)`}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    onClick={() => handleSort("registrationId")}
                  >
                    Registration ID{" "}
                    {sortField === "registrationId" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    onClick={() => handleSort("contactName")}
                  >
                    Contact{" "}
                    {sortField === "contactName" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    onClick={() => handleSort("program_title")}
                  >
                    Program{" "}
                    {sortField === "program_title" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    onClick={() => handleSort("totalAmount")}
                  >
                    Amount{" "}
                    {sortField === "totalAmount" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    onClick={() => handleSort("paymentMethod")}
                  >
                    Payment{" "}
                    {sortField === "paymentMethod" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    onClick={() => handleSort("paymentStatus")}
                  >
                    Status{" "}
                    {sortField === "paymentStatus" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-2 font-medium text-gray-600 text-start text-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    onClick={() => handleSort("createdAt")}
                  >
                    Date{" "}
                    {sortField === "createdAt" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
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
              {paginatedData.map((reg) => (
                <TableRow key={reg.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <TableCell className="px-3 py-2.5 text-gray-800 text-start text-xs dark:text-gray-400">
                    <span className="font-mono font-medium">{reg.registrationId}</span>
                    {reg.midtransOrderId && (
                      <span className="block text-gray-500 text-[10px] dark:text-gray-500 mt-0.5">
                        {reg.midtransOrderId}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-500 text-start text-xs dark:text-gray-400">
                    <div>
                      <span className="block font-medium text-gray-800 dark:text-white/90">
                        {reg.contactName}
                      </span>
                      <span className="block text-[10px] text-gray-500 dark:text-gray-500 mt-0.5">
                        {reg.contactEmail}
                      </span>
                      <span className="block text-[10px] text-gray-500 dark:text-gray-500">
                        {reg.contactPhone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-700 text-start text-xs dark:text-gray-400">
                    <span className="line-clamp-2">{reg.program_title}</span>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-700 text-start text-xs dark:text-gray-400 font-medium">
                    Rp {reg.totalAmount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-500 text-start text-xs dark:text-gray-400">
                    <PaymentMethodBadge 
                      method={reg.paymentMethod} 
                      hasProof={!!reg.bankTransferProof}
                      verified={reg.bankTransferVerified}
                    />
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-500 text-start text-xs dark:text-gray-400">
                    <StatusBadge status={reg.paymentStatus} />
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-500 text-start text-xs dark:text-gray-400">
                    <span className="block text-[10px]">
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(reg.createdAt))}
                    </span>
                    <span className="block text-[10px] text-gray-500 dark:text-gray-500">
                      {new Intl.DateTimeFormat("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(reg.createdAt))}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-gray-500 text-start text-xs dark:text-gray-400">
                    <Link to={`/registrations/${reg.registrationId}`}>
                      <button className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded transition-colors">
                        <Eye size={12} />
                        View
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination & Export */}
        <div className="px-3 py-3 border-t border-gray-200 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 dark:text-gray-400">
                  Rows:
                </label>
                <select
                  className="px-2 py-1 text-xs border border-gray-300 dark:border-white/[0.1] rounded bg-white dark:bg-white/[0.03] focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 rounded transition-colors"
              >
                <Download size={12} />
                Export Excel
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs border border-gray-300 dark:border-white/[0.1] rounded hover:bg-gray-100 dark:hover:bg-white/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs border border-gray-300 dark:border-white/[0.1] rounded hover:bg-gray-100 dark:hover:bg-white/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs border border-gray-300 dark:border-white/[0.1] rounded hover:bg-gray-100 dark:hover:bg-white/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs border border-gray-300 dark:border-white/[0.1] rounded hover:bg-gray-100 dark:hover:bg-white/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
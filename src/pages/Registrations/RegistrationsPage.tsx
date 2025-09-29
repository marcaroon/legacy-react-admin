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
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

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
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, registrations]);

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle dates
    if (sortField === "createdAt") {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }

    // Handle strings
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

      // Create blob link to download
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

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <>
      <PageMeta title={`Registrations`} description="Registrations page" />
      <PageBreadcrumb items={[{ label: "Registrations" }]} />

      {/* Filters */}
      <div className="mb-6 p-4 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white text-sm"
              placeholder="Search by ID, name, email..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white text-sm"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Program
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white text-sm"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date From
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white text-sm"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date To
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white text-sm"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={resetFilters}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Results info */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {paginatedData.length} of {filteredData.length} registrations
        {filteredData.length !== registrations.length &&
          ` (filtered from ${registrations.length} total)`}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("registrationId")}
                  >
                    Registration ID{" "}
                    {sortField === "registrationId" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("contactName")}
                  >
                    Name & Contact{" "}
                    {sortField === "contactName" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("program_title")}
                  >
                    Program{" "}
                    {sortField === "program_title" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("totalAmount")}
                  >
                    Amount{" "}
                    {sortField === "totalAmount" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("paymentStatus")}
                  >
                    Status{" "}
                    {sortField === "paymentStatus" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("createdAt")}
                  >
                    Date Created{" "}
                    {sortField === "createdAt" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
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
              {paginatedData.map((reg) => (
                <TableRow key={reg.id}>
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                    {reg.registrationId}
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      MIDTRANS: {reg.midtransOrderId}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {reg.contactName}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {reg.contactEmail}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {reg.contactPhone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {reg.program_title}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    Rp {reg.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Badge
                      size="sm"
                      color={
                        reg.paymentStatus === "paid"
                          ? "success"
                          : reg.paymentStatus === "pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {reg.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {new Intl.DateTimeFormat("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(reg.createdAt))}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {new Intl.DateTimeFormat("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(reg.createdAt))}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <Link to={`/registrations/${reg.registrationId}`}>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        View Detail
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination & Export */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  Rows per page:
                </label>
                <select
                  className="px-2 py-1 border border-gray-300 dark:border-white/[0.1] rounded bg-white dark:bg-white/[0.03] text-sm"
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
              <Button
                onClick={handleExportExcel}
                className="bg-green-600 hover:bg-green-700 text-white text-sm"
                size="sm"
              >
                Export to Excel
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs"
                >
                  ««
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs"
                >
                  «
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs"
                >
                  »
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs"
                >
                  »»
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

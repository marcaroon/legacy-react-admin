import { useEffect, useState } from "react";
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

interface Participant {
  id: number;
  registrationId: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  referralCode?: string;
  discountAmount?: number;
  createdAt: string;
  registration: { registrationId: String; midtransOrderId: string };
}

interface Filters {
  search: string;
  hasReferral: string;
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredData, setFilteredData] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof Participant>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<Filters>({
    search: "",
    hasReferral: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/participants`)
      .then((res) => {
        setParticipants(res.data.data || []);
        setFilteredData(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch participants", err);
      })
      .finally(() => setLoading(false));
  }, [API_BASE_URL]);

  useEffect(() => {
    let filtered = [...participants];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (participant) =>
          participant.name.toLowerCase().includes(searchLower) ||
          participant.email.toLowerCase().includes(searchLower) ||
          participant.phone.toLowerCase().includes(searchLower) ||
          participant.registration.registrationId
            .toLowerCase()
            .includes(searchLower) ||
          (participant.referralCode &&
            participant.referralCode.toLowerCase().includes(searchLower))
      );
    }

    if (filters.hasReferral === "yes") {
      filtered = filtered.filter((participant) => participant.referralCode);
    } else if (filters.hasReferral === "no") {
      filtered = filtered.filter((participant) => !participant.referralCode);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filters, participants]);

  const sortedData = [...filteredData].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === ("registration" as keyof Participant)) {
      aValue = a.registration?.registrationId || "";
      bValue = b.registration?.registrationId || "";
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }

    if (aValue === null || aValue === undefined) aValue = "";
    if (bValue === null || bValue === undefined) bValue = "";

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

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: keyof Participant | "registration") => {
    if (field === "registration") {
      if (sortField === "registration") {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField("registration" as keyof Participant);
        setSortDirection("asc");
      }
    } else {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/participants-export-excel`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `participants_${new Date().toISOString().split("T")[0]}.xlsx`
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

  const resetFilters = () => {
    setFilters({
      search: "",
      hasReferral: "",
    });
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <>
      <PageMeta title={`Participants`} description="Participants page" />
      <PageBreadcrumb items={[{ label: "Participants" }]} />

      {/* Filters */}
      <div className="mb-6 p-4 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.05]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white text-sm"
              placeholder="Search by name, email, phone, registration ID..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Has Referral Code
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/[0.1] rounded-md bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white text-sm"
              value={filters.hasReferral}
              onChange={(e) =>
                setFilters({ ...filters, hasReferral: e.target.value })
              }
            >
              <option value="">All</option>
              <option value="yes">With Referral</option>
              <option value="no">Without Referral</option>
            </select>
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
        Showing {paginatedData.length} of {filteredData.length} participants
        {filteredData.length !== participants.length &&
          ` (filtered from ${participants.length} total)`}
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
                    onClick={() => handleSort("registration")}
                  >
                    Registration ID{" "}
                    {sortField === "registration" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("name")}
                  >
                    Name{" "}
                    {sortField === "name" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("email")}
                  >
                    Email{" "}
                    {sortField === "email" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("phone")}
                  >
                    Phone{" "}
                    {sortField === "phone" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("phone")}
                  >
                    City{" "}
                    {sortField === "phone" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("referralCode")}
                  >
                    Referral Code{" "}
                    {sortField === "referralCode" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  <div
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05] p-1 -m-1 rounded"
                    onClick={() => handleSort("discountAmount")}
                  >
                    Discount{" "}
                    {sortField === "discountAmount" &&
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
                    Registered Date{" "}
                    {sortField === "createdAt" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </div>
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                    {participant.registration.registrationId}
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      MIDTRANS: {participant.registration.midtransOrderId}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                    {participant.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {participant.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {participant.phone}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {participant.city || "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <span
                      className={
                        participant.referralCode
                          ? "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          : ""
                      }
                    >
                      {participant.referralCode || "-"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {participant.discountAmount
                      ? `Rp ${participant.discountAmount.toLocaleString()}`
                      : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-gray-400">
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {new Intl.DateTimeFormat("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(participant.createdAt))}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {new Intl.DateTimeFormat("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(participant.createdAt))}
                    </span>
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

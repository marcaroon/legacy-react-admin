import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import CreateProgramModal from "../../components/ui/modal/CreateProgramModal";
import EditProgramModal from "../../components/ui/modal/EditProgramModal";
import ViewProgramModal from "../../components/ui/modal/ViewProgramModal";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface Program {
  id: number;
  title: string;
  duration: string;
  price: number;
  earlyBirdPrice: number | null;
  earlyBirdEndDate: string | null;
  description: string | null;
  isActive: boolean;
  isEarlyBirdActive: boolean;
  currentPrice: number;
  savings: number;
  earlyBirdDaysLeft: number | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = () => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/programs`)
      .then((res) => {
        setPrograms(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch programs", err);
      })
      .finally(() => setLoading(false));
  };

  //   const handleDelete = async (id: number) => {
  //     if (window.confirm("Apakah Anda yakin ingin menghapus program ini?")) {
  //       try {
  //         await axios.delete(`${API_BASE_URL}/programs/${id}`);
  //         fetchPrograms(); // Refresh data
  //       } catch (error) {
  //         console.error("Failed to delete program", error);
  //         alert("Gagal menghapus program");
  //       }
  //     }
  //   };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <>
      <PageMeta title={`Programs`} description="Programs page" />
      <PageBreadcrumb items={[{ label: "Programs" }]} />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
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
                  Program Duration
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Normal Price
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Early Bird Price
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
              {programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      <p className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {program.title}
                      </p>
                      {program.description && (
                        <p className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {program.description.length > 50
                            ? `${program.description.substring(0, 50)}...`
                            : program.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {program.duration}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div>
                      <p className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        Rp {program.price.toLocaleString()}
                      </p>
                      {/* {program.currentPrice !== program.price && (
                        <p className="block text-gray-500 text-theme-xs dark:text-gray-400 line-through">
                          Rp {program.price.toLocaleString()}
                        </p>
                      )} */}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {program.earlyBirdPrice ? (
                      <div>
                        <p className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          Rp {program.earlyBirdPrice.toLocaleString()}
                        </p>
                        <p className="block text-gray-500 text-theme-xs dark:text-gray-400">
                          {program.isEarlyBirdActive ? (
                            <span className="text-green-600">
                              {program.earlyBirdDaysLeft} days left
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              Early Bird Expired
                            </span>
                          )}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">No early bird</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      <Badge
                        size="sm"
                        color={program.isActive ? "success" : "error"}
                      >
                        {program.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {program.isEarlyBirdActive && (
                        <Badge size="sm" color="warning">
                          Early Bird
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {new Intl.DateTimeFormat("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }).format(new Date(program.createdAt))}
                    </span>
                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                      {new Intl.DateTimeFormat("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(program.createdAt))}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white-600 hover:bg-gray-100 text-gray-900"
                        onClick={() => {
                          setSelectedProgram(program);
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
                          setSelectedProgram(program);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      {/* <Button
                        size="sm"
                        variant="outline"
                        className="bg-white-600 hover:bg-gray-100 text-gray-900"
                        onClick={() => handleDelete(program.id)}
                      >
                        Delete
                      </Button> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            {/* Create Modal */}
            <CreateProgramModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSuccess={fetchPrograms}
            />

            {/* View Modal */}
            <ViewProgramModal
              isOpen={isViewModalOpen}
              onClose={() => setIsViewModalOpen(false)}
              program={selectedProgram}
            />

            {/* Edit Modal */}
            {selectedProgram && (
              <EditProgramModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchPrograms}
                program={selectedProgram}
              />
            )}
          </Table>
        </div>
        {/* <button
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
        </button> */}
      </div>
    </>
  );
}

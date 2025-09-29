// components/modals/EditProgramModal.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import Button from "../button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";

interface Program {
  id: number;
  title: string;
  duration: string;
  price: number;
  earlyBirdPrice: number | null;
  earlyBirdEndDate: string | null;
  description: string | null;
  isActive: boolean;
}

interface EditProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  program: Program;
}

export default function EditProgramModal({
  isOpen,
  onClose,
  onSuccess,
  program,
}: EditProgramModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    price: "",
    earlyBirdPrice: "",
    earlyBirdEndDate: "",
    description: "",
    isActive: "true",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const statusOptions = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title,
        duration: program.duration,
        price: program.price.toString(),
        earlyBirdPrice: program.earlyBirdPrice?.toString() || "",
        earlyBirdEndDate: program.earlyBirdEndDate
          ? new Date(program.earlyBirdEndDate).toISOString().slice(0, 16)
          : "",
        description: program.description || "",
        isActive: program.isActive.toString(),
      });
    }
  }, [program]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        duration: formData.duration,
        price: parseInt(formData.price),
        earlyBirdPrice: formData.earlyBirdPrice
          ? parseInt(formData.earlyBirdPrice)
          : null,
        earlyBirdEndDate: formData.earlyBirdEndDate || null,
        description: formData.description || null,
        isActive: formData.isActive === "true",
      };

      await axios.put(`${API_BASE_URL}/programs/${program.id}`, payload);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating program:", error);
      alert(error.response?.data?.message || "Failed to update program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Program" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Title and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Program Title*</Label>
            <Input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter program title"
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration*</Label>
            <Input
              type="text"
              id="duration"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              placeholder="e.g., 3 months, 12 weeks"
            />
          </div>
        </div>

        {/* Row 2: Regular Price and Early Bird Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Regular Price (Rp)*</Label>
            <Input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="Enter regular price"
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="earlyBirdPrice">Early Bird Price (Rp)</Label>
            <Input
              type="number"
              id="earlyBirdPrice"
              value={formData.earlyBirdPrice}
              onChange={(e) =>
                handleInputChange("earlyBirdPrice", e.target.value)
              }
              placeholder="Enter early bird price"
              min="0"
            />
          </div>
        </div>

        {/* Row 3: Early Bird End Date and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="earlyBirdEndDate">Early Bird End Date</Label>
            <Input
              type="datetime-local"
              id="earlyBirdEndDate"
              value={formData.earlyBirdEndDate}
              onChange={(e) =>
                handleInputChange("earlyBirdEndDate", e.target.value)
              }
            />
          </div>

          <div>
            <Label>Status*</Label>
            <Select
              options={statusOptions}
              value={formData.isActive}
              onChange={(value) => handleInputChange("isActive", value)}
            />
          </div>
        </div>

        {/* Row 4: Description */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter program description"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Updating..." : "Update Program"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

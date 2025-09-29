// components/modals/CreateReferralModal.tsx
import { useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import Button from "../button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";

interface CreateReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateReferralModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateReferralModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "fixed",
    discountValue: "",
    programId: "",
    usageLimit: "",
    description: "",
    expiresAt: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const discountTypeOptions = [
    { value: "fixed", label: "Fixed Amount" },
    { value: "percentage", label: "Percentage" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        code: formData.code,
        discountType: formData.discountType,
        discountValue: parseInt(formData.discountValue),
        programId: formData.programId ? parseInt(formData.programId) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        description: formData.description || null,
        expiresAt: formData.expiresAt || null,
      };

      await axios.post(`${API_BASE_URL}/referral-codes`, payload);
      onSuccess();
      onClose();

      // Reset form
      setFormData({
        code: "",
        discountType: "fixed",
        discountValue: "",
        programId: "",
        usageLimit: "",
        description: "",
        expiresAt: "",
      });
    } catch (error: any) {
      console.error("Error creating referral code:", error);
      alert(error.response?.data?.message || "Failed to create referral code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Referral Code"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Code and Discount Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="code">Referral Code*</Label>
            <Input
              type="text"
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              placeholder="Enter referral code"
            />
          </div>

          <div>
            <Label>Discount Type*</Label>
            <Select
              options={discountTypeOptions}
              value={formData.discountType}
              onChange={(value) => handleInputChange("discountType", value)}
            />
          </div>
        </div>

        {/* Row 2: Discount Value and Usage Limit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="discountValue">
              Discount Value*{" "}
              {formData.discountType === "percentage" ? "(%)" : "(Rp)"}
            </Label>
            <Input
              type="number"
              id="discountValue"
              value={formData.discountValue}
              onChange={(e) =>
                handleInputChange("discountValue", e.target.value)
              }
              placeholder={
                formData.discountType === "percentage"
                  ? "Enter percentage (1-100)"
                  : "Enter amount in Rupiah"
              }
              min={formData.discountType === "percentage" ? "1" : "1000"}
              max={formData.discountType === "percentage" ? "100" : undefined}
            />
          </div>

          <div>
            <Label htmlFor="usageLimit">Usage Limit (opt.)</Label>
            <Input
              type="number"
              id="usageLimit"
              value={formData.usageLimit}
              onChange={(e) => handleInputChange("usageLimit", e.target.value)}
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>
        </div>

        {/* Row 3: Description and Expires At */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="description">Description (opt.)</Label>
            <Input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div>
            <Label htmlFor="expiresAt">Expired Date (opt.)</Label>
            <Input
              type="datetime-local"
              id="expiresAt"
              value={formData.expiresAt}
              onChange={(e) => handleInputChange("expiresAt", e.target.value)}
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
            {loading ? "Creating..." : "Create Referral Code"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// components/modals/EditReferralModal.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import Button from "../button/Button";
import Label from "../../form/Label";
import Input from "../../form/input/InputField";
import Select from "../../form/Select";

interface EditReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  referralCode: any;
}

export default function EditReferralModal({
  isOpen,
  onClose,
  onSuccess,
  referralCode,
}: EditReferralModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(referralCode);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setFormData(referralCode);
  }, [referralCode]);

  const discountTypeOptions = [
    { value: "fixed", label: "Fixed Amount" },
    { value: "percentage", label: "Percentage" },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        code: formData.code,
        discountType: formData.discountType,
        discountValue: parseInt(formData.discountValue) || 0,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        description: formData.description || null,
        expiresAt: formData.expiresAt || null,
        status: formData.status || "active",
        isActive: formData.status === "active",
      };

      await axios.put(
        `${API_BASE_URL}/referral-codes/${referralCode.id}`,
        payload
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error updating referral code:", error);
      alert(error.response?.data?.message || "Failed to update referral code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Referral Code">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Code and Discount Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="code">Referral Code*</Label>
            <Input
              type="text"
              id="code"
              value={formData.code || ""}
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
              value={formData.discountValue || ""}
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
            <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
            <Input
              type="number"
              id="usageLimit"
              value={formData.usageLimit || ""}
              onChange={(e) => handleInputChange("usageLimit", e.target.value)}
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>
        </div>

        {/* Row 3: Description and Expires At */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              type="text"
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div>
            <Label htmlFor="expiresAt">Expires At (Optional)</Label>
            <Input
              type="datetime-local"
              id="expiresAt"
              value={
                formData.expiresAt
                  ? new Date(formData.expiresAt).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) => handleInputChange("expiresAt", e.target.value)}
            />
          </div>
        </div>

        {/* Row 4: Status Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              value={formData.status || "active"}
              onChange={(value) => handleInputChange("status", value)}
            />
          </div>

          {/* <div className="flex items-center space-x-2 pt-6">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive !== false}
              onChange={(e) => handleInputChange("isActive", e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Is Active
            </Label>
          </div> */}
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
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

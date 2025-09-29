// components/modals/ViewProgramModal.tsx
import Modal from "./Modal";
import Badge from "../badge/Badge";

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

interface ViewProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  program: Program | null;
}

export default function ViewProgramModal({
  isOpen,
  onClose,
  program,
}: ViewProgramModalProps) {
  if (!program) return null;

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Program Details"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Program Title and Status */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {program.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              ID: {program.id}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge size="sm" color={program.isActive ? "success" : "error"}>
              {program.isActive ? "Active" : "Inactive"}
            </Badge>
            {program.isEarlyBirdActive && (
              <Badge size="sm" color="warning">
                Early Bird Active
              </Badge>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </h4>
              <p className="text-gray-900 dark:text-white">
                {program.duration}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Regular Price
              </h4>
              <p className="text-gray-900 dark:text-white text-lg">
                {formatCurrency(program.price)}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Price
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 dark:text-white text-lg font-semibold">
                  {formatCurrency(program.currentPrice)}
                </span>
                {program.savings > 0 && (
                  <span className="text-green-600 text-sm">
                    (Discount {formatCurrency(program.savings)})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {program.earlyBirdPrice && (
              <>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Early Bird Price
                  </h4>
                  <p className="text-gray-900 dark:text-white text-lg">
                    {formatCurrency(program.earlyBirdPrice)}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Early Bird Status
                  </h4>
                  {program.isEarlyBirdActive ? (
                    <div>
                      <p className="text-green-600 font-medium">Active</p>
                      {program.earlyBirdDaysLeft && (
                        <p className="text-sm text-gray-500">
                          {program.earlyBirdDaysLeft} days remaining
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400">Early Bird Expired</p>
                  )}
                </div>

                {program.earlyBirdEndDate && (
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Early Bird End Date
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(program.earlyBirdEndDate)}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Description */}
        {program.description && (
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </h4>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                {program.description}
              </p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Created At
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {formatDate(program.createdAt)}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Last Updated
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {formatDate(program.updatedAt)}
            </p>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3">
            Pricing Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Current Price
              </p>
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                {formatCurrency(program.currentPrice)}
              </p>
            </div>
            {program.savings > 0 && (
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Discount
                </p>
                <p className="font-semibold text-green-700 dark:text-green-300">
                  {formatCurrency(program.savings)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

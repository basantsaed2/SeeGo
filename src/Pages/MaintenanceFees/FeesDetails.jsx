"use client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import FullPageLoader from "@/components/Loading";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import DataTable from "@/components/DataTableLayout";

const FeesDetails = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [maintenanceFees, setMaintenanceFees] = useState([]);
  const [totals, setTotals] = useState({
    grandTotal: 0,
    grandPaid: 0,
    grandRemain: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const { refetch: refetchMaintenanceFees, loading: loadingMaintenanceFees, data: MaintenanceFeesData } = useGet({
    url: `${apiUrl}/maintenance_feez/item/${id}`,
  });
  const { postData, loading: loadingPost, response } = usePost({
    url: `${apiUrl}/maintenance_feez/add_payment`,
  });

  useEffect(() => {
    refetchMaintenanceFees();
  }, [refetchMaintenanceFees]);

  useEffect(() => {
    if (MaintenanceFeesData && MaintenanceFeesData.maintenance_fees) {
      const formatted = MaintenanceFeesData.maintenance_fees.users_unpaid?.map((u) => ({
        id: u.id || u.unit, // Fallback to unit if id is not provided
        name: u.user_name || "—",
        phone: u.user_phone || "—",
        unit: u.unit || "—",
        unit_type: u.unit_type || "—",
        total: u.total ? parseFloat(u.total).toFixed(2) : "0.00",
        paid: u.paid ? parseFloat(u.paid).toFixed(2) : "0.00",
        remain: u.remain ? parseFloat(u.remain).toFixed(2) : "0.00",
      })) || [];

      const grandTotal = MaintenanceFeesData.maintenance_fees.users_unpaid?.reduce(
        (sum, item) => sum + (parseFloat(item.total) || 0),
        0
      ) || 0;
      const grandPaid = MaintenanceFeesData.maintenance_fees.users_unpaid?.reduce(
        (sum, item) => sum + (parseFloat(item.paid) || 0),
        0
      ) || 0;
      const grandRemain = MaintenanceFeesData.maintenance_fees.users_unpaid?.reduce(
        (sum, item) => sum + (parseFloat(item.remain) || 0),
        0
      ) || 0;

      setTotals({
        grandTotal: grandTotal.toFixed(2),
        grandPaid: grandPaid.toFixed(2),
        grandRemain: grandRemain.toFixed(2),
      });

      setMaintenanceFees(formatted);
    }
  }, [MaintenanceFeesData]);

  useEffect(() => {
    if (!loadingPost && response) {
      toast.success("Maintenance Fees payment added successfully!");
      setIsModalOpen(false);
      setPaymentAmount("");
      setSelectedUser(null);
      refetchMaintenanceFees(); // Refresh data after successful payment
    }
  }, [response, loadingPost, refetchMaintenanceFees]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPaymentAmount("");
    setSelectedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error("Please enter a valid payment amount.");
      return;
    }

    const body = new FormData();
    body.append("maintenance_fees_id", MaintenanceFeesData?.maintenance_fees?.id || id);
    body.append("appartment_id", selectedUser.unit); // Assuming unit can serve as appartment_id
    body.append("user_id", selectedUser.id); // Assuming id is user_id
    body.append("paid", parseFloat(paymentAmount).toFixed(2));

    await postData(body, "Maintenance Fees payment added successfully!");
  };

  const columns = [
    { key: "name", label: "User Name" },
    { key: "phone", label: "User Phone" },
    { key: "unit", label: "Unit" },
    { key: "unit_type", label: "Unit Type" },
    { key: "total", label: "Total" },
    { key: "paid", label: "Paid" },
    { key: "remain", label: "Remain" },
  ];

  const actionColumns = [
    {
      label: "Add Payment",
      onClick: (row) => handleOpenModal(row),
    },
  ];

  if (isLoading || loadingMaintenanceFees) {
    return <FullPageLoader />;
  }

  return (
    <div>
      <ToastContainer />
      {/* Enhanced Grand Totals Row */}
      <div className="border-t border-gray-200 bg-gray-50/50 dark:bg-gray-800/50 mb-5 px-4 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
            />
          </svg>
          <span className="font-semibold text-xl text-gray-700 dark:text-gray-300">
            {MaintenanceFeesData?.maintenance_fees?.name || "—"}
          </span>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-4">
          <div className="flex items-center space-x-1.5 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg">
            <span className="text-green-600 dark:text-green-400 font-medium">Total:</span>
            <span className="text-green-700 dark:text-green-300 font-semibold">{totals.grandTotal} EGP</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">
            <span className="text-blue-600 dark:text-blue-400 font-medium">Paid:</span>
            <span className="text-blue-700 dark:text-blue-300 font-semibold">{totals.grandPaid} EGP</span>
          </div>
          <div
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg ${
              parseFloat(totals.grandRemain) > 0 ? "bg-red-50 dark:bg-red-900/20" : "bg-gray-100 dark:bg-gray-700"
            }`}
          >
            <span
              className={
                parseFloat(totals.grandRemain) > 0
                  ? "text-red-600 dark:text-red-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 font-medium"
              }
            >
              Remain:
            </span>
            <span
              className={
                parseFloat(totals.grandRemain) > 0
                  ? "text-red-700 dark:text-red-300 font-semibold"
                  : "text-gray-700 dark:text-gray-300 font-semibold"
              }
            >
              {totals.grandRemain} EGP
            </span>
          </div>
          <div className="flex items-center space-x-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg">
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">Unpaid:</span>
            <span className="text-yellow-700 dark:text-yellow-300 font-semibold">
              {MaintenanceFeesData?.maintenance_fees?.unpaid || 0} Users
            </span>
          </div>
        </div>
      </div>

      {/* Modal for Adding Payment */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Add Payment for {selectedUser?.name || "User"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="paymentAmount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Payment Amount (EGP)
                </label>
                <input
                  type="number"
                  id="paymentAmount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                  disabled={loadingPost}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  disabled={loadingPost}
                >
                  {loadingPost ? "Submitting..." : "Submit Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DataTable
        data={maintenanceFees}
        columns={columns}
        pageDetailsRoute={true}
        showAddButton={false}
        showActionColumns={true}
        actionColumns={actionColumns}
      />
    </div>
  );
};

export default FeesDetails;
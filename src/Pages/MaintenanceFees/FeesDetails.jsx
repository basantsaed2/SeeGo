"use client";
import { useEffect, useState, useMemo } from "react"; // Add useMemo
import { useParams } from "react-router-dom";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import FullPageLoader from "@/components/Loading";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import DataTable from "@/components/DataTableLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Removed DialogTrigger as it's not directly used for the modal open
import { Button } from "@/components/ui/button";
import Add from "@/components/AddFieldSection";
import { useTranslation } from "react-i18next";

const FeesDetails = () => {
  const { t } = useTranslation();
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
  const [payment, setPayment] = useState({ amount: "" }); // State for form values

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
      console.log("MaintenanceFeesData:", MaintenanceFeesData);
      const formatted = MaintenanceFeesData.maintenance_fees.users_unpaid?.map((u) => ({
        id: u.user_id,
        appartment_id: u.appartment_id,
        name: u.user_name || "—",
        phone: u.user_phone || "—",
        unit: u.unit || "—",
        unit_type: u.unit_type || "—", // Ensure unit_type is always a string
        total: u.total ? parseFloat(u.total).toFixed(2) : "0.00",
        paid: u.paid ? parseFloat(u.paid).toFixed(2) : "0.00",
        remain: u.remaines ? parseFloat(u.remaines).toFixed(2) : "0.00",
      })) || [];

      console.log("Formatted maintenance fees:", formatted);

      const grandTotal = MaintenanceFeesData.maintenance_fees.users_unpaid?.reduce(
        (sum, item) => sum + (parseFloat(item.total) || 0),
        0
      ) || 0;
      const grandPaid = MaintenanceFeesData.maintenance_fees.users_unpaid?.reduce(
        (sum, item) => sum + (parseFloat(item.paid) || 0),
        0
      ) || 0;
      const grandRemain = MaintenanceFeesData.maintenance_fees.users_unpaid?.reduce(
        (sum, item) => sum + (parseFloat(item.remaines) || 0),
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
      toast.success(t("MaintenanceFeespaymentaddedsuccessfully"));
      setIsModalOpen(false);
      setPayment({ amount: "" });
      setSelectedUser(null);
      refetchMaintenanceFees();
    }
  }, [response, loadingPost, refetchMaintenanceFees]);

  const handleOpenModal = (user) => {
    console.log("Opening modal for user:", user);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPayment({ amount: "" });
    setSelectedUser(null);
  };

  const handleChange = (name, value) => {
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !payment.amount || parseFloat(payment.amount) <= 0) {
      toast.error(t("Pleaseenteravalidpaymentamount"));
      return;
    }

    const body = new FormData();
    body.append("maintenance_feez_id", MaintenanceFeesData?.maintenance_fees?.id || id);
    body.append("appartment_id", selectedUser.appartment_id);
    body.append("user_id", selectedUser.id);
    body.append("paid", parseFloat(payment.amount).toFixed(2));

    await postData(body, t("MaintenanceFeespaymentaddedsuccessfully"));
  };

  const columns = [
    { key: "name", label: t("UserName") },
    { key: "phone", label: t("UserPhone") },
    { key: "unit", label: t("Unit") },
    { key: "unit_type", label: t("UnitType") },
    { key: "total", label: t("Total") },
    { key: "paid", label: t("Paid") },
    { key: "remain", label: t("Remain") },
    {
      key: "payment",
      label: t("AddPayment"),
      render: (row) => (
        <Button
          onClick={() => handleOpenModal(row)}
          className="inline-block cursor-pointer !px-3 !py-1 bg-bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-500 transition-all duration-300 ease-in-out"
          disabled={parseFloat(row.remain) <= 0}
        >
          {t("AddPayment")}
        </Button>
      ),
    },
  ];

  // Define fields for the Add component (for modal)
  const paymentFields = [
    {
      name: t("amount"), // Using t() for the name
      type: "input",
      inputType: "number",
      placeholder: t("PaymentAmount"),
    },
  ];

  // --- NEW LOGIC FOR UNIT TYPE FILTER ---
const unitTypeOptions = useMemo(() => {
  const typesSet = new Set();
  maintenanceFees.forEach((fee) => {
    if (fee.unit_type) {
      typesSet.add(fee.unit_type);
    }
  });

  const allOption = {
    key: "unit_type",
    label: t("UnitType"),
    options: [
      { value: "all", label: t("AllUnitTypes") },
      ...Array.from(typesSet).map((type) => ({
        value: type,
        label: type,
      })),
    ],
  };

  return [allOption];
}, [maintenanceFees, t]);


  // const unitTypeLabels = useMemo(() => {
  //   const labels = {
  //     all: t("All"), // Translate "All"
  //   };
  //   unitTypeOptions.forEach(type => {
  //     if (type !== "all") {
  //       labels[type] = t(type.charAt(0).toUpperCase() + type.slice(1)); // Capitalize and translate, e.g., "apartment" -> "Apartment"
  //     }
  //   });
  //   return labels;
  // }, [unitTypeOptions, t]); // Depend on unitTypeOptions and t for re-calculation


  if (isLoading || loadingMaintenanceFees) {
    return <FullPageLoader />;
  }

  return (
    <div>
      <ToastContainer />
      {/* Grand Totals Row */}
      <div className="border-t border-gray-200 bg-gray-50/50 dark:bg-gray-800/50 !mb-5 !px-4 !py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center !space-x-2">
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
          <div className="flex items-center !space-x-1.5 bg-green-50 dark:bg-green-900/20 !px-3 !py-1.5 rounded-lg">
            <span className="text-green-600 dark:text-green-400 font-medium">{t("Total")}:</span>
            <span className="text-green-700 dark:text-green-300 font-semibold">{totals.grandTotal} EGP</span>
          </div>
          <div className="flex items-center !space-x-1.5 bg-blue-50 dark:bg-blue-900/20 !px-3 !py-1.5 rounded-lg">
            <span className="text-blue-600 dark:text-blue-400 font-medium">{t("Paid")}:</span>
            <span className="text-blue-700 dark:text-blue-300 font-semibold">{totals.grandPaid} EGP</span>
          </div>
          <div
            className={`flex items-center !space-x-1.5 !px-3 !py-1.5 rounded-lg ${
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
              {t("Remain:")}:
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
          <div className="flex items-center !space-x-1.5 bg-yellow-50 dark:bg-yellow-900/20 !px-3 !py-1.5 rounded-lg">
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">{t("Unpaid")}:</span>
            <span className="text-yellow-700 dark:text-yellow-300 font-semibold">
              {MaintenanceFeesData?.maintenance_fees?.unpaid || 0} {t("Users")}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Modal with Add Component */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white !p-6 border-none rounded-lg shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-bg-primary">
              {t("AddPaymentfor")} {selectedUser?.name || t("User")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Add
              fields={paymentFields}
              lang="en" // Keep lang as 'en' or change based on your Add component's localization strategy
              values={payment}
              onChange={(lang, name, value) => handleChange(name, value)}
            />
          </div>
          <div className="!pt-6 flex justify-end gap-3">
            <Button
              onClick={handleCloseModal}
              variant="outline"
              className="border !px-3 !py-2 cursor-pointer border-teal-500 hover:bg-bg-primary hover:text-white transition-all text-bg-primary"
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-bg-primary border border-teal-500 hover:bg-white hover:text-bg-primary transition-all !px-3 !py-2 cursor-pointer text-white"
              disabled={loadingPost}
            >
              {loadingPost ? t("Submitting") : t("Submit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <DataTable
        data={maintenanceFees}
        columns={columns}
        showAddButton={false}
        showActionColumns={false}
        filterOptions={unitTypeOptions} // مصفوفة تحتوي على { key, label, options }
        showFilter={true}
      />

    </div>
  );
};

export default FeesDetails;
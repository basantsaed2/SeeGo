"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteDialog from "@/components/DeleteDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux"; // useDispatch is not used, so it can be removed
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { useChangeState } from "@/Hooks/useChangeState";
import { useTranslation } from "react-i18next";

const MaintenanceType = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [maintenanceTypes, setMaintenanceTypes] = useState([]); // Renamed for clarity
  const [selectedRow, setselectedRow] = useState(null);
  const { deleteData, loadingDelete } = useDelete(); // responseDelete is not used
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { changeState, loadingChange } = useChangeState();
  const { t } = useTranslation();

  const { refetch: refetchMaintenanceTypes, loading: loadingMaintenanceTypes, data: MaintenanceTypesData } = useGet({ url: `${apiUrl}/maintenance_type` });

  useEffect(() => {
    refetchMaintenanceTypes();
  }, [refetchMaintenanceTypes]);

  useEffect(() => {
    if (MaintenanceTypesData && MaintenanceTypesData.my_maintenance_types) {
      console.log("MaintenanceType Data:", MaintenanceTypesData);
      const formatted = MaintenanceTypesData?.my_maintenance_types?.map((u) => {
        return {
          id: u.id,
          name: u.name || "—",
          // The `status` key needs to hold the raw value (0 or 1) for the DataTable's Switch,
          // and for filtering. We'll use a separate key for the text display.
          status: u.status, // Keep as 0 or 1 for the switch
          statusText: u.status === 1 ? "active" : "inactive", // For the badge display and filtering
          img: u.image_link ? (
            <img
              src={u.image_link}
              alt={u.name}
              className="w-12 h-12 object-cover rounded-md"
            />
          ) : (
            <Avatar className="w-12 h-12">
              <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          ),
        };
      });
      setMaintenanceTypes(formatted);
    }
  }, [MaintenanceTypesData]);

  const handleDelete = (maintenanceType) => { // Renamed parameter for clarity
    setselectedRow(maintenanceType);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteData(`${apiUrl}/maintenance_type/delete?maintenance_type_id=${selectedRow.id}`, `${selectedRow.name} ${t("DeletedSuccess")}`); // Added translation

    if (success) {
      setIsDeleteOpen(false);
      setMaintenanceTypes(
        maintenanceTypes.filter((type) => // Renamed parameter for clarity
          type.id !== selectedRow.id
        )
      );
    }
  };

  const handleToggleStatus = async (row, newStatus) => {
    const response = await changeState(
      `${apiUrl}/maintenance_type/status/${row.id}?status=${newStatus}`,
      `${row.name} ${t("statuschangedsuccessfully")}` // Added translation
    );
    if (response) {
      setMaintenanceTypes((prev) =>
        prev.map((type) => // Renamed parameter for clarity
          type.id === row.id
            ? { ...type, status: newStatus, statusText: newStatus === 1 ? "active" : "inactive" } // Update both status and statusText
            : type
        )
      );
    }
  };

  const columns = [
    { key: "img", label: t("Image") },
    { key: "name", label: t("MaintenanceType") },
    { key: "status", label: t("Status") }, // This column will render the Switch component
  ];

  // Define filter options and labels for status
  const statusFilterOptions = ["all", "active", "inactive"];
  const statusFilterLabels = {
    all: t("All"),
    active: t("Active"),
    inactive: t("Inactive"),
  };

  if (isLoading || loadingMaintenanceTypes) {
    return <FullPageLoader />;
  }

  return (
    <div className="p-4">
      <ToastContainer />
      <DataTable
        data={maintenanceTypes} // Ensure this is `maintenanceTypes`
        columns={columns}
        addRoute="/maintenance_type/add"
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        // --- NEW PROPS FOR STATUS FILTER ---
        filterByKey="statusText" // Filter by the 'statusText' key, which holds "active" or "inactive"
filterOptions={[
  {
    key: "statusText",
    label: t("Status"),
    options: statusFilterOptions.map((val) => ({
      value: val,
      label: statusFilterLabels[val],
    })),
  },
]}
        filterLabelsText={statusFilterLabels}
        showFilter={true} // Ensure the filter section is shown
        // Custom labels for the switch (optional, if you want different text than the badge)
        statusLabels={{ active: t("Active"), inactive: t("Inactive") }}
        // Custom labels for the statusText badge (optional, but good for consistency)
        statusLabelsText={{ active: t("Active"), inactive: t("Inactive") }}
      />
      {selectedRow && (
        <>
          <DeleteDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onDelete={handleDeleteConfirm}
            name={selectedRow.name}
            isLoading={loadingDelete}
          />
        </>
      )}
    </div>
  );
};

export default MaintenanceType;
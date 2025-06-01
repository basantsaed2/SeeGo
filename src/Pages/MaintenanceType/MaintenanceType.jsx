"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteDialog from "@/components/DeleteDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { useChangeState } from "@/Hooks/useChangeState";
import { useTranslation } from "react-i18next";

const MaintenanceType = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [MaintenanceType, setMaintenanceType] = useState([]);
  const [selectedRow, setselectedRow] = useState(null);
  const { deleteData, loadingDelete, responseDelete } = useDelete();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { changeState, loadingChange } = useChangeState();
  const {t}=useTranslation();

  const { refetch: refetchMaintenanceType, loading: loadingMaintenanceType, data: MaintenanceTypeData } = useGet({ url: `${apiUrl}/maintenance_type` });

  useEffect(() => {
    refetchMaintenanceType();
  }, [refetchMaintenanceType]);

  useEffect(() => {
    if (MaintenanceTypeData && MaintenanceTypeData.my_maintenance_types) {
      console.log("MaintenanceType Data:", MaintenanceTypeData);
      const formatted = MaintenanceTypeData?.my_maintenance_types?.map((u) => {
        return {
          id: u.id,
          name: u.name || "—",
          status: u.status === 1 ? "Active" : "Inactive",
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
      setMaintenanceType(formatted);
    }
  }, [MaintenanceTypeData]);

  const handleDelete = (MaintenanceType) => {
    setselectedRow(MaintenanceType);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteData(`${apiUrl}/maintenance_type/delete?maintenance_type_id=${selectedRow.id}`, `${selectedRow.name} Deleted Success.`);

    if (success) {
      setIsDeleteOpen(false);
      setMaintenanceType(
        MaintenanceType.filter((MaintenanceType) =>
          MaintenanceType.id !== selectedRow.id
        )
      );
    }
  };

  const handleToggleStatus = async (row, newStatus) => {
    const response = await changeState(
      `${apiUrl}/maintenance_type/status/${row.id}?status=${newStatus}`,
      `${row.name} status changed successfully.`
    );
    if (response) {
      setMaintenanceType((prev) =>
        prev.map((Type) =>
          Type.id === row.id
            ? { ...Type, status: newStatus === 1 ? t("Active") : t("Inactive") }
            : Type
        )
      );
    }
  };

  const columns = [
    { key: "img", label: t("Image") },
    { key: "name", label: t("MaintenanceType") },
    { key: "status", label: t("Status") },
  ];
  if (isLoading || loadingMaintenanceType) {
    return <FullPageLoader />;
  }
  return (
    <div className="p-4">
      <ToastContainer />
      <DataTable
        data={MaintenanceType}
        columns={columns}
        addRoute="/maintenance_type/add"
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
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
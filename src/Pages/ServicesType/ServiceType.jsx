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
import { ServiceTypeFormFields, useServiceTypeForm } from "./ServiceTypeForm";

const ServicesType = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [Services, setServices] = useState([]);
  const [selectedRow, setselectedRow] = useState(null);
  const [rowEdit, setRowEdit] = useState(null);
  const { deleteData, loadingDelete, responseDelete } = useDelete();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { refetch: refetchServices, loading: loadingServices, data: ServicesData } = useGet({ url:`${apiUrl}/service_type` });

  const {
    formData,
    fields,
    handleFieldChange,
    prepareFormData
  } = useServiceTypeForm(apiUrl, true, rowEdit); // true for edit mode

  useEffect(() => {
    refetchServices();
  }, [refetchServices]);

  useEffect(() => {
    if (ServicesData && ServicesData.my_service_type) {
      console.log("Services Data:", ServicesData);
      const formatted = ServicesData?.my_service_type?.map((u) => {
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
      setServices(formatted);
    }
  }, [ServicesData]);

  const handleDelete = (Services) => {
    setselectedRow(Services);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteData(`${apiUrl}/service_type/delete?service_type_id=${selectedRow.id}`, `${selectedRow.name} Deleted Success.`);

    if (success) {
      setIsDeleteOpen(false);
      setServices(
        Services.filter((Services) =>
          Services.id !== selectedRow.id
        )
      );
    }
  };


  const columns = [
    { key: "img", label: "Image" },
    { key: "name", label: "Service Type" },
    { key: "statusText", label: "Status" },
  ];
  if (isLoading || loadingServices) {
    return <FullPageLoader />;
  }
  return (
    <div className="p-4">
      <ToastContainer />
      <DataTable
        data={Services}
        columns={columns}
        addRoute="/service_type/add"
        onDelete={handleDelete}
        statusLabelsText={{
          active: "Active",
          inactive: "Inactive",
        }}
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

export default ServicesType;
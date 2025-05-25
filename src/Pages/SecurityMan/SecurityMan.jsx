"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { useChangeState } from "@/Hooks/useChangeState";
import { SecurityManFormFields, useSecurityManForm } from "./SecurityManForm";
import { usePost } from "@/Hooks/UsePost";

const SecurityMan = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [Securitys, setSecuritys] = useState([]);
  const [selectedRow, setselectedRow] = useState(null);
  const [rowEdit, setRowEdit] = useState(null);
  const { changeState } = useChangeState();
  const { deleteData, loadingDelete } = useDelete();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { refetch: refetchSecuritys, loading: loadingSecuritys, data: SecuritysData } = useGet({ url: `${apiUrl}/security` });
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/security/update/${selectedRow?.id}` });

  const {
    formData,
    fields,
    handleFieldChange,
    prepareFormData
  } = useSecurityManForm(apiUrl, true, rowEdit); // true for edit mode

  useEffect(() => {
    refetchSecuritys();
  }, [refetchSecuritys]);

  useEffect(() => {
    if (SecuritysData && SecuritysData.security) {
      console.log("Securitys Data:", SecuritysData);
      const formatted = SecuritysData?.security?.map((u) => {
        return {
          id: u.id,
          name: u.name || "—",
          email: u.email || "—",
          phone: u.phone || "—",
          type: u.type || "—",
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
      setSecuritys(formatted);
    }
  }, [SecuritysData]);

  const handleEdit = (Securitys) => {
    const fullSecuritysData = SecuritysData?.security.find(o => o.id === Securitys.id);
    setselectedRow(Securitys);
    setIsEditOpen(true);
    setRowEdit({
      ...fullSecuritysData,
      image_link: fullSecuritysData?.image_link || null,
      status: Securitys.status,
    });
  };

  const handleDelete = (Securitys) => {
    setselectedRow(Securitys);
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    if (!loadingPost && response) {
      if (response) {
        setIsEditOpen(false);
        setselectedRow(null);
        refetchSecuritys();
      }
    }
  }, [response, loadingPost]);

  const handleSave = async () => {
    const body = prepareFormData();
    postData(body, "Security Man updated successfully!")
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteData(`${apiUrl}/security/delete/${selectedRow.id}`, `${selectedRow.name} Deleted Success.`);

    if (success) {
      setIsDeleteOpen(false);
      setSecuritys(
        Securitys.filter((Securitys) =>
          Securitys.id !== selectedRow.id
        )
      );
    }
  };

  const handleToggleStatus = async (row, newStatus) => {
    const response = await changeState(
      `${apiUrl}/security/status/${row.id}?status=${newStatus}`,
      `${row.name} Changed Status.`,
    );
    if (response) {
      setSecuritys((prev) =>
        prev.map((Securitys) =>
          Securitys.id === row.id ? { ...Securitys, status: newStatus === 1 ? "Active" : "Inactive" } : Securitys
        )
      );
    }
  };

  const columns = [
    { key: "img", label: "Image" },
    { key: "name", label: "Security Man" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ];
  if (isLoading || loadingPost || loadingSecuritys) {
    return <FullPageLoader />;
  }
  return (
    <div className="p-4">
      <ToastContainer />
      <DataTable
        data={Securitys}
        columns={columns}
        addRoute="/security_man/add"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
      {selectedRow && (
        <>
          <EditDialog
            title="Edit Security Man"
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSave={handleSave}
            selectedRow={selectedRow}
            onCancel={() => setIsEditOpen(false)}
            onChange={handleFieldChange}
            isLoading={loadingSecuritys}
          >
            <div className="w-full max-h-[60vh] p-4 overflow-y-auto">
              <Tabs defaultValue="english" className="w-full">
                <TabsContent value="english">
                  <SecurityManFormFields
                    fields={fields}
                    formData={formData}
                    handleFieldChange={handleFieldChange}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </EditDialog>

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

export default SecurityMan;
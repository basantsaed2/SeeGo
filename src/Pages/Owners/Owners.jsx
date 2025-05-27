"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { useChangeState } from "@/Hooks/useChangeState";
import { useOwnerForm, OwnerFormFields } from "./OwnerForm";
import { usePost } from "@/Hooks/UsePost";

const Owners = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [owners, setOwners] = useState([]);
  const [selectedRow, setselectedRow] = useState(null);
  const [rowEdit, setRowEdit] = useState(null);
  const { changeState, loadingChange, responseChange } = useChangeState();
  const { deleteData, loadingDelete, responseDelete } = useDelete();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { refetch: refetchOwner, loading: loadingOwner, data: OwnerData } = useGet({ url: `${apiUrl}/owner` });
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/owner/update/${selectedRow?.id}` });

  const {
    formData,
    fields,
    loadingOwnerParent,
    handleFieldChange,
    prepareFormData
  } = useOwnerForm(apiUrl, true, rowEdit); // true for edit mode

  useEffect(() => {
    refetchOwner();
  }, [refetchOwner]);

  useEffect(() => {
    if (OwnerData && OwnerData.owners) {
      console.log("Owner Data:", OwnerData);
      const formatted = OwnerData?.owners?.map((u) => {
        return {
          id: u.id,
          name: u.name || "—",
          parent: u.parent?.name || "—",
          email: u.email || "—",
          phone: u.phone || "—",
          gender: u.gender || "—",
          appartment: u.appartments?.unit || "—",
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
          password: "",
          birthDate: u.birthDate || "",
        };
      });
      setOwners(formatted);
    }
  }, [OwnerData]);

  const handleEdit = (owner) => {
    const fullOwnerData = OwnerData?.owners.find(o => o.id === owner.id);
    setselectedRow(owner);
    setIsEditOpen(true);
    setRowEdit({
      ...fullOwnerData,
      parent_user_id: fullOwnerData?.parent?.id?.toString() || "", // Ensure string type
      image_link: fullOwnerData?.image_link || null,
      status: fullOwnerData?.status || 0 // Ensure status is properly set
    });
  };

  const handleDelete = (owner) => {
    setselectedRow(owner);
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    if (!loadingPost && response) {
      if (response) {
        setIsEditOpen(false);
        setselectedRow(null);
        refetchOwner();
      }
    }
  }, [response, loadingPost]);

  const handleSave = async () => {
    const body = prepareFormData();
    postData(body, "Owner updated successfully!")
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteData(`${apiUrl}/owner/delete/${selectedRow.id}`, `${selectedRow.name} Deleted Success.`);

    if (success) {
      setIsDeleteOpen(false);
      setOwners(
        owners.filter((owner) =>
          owner.id !== selectedRow.id
        )
      );
    }
  };

  const handleToggleStatus = async (row, newStatus) => {
    const response = await changeState(
      `${apiUrl}/owner/status/${row.id}?status=${newStatus}`,
      `${row.name} Changed Status.`,
    );
    if (response) {
      setOwners((prev) =>
        prev.map((owner) =>
          owner.id === row.id ? { ...owner, status: newStatus === 1 ? "Active" : "Inactive" } : owner
        )
      );
    }
  };

  const columns = [
    { key: "img", label: "Image" },
    { key: "name", label: "Owner Name" },
    // { key: "birthDate", label: "BirthDate" },
    { key: "parent", label: "Owner Type" },
    { key: "appartment", label: "Unit" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "gender", label: "Gender" },
  ];
  if (isLoading || loadingPost || loadingOwner) {
    return <FullPageLoader />;
  }
  return (
    <div className="p-4">
      <ToastContainer />
      <DataTable
        data={owners}
        columns={columns}
        showAddButton={false}
        showActionColumns={false}
        // onEdit={handleEdit}
        // onDelete={handleDelete}
        // onToggleStatus={handleToggleStatus}
        pageDetailsRoute={true}
      />
      {/* {selectedRow && (
        <>
          <EditDialog
            title="Edit Owner"
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSave={handleSave}
            selectedRow={selectedRow}
            onCancel={() => setIsEditOpen(false)}
            onChange={handleFieldChange}
            isLoading={loadingOwner}
          >
            <div className="w-full max-h-[60vh] p-4 overflow-y-auto">
              <Tabs defaultValue="english" className="w-full">
                <TabsContent value="english">
                  <OwnerFormFields
                    fields={fields}
                    formData={formData}
                    handleFieldChange={handleFieldChange}
                    loading={loadingOwnerParent}
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
      )} */}
    </div>
  );
};

export default Owners;
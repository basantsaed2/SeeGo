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
import { useGateForm , GateFormFields} from "./GateForm";
import { usePost } from "@/Hooks/UsePost";

const Gates = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [Gates, setGates] = useState([]);
  const [selectedRow, setselectedRow] = useState(null);
  const [rowEdit, setRowEdit] = useState(null);
  const { changeState, loadingChange, responseChange } = useChangeState();
  const { deleteData, loadingDelete, responseDelete } = useDelete();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { refetch: refetchGates, loading: loadingGates, data: GatesData } = useGet({ url: `${apiUrl}/gate` });
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/gate/update/${selectedRow?.id}` });

  const {
    formData,
    fields,
    handleFieldChange,
    prepareFormData
  } = useGateForm(apiUrl, true, rowEdit); // true for edit mode

  useEffect(() => {
    refetchGates();
  }, [refetchGates]);

  useEffect(() => {
    if (GatesData && GatesData.gatess) {
      console.log("Gates Data:", GatesData);
      const formatted = GatesData?.gatess?.map((u) => {
        return {
          id: u.id,
          name: u.name || "—",
          map: u.location || "—",
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
      setGates(formatted);
    }
  }, [GatesData]);

  const handleEdit = (Gates) => {
    const fullGatesData = GatesData?.gatess.find(o => o.id === Gates.id);
    setselectedRow(Gates);
    setIsEditOpen(true);
    setRowEdit({
      ...fullGatesData,
      image_link: fullGatesData?.image_link || null,
      status: Gates.status ,
    });
  };

  const handleDelete = (Gates) => {
    setselectedRow(Gates);
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    if (!loadingPost && response) {
      if (response) {
        setIsEditOpen(false);
        setselectedRow(null);
        refetchGates();
      }
    }
  }, [response, loadingPost]);

  const handleSave = async () => {
    const body = prepareFormData();
    postData(body, "Gates updated successfully!")
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteData(`${apiUrl}/gate/delete/${selectedRow.id}`, `${selectedRow.name} Deleted Success.`);

    if (success) {
      setIsDeleteOpen(false);
      setGates(
        Gates.filter((Gates) =>
          Gates.id !== selectedRow.id
        )
      );
    }
  };

  const handleToggleStatus = async (row, newStatus) => {
    const response = await changeState(
      `${apiUrl}/gate/status/${row.id}?status=${newStatus}`,
      `${row.name} Changed Status.`,
    );
    if (response) {
      setGates((prev) =>
        prev.map((Gates) =>
          Gates.id === row.id ? { ...Gates, status: newStatus === 1 ? "Active" : "Inactive" } : Gates
        )
      );
    }
  };

  const columns = [
    { key: "img", label: "Image" },
    { key: "name", label: "Gates Name" },
    { key: "map", label: "Location" },
    { key: "status", label: "Status" },
  ];
  if (isLoading || loadingPost || loadingGates) {
    return <FullPageLoader />;
  }
  return (
    <div className="p-4">
      <ToastContainer />
      <DataTable
        data={Gates}
        columns={columns}
        addRoute="/gates/add"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
      {selectedRow && (
        <>
          <EditDialog
            title="Edit Gates"
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSave={handleSave}
            selectedRow={selectedRow}
            onCancel={() => setIsEditOpen(false)}
            onChange={handleFieldChange}
            isLoading={loadingGates}
          >
            <div className="w-full max-h-[60vh] p-4 overflow-y-auto">
              <Tabs defaultValue="english" className="w-full">
                <TabsContent value="english">
                  <GateFormFields
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

export default Gates;
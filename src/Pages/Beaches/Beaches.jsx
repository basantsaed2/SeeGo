"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { useDispatch, useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { useChangeState } from "@/Hooks/useChangeState";
import { useBeachesForm, BeachesFields } from "./BeachesForm";
import { usePost } from "@/Hooks/UsePost";

const Beaches = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [beaches, setBeaches] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowEdit, setRowEdit] = useState(null);
    const { changeState, loadingChange } = useChangeState();
    const { deleteData, loadingDelete } = useDelete();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { refetch: refetchBeach, loading: loadingBeach, data: beachData } = useGet({
        url: `${apiUrl}/beach`,
    });
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/beach/update/${selectedRow?.id}`,
    });

    const { formData, fields, handleFieldChange, prepareFormData, LanguageTabs } = useBeachesForm(
        apiUrl,
        true,
        rowEdit
    );

    useEffect(() => {
        refetchBeach();
    }, [refetchBeach]);

    useEffect(() => {
        if (beachData && beachData.beachs) {
            const formatted = beachData?.beachs?.map((u) => {
                return {
                    id: u.id,
                    name: u.name || "—",
                    from: u.from || "—",
                    to: u.to || "—",
                    fromTo: `${u.from || "—"} - ${u.to || "—"}`,
                    status: u.status === 1 ? "Active" : "Inactive",
                };
            });
            setBeaches(formatted);
        }
    }, [beachData]);

    const handleEdit = (beach) => {
        const fullBeachData = beachData?.beachs.find((o) => o.id === beach.id);
        setSelectedRow(beach);
        setIsEditOpen(true);
        setRowEdit({
            ...fullBeachData,
            status: beach.status,
        });
    };

    const handleDelete = (beach) => {
        setSelectedRow(beach);
        setIsDeleteOpen(true);
    };

    useEffect(() => {
        if (!loadingPost && response) {
            setIsEditOpen(false);
            setSelectedRow(null);
            refetchBeach();
        }
    }, [response, loadingPost, refetchBeach]);

    const handleSave = async () => {
        const body = prepareFormData();
        postData(body, "Beach updated successfully!");
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteData(
            `${apiUrl}/beach/delete/${selectedRow.id}`,
            `${selectedRow.name} Deleted Successfully!`
        );

        if (success) {
            setIsDeleteOpen(false);
            setBeaches(beaches.filter((beach) => beach.id !== selectedRow.id));
        }
    };

    const handleToggleStatus = async (row, newStatus) => {
        const response = await changeState(
            `${apiUrl}/beach/status/${row.id}?status=${newStatus}`,
            `${row.name} status changed successfully.`
        );
        if (response) {
            setBeaches((prev) =>
                prev.map((beach) =>
                    beach.id === row.id
                        ? { ...beach, status: newStatus === 1 ? "Active" : "Inactive" }
                        : beach
                )
            );
        }
    };

    const columns = [
        { key: "name", label: "Beach Name" },
        { key: "from", label: "Opening Time" },
        { key: "to", label: "Closing Time" },
        { key: "status", label: "Status" },
    ];

    if (isLoading || loadingPost || loadingBeach) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <DataTable
                data={beaches}
                columns={columns}
                addRoute="/beaches/add"
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
            />
            {selectedRow && (
                <>
                    <EditDialog
                        title="Edit Beach"
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        onSave={handleSave}
                        selectedRow={selectedRow}
                        onCancel={() => setIsEditOpen(false)}
                        onChange={handleFieldChange}
                        isLoading={loadingBeach}
                    >
                        <div className="w-full max-h-[60vh] p-4 overflow-y-auto">
                            <Tabs defaultValue="english" className="w-full">
                                <LanguageTabs />
                                <TabsContent value="english">
                                    <BeachesFields
                                        fields={fields.en}
                                        formData={formData.en}
                                        handleFieldChange={handleFieldChange}
                                        loading={loadingBeach}
                                        language="en"
                                    />
                                </TabsContent>
                                <TabsContent value="arabic">
                                    <BeachesFields
                                        fields={fields.ar}
                                        formData={formData.ar}
                                        handleFieldChange={handleFieldChange}
                                        loading={loadingBeach}
                                        language="ar"
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

export default Beaches;
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
import { usePoolsForm, PoolsFields } from "./PoolsForm";
import { usePost } from "@/Hooks/UsePost";

const Pools = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [Pools, setPools] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowEdit, setRowEdit] = useState(null);
    const { changeState, loadingChange } = useChangeState();
    const { deleteData, loadingDelete } = useDelete();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { refetch: refetchPool, loading: loadingPool, data: PoolData } = useGet({
        url: `${apiUrl}/pool`,
    });
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/pool/update/${selectedRow?.id}`,
    });

    const { formData, fields, handleFieldChange, prepareFormData, LanguageTabs } = usePoolsForm(
        apiUrl,
        true,
        rowEdit
    );

    useEffect(() => {
        refetchPool();
    }, [refetchPool]);

    useEffect(() => {
        if (PoolData && PoolData.pools) {
            const formatted = PoolData?.pools?.map((u) => {
                return {
                    id: u.id,
                    name: u.name || "—",
                    nameAr: u.ar_name || "—",
                    from: u.from || "—",
                    to: u.to || "—",
                    fromTo: `${u.from || "—"} - ${u.to || "—"}`,
                    status: u.status === 1 ? "Active" : "Inactive",
                };
            });
            setPools(formatted);
        }
    }, [PoolData]);

    const handleEdit = (Pool) => {
        const fullPoolData = PoolData?.pools.find((o) => o.id === Pool.id);
        setSelectedRow(Pool);
        setIsEditOpen(true);
        setRowEdit({
            ...fullPoolData,
            status: Pool.status,
        });
    };

    const handleDelete = (Pool) => {
        setSelectedRow(Pool);
        setIsDeleteOpen(true);
    };

    useEffect(() => {
        if (!loadingPost && response) {
            setIsEditOpen(false);
            setSelectedRow(null);
            refetchPool();
        }
    }, [response, loadingPost, refetchPool]);

    const handleSave = async () => {
        const body = prepareFormData();
        postData(body, "Pool updated successfully!");
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteData(
            `${apiUrl}/pool/delete/${selectedRow.id}`,
            `${selectedRow.name} Deleted Successfully!`
        );

        if (success) {
            setIsDeleteOpen(false);
            setPools(Pools.filter((Pool) => Pool.id !== selectedRow.id));
        }
    };

    const handleToggleStatus = async (row, newStatus) => {
        const response = await changeState(
            `${apiUrl}/pool/status/${row.id}?status=${newStatus}`,
            `${row.name} status changed successfully.`
        );
        if (response) {
            setPools((prev) =>
                prev.map((Pool) =>
                    Pool.id === row.id
                        ? { ...Pool, status: newStatus === 1 ? "Active" : "Inactive" }
                        : Pool
                )
            );
        }
    };

    const columns = [
        { key: "name", label: "Pool Name (En)" },
        { key: "nameAr", label: "Pool Name (Ar)" },
        { key: "from", label: "Opening Time" },
        { key: "to", label: "Closing Time" },
        { key: "status", label: "Status" },
    ];

    if (isLoading || loadingPost || loadingPool) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <DataTable
                data={Pools}
                columns={columns}
                addRoute="/pools/add"
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
            />
            {selectedRow && (
                <>
                    <EditDialog
                        title="Edit Pool"
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        onSave={handleSave}
                        selectedRow={selectedRow}
                        onCancel={() => setIsEditOpen(false)}
                        onChange={handleFieldChange}
                        isLoading={loadingPool}
                    >
                        <div className="w-full max-h-[60vh] p-4 overflow-y-auto">
                            <Tabs defaultValue="english" className="w-full">
                                <LanguageTabs />
                                <TabsContent value="english">
                                    <PoolsFields
                                        fields={fields.en}
                                        formData={formData.en}
                                        handleFieldChange={handleFieldChange}
                                        loading={loadingPool}
                                        language="en"
                                    />
                                </TabsContent>
                                <TabsContent value="arabic">
                                    <PoolsFields
                                        fields={fields.ar}
                                        formData={formData.ar}
                                        handleFieldChange={handleFieldChange}
                                        loading={loadingPool}
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

export default Pools;
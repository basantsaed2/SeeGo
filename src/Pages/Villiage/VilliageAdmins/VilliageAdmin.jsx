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
import { useVillageAdminForm, VillageAdminFields } from "./VilliageAdminForm";
import { usePost } from "@/Hooks/UsePost";
import { useTranslation } from "react-i18next";

const VillageAdmin = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [VillageAdmin, setVillageAdmin] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowEdit, setRowEdit] = useState(null);
    const { changeState, loadingChange } = useChangeState();
    const { deleteData, loadingDelete } = useDelete();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { t } = useTranslation();

    const { refetch: refetchVillageAdmin, loading: loadingVillageAdmin, data: VillageAdminData } = useGet({
        url: `${apiUrl}/admin_village`,
    });
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin_village/update/${selectedRow?.id}`,
    });

    const { formData, fields, handleFieldChange, prepareFormData } = useVillageAdminForm(
        apiUrl,
        true,
        rowEdit
    );

    useEffect(() => {
        refetchVillageAdmin();
    }, [refetchVillageAdmin]);

    useEffect(() => {
        if (VillageAdminData && VillageAdminData.admins) {
            const formatted = VillageAdminData?.admins?.map((u) => {
                return {
                    id: u.id,
                    name: u.name || "—",
                    phone: u.phone || "—",
                    email: u.email || "—",
                    admin_position: u.position?.name || "—",
                    admin_position_id: u.position?.id || "—",
                    status: u.status === 1 ? "Active" : "Banned",
                };
            });
            setVillageAdmin(formatted);
        }
    }, [VillageAdminData]);

    const handleEdit = (VillageAdmin) => {
        console.log("VillageAdmin", VillageAdmin)
        const fullVillageAdminData = VillageAdminData?.admins.find((o) => o.id === VillageAdmin.id);
        setSelectedRow(VillageAdmin);
        setIsEditOpen(true);
        setRowEdit({
            ...fullVillageAdminData,
            admin_position: fullVillageAdminData?.position?.name || '',
            admin_position_id: fullVillageAdminData?.position?.id?.toString() || "",
            status: VillageAdmin.status,
        });
    };

    const handleDelete = (VillageAdmin) => {
        setSelectedRow(VillageAdmin);
        setIsDeleteOpen(true);
    };

    useEffect(() => {
        if (!loadingPost && response) {
            setIsEditOpen(false);
            setSelectedRow(null);
            refetchVillageAdmin();
        }
    }, [response, loadingPost, refetchVillageAdmin]);

    const handleSave = async () => {
        const body = prepareFormData();
        postData(body, t("VillageAdminupdatedsuccessfully"));
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteData(
            `${apiUrl}/admin_village/delete/${selectedRow.id}`,
            `${selectedRow.name} ${t("DeletedSuccessfully")}`
        );

        if (success) {
            setIsDeleteOpen(false);
            setVillageAdmin(VillageAdmin.filter((VillageAdmin) => VillageAdmin.id !== selectedRow.id));
        }
    };

    const handleToggleStatus = async (row, newStatus) => {
        const response = await changeState(
            `${apiUrl}/admin_village/status/${row.id}?status=${newStatus}`,
            `${row.name} ${"statuschangedsuccessfully"}`
        );
        if (response) {
            setVillageAdmin((prev) =>
                prev.map((VillageAdmin) =>
                    VillageAdmin.id === row.id
                        ? { ...VillageAdmin, status: newStatus === 1 ? t("Active") : t("Banned") }
                        : VillageAdmin
                )
            );
        }
    };

    const columns = [
        { key: "name", label: t("AdminName") },
        { key: "phone", label: t("Phone") },
        { key: "email", label: t("Email") },
        { key: "admin_position", label: t("Role") },
        { key: "status", label: t("Status") },
    ];

    if (isLoading || loadingPost || loadingVillageAdmin) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <DataTable
                data={VillageAdmin}
                columns={columns}
                addRoute="add_admin"
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                statusLabels={
                    {
                        active: "Active",
                        inactive: "Banned",
                    }
                }
            />
            {selectedRow && (
                <>
                    <EditDialog
                        title={t('EditAdmin')}
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        onSave={handleSave}
                        selectedRow={selectedRow}
                        onCancel={() => setIsEditOpen(false)}
                        onChange={handleFieldChange}
                        isLoading={loadingVillageAdmin}
                    >
                        <div className="w-full max-h-[60vh] p-4 overflow-y-auto">
                            <Tabs defaultValue="english" className="w-full">
                                <TabsContent value="english">
                                    <VillageAdminFields
                                        fields={fields}
                                        formData={formData}
                                        handleFieldChange={handleFieldChange}
                                        loading={loadingVillageAdmin}
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

export default VillageAdmin;
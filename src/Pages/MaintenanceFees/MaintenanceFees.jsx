"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { useDispatch, useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { usePost } from "@/Hooks/UsePost";
import { useMaintenanceForm, MaintenanceFormFields } from "./MaintenanceForm";
import { Link } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
const MaintenanceFees = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [maintenanceFees, setMaintenanceFees] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowEdit, setRowEdit] = useState(null);
    const { deleteData, loadingDelete, responseDelete } = useDelete();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
const {t}=useTranslation();
    const { refetch: refetchMaintenanceFees, loading: loadingMaintenanceFees, data: MaintenanceFeesData } = useGet({
        url: `${apiUrl}/maintenance_feez/view_maintanence`
    });
    const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/maintenance_feez/update/${selectedRow?.id}` });

    const {
        formData,
        fields,
        handleFieldChange,
        prepareFormData,
    } = useMaintenanceForm(apiUrl, true, rowEdit); // true for edit mode

    useEffect(() => {
        refetchMaintenanceFees();
    }, [refetchMaintenanceFees]);

    useEffect(() => {
        if (MaintenanceFeesData && MaintenanceFeesData.maintenance_fees) {
            const formatted = MaintenanceFeesData.maintenance_fees.map((u) => {
                return {
                    id: u.id,
                    name: u.name || "—",
                    year: u.year || "—",
                    price: u.price || "0",
                };
            });
            setMaintenanceFees(formatted);
        }
    }, [MaintenanceFeesData]);

    // Fix the initial data format in handleEdit
    const handleEdit = (Maintenance) => {
        const fullMaintenanceData = MaintenanceFeesData?.maintenance_fees.find(o => o.id === Maintenance.id);
        setSelectedRow(Maintenance);
        setIsEditOpen(true);
        setRowEdit({
            name: fullMaintenanceData?.name || "",
            year: fullMaintenanceData?.year || "",
            price: fullMaintenanceData?.price || "",
        });
    };

    const handleDelete = (Maintenance) => {
        setSelectedRow(Maintenance);
        setIsDeleteOpen(true);
    };

    useEffect(() => {
        if (!loadingPost && response) {
            if (response) {
                setIsEditOpen(false);
                setSelectedRow(null);
                refetchMaintenanceFees();
            }
        }
    }, [response, loadingPost]);

    const handleSave = async () => {
        const body = prepareFormData();
        postData(body, t("MaintenanceFeesupdatedsuccessfully"))
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteData(`${apiUrl}/maintenance_feez/delete/${selectedRow.id}`, `${selectedRow.name} Deleted Success.`);

        if (success) {
            setIsDeleteOpen(false);
            setMaintenanceFees(
                maintenanceFees.filter((Maintenance) =>
                    Maintenance.id !== selectedRow.id
                )
            );
        }
    };
    const columns = [
        {
            key: "name",
            label: t("MaintenanceFees"),
            render: (row) => (
                <Link to={`details/${row.id}`} className="text-blue-600 hover:underline">
                    {row.name}
                </Link>
            ),
        },
        { key: "year", label: t("Year") },
        { key: "price", label: t("Price") },
    ];
    if (isLoading || loadingMaintenanceFees) {
        return <FullPageLoader />;
    }
    return (
        <div>
            <DataTable
                data={maintenanceFees}
                columns={columns}
                addRoute="/maintenance_fees/add"
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            {selectedRow && (
                <>
                    <EditDialog
                        title={t("EditMaintenanceFees")}
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        onSave={handleSave}
                        selectedRow={selectedRow}
                        onCancel={() => setIsEditOpen(false)}
                        onChange={handleFieldChange}
                        isLoading={loadingMaintenanceFees}
                    >
                        <div className="w-full max-h-[60vh] p-4 overflow-y-auto">
                            <Tabs defaultValue="english" className="w-full">
                                <TabsContent value="english">
                                    <MaintenanceFormFields
                                        fields={fields}
                                        formData={formData}
                                        handleFieldChange={handleFieldChange}
                                        loading={loadingMaintenanceFees} // Use the correct loading state
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

export default MaintenanceFees;
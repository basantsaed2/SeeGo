import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

// Components
import DataTable from "@/components/DataTableLayout";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import FullPageLoader from "@/components/Loading";

// Custom Hooks
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import { useChangeState } from "@/Hooks/useChangeState";
import { useDelete } from "@/Hooks/useDelete";
import { useInsideGateForm } from "./useInsideGateForm";
import InsideGateForm from "./InsideGateForm";

export default function InsideGate() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Dialog states
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Form logic hook
    const { formValues, setFormValues, formFields, handleFormChange, prepareFormData } = useInsideGateForm(selectedRow);

    // Fetch inside_gates list from https://bcknd.sea-go.org/village/inside_gate
    const { data: apiResponse, loading, refetch } = useGet({
        url: `${apiUrl}/inside_gate`,
    });

    const tableData = apiResponse?.inside_gates || [];

    // API Update Mutation
    const { postData: updateGate, loadingPost: loadingUpdate } = usePost({
        url: `${apiUrl}/inside_gate/update/${selectedRow?.id}`,
        type: true,
    });

    const { changeState } = useChangeState();
    const { deleteData, isDeleting } = useDelete();

    useEffect(() => {
        refetch();
    }, [refetch]);

    // Table Column Definitions
    const columns = [
        { key: "id", label: t("ID") || "ID" },
        { key: "name", label: t("Gate Name") || "Gate Name" },
        { key: "from", label: t("From") || "From" },
        { key: "to", label: t("To") || "To" },
        {
            key: "visitor",
            label: t("Visitor") || "Visitor",
            render: (row) => (
                <span className={`px-2 py-1 text-xs rounded-full ${row.visitor ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {row.visitor ? (t("Allowed") || "Allowed") : (t("Not Allowed") || "Not Allowed")}
                </span>
            ),
        },
        { key: "status", label: t("Status") || "Status" }, // Interactive Switch column in DataTableLayout
    ];

    // Edit Inside Gate Handler
    const handleEditOpen = (row) => {
        setSelectedRow(row);
        setFormValues({
            name: row.name || "",
            from: row.from ? row.from.substring(0, 5) : "08:00",
            to: row.to ? row.to.substring(0, 5) : "22:00",
            status: row.status === 1 || row.status === "Active" ? 1 : 0,
            visitor: row.visitor !== undefined ? Boolean(row.visitor) : true,
        });
        setIsEditOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedRow?.id) return;
        const payload = prepareFormData();
        await updateGate(payload, t("Inside Gate updated successfully") || "Inside Gate updated successfully");
        setIsEditOpen(false);
        setSelectedRow(null);
        refetch();
    };

    // Delete Inside Gate Handler
    const handleDeleteOpen = (row) => {
        setSelectedRow(row);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow?.id) return;
        const success = await deleteData(
            `${apiUrl}/inside_gate/delete/${selectedRow.id}`,
            t("Inside Gate deleted successfully") || "Inside Gate deleted successfully"
        );
        if (success) {
            setIsDeleteOpen(false);
            setSelectedRow(null);
            refetch();
        }
    };

    // Status Switch Handler (Toggle Switch in Table)
    const handleToggleStatus = async (row, newStatus) => {
        const success = await changeState(
            `${apiUrl}/inside_gate/status/${row.id}`,
            t("Status updated successfully") || "Status updated successfully",
            { status: newStatus }
        );
        if (success) {
            refetch();
        }
    };

    if (loading && !tableData.length) {
        return <FullPageLoader />;
    }

    return (
        <div className="!p-6 space-y-6">
            {/* Header section */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-bg-primary">
                    {t("Inside Gates") || "Inside Gates"}
                </h1>
                <Button
                    onClick={() => navigate("/inside_gate/add")}
                    className="bg-bg-primary text-white hover:bg-teal-700 rounded-[10px] !p-3 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> {t("Add New Gate") || "Add New Gate"}
                </Button>
            </div>

            {/* Data Table */}
            <DataTable
                data={tableData}
                columns={columns}
                addRoute="/inside_gate/add"
                showAddButton={false}
                pageDetailsRoute={true}
                pageDetailsLabel={t("Entrance List") || "Entrance List"}
                onEdit={handleEditOpen}
                onDelete={handleDeleteOpen}
                onToggleStatus={handleToggleStatus}
            />

            {/* Edit Modal */}
            {selectedRow && (
                <EditDialog
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    selectedRow={selectedRow}
                    title={t("Edit Gate") || "Edit Gate"}
                    onSave={handleSaveEdit}
                    isLoading={loadingUpdate}
                >
                    <InsideGateForm
                        fields={formFields}
                        values={formValues}
                        onChange={handleFormChange}
                    />
                </EditDialog>
            )}

            {/* Delete Dialog */}
            {selectedRow && (
                <DeleteDialog
                    open={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    onDelete={handleDeleteConfirm}
                    name={selectedRow?.name || "this gate"}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}
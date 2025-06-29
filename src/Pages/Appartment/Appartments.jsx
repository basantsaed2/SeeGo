"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { usePost } from "@/Hooks/UsePost";
import { useAppartmentForm, AppartmentFormFields } from "./AppartmentForm";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Appartments = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [Appartments, setAppartments] = useState([]);
    const [selectedRow, setselectedRow] = useState(null);
    const [rowEdit, setRowEdit] = useState(null);
    const { deleteData, loadingDelete } = useDelete();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { t } = useTranslation();

    const { refetch: refetchAppartment, loading: loadingAppartment, data: AppartmentData } = useGet({ url: `${apiUrl}/appartment` });
    const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/appartment/update/${selectedRow?.id}` });

    const {
        formData,
        fields,
        handleFieldChange,
        prepareFormData,
    } = useAppartmentForm(apiUrl, true, rowEdit); // true for edit mode

    useEffect(() => {
        refetchAppartment();
    }, [refetchAppartment]);

    useEffect(() => {
        if (AppartmentData && AppartmentData.appartments) {
            console.log("Appartment Data:", AppartmentData);
            const formatted = AppartmentData?.appartments?.map((u) => ({
                id: u.id,
                name: u.unit || "—", // Keep name as a string
                type: u.type?.name || "—",
                map: u.location || "—",
            }));
            setAppartments(formatted);
            console.log("Formatted Appartments:", formatted);
        }
    }, [AppartmentData]);

    // Fix the initial data format in handleEdit
    const handleEdit = (Appartment) => {
        const fullAppartmentData = AppartmentData?.appartments.find((o) => o.id === Appartment.id);
        setselectedRow(Appartment);
        setIsEditOpen(true);
        setRowEdit({
            name: fullAppartmentData?.unit || "",
            type: fullAppartmentData?.type?.id?.toString() || "", // Ensure type is a string
            appartment_type_id: fullAppartmentData?.type?.id?.toString() || "", // Include for consistency
            map: fullAppartmentData?.location || "",
        });
    };
    const handleDelete = (Appartment) => {
        setselectedRow(Appartment);
        setIsDeleteOpen(true);
    };

    useEffect(() => {
        if (!loadingPost && response) {
            if (response) {
                setIsEditOpen(false);
                setselectedRow(null);
                refetchAppartment();
            }
        }
    }, [response, loadingPost]);

    const handleSave = async () => {
        const body = prepareFormData();
        postData(body, t("Appartmentupdatedsuccessfully!"))
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteData(`${apiUrl}/appartment/delete/${selectedRow.id}`, `${selectedRow.name} Deleted Success.`);

        if (success) {
            setIsDeleteOpen(false);
            setAppartments(
                Appartments.filter((Appartment) =>
                    Appartment.id !== selectedRow.id
                )
            );
        }
    };

    const columns = [
        {
            key: "name",
            label: t("Unit"),
            render: (row) => (
                <Link
                    to={`details/${row.id}`}
                    className="text-blue-600 hover:underline"
                >
                    {row.name || "—"}
                </Link>
            ),
        },
        { key: "type", label: t("Type") },
        { key: "map", label: t("Location") },
    ];
    if (isLoading || loadingPost || loadingAppartment) {
        return <FullPageLoader />;
    }
    return (
        <div className="p-4">
            <DataTable
                data={Appartments}
                columns={columns}
                addRoute="/units/add"
                onEdit={handleEdit}
                onDelete={handleDelete}
                showFilter={false}
                showSearch={true}
                pageDetailsRoute={false}
                additionalLink="/units/create_code"
                additionalLinkLabel={t("CreateCode")}

            />
            {selectedRow && (
                <>
                    <EditDialog
                        title={t("EditUnit")}
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        onSave={handleSave}
                        selectedRow={selectedRow}
                        onCancel={() => setIsEditOpen(false)}
                        onChange={handleFieldChange}
                        isLoading={loadingAppartment}
                    >
                        <div className="w-full max-h-[60vh] p-4 overflow-y-auto">
                            <Tabs defaultValue="english" className="w-full">
                                <TabsContent value="english">
                                    <AppartmentFormFields
                                        fields={fields}
                                        formData={formData}
                                        handleFieldChange={handleFieldChange}
                                        loading={loadingAppartment} // Use the correct loading state
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

export default Appartments;
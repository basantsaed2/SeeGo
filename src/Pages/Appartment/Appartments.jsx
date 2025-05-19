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
import { usePost } from "@/Hooks/UsePost";
import { useAppartmentForm, AppartmentFormFields } from "./AppartmentForm";

const Appartments = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [Appartments, setAppartments] = useState([]);
    const [selectedRow, setselectedRow] = useState(null);
    const [rowEdit, setRowEdit] = useState(null);
    const { changeState, loadingChange, responseChange } = useChangeState();
    const { deleteData, loadingDelete, responseDelete } = useDelete();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { refetch: refetchAppartment, loading: loadingAppartment, data: AppartmentData } = useGet({ url: `${apiUrl}/appartment` });
    const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/appartment/update/${selectedRow?.id}` });

    const {
        formData,
        fields,
        handleFieldChange,
        prepareFormData,
        loadingAppartmentData
    } = useAppartmentForm(apiUrl, true, rowEdit); // true for edit mode

    useEffect(() => {
        refetchAppartment();
    }, [refetchAppartment]);

    useEffect(() => {
        if (AppartmentData && AppartmentData.appartments) {
            console.log("Appartment Data:", AppartmentData);
            const formatted = AppartmentData?.appartments?.map((u) => {
                return {
                    id: u.id,
                    name: u.zone?.name || "",
                    unit: u.unit || "—",
                    floors: u.number_floors || "—",
                    type: u.type?.name || "—",
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
            setAppartments(formatted);
            console.log("Formatted Appartments:", formatted);
        }
    }, [AppartmentData]);

    // Fix the initial data format in handleEdit
    const handleEdit = (Appartment) => {
        const fullAppartmentData = AppartmentData?.appartments.find(o => o.id === Appartment.id);
        setselectedRow(Appartment);
        setIsEditOpen(true);
        setRowEdit({
            unit: fullAppartmentData?.unit || "",
            floors: fullAppartmentData?.number_floors || "",
            type: fullAppartmentData?.type?.id?.toString() || "",
            zone: fullAppartmentData?.zone?.id?.toString() || "",
            image_link: fullAppartmentData?.image_link || null,
            // Ensure these match your form's field names exactly
            appartment_type_id: fullAppartmentData?.type?.id?.toString() || "",
            zone_id: fullAppartmentData?.zone?.id?.toString() || ""
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
        postData(body, "Appartment updated successfully!")
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteData(`${apiUrl}/appartment/delete/${selectedRow.id}`, `${selectedRow.unit} Deleted Success.`);

        if (success) {
            setIsDeleteOpen(false);
            setAppartments(
                Appartments.filter((Appartment) =>
                    Appartment.id !== selectedRow.id
                )
            );
        }
    };

    const handleToggleStatus = async (row, newStatus) => {
        const response = await changeState(
            `${apiUrl}/appartment/status/${row.id}?status=${newStatus}`,
            `${row.name} Changed Status.`,
        );
        if (response) {
            setAppartments((prev) =>
                prev.map((Appartment) =>
                    Appartment.id === row.id ? { ...Appartment, status: newStatus === 1 ? "Active" : "Inactive" } : Appartment
                )
            );
        }
    };

    const columns = [
        { key: "img", label: "Image" },
        { key: "unit", label: "Unit" },
        { key: "name", label: "Zone" },
        { key: "type", label: "Type" },
        { key: "floors", label: "Floors Number" },
    ];
    if (isLoading || loadingPost || loadingAppartment) {
        return <FullPageLoader />;
    }
    return (
        <div className="p-4">
            <DataTable
                data={Appartments}
                columns={columns}
                addRoute="/appartments/add"
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                pageDetailsRoute={false}
                additionalLink="/appartments/create_code"
                additionalLinkLabel={"Create Code"}

            />
            {selectedRow && (
                <>
                    <EditDialog
                        title="Edit Appartment"
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
                        name={selectedRow.unit}
                        isLoading={loadingDelete}
                    />
                </>
            )}
        </div>
    );
};

export default Appartments;
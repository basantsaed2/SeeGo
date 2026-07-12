"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { usePost } from "@/Hooks/UsePost";
import { useTranslation } from "react-i18next";
import { UmbrellaFormFields, useUmbrellaForm } from "./useUmbrellaForm";

const UmbrellasList = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [umbrellasData, setUmbrellasData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowEdit, setRowEdit] = useState(null);
    const { deleteData, loadingDelete, isDeleting } = useDelete();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { t } = useTranslation();

    // جلب قائمة الـ Umbrellas
    const { refetch: refetchUmbrellas, loading: loadingUmbrellas, data: apiData } = useGet({
        url: `${apiUrl}/appartment_type_umbrella`
    });

    // جلب خيارات القوائم المنسدلة (لعرض الأسماء في الجدول بدلاً من الـ IDs)
    const { data: optionsData } = useGet({
        url: `${apiUrl}/appartment_type_umbrella/list`
    });

    const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/appartment_type_umbrella/update/${selectedRow?.id}` });

    const {
        formData,
        fields,
        handleFieldChange,
        prepareFormData,
    } = useUmbrellaForm(apiUrl, true, rowEdit);

    useEffect(() => {
        refetchUmbrellas();
    }, [refetchUmbrellas]);

    useEffect(() => {
        const umbrellasList = apiData?.umbrellas || [];
        const appartmentTypes = optionsData?.appartment_types || [];

        if (Array.isArray(umbrellasList)) {
            const formatted = umbrellasList.map((u) => {
                // مطابقة הـ ID بالاسم لتسهيل القراءة في الجدول
                const typeName = appartmentTypes.find(t => t.id === u.appartment_type_id)?.name || u.appartment_type_id;

                return {
                    id: u.id,
                    appartment_type_id: u.appartment_type_id,
                    appartment_type_name: typeName,
                    village_id: u.village_id,
                    umbrellas: u.umbrellas,
                    created_at: u.created_at,
                };
            });
            setUmbrellasData(formatted);
        } else {
            setUmbrellasData([]); 
        }
    }, [apiData, optionsData]);

    const handleEdit = (row) => {
        setSelectedRow(row);
        setRowEdit({
            appartment_type_id: row.appartment_type_id?.toString() || "",
            umbrellas: row.umbrellas?.toString() || "",
        });
        setIsEditOpen(true);
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setIsDeleteOpen(true);
    };

    useEffect(() => {
        if (!loadingPost && response) {
            if (response.status === 200 || response.status === 201) {
                setIsEditOpen(false);
                setSelectedRow(null);
                refetchUmbrellas();
            }
        }
    }, [response, loadingPost, refetchUmbrellas]);

    const handleSave = async () => {
        const body = prepareFormData();
        postData(body, t("Updated successfully!"));
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteData(`${apiUrl}/appartment_type_umbrella/delete/${selectedRow.id}`, t("Deleted Successfully"));
        if (success) {
            setIsDeleteOpen(false);
            setUmbrellasData(umbrellasData.filter((item) => item.id !== selectedRow.id));
        }
    };

    const columns = [
        { key: "id", label: t("ID") },
        { key: "appartment_type_name", label: t("Appartment Type") },
        { 
            key: "umbrellas", 
            label: t("Umbrellas Count"),
            render: (row) => (
                <span className="font-bold text-teal-600 bg-teal-50 !px-3 !py-1 rounded-lg">
                    {row.umbrellas}
                </span>
            )
        },
        { 
            key: "created_at", 
            label: t("Created At"),
            render: (row) => new Date(row.created_at).toLocaleDateString()
        },
    ];

    if (isLoading || loadingUmbrellas) { 
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <ToastContainer />
            <DataTable
                data={umbrellasData}
                columns={columns}
                addRoute="/unit-type/add"
                onEdit={handleEdit}
                onDelete={handleDelete}
                showFilter={false}
                showSearch={false}
            />

            {selectedRow && (
                <>
                    <EditDialog
                        title={t("Edit Umbrella Configuration")}
                        open={isEditOpen}
                        onOpenChange={setIsEditOpen}
                        onSave={handleSave}
                        selectedRow={selectedRow}
                        onCancel={() => setIsEditOpen(false)}
                        isLoading={loadingPost}
                    >
                        <div className="w-full p-4">
                            <UmbrellaFormFields
                                fields={fields}
                                formData={formData}
                                handleFieldChange={handleFieldChange}
                                loading={false}
                            />
                        </div>
                    </EditDialog>

                    <DeleteDialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        isDeleting={isDeleting}
                        onDelete={handleDeleteConfirm}
                        name={`Configuration ID: ${selectedRow.id}`}
                        isLoading={loadingDelete}
                    />
                </>
            )}
        </div>
    );
};

export default UmbrellasList;
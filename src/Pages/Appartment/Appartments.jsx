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
import { Switch } from "@/components/ui/switch"; // 🛠️ استيراد الـ Switch للاستخدام في الـ Dialog

const Appartments = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [Appartments, setAppartments] = useState([]);
    const [selectedRow, setselectedRow] = useState(null);
    const [rowEdit, setRowEdit] = useState(null);
    const { deleteData, loadingDelete, isDeleting } = useDelete();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { t } = useTranslation();

    // 🛠️ 1. تعريف الـ State الخاص بحالات الحظر في صفحة التعديل
    const [banStatuses, setBanStatuses] = useState({
        all_status: false,
        entrance_status: false,
        selling_status: false,
        rent_status: false,
        visits_status: false,
        pool_status: false,
        beach_status: false,
        rent_code_status: false,
        options_status: false,
    });

    // 🛠️ دالة تحديث السويتشات عند الضغط عليها
    const handleSwitchChange = (key, value) => {
        setBanStatuses((prev) => ({ ...prev, [key]: value }));
    };

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
                name: u.unit || "—",
                type: u.type?.name || "—",
                map: u.location || "—",
                // إضافة الحالات هنا لكي يراها الـ DataTable
                all_status: u.all_status,
                entrance_status: u.entrance_status,
                selling_status: u.selling_status,
                rent_status: u.rent_status,
                visits_status: u.visits_status,
                pool_status: u.pool_status,
                beach_status: u.beach_status,
                rent_code_status: u.rent_code_status,
                options_status: u.options_status,
            }));
            setAppartments(formatted);
            console.log("Formatted Appartments:", formatted);
        }
    }, [AppartmentData]);

    // 🛠️ 2. تعديل دالة الـ handleEdit لجلب قيم السويتشات الحالية للوحدة المحددة
    const handleEdit = (Appartment) => {
        const fullAppartmentData = AppartmentData?.appartments.find((o) => o.id === Appartment.id);
        setselectedRow(Appartment);
        setIsEditOpen(true);
        setRowEdit({
            name: fullAppartmentData?.unit || "",
            type: fullAppartmentData?.type?.id?.toString() || "",
            appartment_type_id: fullAppartmentData?.type?.id?.toString() || "",
            map: fullAppartmentData?.location || "",
        });

        // ملء السويتشات بالقيم المخزنة في قاعدة البيانات مع دعم كافة أنواع التعبيرات الممكنة (1, true, "true")
        if (fullAppartmentData) {
            setBanStatuses({
                all_status: fullAppartmentData.all_status == 1 || fullAppartmentData.all_status === true || fullAppartmentData.all_status === "true",
                entrance_status: fullAppartmentData.entrance_status == 1 || fullAppartmentData.entrance_status === true || fullAppartmentData.entrance_status === "true",
                selling_status: fullAppartmentData.selling_status == 1 || fullAppartmentData.selling_status === true || fullAppartmentData.selling_status === "true",
                rent_status: fullAppartmentData.rent_status == 1 || fullAppartmentData.rent_status === true || fullAppartmentData.rent_status === "true",
                visits_status: fullAppartmentData.visits_status == 1 || fullAppartmentData.visits_status === true || fullAppartmentData.visits_status === "true",
                pool_status: fullAppartmentData.pool_status == 1 || fullAppartmentData.pool_status === true || fullAppartmentData.pool_status === "true",
                beach_status: fullAppartmentData.beach_status == 1 || fullAppartmentData.beach_status === true || fullAppartmentData.beach_status === "true",
                rent_code_status: fullAppartmentData.rent_code_status == 1 || fullAppartmentData.rent_code_status === true || fullAppartmentData.rent_code_status === "true",
                options_status: fullAppartmentData.options_status == 1 || fullAppartmentData.options_status === true || fullAppartmentData.options_status === "true",
            });
        }
    };

    const handleDelete = (Appartment) => {
        setselectedRow(Appartment);
        setIsDeleteOpen(true);
    };

    useEffect(() => {
        if (!loadingPost && response) {
            if (response.status === 200 || response.status === 201) {
                setIsEditOpen(false);
                setselectedRow(null);
                refetchAppartment();
            }
        }
    }, [response, loadingPost]);

    // 🛠️ 3. تعديل دالة الـ handleSave لدمج وإرسال بيانات السويتشات المعدلة كـ "1" أو "0" 
    const handleSave = async () => {
        const body = prepareFormData();

        Object.keys(banStatuses).forEach((key) => {
            const cleanKey = key.trim();
            const stringValue = banStatuses[key] ? "1" : "0"; // تحويل الـ boolean لـ 1 أو 0 لحل مشكلة تحقق السيرفر

            if (body instanceof FormData) {
                body.delete(cleanKey);
                body.append(cleanKey, stringValue);
            } else {
                body[cleanKey] = stringValue;
            }
        });

        postData(body, t("Appartmentupdatedsuccessfully!"));
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
    // دالة مساعدة لتنسيق الحالات (0 و 1) داخل الجدول
    const renderStatusBadge = (statusValue) => {
        // التحقق من القيمة سواء كانت رقم، نص، أو boolean
        const isActive = statusValue == 1 || statusValue === true || statusValue === "1";

        return (
            <span
                className={`inline-flex items-center !px-2.5 !py-0.5 rounded-full text-xs font-medium ${isActive
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"   // إذا كان محظور (1) باللون الأحمر
                    // إذا كان متاح (0) باللون الأخضر
                    }`}
            >
                {isActive ? t("Active") : t("Inactive")}
            </span>
        );
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
        // --- تحديث أعمدة حالات الحظر هنا ---
        {
            key: "all_status",
            label: t("all_status"),
            render: (row) => renderStatusBadge(row.all_status)
        },
        {
            key: "entrance_status",
            label: t("entrance_status"),
            render: (row) => renderStatusBadge(row.entrance_status)
        },
        {
            key: "selling_status",
            label: t("selling_status"),
            render: (row) => renderStatusBadge(row.selling_status)
        },
        {
            key: "rent_status",
            label: t("rent_status"),
            render: (row) => renderStatusBadge(row.rent_status)
        },
        {
            key: "visits_status",
            label: t("visits_status"),
            render: (row) => renderStatusBadge(row.visits_status)
        },
        {
            key: "pool_status",
            label: t("pool_status"),
            render: (row) => renderStatusBadge(row.pool_status)
        },
        {
            key: "beach_status",
            label: t("beach_status"),
            render: (row) => renderStatusBadge(row.beach_status)
        },
        {
            key: "rent_code_status",
            label: t("rent_code_status"),
            render: (row) => renderStatusBadge(row.rent_code_status)
        },
        {
            key: "options_status",
            label: t("options_status"),
            render: (row) => renderStatusBadge(row.options_status)
        },
        // ----------------------------------
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
                                        loading={loadingAppartment}
                                    />

                                    {/* 🛠️ 4. حقن وإظهار قسم السويتشات الخاص بالـ BanStatuses أسفل الحقول داخل الـ Modal */}
                                    <div className="border-t !pt-5 !mt-4">
                                        <h3 className="text-md font-medium !mb-4 text-gray-700">{t("BanStatuses")}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {Object.keys(banStatuses).map((statusKey) => (
                                                <div key={statusKey} className="flex items-center justify-between !p-3 border rounded-xl bg-gray-50/50 shadow-sm">
                                                    <span className="text-xs font-medium text-gray-600">{t(statusKey)}</span>
                                                    <Switch
                                                        checked={banStatuses[statusKey]}
                                                        onCheckedChange={(checked) => handleSwitchChange(statusKey, checked)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </EditDialog>

                    <DeleteDialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        isDeleting={isDeleting}
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
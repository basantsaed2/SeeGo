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
import { Switch } from "@/components/ui/switch"; 
import { Eye } from "lucide-react"; // استيراد أيقونة العين لزر العرض

// استيراد مكونات الـ Dialog الأساسية من الـ UI الخاص بكِ لعرض الـ Bans
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

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

    // 💡 حالات الـ Dialog الجديد الخاص بعرض الـ Bans
    const [isBansDialogOpen, setIsBansDialogOpen] = useState(false);
    const [activeBansData, setActiveBansData] = useState(null);

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
    } = useAppartmentForm(apiUrl, true, rowEdit); 

    useEffect(() => {
        refetchAppartment();
    }, [refetchAppartment]);

    useEffect(() => {
        if (AppartmentData && AppartmentData.appartments) {
            const formatted = AppartmentData?.appartments?.map((u) => ({
                id: u.id,
                name: u.unit || "—",
                type: u.type?.name || "—",
                map: u.location || "—",
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
        }
    }, [AppartmentData]);

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

    const handleSave = async () => {
        const body = prepareFormData();

        Object.keys(banStatuses).forEach((key) => {
            const cleanKey = key.trim();
            const stringValue = banStatuses[key] ? "1" : "0";

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
            setAppartments(Appartments.filter((Appartment) => Appartment.id !== selectedRow.id));
        }
    };

    // دالة مساعدة لتنسيق شارات الحالة (Badges) داخل الـ Dialog الجديد
    const renderStatusBadge = (statusValue) => {
        const isActive = statusValue == 1 || statusValue === true || statusValue === "1";
        return (
            <span
                className={`inline-flex items-center !px-2.5 !py-1 rounded-full text-xs font-bold ${
                    isActive
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                }`}
            >
                {isActive ? t("Active") : t("Inactive")}
            </span>
        );
    };

    // 💡 دالة فتح نافذة الـ Bans وتمرير بيانات السطر المحدد لها
    const openBansDialog = (row) => {
        setActiveBansData(row);
        setIsBansDialogOpen(true);
    };

    // 🛠️ جدول الأعمدة الجديد: قمنا بتنظيف الـ 9 أعمدة واستبدالهم بزر عرض ذكي واحد
    const columns = [
        {
            key: "name",
            label: t("Unit"),
            render: (row) => (
                <Link to={`details/${row.id}`} className="text-blue-600 hover:underline font-semibold">
                    {row.name || "—"}
                </Link>
            ),
        },
        {
            key: "bans_view",
            label: t("BanStatuses"),
            render: (row) => (
                <button
                    onClick={() => openBansDialog(row)}
                    className="inline-flex items-center gap-1.5 !px-3 !py-1.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors text-xs font-bold"
                >
                    <Eye size={14} />
                    {t("View Statuses")}
                </button>
            ),
        },
        { key: "type", label: t("Type") },
        { key: "map", label: t("Location") },
    ];

    if (isLoading || loadingPost || loadingAppartment) {
        return <FullPageLoader />;
    }

    // مصفوفة مساعدة للمرور على مفاتيح الـ Bans لترجمتها وعرضها داخل الـ Dialog
    const banKeys = [
        "all_status", "entrance_status", "selling_status", "rent_status",
        "visits_status", "pool_status", "beach_status", "rent_code_status", "options_status"
    ];

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

            {/* 🌟 نافذة الـ Dialog الجديدة لعرض جميع حالات الحظر (Bans) للوحدة المحددة */}
            <Dialog open={isBansDialogOpen} onOpenChange={setIsBansDialogOpen}>
                <DialogContent className="sm:max-w-[460px] rounded-2xl !p-6">
                    <DialogHeader className="border-b !pb-3">
                        <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span>{t("BanStatuses")}</span>
                            <span className="text-primary font-black bg-primary/10 !px-2 !py-0.5 rounded-lg text-sm">
                                #{activeBansData?.name}
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    {/* قائمة الحالات */}
                    <div className="grid grid-cols-1 gap-3 !py-4 max-h-[50vh] overflow-y-auto !pr-1">
                        {activeBansData && banKeys.map((key) => (
                            <div 
                                key={key} 
                                className="flex items-center justify-between !p-3 border border-slate-100 rounded-xl bg-slate-50/50 shadow-sm hover:bg-slate-50 transition-colors"
                            >
                                <span className="text-xs font-bold text-slate-600">
                                    {t(key)}
                                </span>
                                <div>
                                    {renderStatusBadge(activeBansData[key])}
                                </div>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

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
                        <div className="w-full max-h-[60vh] !p-4 overflow-y-auto">
                            <Tabs defaultValue="english" className="w-full">
                                <TabsContent value="english">
                                    <AppartmentFormFields
                                        fields={fields}
                                        formData={formData}
                                        handleFieldChange={handleFieldChange}
                                        loading={loadingAppartment}
                                    />

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
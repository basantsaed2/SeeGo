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
import { Eye } from "lucide-react";

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

    const [currentPage, setCurrentPage] = useState(1);

    const [searchInput, setSearchInput] = useState(""); 
    const [debouncedSearch, setDebouncedSearch] = useState(""); 

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

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setCurrentPage(1); 
        }, 500); 

        return () => {
            clearTimeout(handler);
        };
    }, [searchInput]);

    const { refetch: refetchAppartment, loading: loadingAppartment, data: AppartmentData } = useGet({
        url: `${apiUrl}/appartment?page=${currentPage}${debouncedSearch ? `&search=${debouncedSearch}` : ""}`
    });

    const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/appartment/update/${selectedRow?.id}` });

    const {
        formData,
        fields,
        handleFieldChange,
        prepareFormData,
    } = useAppartmentForm(apiUrl, true, rowEdit);

    useEffect(() => {
        refetchAppartment();
    }, [refetchAppartment, currentPage, debouncedSearch]); 

    useEffect(() => {
        const appartmentList = AppartmentData?.appartments?.data || AppartmentData?.appartments;

        if (appartmentList && Array.isArray(appartmentList)) {
            const formatted = appartmentList.map((u) => ({
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
                formatted_codes: u.formatted_codes || [],
            }));
            setAppartments(formatted);
        } else {
            setAppartments([]); 
        }
    }, [AppartmentData]);

    const handleEdit = (Appartment) => {
        const appartmentList = AppartmentData?.appartments?.data || AppartmentData?.appartments || [];
        const fullAppartmentData = appartmentList.find((o) => o.id === Appartment.id);

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
                setIsBansDialogOpen(false); 
                setselectedRow(null);
                refetchAppartment();
            }
        }
    }, [response, loadingPost]);

    const handleSave = async () => {
        const body = prepareFormData();

        const unitValue = rowEdit?.name || "";
        const typeIdValue = rowEdit?.appartment_type_id || "";

        if (body instanceof FormData) {
            body.set("unit", unitValue);
            body.set("appartment_type_id", typeIdValue);
            
            Object.keys(banStatuses).forEach((key) => {
                const stringValue = banStatuses[key] ? "1" : "0";
                body.set(key.trim(), stringValue);
            });
        } else {
            body["unit"] = unitValue;
            body["appartment_type_id"] = typeIdValue;
            
            Object.keys(banStatuses).forEach((key) => {
                const stringValue = banStatuses[key] ? "1" : "0";
                body[key.trim()] = stringValue;
            });
        }

        postData(body, t("Appartmentupdatedsuccessfully!"));
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteData(`${apiUrl}/appartment/delete/${selectedRow.id}`, `${selectedRow.name} Deleted Success.`);
        if (success) {
            setIsDeleteOpen(false);
            setAppartments(Appartments.filter((Appartment) => Appartment.id !== selectedRow.id));
        }
    };

    const openBansDialog = (row) => {
        const appartmentList = AppartmentData?.appartments?.data || AppartmentData?.appartments || [];
        const fullAppartmentData = appartmentList.find((o) => o.id === row.id);

        setActiveBansData(row);
        setselectedRow(row); 
        
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
        
        setIsBansDialogOpen(true);
    };

    // 🌟 تحديث المصفوفة لتعرض الأكواد مباشرة وبشكل منسق داخل الخلية
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
{
        key: "formatted_codes",
        label: t("Codes"),
        render: (row) => {
            // التأكد أولاً إذا كان الكود موجوداً داخل الأوبجكت
            if (row.formatted_codes && row.formatted_codes.code) {
                return (
                    <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50/50 border border-blue-100 !px-2.5 !py-1 rounded-lg">
                        {row.formatted_codes.code}
                    </span>
                );
            }
            // في حال كان جاي من الـ API كـ Array (للاحتياط)
            if (Array.isArray(row.formatted_codes) && row.formatted_codes.length > 0) {
                return (
                    <span className="font-mono text-sm font-bold text-blue-600 bg-blue-50/50 border border-blue-100 !px-2.5 !py-1 rounded-lg">
                        {row.formatted_codes[0].code}
                    </span>
                );
            }
            // إذا لم يكن هناك كود مطلقاً
            return <span className="text-gray-400 font-normal">—</span>;
        },
    },
        { key: "type", label: t("Type") },
        { key: "map", label: t("Location") },
    ];

    if (isLoading || loadingPost) { 
        return <FullPageLoader />;
    }

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

                isBackendPagination={true}
                backendCurrentPage={AppartmentData?.appartments?.current_page || 1}
                backendTotalPages={AppartmentData?.appartments?.last_page || 1}
                onBackendPageChange={(newPage) => setCurrentPage(newPage)}

                onSearchChange={(val) => setSearchInput(val)}
            />

            <Dialog open={isBansDialogOpen} onOpenChange={setIsBansDialogOpen}>
                <DialogContent className="sm:max-w-[460px] rounded-2xl !p-6">
                    <DialogHeader className="border-b !pb-3">
                        <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span>{t("BanStatuses")}</span>
                            <span className="text-teal-600 font-black bg-teal-50 !px-2 !py-0.5 rounded-lg text-sm">
                                #{activeBansData?.name}
                            </span>
                        </DialogTitle>
                    </DialogHeader>

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
                                    <Switch
                                        checked={banStatuses[key]}
                                        onCheckedChange={(checked) => handleSwitchChange(key, checked)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end border-t !pt-4 mt-2">
                        <button
                            onClick={handleSave}
                            disabled={loadingPost}
                            className="inline-flex items-center justify-center rounded-xl bg-teal-600 !px-5 !py-2.5 text-sm font-bold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 transition-colors"
                        >
                            {loadingPost ? t("Saving...") : t("Save Changes")}
                        </button>
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
                        <div className="w-full max-h-[60vh] p-4 overflow-y-auto">
                            <Tabs defaultValue="english" className="w-full">
                                <TabsContent value="english">
                                    <AppartmentFormFields
                                        fields={fields}
                                        formData={formData}
                                        handleFieldChange={handleFieldChange}
                                        loading={loadingAppartment}
                                    />
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
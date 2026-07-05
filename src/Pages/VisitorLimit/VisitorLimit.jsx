"use client";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import Add from "@/components/AddFieldSection";
import { useTranslation } from "react-i18next";
import { useChangeState } from "@/Hooks/useChangeState";
import { useDelete } from "@/Hooks/useDelete";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// استيراد المكونات المساعدة التي قمت بإرفاقها
import DataTable from "@/components/DataTableLayout"; // تأكد من مسار الاستيراد الصحيح
import EditDialog from "@/components/EditDialog"; 
import DeleteDialog from "@/components/DeleteDialog";

const VisitorLimit = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const { t } = useTranslation();

    // --- Main States ---
    const [activeTab, setActiveTab] = useState("visitor");
    
    // --- Renter CRUD States for Dialogs ---
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAddMode, setIsAddMode] = useState(false); // للتفريق بين الإضافة والتعديل في نفس الـ Dialog
    const [selectedItem, setSelectedItem] = useState(null);
    
    const [renterFormData, setRenterFormData] = useState({
        appartment_type_id: "",
        renter_limit: 0
    });

    const [visitorLimit, setVisitorLimit] = useState({
        guest: 0,
        worker: 0,
        delivery: 0,
        renter_guest: 0,
        renter_worker: 0,
        renter_delivery: 0
    });

    // --- API Hooks ---
    // 1. Visitor Limits
    const { refetch: refetchVisitorLimit, loading: loadingVisitorLimitData, data: VisitorLimitData } = useGet({
        url: `${apiUrl}/visitor_limit`,
    });
    const { postData: updateVisitorLimit, loadingPost: loadingVisitorLimit } = usePost({
        url: `${apiUrl}/visitor_limit/update`,
    });

    // 2. Renter Settings (CRUD APIs)
    const { refetch: refetchSettings, loading: loadingSettings, data: settingsData } = useGet({
        url: `${apiUrl}/setting`, // Get All
    });

    const { postData: addSetting, loadingPost: loadingAdd } = usePost({
        url: `${apiUrl}/setting/add`, // Add New
    });

    const { changeState: updateSetting, loadingChange: loadingEdit } = useChangeState(); // Edit by ID
    const { deleteData, loadingDelete, isDeleting } = useDelete(); // Delete by ID

    // Hook لجلب قائمة أنواع الشقق للـ Dropdown
    const { data: typesData } = useGet({
        url: `${apiUrl}/setting/lists`,
    });

    // --- UseEffects ---
    useEffect(() => {
        refetchVisitorLimit();
        refetchSettings();
    }, [refetchVisitorLimit, refetchSettings]);

    useEffect(() => {
        if (VisitorLimitData?.visitor_limit) {
            setVisitorLimit(VisitorLimitData.visitor_limit);
        }
    }, [VisitorLimitData]);

    // --- Handlers ---
    const handleVisitorChange = (field, value) => {
        setVisitorLimit(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
    };

    // فتح نافذة الإضافة الجديدة
    const handleOpenAddDialog = () => {
        setIsAddMode(true);
        setSelectedItem({}); // تمرير كائن فارغ لتجنب الـ return null في EditDialog
        setRenterFormData({ appartment_type_id: "", renter_limit: 0 });
        setIsEditDialogOpen(true);
    };

    // فتح نافذة التعديل لعنصر محدد
    const handleOpenEditDialog = (row) => {
        setIsAddMode(false);
        setSelectedItem(row);
        setRenterFormData({
            appartment_type_id: row.appartment_type_id || row.id,
            renter_limit: row.renter_limit || row.rent || 0
        });
        setIsEditDialogOpen(true);
    };

    // فتح نافذة الحذف
    const handleOpenDeleteDialog = (row) => {
        setSelectedItem(row);
        setIsDeleteDialogOpen(true);
    };

    // حفظ البيانات (Add / Edit) عند الضغط على Save في EditDialog
    const handleSaveDialog = async () => {
        if (isAddMode) {
            await addSetting(renterFormData, t('AddedSuccessfully'));
        } else {
            const url = `${apiUrl}/setting/${selectedItem.id}`;
            await updateSetting(url, t('UpdatedSuccessfully'), renterFormData);
        }
        setIsEditDialogOpen(false);
        refetchSettings();
    };

    // تأكيد الحذف من DeleteDialog
    const handleConfirmDelete = async () => {
        if (selectedItem?.id) {
            const url = `${apiUrl}/setting/${selectedItem.id}`;
            await deleteData(url, t('DeletedSuccessfully'));
            setIsDeleteDialogOpen(false);
            refetchSettings();
        }
    };

    const visitorFields = [
        { name: "guest", type: "input", inputType: "number", placeholder: t("OwnerGuestLimit"), min: 0 },
        { name: "worker", type: "input", inputType: "number", placeholder: t('OwnerWorkerLimit'), min: 0 },
        { name: "delivery", type: "input", inputType: "number", placeholder: t("OwnerDeliveryLimit"), min: 0 },
        { name: "renter_guest", type: "input", inputType: "number", placeholder: t("OwnerRenterGuestLimit"), min: 0 },
        { name: "renter_worker", type: "input", inputType: "number", placeholder: t("RenterWorkerLimit"), min: 0 },
        { name: "renter_delivery", type: "input", inputType: "number", placeholder: t("RenterDeliveryLimit"), min: 0 }
    ];

    if (isLoading || loadingVisitorLimitData || loadingSettings) {
        return <FullPageLoader />;
    }

    const renterList = settingsData?.data || settingsData?.settings || settingsData?.appartments_types || [];

    // تعريف أعمدة الجدول لـ DataTable
    const columns = [
        {
            label: t("ApartmentType"),
            key: "name",
            render: (row) => <span className="font-medium">{row.name || row.appartment_type_name || t("-")}</span>
        },
        {
            label: t("RenterLimit"),
            key: "renter_limit",
            render: (row) => (
                <span className="bg-green-100 text-green-800 font-semibold !px-2 !py-1 rounded text-xs">
                    {row.renter_limit || row.rent || 0}
                </span>
            )
        }
    ];

    return (
        <div className="min-h-screen">
            <div className="!p-6">
                <h1 className="text-2xl text-bg-primary font-semibold !mb-6">{t("LimitSettings")}</h1>

                {/* --- Tabs Header --- */}
                <div className="flex border-b border-gray-200 !mb-6">
                    <button onClick={() => setActiveTab("visitor")} className={`!py-2 !px-4 text-sm font-medium ${activeTab === "visitor" ? "border-b-2 border-bg-primary text-bg-primary" : "text-gray-500"}`}>
                        {t("VisitorLimits")}
                    </button>
                    <button onClick={() => setActiveTab("renter")} className={`!py-2 !px-4 text-sm font-medium ${activeTab === "renter" ? "border-b-2 border-bg-primary text-bg-primary" : "text-gray-500"}`}>
                        {t("RenterLimits")}
                    </button>
                </div>

                {/* --- Tab 1: Visitor Limits --- */}
                {activeTab === "visitor" && (
                    <div className="animate-fade-in">
                        <Add fields={visitorFields} lang="en" values={visitorLimit} onChange={(lang, name, value) => handleVisitorChange(name, value)} />
                        <div className="!mt-6 flex justify-end">
                            <button disabled={loadingVisitorLimit} onClick={(e) => { e.preventDefault(); updateVisitorLimit(visitorLimit, t('Visitorlimitsupdatedsuccessfully')); }} className="bg-bg-primary text-white !py-2 !px-6 rounded-lg">
                                {loadingVisitorLimit ? t("Saving") : t("SaveChanges")}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- Tab 2: Renter Limits (Using Custom Components) --- */}
                {activeTab === "renter" && (
                    <div className="animate-fade-in space-y-4">
                        
                        {/* Custom Header with Add Button for Dialog */}
                        <div className="flex justify-between items-center !px-3">
                            <h2 className="text-lg font-medium text-bg-primary">{t("ApartmentRenterLimits")}</h2>
                            <Button onClick={handleOpenAddDialog} className="bg-bg-primary cursor-pointer text-white hover:bg-teal-700 rounded-[10px] !p-3">
                                <Plus className="w-5 h-5 !mr-2" />
                                {t("AddNewLimit")}
                            </Button>
                        </div>

                        {/* DataTable Component */}
                        <DataTable
                            data={renterList}
                            columns={columns}
                            showAddButton={false} // تم تعطيله لأننا نستخدم زر مخصص لفتح Dialog بدلاً من التوجيه لصفحة جديدة
                            onEdit={handleOpenEditDialog}
                            onDelete={handleOpenDeleteDialog}
                            // detailsData={renterList} // لتمكين زر View Details المدمج داخل DataTable
                        />

                        {/* Edit & Add Dialog Component */}
                        <EditDialog
                            open={isEditDialogOpen}
                            onOpenChange={setIsEditDialogOpen}
                            selectedRow={selectedItem || {}}
                            onSave={handleSaveDialog}
                            title={isAddMode ? t("AddNewRenterLimit") : t("EditRenterLimit")}
                        >
                            <div className="space-y-4 !py-2">
                                <div>
                                    <label className="block text-sm font-medium !mb-1 text-gray-700">{t("ApartmentType")}</label>
                                    <select
                                        className="border !p-3 rounded-lg w-full bg-white focus:ring-2 focus:ring-bg-primary focus:outline-none text-sm"
                                        value={renterFormData.appartment_type_id}
                                        disabled={!isAddMode} // يفضل منع تغيير نوع الشقة أثناء التعديل
                                        onChange={(e) => setRenterFormData({ ...renterFormData, appartment_type_id: e.target.value })}
                                        required
                                    >
                                        <option value="">{t("SelectApartmentType")}</option>
                                        {typesData?.appartments_types?.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium !mb-1 text-gray-700">{t("RenterLimit")}</label>
                                    <input
                                        type="number"
                                        className="border !p-3 rounded-lg w-full bg-white focus:ring-2 focus:ring-bg-primary focus:outline-none text-sm"
                                        value={renterFormData.renter_limit}
                                        onChange={(e) => setRenterFormData({ ...renterFormData, renter_limit: parseInt(e.target.value) || 0 })}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                        </EditDialog>

                        {/* Delete Dialog Component */}
                        <DeleteDialog
                            open={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                            onDelete={handleConfirmDelete}
                            name={selectedItem?.name || selectedItem?.appartment_type?.name || `ID: ${selectedItem?.id}`}
                            isDeleting={loadingDelete || isDeleting}
                        />

                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default VisitorLimit;
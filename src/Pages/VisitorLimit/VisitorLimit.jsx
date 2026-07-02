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
import { useDelete } from "@/Hooks/useDelete"; // تم استيراد هوك الحذف

const VisitorLimit = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const { t } = useTranslation();

    // --- States ---
    const [activeTab, setActiveTab] = useState("visitor");
    const [selectedApartmentId, setSelectedApartmentId] = useState("");
    const [visitorLimit, setVisitorLimit] = useState({
        guest: 0,
        worker: 0,
        delivery: 0,
        renter_guest: 0,
        renter_worker: 0,
        renter_delivery: 0
    });

    const [apartmentRents, setApartmentRents] = useState([]);

    // --- API Hooks ---
    const { refetch: refetchVisitorLimit, loading: loadingVisitorLimitData, data: VisitorLimitData } = useGet({
        url: `${apiUrl}/visitor_limit`,
    });

    const { postData: updateVisitorLimit, loadingPost: loadingVisitorLimit } = usePost({
        url: `${apiUrl}/visitor_limit/update`,
    });

    const { refetch: refetchTypes, data: typesData } = useGet({
        url: `${apiUrl}/setting/lists`,
    });

    const { refetch: refetchSingleSetting, data: singleSettingData } = useGet({
        url: selectedApartmentId ? `${apiUrl}/setting/${String(selectedApartmentId)}` : null,
    });

    const { changeState, loadingChange } = useChangeState(); // هوك التعديل (PUT)
    const { deleteData, loadingDelete, isDeleting } = useDelete(); // هوك الحذف (DELETE)

    // --- UseEffects ---
    useEffect(() => {
        refetchVisitorLimit();
        refetchTypes();
    }, [refetchVisitorLimit, refetchTypes]);

    useEffect(() => {
        if (VisitorLimitData?.visitor_limit) {
            setVisitorLimit(VisitorLimitData.visitor_limit);
        }
    }, [VisitorLimitData]);

    useEffect(() => {
        if (typesData?.appartments_types) {
            setApartmentRents(typesData.appartments_types.map(type => ({
                id: type.id,
                name: type.name,
                rent: type.renter_limit || type.rent || 0
            })));
        }
    }, [typesData]);

    useEffect(() => {
        if (selectedApartmentId) {
            refetchSingleSetting();
        }
    }, [selectedApartmentId]);

    useEffect(() => {
        if (singleSettingData && selectedApartmentId) {
            const limitVal = singleSettingData?.renter_limit ?? singleSettingData?.data?.renter_limit ?? singleSettingData?.setting?.renter_limit ?? singleSettingData?.rent ?? 0;
            setApartmentRents(prev => prev.map(item =>
                String(item.id) === String(selectedApartmentId)
                    ? { ...item, rent: limitVal }
                    : item
            ));
        }
    }, [singleSettingData, selectedApartmentId]);

    // --- Handlers ---
    const handleVisitorChange = (field, value) => {
        setVisitorLimit(prev => ({
            ...prev,
            [field]: parseInt(value) || 0
        }));
    };

    const handleUpdateRent = async (id, rentValue) => {
        const payload = {
            appartment_type_id: id,
            renter_limit: parseInt(rentValue) || 0
        };
        // الترتيب الصحيح: (url, name, data)
        await changeState(`${apiUrl}/setting/${String(id)}`, t('RentUpdatedSuccessfully'), payload);
        refetchTypes();
        if (selectedApartmentId) {
            refetchSingleSetting();
        }
    };

    const handleDeleteRent = async (id) => {
        const payload = {
            appartment_type_id: id,
            renter_limit: 0
        };
        // الترتيب الصحيح: (url, name, payload)
        await deleteData(`${apiUrl}/setting/${String(id)}`, t('RentDeletedSuccessfully'), payload);
        refetchTypes();
        if (selectedApartmentId) {
            refetchSingleSetting();
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

    if (isLoading || loadingVisitorLimitData) {
        return <FullPageLoader />;
    }

    return (
        <div className="min-h-screen">
            <div className="!p-6">
                <h1 className="text-2xl text-bg-primary font-semibold !mb-6">{t("LimitsSettings")}</h1>

                <div className="flex border-b border-gray-200 !mb-6">
                    <button onClick={() => setActiveTab("visitor")} className={`!py-2 !px-4 text-sm font-medium ${activeTab === "visitor" ? "border-b-2 border-bg-primary text-bg-primary" : "text-gray-500"}`}>
                        {t("VisitorLimits")}
                    </button>
                    <button onClick={() => setActiveTab("renter")} className={`!py-2 !px-4 text-sm font-medium ${activeTab === "renter" ? "border-b-2 border-bg-primary text-bg-primary" : "text-gray-500"}`}>
                        {t("RenterLimits")}
                    </button>
                </div>

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

                {activeTab === "renter" && (
                    <div className="animate-fade-in">
                        <div className="!mb-4">
                            <select
                                className="border !p-2 rounded-lg w-full"
                                value={selectedApartmentId}
                                onChange={(e) => setSelectedApartmentId(e.target.value)}
                            >
                                <option value="">{t("SelectApartmentType")}</option>
                                {apartmentRents.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedApartmentId && apartmentRents
                            .filter(item => String(item.id) === String(selectedApartmentId))
                            .map((item) => (
                                <div key={item.id} className="flex items-center gap-4 !p-4 border rounded-lg !mb-2">
                                    <span className="flex-1 font-medium">{item.name}</span>
                                    <input type="number" className="border !p-2 rounded w-32" value={item.rent} onChange={(e) => {
                                        const val = e.target.value;
                                        setApartmentRents(prev => prev.map(i => String(i.id) === String(item.id) ? { ...i, rent: val } : i));
                                    }} />
                                    <button disabled={loadingChange} onClick={() => handleUpdateRent(item.id, item.rent)} className="bg-bg-primary text-white !py-2 !px-4 rounded-lg">
                                        {loadingChange ? t("Saving...") : t("Update")}
                                    </button>
                                    <button disabled={loadingDelete || isDeleting} onClick={() => handleDeleteRent(item.id)} className="bg-red-500 text-white !py-2 !px-4 rounded-lg">
                                        {(loadingDelete || isDeleting) ? t("Deleting...") : t("Delete")}
                                    </button>
                                </div>
                            ))
                        }
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default VisitorLimit;
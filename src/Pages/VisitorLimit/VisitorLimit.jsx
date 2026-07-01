"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import Add from "@/components/AddFieldSection";
import { useTranslation } from "react-i18next";

const VisitorLimit = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const navigate = useNavigate();
    const { t } = useTranslation();

    // --- States ---
    const [activeTab, setActiveTab] = useState("visitor"); // "visitor" | "renter"

    const [visitorLimit, setVisitorLimit] = useState({
        guest: 0,
        worker: 0,
        delivery: 0,
        renter_guest: 0,
        renter_worker: 0,
        renter_delivery: 0
    });

    const [renterSettings, setRenterSettings] = useState({
        renter_limit: 0
    });

    // --- API Hooks: Visitor Limits ---
    const { refetch: refetchVisitorLimit, loading: loadingVisitorLimitData, data: VisitorLimitData } = useGet({
        url: `${apiUrl}/visitor_limit`,
    });
    const { postData: updateVisitorLimit, loadingPost: loadingVisitorLimit } = usePost({
        url: `${apiUrl}/visitor_limit/update`,
    });

    // --- API Hooks: Renter Settings ---
    // تأكدي من مسار الـ API هنا لو مختلف في الباك إند
    const { refetch: refetchRenterSettings, loading: loadingRenterSettingsData, data: RenterSettingsData } = useGet({
        url: `${apiUrl}/setting`,
    });
    const { postData: updateRenterSettings, loadingPost: loadingRenterSettings } = usePost({
        url: `${apiUrl}/setting/update`,
    });

    // --- UseEffects ---
    useEffect(() => {
        refetchVisitorLimit();
        refetchRenterSettings();
    }, [refetchVisitorLimit, refetchRenterSettings]);

    useEffect(() => {
        if (VisitorLimitData && VisitorLimitData.visitor_limit) {
            setVisitorLimit(VisitorLimitData.visitor_limit);
        }
    }, [VisitorLimitData]);

    useEffect(() => {
        // افترضت إن الداتا راجعة جوة object اسمه setting أو مباشرة
        if (RenterSettingsData && RenterSettingsData.setting) {
            setRenterSettings({ renter_limit: RenterSettingsData.setting.renter_limit || 0 });
        } else if (RenterSettingsData && RenterSettingsData.renter_limit !== undefined) {
            setRenterSettings({ renter_limit: RenterSettingsData.renter_limit });
        }
    }, [RenterSettingsData]);

    // --- Handlers ---
    const handleVisitorChange = (field, value) => {
        setVisitorLimit(prev => ({
            ...prev,
            [field]: parseInt(value) || 0
        }));
    };

    const handleRenterChange = (field, value) => {
        setRenterSettings(prev => ({
            ...prev,
            [field]: parseInt(value) || 0
        }));
    };

    const handleVisitorSave = async (e) => {
        e.preventDefault();
        updateVisitorLimit(visitorLimit, t('Visitorlimitsupdatedsuccessfully'));
    };

    const handleRenterSave = async (e) => {
        e.preventDefault();
        updateRenterSettings(renterSettings, t('Renterlimitsupdatedsuccessfully'));
    };

    // --- Fields Configuration ---
    const visitorFields = [
        { name: t("guest"), type: "input", inputType: "number", placeholder: t("OwnerGuestLimit"), min: 0 },
        { name: t("worker"), type: "input", inputType: "number", placeholder: t('OwnerWorkerLimit'), min: 0 },
        { name: t("delivery"), type: "input", inputType: "number", placeholder: t("OwnerDeliveryLimit"), min: 0 },
        { name: t("renter_guest"), type: "input", inputType: "number", placeholder: t("OwnerRenterGuestLimit"), min: 0 },
        { name: t("renter_worker"), type: "input", inputType: "number", placeholder: t("RenterWorkerLimit"), min: 0 },
        { name: t("renter_delivery"), type: "input", inputType: "number", placeholder: t("RenterDeliveryLimit"), min: 0 }
    ];

    const renterFields = [
        { name: "renter_limit", type: "input", inputType: "number", placeholder: t("RenterLimit"), min: 0 }
    ];

    // --- Loading State ---
    if (isLoading || loadingVisitorLimitData || loadingRenterSettingsData) {
        return <FullPageLoader />;
    }

    return (
        <div className="min-h-screen">
            <div className="!p-6">
                <h1 className="text-2xl text-bg-primary font-semibold !mb-6">{t("LimitsSettings")}</h1>

                {/* Tabs Navigation */}
                <div className="flex border-b border-gray-200 !mb-6">
                    <button
                        onClick={() => setActiveTab("visitor")}
                        className={`!py-2 !px-4 text-sm font-medium transition-colors duration-200 ${activeTab === "visitor"
                                ? "border-b-2 border-bg-primary text-bg-primary"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {t("VisitorLimits")}
                    </button>
                    <button
                        onClick={() => setActiveTab("renter")}
                        className={`!py-2 !px-4 text-sm font-medium transition-colors duration-200 ${activeTab === "renter"
                                ? "border-b-2 border-bg-primary text-bg-primary"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {t("RenterLimits")}
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "visitor" && (
                    <div className="animate-fade-in">
                        <Add
                            fields={visitorFields}
                            lang="en"
                            values={visitorLimit}
                            onChange={(lang, name, value) => handleVisitorChange(name, value)}
                        />
                        <div className="!mt-6 flex justify-end">
                            <button
                                disabled={loadingVisitorLimit}
                                onClick={handleVisitorSave}
                                className="bg-bg-primary hover:bg-white hover:text-bg-primary transition-colors border border-transparent hover:border-bg-primary cursor-pointer text-white font-medium !py-2 !px-6 rounded-lg"
                            >
                                {loadingVisitorLimit ? t("Saving") : t("SaveChanges")}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "renter" && (
                    <div className="animate-fade-in">
                        <Add
                            fields={renterFields}
                            lang="en"
                            values={renterSettings}
                            onChange={(lang, name, value) => handleRenterChange(name, value)}
                        />
                        <div className="!mt-6 flex justify-end">
                            <button
                                disabled={loadingRenterSettings}
                                onClick={handleRenterSave}
                                className="bg-bg-primary hover:bg-white hover:text-bg-primary transition-colors border border-transparent hover:border-bg-primary cursor-pointer text-white font-medium !py-2 !px-6 rounded-lg"
                            >
                                {loadingRenterSettings ? t("Saving") : t("SaveChanges")}
                            </button>
                        </div>
                    </div>
                )}

            </div>
            <ToastContainer />
        </div>
    );
};

export default VisitorLimit;
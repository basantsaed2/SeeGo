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
    const [visitorLimit, setVisitorLimit] = useState({
        guest: 0,
        worker: 0,
        delivery: 0
    });
    const navigate = useNavigate();
  const { t } = useTranslation();

    const { refetch: refetchVisitorLimit, loading: loadingVisitorLimitData, data: VisitorLimitData } = useGet({
        url: `${apiUrl}/visitor_limit`,
    });
    const { postData: updateVisitorLimit, loading: loadingVisitorLimit, response:VisitorLimitResponse } = usePost({url: `${apiUrl}/visitor_limit/update`,});

    useEffect(() => {
        refetchVisitorLimit();
    }, [refetchVisitorLimit]);

    useEffect(() => {
        if (VisitorLimitData && VisitorLimitData.visitor_limit) {
            setVisitorLimit(VisitorLimitData.visitor_limit);
        }
    }, [VisitorLimitData]);

    const handleChange = (field, value) => {
        setVisitorLimit(prev => ({
            ...prev,
            [field]: parseInt(value) || 0
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        updateVisitorLimit(visitorLimit,t('Visitorlimitsupdatedsuccessfully'));
    };

    const fields = [
        {
            name: t("guest"),
            type: "input",
            inputType: "number",
            placeholder: t("GuestLimit"),
            min: 0
        },
        {
            name: t("worker"),
            type: "input",
            inputType: "number",
            placeholder: t("WorkerLimit"),
            min: 0
        },
        {
            name: t("delivery"),
            type: "input",
            inputType: "number",
            placeholder: t("DeliveryLimit"),
            min: 0
        }
    ];

    if (isLoading || loadingVisitorLimit || loadingVisitorLimitData) {
        return <FullPageLoader />;
    }

    return (
        <div className="min-h-screen">
            <div className=" !p-6">
                <h1 className="text-2xl text-bg-primary font-semibold !mb-6">{t("VisitorLimits")}</h1>
                
                <Add 
                    fields={fields} 
                    lang="en" 
                    values={visitorLimit} 
                    onChange={(lang, name, value) => handleChange(name, value)} 
                />
                
                <div className="!mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="bg-bg-primary hover:bg-white hover:text-bg-primary cursor-pointer text-white font-medium !py-2 !px-6 rounded-lg"
                        disabled={loadingVisitorLimit}
                    >
                        {loadingVisitorLimit ? t("Saving") : t("SaveChanges")}
                    </button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default VisitorLimit;
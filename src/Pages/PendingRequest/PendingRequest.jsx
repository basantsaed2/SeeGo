"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { useGet } from "@/Hooks/UseGet";
import { useChangeState } from "@/Hooks/useChangeState"; // استخدام هوك تغيير الحالة المتوفر لديكِ
import { useTranslation } from "react-i18next";
import FullPageLoader from "@/components/Loading";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const PendingRequest = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);

    // 1. جلب البيانات من السيرفر باستخدام useGet لجلب الـ code_request
    const { refetch, loading, data: requestData } = useGet({ url: `${apiUrl}/code_request` });
    
    // 2. استخدام هوك تغيير الحالة المتوفر في مشروعك لتحديث الـ status
    const { changeState, loadingChange } = useChangeState();

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (requestData) {
            // التعامل مع البيانات سواء كانت مصفوفة مباشرة أو كائن يحتوي مصفوفة
            const rawList = requestData.code_requests || requestData.data || requestData;
            if (Array.isArray(rawList)) {
                setRequests(rawList);
            }
        }
    }, [requestData]);

    // 3. دالة إرسال التحديث للسيرفر بناءً على المعطيات (code_request/status/{id})
    const handleStatusChange = async (id, newStatus) => {
        const url = `${apiUrl}/code_request/status/${id}`;
        const toastMessage = newStatus === "accepted" ? t("RequestAccepted") : t("RequestRejected");
        
        // إرسال الـ status المطلوبة (accepted / rejected) في الـ body للـ PUT Request
        const success = await changeState(url, toastMessage, { status: newStatus });
        
        if (success) {
            refetch(); // إعادة جلب البيانات لتحديث الجدول فوراً بعد القبول أو الرفض
        }
    };

    // 4. إعداد أعمدة الجدول لعرض البيانات وأزرار التحكم
    const columns = [
        { 
            key: "serial_number", 
            label: t("ID") 
        },
        
        {
            key: "unit",
            label: t("unit"),
            render: (row) => row.appartment?.floor || row.floor || "—"
        },
        { 
            key: "date", 
            label: t("date"), 
            render: (row) => row.appartment?.unit || row.unit || "—" 
        },
        { 
            key: "time", 
            label: t("time"), 
            render: (row) => row.user?.name || "—" 
        },
        {
            key: "status",
            label: t("Status"),
            render: (row) => {
                // تلوين الحالات (pending, accepted, rejected)
                const colors = {
                    pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
                    accepted: "bg-green-100 text-green-700 border border-green-300",
                    rejected: "bg-red-100 text-red-700 border border-red-300",
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[row.status] || ""}`}>
                        {t(row.status || "pending")}
                    </span>
                );
            },
        },

    ];

    if (loading || loadingChange) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-bg-primary" />
                <h1 className="text-xl font-semibold text-gray-800">{t("PendingRequests")}</h1>
            </div>

            <DataTable
                data={requests}
                columns={columns}
                showFilter={false}
                showSearch={true}
                showAddButton={false}
                pageDetailsRoute={false}
            />
        </div>
    );
};

export default PendingRequest;
"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { useGet } from "@/Hooks/UseGet";
import { useChangeState } from "@/Hooks/useChangeState";
import { useTranslation } from "react-i18next";
import FullPageLoader from "@/components/Loading";
import { CheckCircle2, XCircle, Clock, Check, X } from "lucide-react";

const LoginRequest = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);

    // 1. جلب البيانات من السيرفر
    const { refetch, loading, data: requestData } = useGet({ url: `${apiUrl}/login_request` });

    // 2. هوك لتغيير الحالة (Approve / Reject)
    const { changeState, loadingChange } = useChangeState();

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (requestData) {
            // التعديل هنا: الوصول للمصفوفة الصحيحة داخل login_requests.data بناءً على الـ JSON
            const rawList = requestData?.login_requests?.data || requestData?.data || [];
            if (Array.isArray(rawList)) {
                setRequests(rawList);
            }
        }
    }, [requestData]);

    // 3. دالة إرسال التحديث للسيرفر عند الضغط على الأزرار
    const handleStatusChange = async (id, newStatus) => {
        // بناءً على الـ Endpoint المستهدفة مع تمرير الـ status كـ Query Parameter أو Body حسب تصميم الباكيند
        const url = `${apiUrl}/login_request/status/${id}?status=${newStatus}`;
        const toastMessage = newStatus === "approve" ? t("RequestApproved") : t("RequestRejected");

        // إرسال طلب الـ PUT وتمرير الـ status أيضاً داخل الـ body لضمان الأمان
        const success = await changeState(url, toastMessage, { status: newStatus });

        if (success) {
            refetch(); // إعادة جلب البيانات فوراً لتحديث الجدول بالداتا الجديدة
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return "-";

        const date = new Date(dateString);

        // التحقق من أن النص الممرر هو تاريخ صالح
        if (isNaN(date.getTime())) return dateString;

        // استخراج عناصر التاريخ والوقت
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        // تحويل الوقت إلى نظام 12 ساعة
        hours = hours % 12;
        hours = hours ? hours : 12; // الساعة 0 تصبح 12
        const formattedHours = String(hours).padStart(2, '0');

        return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
    };

    // 4. إعداد أعمدة الجدول المتوافقة تماماً مع الـ JSON المرفق
    const columns = [
        {
            key: "id",
            label: t("ID")
        },
        {
            key: "user_name",
            label: t("Name"),
            render: (row) => row.user_name || "—"
        },
        {
            key: "user_email",
            label: t("Email"),
            render: (row) => row.user_email || "—"
        },
        {
            key: "user_phone",
            label: t("Phone"),
            render: (row) => row.user_phone || "—"
        },
        {
            key: "ip_address",
            label: t("IP Address"),
            render: (row) => row.ip_address || "—"
        },
        {
            key: "created_at",
            label: "Requested At",
            // التعديل هنا: نأخذ القيمة ونمررها لدالة التنسيق
            render: (row) => <span className="text-gray-600 font-medium">{formatDate(row.created_at)}</span>
        },
        // إضافة عمود الـ Actions ليحتوي على أزرار الـ Approve والـ Reject مباشرة
        {
            key: "actions",
            label: t("Actions"),
            render: (row) => (
                <div className="flex items-center gap-2">
                    {/* زر الـ Approve (قبول) */}
                    <button
                        onClick={() => handleStatusChange(row.id, "approve")}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        title={t("Approve")}
                    >
                        <Check className="w-4 h-4" />
                    </button>

                    {/* زر الـ Reject (رفض) */}
                    <button
                        onClick={() => handleStatusChange(row.id, "reject")}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        title={t("Reject")}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    if (loading || loadingChange) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-6 h-6 text-bg-primary" />
                <h1 className="text-xl font-semibold text-gray-800">{t("LoginRequests")}</h1>
            </div>

            <DataTable
                data={requests}
                columns={columns}
                showFilter={false}
                showSearch={true}
                showAddButton={false}
                showActionColumns={false}
                showDeleteButton={false} // إخفاء زر الحذف الافتراضي لأننا أضفنا أكشنز مخصصة
                pageDetailsRoute={false}
                searchKeys={["user_name", "user_email", "user_phone"]} // مفاتيح البحث المتوافقة مع الكود والـ JSON
            />
        </div>
    );
};

export default LoginRequest;
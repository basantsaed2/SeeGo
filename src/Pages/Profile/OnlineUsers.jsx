"use client";
import React, { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { useGet } from "@/Hooks/UseGet";
import { useTranslation } from "react-i18next";
import FullPageLoader from "@/components/Loading";
import { LogOut, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux"; // لجلب بيانات المستخدم والـ Token
import axios from "axios"; // لعمل طلب الـ GET مباشرة
import { toast } from "react-toastify"; // لعرض رسالة النجاح أو الفشل

const OnlineUsers = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loadingLogout, setLoadingLogout] = useState(false); // حالة تحميل خاصة بعملية تسجيل الخروج

    // جلب بيانات الـ auth من الـ Redux للحصول على الـ Token
    const { user } = useSelector((state) => state.auth);

    // 1. جلب بيانات المستخدمين المتصلين (Online Users)
    const { refetch, loading, data: onlineUsersData } = useGet({ url: `${apiUrl}/info_village/online_users` });

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (onlineUsersData) {
            const rawList = onlineUsersData.users || onlineUsersData.data || onlineUsersData;
            if (Array.isArray(rawList)) {
                setUsers(rawList);
            }
        }
    }, [onlineUsersData]);

    // 3. دالة الخروج القسري باستخدام GET Request
    const handleForceLogout = async (userId) => {
        setLoadingLogout(true);
        const url = `${apiUrl}/info_village/logout_user/${userId}`;
        
        try {
            // إعداد الهيدر وتمرير الـ Token الخاص بحساب الأدمن
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token || ""}`,
                },
            };

            // إرسال طلب GET للسيرفر لتسجيل خروج اليوزر
            const response = await axios.get(url, config);

            if (response.status === 200 || response.status === 201) {
                toast.success(t("UserLoggedOutSuccessfully"));
                refetch(); // إعادة جلب البيانات فوراً لتحديث الجدول واختفاء اليوزر
            }
        } catch (error) {
            console.error("Error during force logout:", error);
            toast.error(error?.response?.data?.message || error.message || t("AnUnknownErrorOccurred"));
        } finally {
            setLoadingLogout(false);
        }
    };

    // 4. تعريف أعمدة الجدول
    const columns = [
        { key: "id", label: t("ID"), width: "w-[80px]" },
        { key: "name", label: t("Name") },
        { key: "email", label: t("Email") },
        
        {
            key: "actions",
            label: t("Actions"),
            render: (row) => (
                <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 !p-2 border-red-200 hover:bg-red-50 hover:text-red-700 cursor-pointer flex items-center gap-2 transition-all"
                    onClick={() => handleForceLogout(row.id)}
                    disabled={loadingLogout} // تعطيل الزر أثناء المعالجة
                >
                    <LogOut className="w-4 h-4" />
                    {t("ForceLogout")}
                </Button>
            ),
        },
    ];

    // عرض لودر الصفحة إذا كان جاري جلب البيانات أو جاري تسجيل خروج مستخدم
    if (loading || loadingLogout) {
        return <FullPageLoader />;
    }

    return (
        <div className="!p-4 bg-white rounded-lg shadow-sm !mt-4 border border-gray-100">
            <div className="flex items-center gap-2 !mb-6">
                <Users className="w-6 h-6 text-bg-primary" />
                <h2 className="text-xl font-semibold text-gray-800">{t("OnlineUsers")}</h2>
            </div>

            <DataTable
                data={users}
                columns={columns}
                showFilter={false}
                showSearch={true}
                showAddButton={false} 
                showActionColumns= {false}
                pageDetailsRoute={false}
            />
        </div>
    );
};

export default OnlineUsers;
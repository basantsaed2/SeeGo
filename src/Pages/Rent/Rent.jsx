"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, Users, Home, Phone, ShieldCheck, Image as ImageIcon } from "lucide-react";

const Rent = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [status, setStatus] = useState("all");
    const [rentList, setRentList] = useState([]);
    const { t } = useTranslation();

    const url = status === "all"
        ? `${apiUrl}/rents/all`
        : `${apiUrl}/rents/all?status=${status}`;

    const { refetch: refetchRent, loading: loadingRent, data: RentData } = useGet({
        url: url,
    });

    useEffect(() => {
        refetchRent();
    }, [status, refetchRent]);

    useEffect(() => {
        if (RentData?.rents?.data) {
            const formattedRent = RentData.rents.data.map((u) => ({
                id: u.id,
                image_id_link: u?.image_id_link || null,
                renter: u?.user?.name || "—",
                phone: u?.user?.phone || "—",
                owner: u?.owner?.name || "—",
                from: u?.from || "—",
                to: u?.to || "—",
                people: u?.people || 0,
                unit: u?.appartment?.unit || "—",
            }));
            setRentList(formattedRent);
        }
    }, [RentData]);

    return (
        <div className="!p-6">
            {/* تحسين شكل التابس */}
            <Tabs defaultValue="all" onValueChange={setStatus} className="w-full !mb-6">
                <TabsList className="bg-slate-100 !p-1 rounded-xl w-full flex justify-between">
                    {["all", "upcoming", "current", "past"].map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className={`flex-1 !px-6 !py-2.5 rounded-lg text-sm font-medium transition-all duration-300 capitalize
                                data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm
                                hover:text-primary/80`}
                        >
                            {t(tab)}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {isLoading || loadingRent ? (
                <FullPageLoader />
            ) : (
                <div className="flex flex-col !gap-4">
                    {rentList.length > 0 ? (
                        rentList.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-slate-200 rounded-2xl !p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between !gap-4"
                            >
                                {/* الجزء الأيسر: الأيقونة والتفاصيل الأساسية */}
                                <div className="flex items-start md:items-center !gap-4">
                                    <div className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center bg-slate-50 shrink-0 shadow-inner">
                                        <User className="w-6 h-6 text-slate-700" />
                                    </div>

                                    <div className="flex flex-col !gap-1">
                                        <h3 className="text-base font-semibold text-slate-800">
                                            {item.renter}
                                        </h3>

                                        <div className="flex flex-wrap items-center !gap-x-4 !gap-y-1 text-xs text-slate-500">
                                            {/* التاريخ */}
                                            <div className="flex items-center !gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>{item.from} - {item.to}</span>
                                            </div>

                                            {/* عدد الأفراد */}
                                            <div className="flex items-center !gap-1.5">
                                                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span>{item.people} {t("People")}</span>
                                            </div>
                                        </div>

                                        {/* تفاصيل إضافية صغيرة تحتهم (رقم الهاتف / المالك / الوحدة) */}
                                        <div className="flex flex-wrap items-center !gap-x-4 !gap-y-1 !mt-1 pt-1 border-t border-slate-100 text-xs text-slate-600">
                                            <div className="flex items-center !gap-1">
                                                <Phone className="w-3 h-3 text-slate-400" />
                                                <span>{item.phone}</span>
                                            </div>
                                            <div className="flex items-center !gap-1">
                                                <Home className="w-3 h-3 text-slate-400" />
                                                <span>{t("Unit")}: <strong className="font-medium text-slate-800">{item.unit}</strong></span>
                                            </div>
                                            <div className="flex items-center !gap-1">
                                                <ShieldCheck className="w-3 h-3 text-slate-400" />
                                                <span>{t("Owner")}: <strong className="font-medium text-slate-800">{item.owner}</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* الجزء الأيمن: الأزرار (مثل صورة البطاقة) */}
                                <div className="flex items-center !gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                                    {item.image_id_link ? (
                                        <a
                                            href={item.image_id_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center !gap-2 border border-slate-200 text-primary hover:bg-slate-50 text-xs font-medium !py-2 !px-4 rounded-lg transition-colors duration-150"
                                        >
                                            <ImageIcon className="w-4 h-4" />
                                            <span>{t("View Id")}</span>
                                        </a>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic !px-2">
                                            {t("No ID Attached")}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center !py-12 bg-white rounded-2xl border border-slate-200">
                            <p className="text-slate-500 text-sm">{t("No rents found")}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Rent;
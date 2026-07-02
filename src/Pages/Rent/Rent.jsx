"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
                img: u?.image_id_link ? (
                    <img src={u?.image_id_link} className="w-12 h-12 object-cover rounded-md" />
                ) : (
                    <Avatar className="w-12 h-12"><AvatarFallback>{u?.owner?.name?.charAt(0)}</AvatarFallback></Avatar>
                ),
                renter: u?.user?.name || "—",
                phone: u?.user?.phone || "—",
                owner: u?.owner?.name || "—",
                from: u?.from,
                to: u?.to,
                people: u?.people,
                unit: u?.appartment?.unit || "—",
            }));
            setRentList(formattedRent);
        }
    }, [RentData]);

    const columns = [
        { key: "img", label: t("ImageID") },
        { key: "renter", label: t("Renter") },
        { key: "phone", label: t("RenterPhone") },
        { key: "owner", label: t("Owner") },
        { key: "from", label: t("From") },
        { key: "to", label: t("To") },
        { key: "people", label: t("No.People") },
        { key: "unit", label: t("Unit") },
    ];

    return (
        <div className="p-6">
            {/* تحسين شكل التابس */}
            <Tabs defaultValue="all" onValueChange={setStatus} className="w-full !mb-6">
                <TabsList className="bg-slate-100 !p-1 rounded-xl w-full">
                    {["all", "upcoming", "current", "past"].map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className={`!px-6 !py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize
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
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <DataTable
                        data={rentList}
                        columns={columns}
                        showAddButton={false}
                        showActionColumns={false}
                    />
                </div>
            )}
        </div>
    );
};

export default Rent;
import { useEffect, useState } from "react";
import SinglePageCompo from "@/components/SinglePageCompo";
import Loading from "@/components/Loading";
import { Outlet } from "react-router-dom";
import { useGet } from "@/Hooks/UseGet";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function VilliageSinglePage() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { refetch: refetchSinglePage, loading: loadingSinglePage, data: SinglePageData } = useGet({
        url: `${apiUrl}/info_village`,
    });

    const [villageData, setVillageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        refetchSinglePage();
    }, [refetchSinglePage]);

    useEffect(() => {
        if (SinglePageData && SinglePageData.village) {
            const village = SinglePageData.village; // Single object, not an array
            const formatted = {
                name: village.name || "—",
                image: village.image_link || "",
                location: village.location || "—",
                description: village.description || "—",
                units: `${village.units_count || 0} Units`,
                population: village.population_count || "zero",
                zone: village.zone?.name || "—",
                from: village.from || "—",
                to: village.to || "—",
                status: village.status === 1 ? "Active" : "Inactive",
            };
            setVillageData(formatted);
        }
        setLoading(false);
    }, [SinglePageData]);
const {t}=useTranslation();
    if (loading || loadingSinglePage) return <Loading />;
    if (!villageData) return <p className="text-center text-red-500">{t("Failedtoloadvillagedata")}</p>;

    return (
        <>
            <SinglePageCompo data={villageData} entityType="village" />
            <Outlet />
        </>
    )
}
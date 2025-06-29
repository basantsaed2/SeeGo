"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

const Epool = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [visits, setVisits] = useState([]);
  const { t } = useTranslation();

  const {
    refetch: refetchVisit,
    loading: loadingVisit,
    data: visitData,
  } = useGet({
    url: `${apiUrl}/entrance/pool`,
  });

  useEffect(() => {
    refetchVisit();
  }, [refetchVisit]);

  useEffect(() => {
    if (visitData && Array.isArray(visitData.pool)) {
      const today = new Date(); // تاريخ اليوم
      const formatted = visitData.pool.map((u, index) => ({
        id: index + 1,
        name: u.user_name || "—",
        phone: u.user_phone || "—",
        email: u.user_email || "—",
        pool: u.pool || "—",
        time: u.time || "—",
        date: today, // نمرر تاريخ اليوم وهمي للفلتر
      }));
      setVisits(formatted);
    }
  }, [visitData]);

  const columns = [
    {
      key: "name",
      label: t("Visitor Name") || "Visitor Name",

    },
    { key: "phone", label: t("Visitor Phone") || "Phone" },
    { key: "email", label: t("Visitor Email") || "Email" },
    { key: "pool", label: t("pool Name") || "pool" },
    { key: "time", label: t("Time") || "Time" },
  ];

  const handleDateRangeChange = ({ startDate, endDate }) => {
    // ممكن تضيف فلترة من السيرفر هنا لو API يدعمها
    console.log("Filter by date range:", startDate, endDate);
  };

  if (isLoading || loadingVisit) {
    return <FullPageLoader />;
  }

  return (
    <div className="p-4">
      <DataTable
        data={visits}
        columns={columns}
        showActionColumns={false}
        showAddButton={false}
        dateRangeFilter={true}
        dateRangeKey="date" // نستخدم التاريخ الوهمي للفلتر
        onDateRangeChange={handleDateRangeChange}
      />
    </div>
  );
};

export default Epool;

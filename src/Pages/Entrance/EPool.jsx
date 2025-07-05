"use client";
import { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import Pools from "../Pools/Pools";

const Epool = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [visits, setVisits] = useState([]);
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ pool: "", user_type: "" });


  const {
    refetch: refetchVisit,
    loading: loadingVisit,
    data: visitData,
  } = useGet({
    url: `${apiUrl}/entrance/pool`,
  });
  // استخراج القيم المميزة للفلاتر
  const uniquePools = [...new Set(visits.map((v) => v.pool).filter(Boolean))];
  const uniqueUserTypes = [...new Set(visits.map((v) => v.user_type).filter(Boolean))];

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
        user_type: u.user_type || "—",
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
      label: "User Name",
    },
    { key: "phone", label: t("User Phone") },
    // {key:"entrance_type",label:t("Entrance Type")},
    { key: "user_type", label: t("User Type") },
    {key:"pool",label:t("Pool")},
    { key: "unit", label: t("Units") },
    // { key: "unit_type", label: t("Unit Type") },
    { key: "time", label: t("Time") },
  ];

  const handleDateRangeChange = ({ startDate, endDate }) => {
    // ممكن تضيف فلترة من السيرفر هنا لو API يدعمها
    console.log("Filter by date range:", startDate, endDate);
  };
    const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  // تطبيق الفلاتر يدويًا على البيانات
  const filteredPools = useMemo(() => {
    return visits.filter((v) => {
      const matchPool = filters.pool ? v.pool === filters.pool : true;
      const matchType = filters.user_type ? v.user_type === filters.user_type : true;
      return matchPool && matchType;
    });
  }, [visits, filters]);
  
  if (isLoading || loadingVisit) {
    return <FullPageLoader />;
  }

  return (
    <div className="p-4">
      <DataTable
        data={filteredPools}
        columns={columns}
        showActionColumns={false}
        showAddButton={false}
        showFilters={true}
        dateRangeFilter={true}
        dateRangeKey="date" // نستخدم التاريخ الوهمي للفلتر
        onDateRangeChange={handleDateRangeChange}
          filterByKey="data"
filterOptions={[
  {
    key: "pool",
    label: t("By Pool"),
    value: filters.pool || "all", // ✅ أضف value لعرض القيمة الحالية
    options: [
      { label: t("All Pools"), value: "all" },
      ...uniquePools.map((pool) => ({ label:pool, value: pool }))
    ],
    onChange: (val) => handleFilterChange("pool", val === "all" ? "" : val),
  },
  {
    key: "user_type",
    label: ("By User Type"),
    value: filters.user_type || "all", 
    options: [
      { label: t("All User Types"), value: "all" },
      ...uniqueUserTypes.map((type) => ({ label: type, value: type }))
    ],
    onChange: (val) => handleFilterChange("user_type", val === "all" ? "" : val),
  },
]}
      />
    </div>
  );
};

export default Epool;

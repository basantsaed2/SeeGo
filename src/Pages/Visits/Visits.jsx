"use client";
import { useEffect, useMemo, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const Visits = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [visits, setVisits] = useState([]);
  const [filters, setFilters] = useState({ gate: "", entrance_type: "" });

  const { t } = useTranslation();

  const {
    refetch: refetchVisit,
    loading: loadingVisit,
    data: visitData,
  } = useGet({
    url: `${apiUrl}/visits`,
  });

  // استخراج القيم المميزة للفلاتر
  const uniqueGates = [...new Set(visits.map((v) => v.gate).filter(Boolean))];
  const uniqueEntranceTypes = [...new Set(visits.map((v) => v.entrance_type).filter(Boolean))];

  useEffect(() => {
    refetchVisit();
  }, [refetchVisit]);

  useEffect(() => {
    if (visitData && visitData.visit_requests) {
      const formatted = visitData.visit_requests.map((u) => ({
        id: u.id,
        name: u.user_name || "—",
        phone: u.user_phone || "—",
        user_type: u.user_type || "—",
        entrance_type: u.visitor_type || "—",
        gate: u.gate || "—",
        unit: u.unit || "—",
        unit_type: u.unit_type || "—",
        date: u.date ? new Date(u.date) : null,
        time: u.time || "—",
      }));
      setVisits(formatted);
    }
  }, [visitData]);

  const columns = [
    { key: "name", label: "User Name" },
    { key: "phone", label: t("User Phone") },
    { key: "entrance_type", label: t("Entrance Type") },
    { key: "user_type", label: t("User Type") },
    { key: "gate", label: t("Gate") },
    { key: "unit", label: t("Units") },
    { key: "unit_type", label: t("Unit Type") },
    {
      key: "date",
      label: t("Date"),
      render: (row) => (row.date ? format(row.date, "MMM dd, yyyy") : "—"),
    },
    { key: "time", label: t("Time") },
  ];

  const handleDateRangeChange = ({ startDate, endDate }) => {
    console.log("Date range changed:", startDate, endDate);
    // يمكنك تعديل الفetch هنا لإرسال التاريخ للـ API لو حبيت
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // تطبيق الفلاتر يدويًا على البيانات
  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const matchGate = filters.gate ? v.gate === filters.gate : true;
      const matchType = filters.entrance_type ? v.entrance_type === filters.entrance_type : true;
      return matchGate && matchType;
    });
  }, [visits, filters]);

  if (isLoading || loadingVisit) return <FullPageLoader />;

  return (
    <div className="p-4">
      <DataTable
        data={filteredVisits}
        columns={columns}
        showActionColumns={false}
        showAddButton={false}
        showFilters={true}
        dateRangeFilter={true}
        dateRangeKey="date"
        onDateRangeChange={handleDateRangeChange}
filterOptions={[
  {
    key: "gate",
    label: t("By Gate"),
    value: filters.gate || "all", // ✅ أضف value لعرض القيمة الحالية
    options: [
      { label: t("All Gates"), value: "all" },
      ...uniqueGates.map((gate) => ({ label: gate, value: gate }))
    ],
    onChange: (val) => handleFilterChange("gate", val === "all" ? "" : val),
  },
  {
    key: "entrance_type",
    label: ("By Entrance Type"),
    value: filters.entrance_type || "all", 
    options: [
      { label: t("All Entrance Types"), value: "all" },
      ...uniqueEntranceTypes.map((type) => ({ label: type, value: type }))
    ],
    onChange: (val) => handleFilterChange("entrance_type", val === "all" ? "" : val),
  },
]}

      />
    </div>
  );
};

export default Visits;

"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

const Egate = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [visits, setVisits] = useState([]);
  const { t } = useTranslation();

  const {
    refetch: refetchVisit,
    loading: loadingVisit,
    data: visitData,
  } = useGet({
    url: `${apiUrl}/entrance/gate`,
  });

  useEffect(() => {
    refetchVisit();
  }, [refetchVisit]);

  useEffect(() => {
    if (visitData && Array.isArray(visitData.gate)) {
      const today = new Date();
      const formatted = visitData.gate.map((u, index) => ({
        id: index + 1,
        name: u.user_name || "—",
        phone: u.user_phone || "—",
        email: u.user_email || "—",
        gate: u.gate || "—",
       map: u.gate_location || "—",
        time: u.time || "—",
        date: today,
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
    { key: "gate", label: t("Gate Name") || "Gate" },
    { key: "time", label: t("Time") || "Time" },
    { key: "map", label: t("Location") },
  ];

  const handleDateRangeChange = ({ startDate, endDate }) => {
    console.log("Filter by date range:", startDate, endDate);
  };

  if (isLoading || loadingVisit) {
    return <FullPageLoader />;
  }
const gateOptions = Array.from(
  new Set(visits.map((v) => v.gate).filter((g) => g && g !== "—"))
);


  return (
    <div className="p-4">
<DataTable
  data={visits}
  columns={columns}
  showActionColumns={false}
  showAddButton={false}
  dateRangeFilter={true}
  dateRangeKey="date"
  onDateRangeChange={handleDateRangeChange}
  filterByKey="gate"
  filterOptions={gateOptions}
  filterLabelsText={{
    all: t("AllGates") || "All Gates",
  }}
/>

    </div>
  );
};

export default Egate;

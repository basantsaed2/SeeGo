"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout"; // Adjust path if needed
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

const Visits = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [visits, setVisits] = useState([]);
  const { t } = useTranslation();

  const {
    refetch: refetchVisit,
    loading: loadingVisit,
    data: visitData,
  } = useGet({
    url: `${apiUrl}/visits`,
  });

  useEffect(() => {
    refetchVisit();
  }, [refetchVisit]);

  useEffect(() => {
    if (visitData && visitData.visit_requests) {
      const formatted = visitData.visit_requests.map((u) => ({
        id: u.id,
        name: u.user_name || "—",
        phone: u.user_phone || "—",
        user_type: u.visitor_type || "—",
        unit: u.unit || "—",
        unit_type: u.unit_type || "—",
        date: u.date ? new Date(u.date) : null, // Store as Date object
        time: u.time || "—",
      }));
      setVisits(formatted);
    }
  }, [visitData]);

  const columns = [
    {
      key: "name",
      label: "Visitor Name",

    },
    { key: "phone", label: t("VisitorPhone") },
    { key: "user_type", label: t("VisitorType") },
    { key: "unit", label: t("Units") },
    { key: "unit_type", label: t("UnitType") },
    {
      key: "date",
      label: t("Date"),
      render: (row) => (row.date ? format(row.date, "MMM dd, yyyy") : "—"), // Format for display
    },
    { key: "time", label: t("Time") },
  ];

  const handleDateRangeChange = ({ startDate, endDate }) => {
    console.log("Date range changed:", startDate, endDate);
    // Optional: Add server-side filtering by updating the API call
    // refetchVisit({
    //   url: `${apiUrl}/visits?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`,
    // });
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
        dateRangeKey="date" // Match the data key
        onDateRangeChange={handleDateRangeChange}
      />
    </div>
  );
};

export default Visits;

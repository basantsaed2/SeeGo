"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout"; // Adjust path if needed
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

const Visits = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [visits, setVisits] = useState([]);

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
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {row.name}
        </div>
      ),
    },
    { key: "phone", label: "Visitor Phone" },
    { key: "user_type", label: "Visitor Type" },
    { key: "unit", label: "Units" },
    { key: "unit_type", label: "Unit Type" },
    {
      key: "date",
      label: "Date",
      render: (row) => (row.date ? format(row.date, "MMM dd, yyyy") : "—"), // Format for display
    },
    { key: "time", label: "Time" },
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

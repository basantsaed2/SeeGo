"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Visits = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [Visits, setVisits] = useState([]);

  const {
    refetch: refetchVisit,
    loading: loadingVisit,
    data: VisitData,
  } = useGet({
    url: `${apiUrl}/visits`,
  });

  useEffect(() => {
    refetchVisit();
  }, [refetchVisit]);

  useEffect(() => {
    if (VisitData && VisitData.visits) {
      const formatted = VisitData?.visits?.map((u) => {
        return {
          id: u.id,
          phone: u.phone || "—",
          name: u.name || "—",
          unit: u.unit || "—",
          nameAr: u.ar_name || "—",
          description: u.description || "—",
          descriptionAr: u.ar_description || "—",
          from: u.from || "—",
          to: u.to || "—",
          rate: u.rate || "—",
          type: u.Visit_type || "—",
          img: u.image ? (
            <img
              src={u.image}
              alt={u.name}
              className="w-12 h-12 object-cover rounded-md"
            />
          ) : (
            <Avatar className="w-12 h-12">
              <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          ),
          map: u.location || "—",
          statusText: u.status === 1 ? "Active" : "Inactive",
        };
      });
      setVisits(formatted);
    }
  }, [VisitData]);

  const columns = [
    { key: "img", label: "Image" },
    { key: "name", label: "Owner Name" },
    { key: "type", label: "Visitor Type" },
    { key: "unit", label: "Units" },

    { key: "date", label: "Date" },
    { key: "date", label: "Time" },
    { key: "statusText", label: "Status" },
  ];

  if (isLoading || loadingVisit) {
    return <FullPageLoader />;
  }

  return (
    <div className="p-4">
      <DataTable data={Visits} showActionColumns={false} columns={columns} showAddButton={false} />
    </div>
  );
};

export default Visits;

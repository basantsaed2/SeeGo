"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HomeIcon } from "lucide-react";

// Custom component for rendering the unit cell
const UnitCell = ({ appartments }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  if (!appartments || appartments.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  if (appartments.length === 1) {
    return <span>{appartments[0].unit}</span>;
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
          aria-label={t("ViewAllUnits", { count: appartments.length })} // Use translation for accessibility
        >
          {appartments[0].unit}...
          <span className="!ml-1">›</span> {/* Simple chevron replacement */}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-gray-50 border-2 border-transparent bg-clip-padding rounded-xl shadow-xl">
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-2xl !text-bg-primary font-bold bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2">
            <HomeIcon className="w-6 h-6 text-bg-primary" />
            {t("AllUnits")}
          </DialogTitle>
        </DialogHeader>
        <div className="bg-white/80 rounded-lg backdrop-blur-sm">
          <div className="flex flex-col !gap-x-3 gap-y-2 text-sm font-medium text-gray-800 !p-3 bg-gray-50/50 rounded-md border border-gray-200 shadow-sm">
            {appartments.map((apt, index) => (
              <span key={index} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-bg-primary" />
                {apt.unit}
                {apt.location && (
                  <span className="text-xs text-gray-500 italic truncate">
                    ({apt.location})
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Owners = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [owners, setOwners] = useState([]);
  const [ownerTypes, setOwnerTypes] = useState([]); // State to store unique owner types
  const { t } = useTranslation();

  const {
    refetch: refetchOwner,
    loading: loadingOwner,
    data: OwnerData,
  } = useGet({
    url: `${apiUrl}/owner`,
  });

  useEffect(() => {
    refetchOwner();
  }, [refetchOwner]);

  useEffect(() => {
    if (OwnerData && OwnerData.owners) {
      console.log("Owner Data:", OwnerData);
      const uniqueOwnerTypes = new Set(); // Use a Set to store unique types

      const formatted = OwnerData?.owners?.map((u) => {
        const ownerType = u.user_type || "—";
        uniqueOwnerTypes.add(ownerType); // Add owner type to the Set

        return {
          id: u.id,
          name: u.name || "—",
          parent: ownerType, // Use user_type as the owner type for filtering
          email: u.email || "—",
          phone: u.phone || "—",
          gender: u.gender || "—",
          appartment: <UnitCell appartments={u.appartments} />,
          status: u.status === 1 ? t("Active") : t("Inactive"), // Still formatting status for display, but not for filter
          img: u.image_link ? (
            <img
              src={u.image_link}
              alt={u.name}
              className="w-12 h-12 object-cover rounded-md"
            />
          ) : (
            <Avatar className="w-12 h-12">
              <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          ),
          password: "",
          birthDate: u.birthDate || "",
        };
      });
      setOwners(formatted);

      // Convert Set to array for filter options, add 'all'
      setOwnerTypes(["all", ...Array.from(uniqueOwnerTypes)]);
    }
  }, [OwnerData, t]); // Add t to dependency array for translation in useEffect

  const columns = [
    { key: "img", label: t("Image") },
    { key: "name", label: t("OwnerName") },
    { key: "parent", label: t("OwnerType") }, // This will be the column used for filtering
    { key: "appartment", label: t("Unit") },
    { key: "email", label: t("Email") },
    { key: "phone", label: t("Phone") },
    { key: "gender", label: t("Gender") },
  ];

  if (isLoading || loadingOwner) {
    return <FullPageLoader />;
  }

  return (
    <div className="p-4">
      <ToastContainer />
      <DataTable
        data={owners}
        columns={columns}
        showAddButton={false}
        showActionColumns={false}
        pageDetailsRoute={true}
        // *** IMPORTANT CHANGES HERE ***
        // 1. Specify the key to filter by:
        filterByKey="parent"
        filterOptions={ownerTypes}
        filterLabelsText={{
          all: t("AllOwnerTypes"), 
        }}
      />
    </div>
  );
};

export default Owners;
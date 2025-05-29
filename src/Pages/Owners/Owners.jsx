// "use client";
// import { useEffect, useState } from "react";
// import DataTable from "@/components/DataTableLayout";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { useSelector } from "react-redux";
// import FullPageLoader from "@/components/Loading";
// import { useGet } from "@/Hooks/UseGet";

// const Owners = () => {
//   const apiUrl = import.meta.env.VITE_API_BASE_URL;
//   const isLoading = useSelector((state) => state.loader.isLoading);
//   const [owners, setOwners] = useState([]);

//   const { refetch: refetchOwner, loading: loadingOwner, data: OwnerData } = useGet({ url: `${apiUrl}/owner` });

//   useEffect(() => {
//     refetchOwner();
//   }, [refetchOwner]);

//   useEffect(() => {
//     if (OwnerData && OwnerData.owners) {
//       console.log("Owner Data:", OwnerData);
//       const formatted = OwnerData?.owners?.map((u) => {
//         return {
//           id: u.id,
//           name: u.name || "—",
//           parent: u.parent?.name || "—",
//           email: u.email || "—",
//           phone: u.phone || "—",
//           gender: u.gender || "—",
//           appartment: u.appartments?.unit || "—",
//           status: u.status === 1 ? "Active" : "Inactive",
//           img: u.image_link ? (
//             <img
//               src={u.image_link}
//               alt={u.name}
//               className="w-12 h-12 object-cover rounded-md"
//             />
//           ) : (
//             <Avatar className="w-12 h-12">
//               <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
//             </Avatar>
//           ),
//           password: "",
//           birthDate: u.birthDate || "",
//         };
//       });
//       setOwners(formatted);
//     }
//   }, [OwnerData]);

//   const columns = [
//     { key: "img", label: "Image" },
//     { key: "name", label: "Owner Name" },
//     { key: "parent", label: "Owner Type" },
//     { key: "appartment", label: "Unit" },
//     { key: "email", label: "Email" },
//     { key: "phone", label: "Phone" },
//     { key: "gender", label: "Gender" },
//   ];
//   if (isLoading) {
//     return <FullPageLoader />;
//   }
//   return (
//     <div className="p-4">
//       <ToastContainer />
//       <DataTable
//         data={owners}
//         columns={columns}
//         showAddButton={false}
//         showActionColumns={false}
//         pageDetailsRoute={true}
//       />
//     </div>
//   );
// };

// export default Owners;
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
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // Use your custom dialog components
import { ChevronRight, Building } from "lucide-react";
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
          aria-label={`View all ${appartments.length} units`}
        >
          {appartments[0].unit}...
          <span className="!ml-1">›</span> {/* Simple chevron replacement */}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-gray-50 border-2 border-transparent bg-clip-padding rounded-xl shadow-xl">
        <DialogHeader className="relative pb-4">
          <DialogTitle className="text-2xl !text-bg-primary font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-2">
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
                {/* {index < appartments.length - 1 && (
                  <span className="text-gray-400 !mx-2">|</span>
                )} */}
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
      const formatted = OwnerData?.owners?.map((u) => {
        return {
          id: u.id,
          name: u.name || "—",
          parent: u.user_type || "—",
          email: u.email || "—",
          phone: u.phone || "—",
          gender: u.gender || "—",
          appartment: <UnitCell appartments={u.appartments} />, // Use custom component
          status: u.status === 1 ? t("Active") : t("Inactive"),
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
    }
  }, [OwnerData]);
  const { t } = useTranslation();

  const columns = [
    { key: "img", label: t("Image") },
    { key: "name", label: t("OwnerName") },
    { key: "parent", label: t("OwnerType") },
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
      />
    </div>
  );
};

export default Owners;

"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Services = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [Services, setServices] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    const { refetch: refetchService, loading: loadingService, data: ServiceData } = useGet({
        url: `${apiUrl}/service`,
    });

    useEffect(() => {
        refetchService();
    }, [refetchService]);

    useEffect(() => {
        if (ServiceData && ServiceData.services) {
            const formatted = ServiceData?.services?.map((u) => {
                return {
                    id: u.id,
                    phone: u.phone || "—",
                    name: u.name || "—",
                    nameAr: u.ar_name || "—",
                    description: u.description || "—",
                    descriptionAr: u.ar_description || "—",
                    from: u.from || "—",
                    to: u.to || "—",
                    rate: u.rate || "—",
                    type: u.service_type || "—",
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
            setServices(formatted);
        }
    }, [ServiceData]);

    const columns = [
        { key: "img", label: "Image" },
        { key: "name", label: "Provider Name" },
        { key: "type", label: "Service Type" },
        { key: "phone", label: "Phone" },
        { key: "map", label: "Location" },
        { key: "from", label: "Opening Time" },
        { key: "to", label: "Closing Time" },
        { key: "rate", label: "Rate" },
        { key: "statusText", label: "Status" },
    ];

    if (isLoading || loadingService) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <DataTable
                data={Services}
                columns={columns}
                showAddButton={false}
                showActionColumns={false}
            />
        </div>
    );
};

export default Services;
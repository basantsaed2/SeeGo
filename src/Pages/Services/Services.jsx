"use client";
import { useEffect, useState, useMemo } from "react"; // Added useMemo
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

const Services = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [servicesData, setServicesData] = useState([]); // Renamed state variable to servicesData

    const { refetch: refetchService, loading: loadingService, data: ServiceData } = useGet({
        url: `${apiUrl}/service`,
    });

    useEffect(() => {
        refetchService();
    }, [refetchService]);

    const { t } = useTranslation();

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
                    // rate: u.rate || "—",
                    // IMPORTANT: Keep original status for toggle, and create statusText for display/filtering
                    status: u.status, // Keep as 0 or 1 if it's for a switch
                    statusText: u.status === 1 ? t("Active") : t("Inactive"), // Translate status text for display
                    type: u.service_type ? u.service_type.toLowerCase() : "—", // Convert to lowercase for consistent filtering
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
                };
            });
            setServicesData(formatted); // Update state to servicesData
        }
    }, [ServiceData, t]); // Added 't' as a dependency for translation changes

    // --- NEW LOGIC FOR SERVICE TYPE FILTER ---
    const serviceTypeOptions = useMemo(() => {
        const types = new Set();
        types.add("all"); // Always include an "all" option

        servicesData.forEach(service => {
            if (service.type && service.type !== "—") { // Check for valid type and not placeholder
                types.add(service.type); // 'type' is already lowercased from useEffect formatting
            }
        });
        return Array.from(types);
    }, [servicesData]); // Re-calculate when servicesData changes

    const serviceTypeLabels = useMemo(() => {
        const labels = {
            all: t("All"), // Translate "All"
        };
        serviceTypeOptions.forEach(type => {
            if (type !== "all") {
                // Capitalize first letter and translate the type.
                // Assuming your i18n keys might be "Plumbing", "Electrical", etc.
                labels[type] = t(type.charAt(0).toUpperCase() + type.slice(1));
            }
        });
        return labels;
    }, [serviceTypeOptions, t]); // Re-calculate when serviceTypeOptions or translation changes


    const columns = [
        { key: "img", label: t("Image") },
        { key: "name", label: t("ProviderName") },
        { key: "type", label: t("ServiceType") }, // This column displays the service type
        { key: "phone", label: t("Phone") },
        { key: "map", label: t("Location") },
        { key: "from", label: t("OpeningTime") },
        { key: "to", label: t("ClosingTime") },
        // { key: "rate", label: "Rate" },
        { key: "statusText", label: t("Status") }, // Displays the translated status
    ];

    if (isLoading || loadingService) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <DataTable
                data={servicesData} // Use the new state variable name
                columns={columns}
                addRoute="/services/add" // Example: route to add new services
                showAddButton={false}
                showActionColumns={false}
                // --- Filter Props ---
                filterByKey="type" // This targets the 'type' key in your data
                filterOptions={serviceTypeOptions} // Dynamic options from unique service types
                filterLabelsText={serviceTypeLabels} // Translated labels for options
                showFilter={true} // Crucial: Make sure the filter is visible
                // Optional: If you want to customize status badge text
                statusLabelsText={{ active: t("Active"), inactive: t("Inactive") }}
            />
        </div>
    );
};

export default Services;
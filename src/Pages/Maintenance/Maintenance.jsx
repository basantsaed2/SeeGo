"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Maintenance = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [MaintenancePending, setMaintenancePending] = useState([]);
    const [MaintenancePendingDetails, setMaintenancePendingDetails] = useState([]);
    const [MaintenanceCompleted, setMaintenanceCompleted] = useState([]);

    const { refetch: refetchMaintenance, loading: loadingMaintenance, data: MaintenanceData } = useGet({
        url: `${apiUrl}/maintenance`,
    });

    useEffect(() => {
        refetchMaintenance();
    }, [refetchMaintenance]);

    useEffect(() => {
        if (MaintenanceData && MaintenanceData.completed && MaintenanceData.pending) {
            console.log(MaintenanceData.completed )
            // No need to format the data - pass it directly to show all details in modal
            setMaintenancePending(MaintenanceData.pending);
            setMaintenanceCompleted(MaintenanceData.completed);
        }
    }, [MaintenanceData]);

    useEffect(() => {
        if (MaintenanceData && MaintenanceData.completed && MaintenanceData.pending) {
            const formattedPending = MaintenanceData?.pending?.map((u) => {
                return {
                    id: u.id,
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
                    name: u.user.name|| "—",
                    phone: u.user.phone|| "—",
                    maintenance: u.maintenance_type?.name || "—",
                    unit: u.appartment?.unit || "—",
                    floor: u.appartment?.number_floors || "—",
                };
            });
            const formattedDetailsPending = MaintenanceData?.pending?.map((u) => {
                return {
                    Description:u.description
                };
            });
            setMaintenancePendingDetails(formattedDetailsPending);
            setMaintenancePending(formattedPending);
            const formattedCompleted = MaintenanceData?.completed?.map((u) => {
                return {
                    id: u.id,
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
                    name: u.user.name|| "—",
                    phone: u.user.phone|| "—",
                    maintenance: u.maintenance_type?.name || "—",
                    unit: u.appartment?.unit || "—",
                    floor: u.appartment?.number_floors || "—",
                };
            });
            setMaintenanceCompleted(formattedCompleted);
        }
    }, [MaintenanceData]);

    const columns = [
        { key: "img", label: "Image" },
        { key: "maintenance", label: "Maintenance Type"},
        { key: "name", label: "User Name"},
        { key: "phone", label: "User Phone"},
        { key: "unit", label: "Apartment Unit"},
    ];

    if (isLoading || loadingMaintenance) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="!p-4 text-md grid w-full grid-cols-2 gap-4 bg-transparent !mb-6">
                    <TabsTrigger
                        value="pending"
                        className="rounded-[10px] border text-bg-primary !py-2 transition-all 
                data-[state=active]:bg-bg-primary data-[state=active]:text-white 
                hover:bg-teal-100 hover:text-teal-700 shadow-md"
                    >
                        Pending Maintenance
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="rounded-[10px] border text-bg-primary !py-2 transition-all 
                data-[state=active]:bg-bg-primary data-[state=active]:text-white 
                hover:bg-teal-100 hover:text-teal-700 shadow-md"
                    >
                        Completed Maintenance
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    <DataTable
                        data={MaintenancePending}
                        columns={columns}
                        showAddButton={false}
                        showActionColumns={false}
                        detailsData={MaintenancePendingDetails}

                    />
                </TabsContent>

                <TabsContent value="completed">
                    <DataTable
                        data={MaintenanceCompleted}
                        columns={columns}
                        showAddButton={false}
                        showActionColumns={false}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Maintenance;
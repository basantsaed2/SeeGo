"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useChangeState } from "@/Hooks/useChangeState";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, Home, Phone, User, Wrench } from "lucide-react";
import { setNotificationTotals } from "@/Store/notificationSlice"; // Import action
const Maintenance = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const dispatch = useDispatch();
    const [MaintenancePending, setMaintenancePending] = useState([]);
    const [MaintenanceCompleted, setMaintenanceCompleted] = useState([]);
    const { changeState, loadingChange } = useChangeState();
    const [selectedProblem, setSelectedProblem] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { refetch: refetchMaintenance, loading: loadingMaintenance, data: MaintenanceData } = useGet({
        url: `${apiUrl}/maintenance`,
    });

    useEffect(() => {
        refetchMaintenance();
    }, [refetchMaintenance]);

    useEffect(() => {
        console.log("MaintenanceData:", MaintenanceData);
        if (MaintenanceData && MaintenanceData.completed && MaintenanceData.pending) {
            const formattedPending = MaintenanceData.pending.map((u) => ({
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
                name: u.user.name || "—",
                phone: u.user.phone || "—",
                maintenance: u.maintenance_type?.name || "—",
                unit: u.appartment?.unit || "—",
                floor: u.appartment?.number_floors || "—",
                status: u.status === 1 ? "Active" : "Inactive",
            }));
            const formattedCompleted = MaintenanceData.completed.map((u) => ({
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
                name: u.user.name || "—",
                phone: u.user.phone || "—",
                maintenance: u.maintenance_type?.name || "—",
                unit: u.appartment?.unit || "—",
                description: u.description || "—",
                status: u.status === 1 ? "Active" : "Inactive",
            }));
            setMaintenancePending(formattedPending);
            setMaintenanceCompleted(formattedCompleted);

            // Dispatch total maintenance requests to Redux store
            dispatch(
                setNotificationTotals({
                    totalMaintenance: formattedPending.length + formattedCompleted.length,
                })
            );
        }
    }, [MaintenanceData, dispatch]);

    const handleToggleStatus = async (row, newStatus) => {
        const response = await changeState(
            `${apiUrl}/maintenance/status/${row.id}?status=${newStatus}`,
            `${row.maintenance} status changed successfully.`
        );
        if (response) {
            refetchMaintenance();
        }
    };

    const columns = [
        { key: "maintenance", label: "Maintenance Type" },
        { key: "name", label: "User Name" },
        { key: "phone", label: "User Phone" },
        { key: "unit", label: "Unit" },
        {
            key: "description",
            label: "Details",
            render: (row) => (
                <Button
                    variant="link"
                    className="text-blue-600 underline p-0"
                    onClick={() => {
                        console.log("Button clicked, row:", row);
                        const originalRow = MaintenanceData.pending.find(item => item.id === row.id) ||
                            MaintenanceData.completed.find(item => item.id === row.id);
                        setSelectedProblem(originalRow);
                        setIsDialogOpen(true);
                    }}
                >
                    View Details
                </Button>
            ),
        },
        { key: "status", label: "Status" },
    ];

    if (isLoading || loadingMaintenance || loadingChange) {
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
                        onToggleStatus={handleToggleStatus}
                        statusLabels={{
                            active: "Completed",
                            inactive: "Pending",
                        }}
                    />
                </TabsContent>
                <TabsContent value="completed">
                    <DataTable
                        data={MaintenanceCompleted}
                        columns={columns}
                        showAddButton={false}
                        showActionColumns={false}
                        onToggleStatus={handleToggleStatus}
                        statusLabels={{
                            active: "Completed",
                            inactive: "Pending",
                        }}
                    />
                </TabsContent>
            </Tabs>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Maintenance Request Details</DialogTitle>
                    </DialogHeader>
                    {selectedProblem ? (
                        <div className="!space-y-6">
                            {console.log("selectedProblem:", selectedProblem)}
                            {selectedProblem.image_link && (
                                <div className="flex justify-center">
                                    <img
                                        src={selectedProblem.image_link}
                                        alt={selectedProblem.maintenance_type?.name || "Maintenance"}
                                        className="max-h-80 object-contain rounded-lg border"
                                    />
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span
                                    className={`!px-4 !py-2 rounded-full text-sm font-medium ${selectedProblem.status === 1
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {selectedProblem.status === 1 ? "Completed" : "Pending"}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="!space-y-4">
                                    <div>
                                        <h3 className="font-medium flex items-center">
                                            <Wrench className="w-5 h-5 !mr-2 text-blue-600" />
                                            Maintenance Type
                                        </h3>
                                        <p className="!mt-1 !pl-7">
                                            {selectedProblem.maintenance_type?.name || "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Description</h3>
                                        <p className="!mt-1 bg-gray-50 !p-3 rounded-md">
                                            {selectedProblem.description || "No description provided"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>No maintenance data available.</p>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Maintenance;
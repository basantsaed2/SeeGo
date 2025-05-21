"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGet } from "@/Hooks/UseGet";
import { useChangeState } from "@/Hooks/useChangeState";

const Payments = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [tab, setTab] = useState("Pending Payments");
    const [PaymentsUpcoming, setPaymentsUpcoming] = useState([]);
    const [PaymentsHistory, setPaymentsHistory] = useState([]);
    const { changeState, loadingChange } = useChangeState();

    const { refetch: refetchPayment, loading: loadingPayment, data: PaymentData } = useGet({
        url: `${apiUrl}/payment_request`,
    });

    useEffect(() => {
        refetchPayment();
    }, [refetchPayment]);

    useEffect(() => {
        if (PaymentData && PaymentData.upcoming && PaymentData.history) {
            const formattedUpcoming = PaymentData?.upcoming?.map((u) => {
                return {
                    id: u.id,
                    name: u.user.name || "—",
                    phone: u.user.phone || "—",
                    maintenance: u.maintenance.name || "—",
                    paid: u.paid || "—",
                    receipt: u.receipt || "—",
                    status: u.status === "accepted" ? "Active" : "Inactive",
                };
            });
            setPaymentsUpcoming(formattedUpcoming);
            const formattedHistory = PaymentData?.history?.map((u) => {
                return {
                    id: u.id,
                    name: u.user.name || "—",
                    phone: u.user.phone || "—",
                    maintenance: u.maintenance.name || "—",
                    paid: u.paid || "—",
                    receipt: u.receipt || "—",
                    status: u.status === "accepted" ? "Active" : "Inactive",
                };
            });
            setPaymentsHistory(formattedHistory);
        }
    }, [PaymentData]);

    const handleApprove = async (id) => {
        const response = await changeState(
            `${apiUrl}/payment_request/status/${id}?status=accepted`,
            `Payment approved successfully.`
        );
        if (response) {
            refetchPayment();
        }
    };

    const handleReject = async (id) => {
        const response = await changeState(
            `${apiUrl}/payment_request/status/${id}?status=rejected`,
            `Payment rejected successfully.`
        );
        if (response) {
            refetchPayment();
        }
    };

    const baseColumnsHistory = [
        { key: "name", label: "User Name" },
        { key: "phone", label: "Phone" },
        { key: "maintenance", label: "Maintenance Name" },
        { key: "paid", label: "Paid" },
        { key: "statusText", label: "Status" },
    ];

    const baseColumns = [
        { key: "name", label: "User Name" },
        { key: "phone", label: "Phone" },
        { key: "maintenance", label: "Maintenance Name" },
        { key: "paid", label: "Paid" },
    ];

    const actionColumn = {
        key: "actions",
        label: "Actions",
        render: (row) => {
            return (
                <div className="flex items-center justify-center !mt-2 !pt-2 gap-4">
                    {/* Accept Button */}
                    <button
                        onClick={() => handleApprove(row.id)}
                        className="flex items-center justify-center gap-2 !px-5 !py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl text-sm font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:bg-green-200 disabled:cursor-not-allowed disabled:scale-100"
                        aria-label="Accept payment"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Accept
                    </button>

                    {/* Reject Button */}
                    <button
                        onClick={() => handleReject(row.id)}
                        className="flex items-center justify-center gap-2 !px-5 !py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-sm font-semibold shadow-lg transition-all duration-200 transform hover:scale-105"
                        aria-label="Reject payment"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        Reject
                    </button>
                </div>
            );
        },
    };

    const columns = [...baseColumns, actionColumn];

    if (isLoading || loadingPayment) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <Tabs defaultValue="upcoming" className="w-full" onValueChange={setTab}>
                <TabsList className="!p-4 text-md grid w-full grid-cols-2 gap-4 bg-transparent !mb-6">
                    <TabsTrigger
                        value="upcoming"
                        className="rounded-[10px] border text-bg-primary !py-2 transition-all 
                      data-[state=active]:bg-bg-primary data-[state=active]:text-white 
                      hover:bg-teal-100 hover:text-teal-700 shadow-md"
                    >
                        Upcoming Payments
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="rounded-[10px] border text-bg-primary !py-2 transition-all 
                      data-[state=active]:bg-bg-primary data-[state=active]:text-white 
                      hover:bg-teal-100 hover:text-teal-700 shadow-md"
                    >
                        History Payments
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    <DataTable
                        data={PaymentsUpcoming}
                        columns={columns}
                        showAddButton={false}
                        showActionColumns={false}
                    />
                </TabsContent>

                <TabsContent value="history">
                    <DataTable
                        data={PaymentsHistory}
                        columns={baseColumnsHistory}
                        showAddButton={false}
                        showActionColumns={false}
                        statusLabelsText={{
                            active: "Accepted",
                            inactive: "Rejected",
                        }}
                    />
                </TabsContent>
            </Tabs>
            <ToastContainer />
        </div>
    );
};

export default Payments;
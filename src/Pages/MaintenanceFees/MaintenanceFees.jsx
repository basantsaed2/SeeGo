"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";

const MaintenanceFees = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [maintenanceFees, setMaintenanceFees] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowEdit, setRowEdit] = useState(null);
    const [totals, setTotals] = useState({
        grandTotal: 0,
        grandPaid: 0,
        grandRemain: 0
    });

    const { refetch: refetchMaintenanceFees, loading: loadingMaintenanceFees, data: MaintenanceFeesData } = useGet({
        url: `${apiUrl}/maintenance_feez`
    });

    useEffect(() => {
        refetchMaintenanceFees();
    }, [refetchMaintenanceFees]);

    useEffect(() => {
        if (MaintenanceFeesData && MaintenanceFeesData.maintenance_fees) {
            const formatted = MaintenanceFeesData.maintenance_fees.map((u) => {
                return {
                    id: u.id,
                    name: u.name || "—",
                    total: u.total ? parseFloat(u.total).toFixed(2) : "0.00",
                    paid: u.paid ? parseFloat(u.paid).toFixed(2) : "0.00",
                    remain: u.remain ? parseFloat(u.remain).toFixed(2) : "0.00",
                    unpaidNo: u.unpaid || "—",
                };
            });

            // Calculate grand totals
            const grandTotal = formatted.reduce((sum, item) => sum + parseFloat(item.total), 0);
            const grandPaid = formatted.reduce((sum, item) => sum + parseFloat(item.paid), 0);
            const grandRemain = formatted.reduce((sum, item) => sum + parseFloat(item.remain), 0);

            setTotals({
                grandTotal: grandTotal.toFixed(2),
                grandPaid: grandPaid.toFixed(2),
                grandRemain: grandRemain.toFixed(2)
            });

            setMaintenanceFees(formatted);
        }
    }, [MaintenanceFeesData]);


    const columns = [
        { key: "name", label: "MaintenanceFees" },
        { key: "total", label: "Total" },
        { key: "paid", label: "Paid" },
        { key: "remain", label: "Remain" },
        { key: "unpaidNo", label: "Unpaid Number" },
    ];
    if (isLoading || loadingMaintenanceFees) {
        return <FullPageLoader />;
    }
    return (
        <div>
            <ToastContainer />
            {/* Enhanced Grand Totals Row */}
            <div className="border-t border-gray-200 bg-gray-50/50 dark:bg-gray-800/50 !mb-5 !px-6 !py-3.5 flex items-center justify-between">
                <div className="flex items-center !space-x-2">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                    </svg>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Grand Totals</span>
                </div>
                <div className="flex !space-x-6">
                    <div className="flex items-center !space-x-1.5 bg-green-50 dark:bg-green-900/20 !px-3 !py-1.5 rounded-lg">
                        <span className="text-green-600 dark:text-green-400 font-medium">Total:</span>
                        <span className="text-green-700 dark:text-green-300 font-semibold">{totals.grandTotal} EGP</span>
                    </div>
                    <div className="flex items-center !space-x-1.5 bg-blue-50 dark:bg-blue-900/20 !px-3 !py-1.5 rounded-lg">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">Paid:</span>
                        <span className="text-blue-700 dark:text-blue-300 font-semibold">{totals.grandPaid} EGP</span>
                    </div>
                    <div className={`flex items-center !space-x-1.5 !px-3 !py-1.5 rounded-lg ${parseFloat(totals.grandRemain) > 0
                            ? "bg-red-50 dark:bg-red-900/20"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}>
                        <span className={parseFloat(totals.grandRemain) > 0
                            ? "text-red-600 dark:text-red-400 font-medium"
                            : "text-gray-600 dark:text-gray-400 font-medium"
                        }>
                            Remain:
                        </span>
                        <span className={parseFloat(totals.grandRemain) > 0
                            ? "text-red-700 dark:text-red-300 font-semibold"
                            : "text-gray-700 dark:text-gray-300 font-semibold"
                        }>
                            {totals.grandRemain} EGP
                        </span>
                    </div>
                </div>
            </div>
            <DataTable
                data={maintenanceFees}
                columns={columns}
                pageDetailsRoute={true}
                showAddButton={false}
                showActionColumns={false}
            />
        </div>
    );
};

export default MaintenanceFees;
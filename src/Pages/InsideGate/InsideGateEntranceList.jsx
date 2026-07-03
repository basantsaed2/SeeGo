import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

// Components
import DataTable from "@/components/DataTableLayout";
import FullPageLoader from "@/components/Loading";

// Custom Hooks
import { useGet } from "@/Hooks/UseGet";

export default function InsideGateEntranceList() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Pagination & Search state
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    // Fetch entrance list for the specific gate ID
    const queryParams = new URLSearchParams();
    if (page) queryParams.append("page", page);
    if (search) queryParams.append("search", search);

    const { data: apiResponse, loading, refetch } = useGet({
        url: `${apiUrl}/inside_gate/entrance_list/${id}?${queryParams.toString()}`,
    });

    const tableData = apiResponse?.data || [];
    const pagination = apiResponse?.pagination || { current_page: 1, last_page: 1, total: 0 };

    useEffect(() => {
        refetch();
    }, [page, search, refetch]);

    const columns = [
        { key: "id", label: t("ID") || "ID" },
        { key: "user_name", label: t("User Name") || "User Name" },
        { key: "user_phone", label: t("Phone") || "Phone" },
        { key: "user_email", label: t("Email") || "Email" },
        { key: "visitor_type", label: t("Visitor Type") || "Visitor Type" },
        { key: "user_type", label: t("User Type") || "User Type" },
        { key: "appartment", label: t("Apartment") || "Apartment" },
        { key: "gate_type", label: t("Gate Type") || "Gate Type" },
        { key: "date", label: t("Date") || "Date" },
        { key: "time", label: t("Time") || "Time" },
        { key: "type", label: t("Type") || "Type" },
    ];

    if (loading && !tableData.length) {
        return <FullPageLoader />;
    }

    return (
        <div className="!p-6 space-y-6">
            {/* Header section with back button */}
            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate("/inside_gate")}
                        className="rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-bg-primary">
                            {t("Gate Entrance Log List") || "Gate Entrance Log List"}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {t("Gate ID") || "Gate ID"}: <span className="font-semibold">{id}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Data Table for Entrance List */}
            <DataTable
                data={tableData}
                columns={columns}
                showAddButton={false}
                showActionColumns={false}
                isBackendPagination={true}
                backendCurrentPage={pagination.current_page || page}
                backendTotalPages={pagination.last_page || 1}
                onBackendPageChange={(newPage) => setPage(newPage)}
                onSearchChange={(val) => {
                    setSearch(val);
                    setPage(1);
                }}
            />
        </div>
    );
}

"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useChangeState } from "@/Hooks/useChangeState";

const Problems = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [Problems, setProblems] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const { changeState, loadingChange, responseChange } = useChangeState();

    const { refetch: refetchProblem, loading: loadingProblem, data: ProblemData } = useGet({
        url: `${apiUrl}/problem`,
    });

    useEffect(() => {
        refetchProblem();
    }, [refetchProblem]);

    useEffect(() => {
        if (ProblemData && ProblemData.problem_reports) {
            const formatted = ProblemData?.problem_reports?.map((u) => {
                return {
                    id: u.id,
                    name: u.owner || "—",
                    type: u.owner_type || "—",
                    map: u.google_map || "—",
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
                    status: u.status === "pending" ? "Inactive" : "Active",
                };
            });
            setProblems(formatted);
        }
    }, [ProblemData]);

    const handleToggleStatus = async (row, newStatus) => {
        const response = await changeState(
            `${apiUrl}/problem/status/${row.id}?status=${newStatus === 0 ? "pending" : "resolved"}`,
            `${row.name} Changed Status.`,
        );
        if (response) {
            setProblems((prev) =>
                prev.map((problem) =>
                    problem.id === row.id ? { ...problem, status: newStatus === 0 ? "Inactive" : "Active" } : problem
                )
            );
        }
    };

    const columns = [
        { key: "img", label: "Image" },
        { key: "name", label: "Problem Owner" },
        { key: "type", label: "Owner Type" },
        { key: "map", label: "Location" },
        { key: "status", label: "Problem Status" },
    ];

    if (isLoading || loadingProblem) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <DataTable
                data={Problems}
                columns={columns}
                showAddButton={false}
                onToggleStatus={handleToggleStatus}
                statusLabels={{
                    active: "Resolved",
                    inactive: "Pending"
                }}
            />
        </div>
    );
};

export default Problems;
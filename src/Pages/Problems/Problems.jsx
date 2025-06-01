"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useChangeState } from "@/Hooks/useChangeState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { setNotificationTotals } from "@/Store/notificationSlice"; // Import action
const Problems = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [problems, setProblems] = useState([]);
  const [pendingProblems, setPendingProblems] = useState([]);
  const [resolvedProblems, setResolvedProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { changeState } = useChangeState();
  const dispatch = useDispatch();

  const { refetch: refetchProblem, loading: loadingProblem, data: ProblemData } = useGet({
    url: `${apiUrl}/problem`,
  });

  useEffect(() => {
    refetchProblem();
  }, [refetchProblem]);
  const { t } = useTranslation();

  useEffect(() => {
    if (ProblemData && ProblemData.problem_reports) {
      const formatted = ProblemData.problem_reports.map((u) => ({
        id: u.id,
        name: u.owner || "—",
        description: u.description || "No description provided",
        map: u.google_map || "—",
        image: u.image,
        // status: u.status === "pending" ? 0 : 1, // 0 for inactive/pending, 1 for active/resolved
        status: u.status || "pending", // Default to "pending" if undefined
      }));
      
      setProblems(formatted);
      setPendingProblems(formatted.filter(problem => problem.status === "pending"));
      setResolvedProblems(formatted.filter(problem => problem.status === "resolved"));

      // Dispatch total problems to Redux store
      dispatch(
        setNotificationTotals({
          totalProblems: formatted.length,
        })
      );
    }
  }, [ProblemData, dispatch]);

  const handleToggleStatus = async (row, newStatus) => {
    const statusValue = newStatus === 1 ? "resolved" : "pending";
    const response = await changeState(
      `${apiUrl}/problem/status/${row.id}?status=${statusValue}`,
      `Problem status changed to ${statusValue}.`,
    );
    if (response) {
      refetchProblem();
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Pending"; // Default value
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const pendingColumns = [
    { key: "name", label: t("UserProblem") },
    { key: "map", label: t("Location") },
    { 
      key: "description", 
      label: t("Details"),
      render: (row) => (
        <Button 
          variant="link" 
          className="text-blue-600 underline p-0"
          onClick={() => {
            setSelectedProblem(row);
            setIsDialogOpen(true);
          }}
        >
          {t("ViewDetails")}
        </Button>
      )
    },
     { 
      key: "status", 
      label: t("Status"),
    },
  ];

  const resolvedColumns = [
     { key: "name", label: t("UserProblem") },
    { key: "map", label: t("Location") },
    { 
      key: "description", 
      label: t("Details"),
      render: (row) => (
        <Button 
          variant="link" 
          className="text-blue-600 underline p-0"
          onClick={() => {
            setSelectedProblem(row);
            setIsDialogOpen(true);
          }}
        >
          {t("ViewDetails")}
        </Button>
      )
    },
    { 
      key: "status", 
      label: t("Status"),
      render: (row) => (
        <span className={`!px-3 !py-1 rounded-full text-sm ${row.status === "resolved" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {formatStatus(row.status)}
        </span>
      )
    },
  ];

  if (isLoading || loadingProblem) {
    return <FullPageLoader />;
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-4 text-lg bg-transparent !mb-6">
          <TabsTrigger
            value="pending"
            className="rounded-[10px] border text-bg-primary !py-2 transition-all 
            data-[state=active]:bg-bg-primary data-[state=active]:text-white 
            hover:bg-teal-100 hover:text-teal-700"
          >
            {t("Pending")}
          </TabsTrigger>
          <TabsTrigger
            value="resolved"
            className="rounded-[10px] border text-bg-primary !py-2 transition-all 
            data-[state=active]:bg-bg-primary data-[state=active]:text-white 
            hover:bg-teal-100 hover:text-teal-700"
          >
            {t("Resolved")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <DataTable
            data={pendingProblems}
            columns={pendingColumns}
            showAddButton={false}
            showActionColumns={false}
            onToggleStatus={handleToggleStatus}
            statusLabels={{
              active: "Resolved",
              inactive: "Pending"
            }}
          />
        </TabsContent>

        <TabsContent value="resolved">
          <DataTable
            data={resolvedProblems}
            columns={resolvedColumns}
            showAddButton={false}
            showActionColumns={false}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("ProblemDetails")}</DialogTitle>
          </DialogHeader>
          {selectedProblem && (
            <div className="!space-y-6">
              {selectedProblem.image && (
                <div className="flex justify-center">
                  <img 
                    src={selectedProblem.image} 
                    alt={selectedProblem.name} 
                    className="max-h-96 object-contain rounded-md"
                  />
                </div>
              )}
              <div>
                <h3 className="font-medium text-lg">{t("Description")}</h3>
                <p className="text-gray-700 !mt-2">{selectedProblem.description}</p>
              </div>
              <div>
                <h3 className="font-medium text-lg">{t("Status")}</h3>
                <p className={`!mt-2 !px-4 !py-2 inline-block rounded-full ${
                  selectedProblem.status === "resolved" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {formatStatus(selectedProblem.status)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Problems;
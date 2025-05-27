// "use client";
// import { useEffect, useState } from "react";
// import DataTable from "@/components/DataTableLayout";
// import "react-toastify/dist/ReactToastify.css";
// import { useSelector } from "react-redux";
// import FullPageLoader from "@/components/Loading";
// import { useGet } from "@/Hooks/UseGet";
// import { useChangeState } from "@/Hooks/useChangeState";

// const Problems = () => {
//     const apiUrl = import.meta.env.VITE_API_BASE_URL;
//     const isLoading = useSelector((state) => state.loader.isLoading);
//     const [Problems, setProblems] = useState([]);
//     const { changeState } = useChangeState();

//     const { refetch: refetchProblem, loading: loadingProblem, data: ProblemData } = useGet({
//         url: `${apiUrl}/problem`,
//     });

//     useEffect(() => {
//         refetchProblem();
//     }, [refetchProblem]);

//     useEffect(() => {
//         if (ProblemData && ProblemData.problem_reports) {
//             const formatted = ProblemData?.problem_reports?.map((u) => {
//                 return {
//                     id: u.id,
//                     name: u.owner || "—",
//                     map: u.google_map || "—",
//                     img: u.image ? (
//                         <img
//                             src={u.image}
//                             alt={u.name}
//                             className="w-12 h-12 object-cover rounded-md"
//                         />
//                     ) : (
//                         <Avatar className="w-12 h-12">
//                             <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                     ),
//                     status: u.status === "pending" ? "Inactive" : "Active",
//                 };
//             });
//             setProblems(formatted);
//         }
//     }, [ProblemData]);

//     const handleToggleStatus = async (row, newStatus) => {
//         const response = await changeState(
//             `${apiUrl}/problem/status/${row.id}?status=${newStatus === 0 ? "pending" : "resolved"}`,
//             `${row.name} Changed Status.`,
//         );
//         if (response) {
//             setProblems((prev) =>
//                 prev.map((problem) =>
//                     problem.id === row.id ? { ...problem, status: newStatus === 0 ? "Inactive" : "Active" } : problem
//                 )
//             );
//         }
//     };

//     const columns = [
//         { key: "img", label: "Image" },
//         { key: "name", label: "User Problem" },
//         { key: "map", label: "Location" },
//         { key: "status", label: "Problem Status" },
//     ];

//     if (isLoading || loadingProblem) {
//         return <FullPageLoader />;
//     }

//     return (
//         <div className="p-4">
//             <DataTable
//                 data={Problems}
//                 columns={columns}
//                 showAddButton={false}
//                 onToggleStatus={handleToggleStatus}
//                 statusLabels={{
//                     active: "Resolved",
//                     inactive: "Pending"
//                 }}
//                 showActionColumns={false}
//             />
//         </div>
//     );
// };

// export default Problems;

"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useChangeState } from "@/Hooks/useChangeState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Problems = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [problems, setProblems] = useState([]);
  const [pendingProblems, setPendingProblems] = useState([]);
  const [resolvedProblems, setResolvedProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { changeState } = useChangeState();

  const { refetch: refetchProblem, loading: loadingProblem, data: ProblemData } = useGet({
    url: `${apiUrl}/problem`,
  });

  useEffect(() => {
    refetchProblem();
  }, [refetchProblem]);

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
    }
  }, [ProblemData]);

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
    { key: "name", label: "User Problem" },
    { key: "map", label: "Location" },
    { 
      key: "description", 
      label: "Details",
      render: (row) => (
        <Button 
          variant="link" 
          className="text-blue-600 underline p-0"
          onClick={() => {
            setSelectedProblem(row);
            setIsDialogOpen(true);
          }}
        >
          View Details
        </Button>
      )
    },
     { 
      key: "status", 
      label: "Status",
    },
  ];

  const resolvedColumns = [
    { key: "name", label: "User Problem" },
    { key: "map", label: "Location" },
    { 
      key: "description", 
      label: "Details",
      render: (row) => (
        <Button 
          variant="link" 
          className="text-blue-600 underline p-0"
          onClick={() => {
            setSelectedProblem(row);
            setIsDialogOpen(true);
          }}
        >
          View Details
        </Button>
      )
    },
    { 
      key: "status", 
      label: "Status",
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
            className="rounded-[10px] text-md border text-bg-primary !py-2 transition-all 
            data-[state=active]:bg-bg-primary data-[state=active]:text-white 
            hover:bg-teal-100 hover:text-teal-700"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="resolved"
            className="rounded-[10px] text-md border text-bg-primary !py-2 transition-all 
            data-[state=active]:bg-bg-primary data-[state=active]:text-white 
            hover:bg-teal-100 hover:text-teal-700"
          >
            Resolved
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
            <DialogTitle>Problem Details</DialogTitle>
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
                <h3 className="font-medium text-lg">Description:</h3>
                <p className="text-gray-700 !mt-2">{selectedProblem.description}</p>
              </div>
              <div>
                <h3 className="font-medium text-lg">Status:</h3>
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
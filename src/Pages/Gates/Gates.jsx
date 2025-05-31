"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { useChangeState } from "@/Hooks/useChangeState";
import { useGateForm, GateFormFields } from "./GateForm";
import { usePost } from "@/Hooks/UsePost";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Image as ImageIcon, Plus } from "lucide-react";
import { Link } from "react-router-dom"; // Replace with next/link if using Next.js
import { useTranslation } from "react-i18next";

const Gates = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [gates, setGates] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowEdit, setRowEdit] = useState(null);
  const { changeState, loadingChange } = useChangeState();
  const { deleteData, loadingDelete } = useDelete();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { t } = useTranslation();
  const { refetch: refetchGates, loading: loadingGates, data: gatesData } = useGet({
    url: `${apiUrl}/gate`,
  });
  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/gate/update/${selectedRow?.id}`,
  });

  const { formData, fields, handleFieldChange, prepareFormData } = useGateForm(
    apiUrl,
    true,
    rowEdit
  );

  useEffect(() => {
    refetchGates();
  }, [refetchGates]);

  useEffect(() => {
    if (gatesData && gatesData.gatess) {
      console.log("Gates Data:", gatesData);
      const formatted = gatesData?.gatess?.map((u) => ({
        id: u.id,
        name: u.name || "—",
        map: u.location || "—",
        status: u.status === 1 ? "Active" : "Inactive",
        image_link: u.image_link || "/placeholder-gate.jpg",
      }));
      setGates(formatted);
    }
  }, [gatesData]);

  const handleEdit = (gate) => {
    const fullGateData = gatesData?.gatess.find((o) => o.id === gate.id);
    setSelectedRow(gate);
    setIsEditOpen(true);
    setRowEdit({
      ...fullGateData,
      image_link: fullGateData?.image_link || null,
      status: gate.status,
    });
  };

  const handleDelete = (gate) => {
    setSelectedRow(gate);
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    if (!loadingPost && response) {
      setIsEditOpen(false);
      setSelectedRow(null);
      refetchGates();
    }
  }, [response, loadingPost, refetchGates]);

  const handleSave = async (e) => {
    e.preventDefault();
    const body = prepareFormData();
    postData(body, t("Gateupdatedsuccessfully"));
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteData(
      `${apiUrl}/gate/delete/${selectedRow.id}`,
      `${selectedRow.name} Deleted Success.`
    );

    if (success) {
      setIsDeleteOpen(false);
      setGates(gates.filter((gate) => gate.id !== selectedRow.id));
    }
  };

  const handleToggleStatus = async (row, newStatus) => {
    const response = await changeState(
      `${apiUrl}/gate/status/${row.id}?status=${newStatus}`,
      `${row.name} Changed Status.`
    );
    if (response) {
      setGates((prev) =>
        prev.map((gate) =>
          gate.id === row.id
            ? { ...gate, status: newStatus === 1 ? t("Active") : t("Inactive") }
            : gate
        )
      );
    }
  };

  if (isLoading || loadingPost || loadingGates) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen !p-6">
      <ToastContainer />
      {/* Header Section */}
      <div className="w-full !mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-bg-primary">{t("Gates")}</h1>
          <Button
            asChild
            className="bg-bg-primary hover:text-bg-primary hover:bg-white text-white font-semibold rounded-full !px-6 !py-2"
          >
            <Link to="/gates/add">
              <Plus className="w-4 h-4 !mr-2" />
              {t("AddNewGate")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {gates.map((gate) => (
            <motion.div
              key={gate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Gate Image */}
              <div className="h-40 bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center">
                {gate.image_link ? (
                  <img
                    src={gate.image_link}
                    alt={gate.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Avatar className="w-16 h-16">
                    <AvatarFallback>{gate.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>

              {/* Card Content */}
              <div className="!p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">{gate.name}</h3>
                  <span
                    className={`!px-3 !py-1 rounded-full text-sm font-medium ${
                      gate.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {gate.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 !mt-2">
                  <span className="font-medium">{t("Location")}:</span> {gate.map}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-between !mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(gate)}
                    disabled={loadingGates}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="w-4 h-4 !mr-2" />
                    {t("Edit")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(gate)}
                    disabled={loadingDelete}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 !mr-2" />
                    {t("Delete")}
                  </Button>

                </div>
              </div>

              {/* Status Toggle */}
              <div className="absolute top-4 right-4">
                <Switch
                  checked={gate.status === "Active"}
                  onCheckedChange={() => handleToggleStatus(gate, gate.status === "Active" ? 0 : 1)}
                  disabled={loadingChange}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit and Delete Dialogs */}
      {selectedRow && (
        <>
          <EditDialog
            title={t("EditGate")}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSave={handleSave}
            selectedRow={selectedRow}
            onCancel={() => setIsEditOpen(false)}
            onChange={handleFieldChange}
            isLoading={loadingGates}
          >
            <div className="w-full max-h-[60vh] p-4 overflow-y-auto">
              <Tabs defaultValue="english" className="w-full">
                <TabsContent value="english">
                  <GateFormFields
                    fields={fields}
                    formData={formData}
                    handleFieldChange={handleFieldChange}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </EditDialog>
          <DeleteDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onDelete={handleDeleteConfirm}
            name={selectedRow.name}
            isLoading={loadingDelete}
          />
        </>
      )}
    </div>
  );
};

export default Gates;
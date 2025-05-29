"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { useChangeState } from "@/Hooks/useChangeState";
import { useBeachesForm, BeachesFields } from "./BeachesForm";
import { usePost } from "@/Hooks/UsePost";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Image as ImageIcon, Plus } from "lucide-react";
import { Link } from "react-router-dom"; // Replace with next/link if using Next.js
import { FaPlus } from "react-icons/fa";

const Beaches = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [beaches, setBeaches] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowEdit, setRowEdit] = useState(null);
  const { changeState, loadingChange } = useChangeState();
  const { deleteData, loadingDelete } = useDelete();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { refetch: refetchBeach, loading: loadingBeach, data: beachData } = useGet({
    url: `${apiUrl}/beach`,
  });

  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/beach/update/${selectedRow?.id}`,
  });

  const { formData, fields, handleFieldChange, prepareFormData, LanguageTabs } = useBeachesForm(
    apiUrl,
    true,
    rowEdit
  );

  useEffect(() => {
    refetchBeach();
  }, [refetchBeach]);

  useEffect(() => {
    if (beachData && beachData.beachs) {
      const formatted = beachData?.beachs?.map((u) => ({
        id: u.id,
        name: u.name || "—",
        from: u.from || "—",
        to: u.to || "—",
        fromTo: `${u.from || "—"} - ${u.to || "—"}`,
        status: u.status === 1 ? "Active" : "Inactive",
        image: u.gallery[0].image_link || "/placeholder-beach.jpg", // Placeholder image
      }));
      setBeaches(formatted);
    }
  }, [beachData]);

  const handleEdit = (beach) => {
    const fullBeachData = beachData?.beachs.find((o) => o.id === beach.id);
    setSelectedRow(beach);
    setIsEditOpen(true);
    setRowEdit({
      ...fullBeachData,
      status: beach.status,
    });
  };

  const handleDelete = (beach) => {
    setSelectedRow(beach);
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    if (!loadingPost && response) {
      setIsEditOpen(false);
      setSelectedRow(null);
      refetchBeach();
    }
  }, [response, loadingPost, refetchBeach]);

  const handleSave = async (e) => {
    e.preventDefault();
    const body = prepareFormData();
    postData(body, "Beach updated successfully!");
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteData(
      `${apiUrl}/beach/delete/${selectedRow.id}`,
      `${selectedRow.name} Deleted Successfully!`
    );
    if (success) {
      setIsDeleteOpen(false);
      setBeaches(beaches.filter((beach) => beach.id !== selectedRow.id));
    }
  };

  const handleToggleStatus = async (row, newStatus) => {
    const response = await changeState(
      `${apiUrl}/beach/status/${row.id}?status=${newStatus}`,
      `${row.name} status changed successfully.`
    );
    if (response) {
      setBeaches((prev) =>
        prev.map((beach) =>
          beach.id === row.id
            ? { ...beach, status: newStatus === 1 ? "Active" : "Inactive" }
            : beach
        )
      );
    }
  };

  if (isLoading || loadingPost || loadingBeach) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen !p-6">
      {/* Header Section */}
      <div className="w-full !mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-bg-primary">Beaches</h1>
          <Button
            asChild
            className="bg-bg-primary hover:text-bg-primary hover:bg-white text-white font-semibold rounded-full !px-6 !py-2"
          >
            <Link to="/beaches/add">
            <Plus className="w-4 h-4 mr-2" />
            Add New Beach</Link>
          </Button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {beaches.map((beach) => (
            <motion.div
              key={beach.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Beach Image Placeholder */}
              <div className="h-50 bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center">
                <img
                  src={beach.image || "/placeholder-beach.jpg"} // Replace with actual image URL
                  alt={beach.name}
                  className="w-full h-full object-fit"
                />
              </div>

              {/* Card Content */}
              <div className="!p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">{beach.name}</h3>
                  <span
                    className={`!px-3 !py-1 rounded-full text-sm font-medium ${
                      beach.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {beach.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 !mt-2">
                  <span className="font-medium">Operating Hours:</span> {beach.fromTo}
                </p>

                {/* Action Buttons */}
                <div className="flex justify-between !mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(beach)}
                    disabled={loadingBeach}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="w-4 h-4 !mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(beach)}
                    disabled={loadingDelete}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4 !mr-2" />
                    Delete
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link
                      to={`/beaches/details/${beach.id}`}
                      className="text-teal-600 hover:text-teal-800"
                    >
                      <ImageIcon className="w-4 h-4 !mr-2" />
                      Gallery
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="absolute top-4 right-4">
                <Switch
                  checked={beach.status === "Active"}
                  onCheckedChange={() =>
                    handleToggleStatus(beach, beach.status === "Active" ? 0 : 1)
                  }
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
            title="Edit Beach"
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSave={handleSave}
            selectedRow={selectedRow}
            onCancel={() => setIsEditOpen(false)}
            onChange={handleFieldChange}
            isLoading={loadingBeach}
          >
            <div className="w-full max-h-[60vh] !p-4 overflow-y-auto">
              <Tabs defaultValue="english" className="w-full">
                {/* <LanguageTabs /> */}
                <TabsContent value="english">
                  <BeachesFields
                    fields={fields.en}
                    formData={formData.en}
                    handleFieldChange={handleFieldChange}
                    loading={loadingBeach}
                    language="en"
                  />
                </TabsContent>
                {/* <TabsContent value="arabic">
                  <BeachesFields
                    fields={fields.ar}
                    formData={formData.ar}
                    handleFieldChange={handleFieldChange}
                    loading={loadingBeach}
                    language="ar"
                  />
                </TabsContent> */}
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

export default Beaches;

"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import { toast, ToastContainer } from "react-toastify";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { useChangeState } from "@/Hooks/useChangeState";
import { SecurityManFormFields, useSecurityManForm } from "./SecurityManForm";
import { usePost } from "@/Hooks/UsePost";
import { useTranslation } from "react-i18next";

const SecurityMan = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [Securitys, setSecuritys] = useState([]);
  const [selectedRow, setselectedRow] = useState(null);
  const [rowEdit, setRowEdit] = useState(null);
  const { changeState } = useChangeState();
  const { deleteData, loadingDelete, isDeleting } = useDelete();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { t } = useTranslation();

  const { refetch: refetchSecuritys, loading: loadingSecuritys, data: SecuritysData } = useGet({ url: `${apiUrl}/security` });
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/security/update/${selectedRow?.id}` });

  const {
    formData,
    fields,
    handleFieldChange,
    prepareFormData
  } = useSecurityManForm(apiUrl, true, rowEdit);

  useEffect(() => {
    refetchSecuritys();
  }, [refetchSecuritys]);

  const handleForceLogout = async (id, name) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/security/logout/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast.success(t("Logged out successfully for") + ` ${name}`);
      } else {
        toast.error(t("Failed to logout"));
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("Something went wrong"));
    }
  };

  useEffect(() => {
    if (SecuritysData && SecuritysData.security) {
      const formatted = SecuritysData?.security?.map((u) => {
        const types = [];
        if (u.pool?.length > 0) types.push("pool");
        if (u.beach?.length > 0) types.push("beach");
        if (u.gate?.length > 0) types.push("gate");
        // 🟢 التحقق من وجود بوابات داخلية وتحديد النوع
        const insideGatesArray = u.inside_gate || u.inside_gates || [];
        if (insideGatesArray.length > 0) types.push("inside_gate");

        return {
          id: u.id,
          name: u.name || "—",
          email: u.email || "—",
          phone: u.phone || "—",
          pool_ids: u.pool?.map((p) => p.id).join(", ") || "—",
          beach_ids: u.beach?.map((b) => b.id).join(", ") || "—",
          gate_ids: u.gate?.map((g) => g.id).join(", ") || "—",
          inside_gate_ids: insideGatesArray.map((ig) => ig.name).join(", ") || "—", // 🟢 عرض البوابات الداخلية في الجدول
          status: u.status === 1 ? t("Active") : t("Inactive"),
          type: types.length > 0 ? types.join(", ") : "—",
          force_logout: (
            <button
              onClick={() => handleForceLogout(u.id, u.name)}
              className="bg-red-500 hover:bg-red-600 text-white !px-3 !py-1 !rounded-md text-xs transition-colors shadow-sm"
            >
              {t("Force Logout")}
            </button>
          ),
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
        };
      });
      setSecuritys(formatted);
    }
  }, [SecuritysData, t]);

  const handleEdit = (Securitys) => {
    const fullSecuritysData = SecuritysData?.security.find(o => o.id === Securitys.id);
    const insideGatesArray = fullSecuritysData?.inside_gate || fullSecuritysData?.inside_gates || [];

    setselectedRow(Securitys);
    setIsEditOpen(true);
    setRowEdit({
      ...fullSecuritysData,
      pool_ids: fullSecuritysData.pool?.map(p => p.id.toString()) || [],
      beach_ids: fullSecuritysData.beach?.map(b => b.id.toString()) || [],
      gate_ids: fullSecuritysData.gate?.map(g => g.id.toString()) || [],
      inside_gate_ids: insideGatesArray.map(ig => ig.id.toString()) || [], // 🟢 تجهيز الـ IDs عند فتح المودال للتعديل
      types: [
        ...(fullSecuritysData.pool?.length > 0 ? ["pool"] : []),
        ...(fullSecuritysData.beach?.length > 0 ? ["beach"] : []),
        ...(fullSecuritysData.gate?.length > 0 ? ["gate"] : []),
        ...(insideGatesArray.length > 0 ? ["inside_gate"] : []), // 🟢 إضافة التايب في حالة وجود بوابات داخلية
      ],
      image_link: fullSecuritysData?.image_link || null,
      status: Securitys.status === t("Active") ? 1 : 0,
    });
  };

  const handleDelete = (Securitys) => {
    setselectedRow(Securitys);
    setIsDeleteOpen(true);
  };

  useEffect(() => {
    if (!loadingPost && response) {
      if (response) {
        setIsEditOpen(false);
        setselectedRow(null);
        refetchSecuritys();
      }
    }
  }, [response, loadingPost]);

  const handleSave = async () => {
    const body = prepareFormData();
    postData(body, t("SecurityManupdatedsuccessfully"))
  };

  const handleDeleteConfirm = async () => {
    const success = await deleteData(`${apiUrl}/security/delete/${selectedRow.id}`, `${selectedRow.name} ${t("DeletedSuccess")}`);

    if (success) {
      setIsDeleteOpen(false);
      setSecuritys(
        Securitys.filter((Securitys) =>
          Securitys.id !== selectedRow.id
        )
      );
    }
  };

  const handleToggleStatus = async (row, newStatus) => {
    const response = await changeState(
      `${apiUrl}/security/status/${row.id}?status=${newStatus}`,
      `${row.name} Changed Status.`,
    );
    if (response) {
      setSecuritys((prev) =>
        prev.map((Securitys) =>
          Securitys.id === row.id ? { ...Securitys, status: newStatus === 1 ? t("Active") : t("Inactive") } : Securitys
        )
      );
    }
  };

  const columns = [
    { key: "img", label: t("Image") },
    { key: "name", label: t("SecurityMan") },
    { key: "phone", label: t("Phone") },
    { key: "email", label: t("Email") },
    { key: "type", label: t("Type") },
    { key: "inside_gate_ids", label: t("Inside Gates") }, // 🟢 إضافة عمود البوابات الداخلية في الجدول
    { key: "force_logout", label: t("Force Logout") },
    { key: "status", label: t("Status") },
  ];

  if (isLoading || loadingPost || loadingSecuritys) {
    return <FullPageLoader />;
  }

  return (
    <div className="p-4">
      <ToastContainer />
      <DataTable
        data={Securitys}
        columns={columns}
        addRoute="/security_man/add"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
      {selectedRow && (
        <>
          <EditDialog
            title={t("EditSecurityMan")}
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onSave={handleSave}
            selectedRow={selectedRow}
            onCancel={() => setIsEditOpen(false)}
            onChange={handleFieldChange}
            isLoading={loadingSecuritys}
          >
            <div className="w-full max-h-[60vh] p-4 overflow-y-auto">
              <Tabs defaultValue="english" className="w-full">
                <TabsContent value="english">
                  <SecurityManFormFields
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
            isDeleting={isDeleting}
            onDelete={handleDeleteConfirm}
            name={selectedRow.name}
            isLoading={loadingDelete}
          />
        </>
      )}
    </div>
  );
};

export default SecurityMan;
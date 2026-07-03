import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// استيراد المكونات المساعدة
import DataTable from "@/components/DataTableLayout"; //
import Add from "@/components/AddFieldSection"; //[cite: 4]
import EditDialog from "@/components/EditDialog"; //[cite: 3]
import DeleteDialog from "@/components/DeleteDialog"; //[cite: 2]
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// استيراد الهوكس الخاصة بالـ API
import { useGet } from "@/Hooks/useGet"; //[cite: 8]
import { usePost } from "@/Hooks/usePost"; //[cite: 5]
import { useChangeState } from "@/Hooks/useChangeState"; //[cite: 6]
import { useDelete } from "@/Hooks/useDelete"; //[cite: 7]

export default function InsideGate() {
    // افترضنا الحصول على الـ id الخاص بالبوابة أو القرية من الرابط
    const { id } = useParams();
    const gateId = id || "1"; // قيمة افتراضية للتجربة

    // حالات الصفحة والبحث والـ Pagination
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    // حالات فتح وإغلاق الموديلز
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // حفظ البيانات المحددة للتعديل أو الحذف
    const [selectedRow, setSelectedRow] = useState(null);
    const [formValues, setFormValues] = useState({});

    // 1. جلب البيانات (Read)[cite: 8]
    const { data: apiResponse, loading, refetch } = useGet({
        url: `https://bcknd.sea-go.org/village/inside_gate`,
    });

    const tableData = apiResponse?.inside_gates || [];
    const pagination = apiResponse?.pagination || { current_page: 1, last_page: 1 };

    // استدعاء هوكس العمليات[cite: 5, 6, 7]
    const { postData, loadingPost } = usePost({
        url: `https://bcknd.sea-go.org/village/inside_gate/store`,
        type: true // application/json[cite: 5]
    });

    const { postData: updateData, loadingPost: loadingUpdate } = usePost({
        url: `https://bcknd.sea-go.org/village/inside_gate/update/${selectedRow?.id}`,
        type: true
    });

    const { changeState } = useChangeState(); //[cite: 6]
    const { deleteData, isDeleting } = useDelete(); //[cite: 7]

    // 2. إعداد أعمدة الجدول (بما فيها الـ status اللي هيتحول لـ Switch)
    const columns = [
        { key: "user_name", label: "User Name" },
        { key: "user_phone", label: "Phone" },
        { key: "user_email", label: "Email" },
        { key: "visitor_type", label: "Visitor Type" },
        { key: "user_type", label: "User Type" },
        { key: "appartment", label: "Apartment" },
        { key: "gate_type", label: "Gate Type" },
        { key: "date", label: "Date" },
        { key: "time", label: "Time" },
        { key: "status", label: "Status" }, // 🌟 هذا السطر هو المسؤول عن رسم الـ Switch
    ];

    // 3. إعداد حقول الفورم للإضافة والتعديل[cite: 4]
    const formFields = [
        { name: "user_name", placeholder: "User Name", type: "input", inputType: "text" },
        { name: "user_phone", placeholder: "Phone Number", type: "input", inputType: "text" },
        { name: "user_email", placeholder: "Email Address", type: "input", inputType: "email" },
        { name: "appartment", placeholder: "Apartment", type: "input", inputType: "text" },
        {
            name: "visitor_type",
            placeholder: "Visitor Type",
            type: "select",
            options: [
                { label: "Guest", value: "guest" },
                { label: "Owner", value: "owner" },
                { label: "Delivery", value: "delivery" },
            ]
        },
        {
            name: "user_type",
            placeholder: "User Type",
            type: "select",
            options: [
                { label: "Resident", value: "resident" },
                { label: "Visitor", value: "visitor" },
            ]
        },
        {
            name: "gate_type",
            placeholder: "Gate Type",
            type: "select",
            options: [
                { label: "Beach", value: "beach" },
                { label: "Main Gate", value: "main" },
            ]
        },
        { name: "date", placeholder: "Date", type: "input", inputType: "date" },
        { name: "time", placeholder: "Time", type: "time" },
        { name: "status", placeholder: "Status", type: "switch", returnType: "binary" } //[cite: 4]
    ];

    // التعامل مع إدخال البيانات في الفورم[cite: 4]
    const handleFormChange = (lang, name, value) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    // 4. دالة إضافة عنصر جديد (Create)
    const handleCreate = async () => {
        await postData({ ...formValues, inside_gate_id: gateId }, "Gate entry created successfully");
        setIsAddOpen(false);
        setFormValues({});
        refetch();
    };

    // 5. دالة تعديل العنصر (Update)[cite: 3]
    const handleEditOpen = (row) => {
        setSelectedRow(row);
        setFormValues(row); // تعبئة الفورم بالبيانات القديمة
        setIsEditOpen(true);
    };

    const handleSaveEdit = async () => {
        await updateData(formValues, "Gate entry updated successfully");
        setIsEditOpen(false);
        setSelectedRow(null);
        refetch();
    };

    // 6. دالة حذف العنصر (Delete)
    const handleDeleteOpen = (row) => {
        setSelectedRow(row);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteData(`https://bcknd.sea-go.org/village/inside_gate/delete/${selectedRow.id}`, "Gate entry deleted successfully"); //[cite: 7]
        if (success) {
            setIsDeleteOpen(false);
            setSelectedRow(null);
            refetch();
        }
    };

    // 7. دالة تغيير حالة الـ Status (Toggle Switch)
    const handleToggleStatus = async (row, newStatus) => {
        // newStatus بيرجع 1 لو شغال و 0 لو مقفول من الـ DataTable[cite: 1]
        const success = await changeState(
            `https://bcknd.sea-go.org/village/inside_gate/status/${row.id}`,
            "Status changed successfully",
            { status: newStatus }
        ); //[cite: 6]

        if (success) {
            refetch();
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* زر الإضافة العلوي */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-bg-primary">Inside Gate Entries</h1>
                <Button
                    onClick={() => { setFormValues({}); setIsAddOpen(true); }}
                    className="bg-bg-primary text-white hover:bg-teal-700 rounded-[10px] p-3 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add New Entry
                </Button>
            </div>

            {/* جدول عرض البيانات */}
            <DataTable
                data={tableData} //[cite: 1]
                columns={columns} //[cite: 1]
                showAddButton={false} // أخفينا زر الإضافة الافتراضي واستخدمنا زر مخصص ليفتح Modal[cite: 1]

                // دمج عمليات الـ Actions
                onEdit={handleEditOpen} //[cite: 1]
                onDelete={handleDeleteOpen} //[cite: 1]
                onToggleStatus={handleToggleStatus} // 🌟 تمرير دالة تغيير الحالة للـ Switch[cite: 1]

                // إعدادات الـ Backend Pagination والبحث[cite: 1]
                isBackendPagination={true} //[cite: 1]
                backendCurrentPage={pagination.current_page || page} //[cite: 1]
                backendTotalPages={pagination.last_page || 1} //[cite: 1]
                onBackendPageChange={(newPage) => setPage(newPage)} //[cite: 1]
                onSearchChange={(val) => {
                    setSearch(val);
                    setPage(1); // تصفير الصفحة عند البحث[cite: 1]
                }}
            />

            {/* Modal الإضافة */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-bg-primary">Add New Gate Entry</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Add fields={formFields} values={formValues} onChange={handleFormChange} /> {/*[cite: 4] */}
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button disabled={loadingPost} onClick={handleCreate} className="bg-bg-primary text-white">
                            {loadingPost ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal التعديل (EditDialog) */}
            <EditDialog
                open={isEditOpen} //[cite: 3]
                onOpenChange={setIsEditOpen} //[cite: 3]
                selectedRow={selectedRow} //[cite: 3]
                title="Edit Gate Entry" //[cite: 3]
                onSave={handleSaveEdit} //[cite: 3]
            >
                <Add fields={formFields} values={formValues} onChange={handleFormChange} /> {/*[cite: 4] */}
            </EditDialog>

            {/* Modal الحذف (DeleteDialog) */}
            <DeleteDialog
                open={isDeleteOpen} //[cite: 2]
                onOpenChange={setIsDeleteOpen} //[cite: 2]
                onDelete={handleDeleteConfirm} //[cite: 2]
                name={selectedRow?.user_name || "this entry"} //[cite: 2]
                isDeleting={isDeleting} //[cite: 2]
            />
        </div>
    );
}
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { usePost } from "@/Hooks/UsePost";
import { useInsideGateForm } from "./useInsideGateForm";
import InsideGateForm from "./InsideGateForm";
import { useTranslation } from "react-i18next";

export default function InsideGateAdd() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { formValues, formFields, handleFormChange, prepareFormData } = useInsideGateForm();

    const { postData, loadingPost } = usePost({
        url: `${apiUrl}/inside_gate/add`,
        type: true, // application/json
    });

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const payload = prepareFormData();
        await postData(payload, t("Inside gate created successfully") || "Inside gate created successfully");
        navigate("/inside_gate");
    };

    return (
        <div className="!p-6 space-y-6 max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 !mt-6">
            <div className="flex items-center justify-between border-b !pb-4">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate("/inside_gate")}
                        className="rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-bg-primary">
                        {t("Add New Inside Gate") || "Add New Inside Gate"}
                    </h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <InsideGateForm
                    fields={formFields}
                    values={formValues}
                    onChange={handleFormChange}
                />

                <div className="flex justify-end gap-3 border-t !pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/inside_gate")}
                    >
                        {t("Cancel") || "Cancel"}
                    </Button>
                    <Button
                        type="submit"
                        disabled={loadingPost}
                        className="bg-bg-primary text-white hover:bg-teal-700 flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {loadingPost ? t("Saving...") : t("Save")}
                    </Button>
                </div>
            </form>
        </div>
    );
}

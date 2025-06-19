import { useState, useEffect } from "react";
import Add from "@/components/AddFieldSection";
import { useTranslation } from "react-i18next";

export const useGateForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            name: "",
            status: isEdit ? 0 : "",
            image: null,
            location: '',
        },
    });
    const { t } = useTranslation();

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                en: {
                    name: initialData.name || "",
                    location: initialData.location || '',
                    status: initialData.status === "Active" ? 1 : 0,
                    image_link: initialData.image_link || null,
                    image: initialData.image_link || null
                }
            });
        }
    }, [initialData, isEdit]);

    const handleFieldChange = (lang, name, value) => {
        setFormData(prev => ({
            ...prev,
            [lang]: {
                ...prev[lang],
                [name]: value,
            },
        }));
    };

    const prepareFormData = () => {
        const body = new FormData();
        body.append("name", formData.en.name);
        body.append("status", formData.en.status.toString() || "0");
        
        // Handle location data - no JSON parsing needed
        if (formData.en.location) {
            body.append("location", formData.en.location);
        }

        if (formData.en.image instanceof File) {
            body.append("image", formData.en.image);
        } else if (formData.en.image) {
            // Handle case where image is a string URL
            fetch(formData.en.image)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], "image.jpg", { type: blob.type });
                    body.append("image", file);
                });
        }

        return body;
    };

    const fields = [
        { type: "input", placeholder: t("GateName"), name: "name", required: true },
        { type: "file", placeholder: t("GateImage"), name: "image", accept: "image/*" },
        { type: "map", placeholder: t("EnterLocation"), name: "location"},
        {
            type: "switch",
            name: "status",
            placeholder: t("Status"),
            returnType: "binary",
            activeLabel: "Active",
            inactiveLabel: "Inactive"
        },
    ];

    return {
        formData,
        fields,
        handleFieldChange,
        prepareFormData,
    };
};

export const GateFormFields = ({ fields, formData, handleFieldChange, loading }) => {
        const { t } = useTranslation();

    if (loading) return <div>{t("Loading")}</div>;
    return <Add fields={fields} lang="en" values={formData.en} onChange={handleFieldChange} />;
};
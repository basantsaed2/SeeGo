import { useState, useEffect } from "react";
import Add from "@/components/AddFieldSection";

export const useSecurityManForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            name: "",
            phone: "",
            email: "",
            password: "",
            type: "",
            from: "",
            to: "",
            status: isEdit ? 0 : "",
            image: null,
            location: '',
        },
    });

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                en: {
                    name: initialData.name || "",
                    phone: initialData.phone || "",
                    email: initialData.email || "",
                    password: initialData.password || "",
                    type: initialData.type || "",
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
        body.append("phone", formData.en.phone);
        body.append("email", formData.en.email);
        body.append("password", formData.en.password);


        body.append("type", formData.en.type);
        body.append("status", formData.en.status.toString() || "0");

        // Handle location data - no JSON parsing needed

        if (formData.en.image) {
            body.append("image", formData.en.image);
        }

        return body;
    };

    const fields = [
        { type: "input", placeholder: "Security Man Name", name: "name", required: true },
        { type: "input", placeholder: "Security Man Phone", name: "phone", required: true },
        { type: "input", inputType: "email", placeholder: "Security Man Email", name: "email", required: true },
        { type: "input", inputType: "password", placeholder: "Security Man Password", name: "password", required: true },
        {
            type: "multi-select",
            placeholder: "Security Gate Type",
            name: "type",
            required: true,
            options: [
                { value: "pool", label: "Pool" },
                { value: "beach", label: "Beach" },
                { value: "gate", label: "Gate" },
            ],
        },

        { type: "file", placeholder: "Gate Image", name: "image", accept: "image/*" },
        {
            type: "switch",
            name: "status",
            placeholder: "Status",
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

export const SecurityManFormFields = ({ fields, formData, handleFieldChange, loading }) => {
    if (loading) return <div>Loading...</div>;
    return <Add fields={fields} lang="en" values={formData.en} onChange={handleFieldChange} />;
};
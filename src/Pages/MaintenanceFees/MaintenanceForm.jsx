import { useState, useEffect } from "react";
import Add from "@/components/AddFieldSection";

export const useMaintenanceForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            name: "",
            year: "",
            price: "",
        },
    });

    // Initialize form data for edit mode
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                en: {
                    name: initialData.name || "",
                    year: initialData.year || "",
                    price: initialData.price || "",
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
        body.append("year", formData.en.year);
        body.append("price", formData.en.price);
        return body;
    };

    const fields = [
        { type: "input", placeholder: "Maintenance Fees", name: "name", required: true },
    {
      type: "select",
      placeholder: "Select Year",
      name: "year",
      required: true,
      options: Array.from({ length: 40 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: year.toString(), label: year.toString() };
      }),
    },
        { type: "input", inputType:"number", placeholder: "Price", name: "price", required: true },
    ];

    return {
        formData,
        fields,
        handleFieldChange,
        prepareFormData,
    };
};

export const MaintenanceFormFields = ({ fields, formData, handleFieldChange, loading }) => {
    if (loading) {
        return <div>Loading form data...</div>;
    }

    return (
        <Add
            fields={fields}
            lang="en"
            values={formData.en}
            onChange={handleFieldChange}
        />
    );
};
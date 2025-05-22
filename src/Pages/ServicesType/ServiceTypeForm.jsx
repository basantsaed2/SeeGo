import { useState, useEffect } from "react";
import { useGet } from "@/Hooks/UseGet";
import Add from "@/components/AddFieldSection";

export const useServiceTypeForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            service_type_id: "",
        },
    });
    const [ServiceType, setServiceType] = useState([]);
    const { refetch: refetchServiceType, loading: loadingServiceType, data: ServiceTypeData } = useGet({ url: `${apiUrl}/service_type` });

    // Initialize form data for edit mode
    useEffect(() => {
        if (isEdit && initialData) {
            console.log("initialData", initialData)
            setFormData({
                en: {
                    service_type_id: initialData.service_type_id || "",
                }
            });
        }
    }, [initialData, isEdit]);

    // Fetch ServiceType data
    useEffect(() => {
        refetchServiceType();
    }, [refetchServiceType]);

    useEffect(() => {
        if (ServiceTypeData?.service_type) {
            setServiceType(
                ServiceTypeData.service_type.map((type) => ({
                    label: type.name,
                    value: type.id.toString(),
                }))
            );

            // If in edit mode, update form data with the loaded options
            if (isEdit && initialData) {
                setFormData(prev => ({
                    en: {
                        ...prev.en,
                        service_type_id: initialData.service_type_id || ""
                    }
                }));
            }
        }
    }, [ServiceTypeData, isEdit, initialData]);

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
        body.append("service_type_id", formData.en.service_type_id || "");

        return body;
    };

    const fields = [
        {
            type: "select",
            placeholder: "Service Type",
            name: "service_type_id",
            options: ServiceType,
            value: formData.en.service_type_id // Make sure this is included
        },
    ];

    return {
        formData,
        fields,
        loadingServiceType,
        handleFieldChange,
        prepareFormData,
    };
};

export const ServiceTypeFormFields = ({ fields, formData, handleFieldChange, loading }) => {
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
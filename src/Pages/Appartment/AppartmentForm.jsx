import { useState, useEffect } from "react";
import { useGet } from "@/Hooks/UseGet";
import Add from "@/components/AddFieldSection";
import { useTranslation } from "react-i18next";

export const useAppartmentForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            name: "",
            type: "",
            map: '',
        },
    });
    const { refetch: refetchAppartment, loading: loadingAppartment, data: AppartmentData } = useGet({ url: `${apiUrl}/appartment` });
    const [types, setTypes] = useState([]);
    const { t } = useTranslation();

    // Initialize form data for edit mode
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                en: {
                    name: initialData.name || "",
                    type: initialData.type || "",
                    map: initialData.map || '',
                }
            });
        }
    }, [initialData, isEdit]);

    useEffect(() => {
        refetchAppartment();
    }, [refetchAppartment]);

    useEffect(() => {
        if (AppartmentData && AppartmentData.zones && AppartmentData.appartment_type) {

            setTypes(
                AppartmentData.appartment_type.map((type) => ({
                    label: type.name,
                    value: type.id.toString(),
                }))
            );

            // If in edit mode, ensure form data is updated with the options
            if (isEdit && initialData) {
                setFormData(prev => ({
                    en: {
                        ...prev.en,
                        type: initialData.type || initialData.appartment_type_id || "",
                    }
                }));
            }
        }
    }, [AppartmentData, isEdit, initialData]);
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
        console.log("bbb",formData.en.name)
        body.append("unit", formData.en.name);
        body.append("appartment_type_id", formData.en.type);
        if (formData.en.map) {
            body.append("location", formData.en.map);
        }

        return body;
    };

    const fields = [
        { type: "input", placeholder: t("UnitName"), name:  "name", required: true },
        {
            type: "select",
            placeholder: t("Type"),
            name: t("type"),
            options: types,
            value: formData.en.type // Ensure this is passed
        },
        { type: "map", placeholder: t("EnterLocation"), name: t("map") },

        // { type: "file", placeholder: "Appartment Image", name: "image", accept: "image/*" },
    ];

    return {
        formData,
        fields,
        handleFieldChange,
        prepareFormData,
        loading: loadingAppartment, // Consistent naming
    };
};

export const AppartmentFormFields = ({ fields, formData, handleFieldChange, loading }) => {
        const { t } = useTranslation();

    if (loading) {
        return <div>{t("Loadingformdata")}</div>;
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
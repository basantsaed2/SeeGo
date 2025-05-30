import { useState, useEffect } from "react";
import { useGet } from "@/Hooks/UseGet";
import Add from "@/components/AddFieldSection";
import { useTranslation } from "react-i18next";

export const useVillageAdminForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            name: "",
            email: "",
            phone: "",
            password: "",
            admin_position_id: "",
            status: isEdit ? 0 : "",
            image: null,
        },
    });
    const [positions, setPositions] = useState([]);
    const { refetch: refetchPositions, loading: loadingPositions, data: PositionsData } = useGet({ url: `${apiUrl}/admin_village` });
      const { t } = useTranslation();

    // Initialize form data for edit mode
    useEffect(() => {
        if (isEdit && initialData) {
            console.log("initialData", initialData)
            setFormData({
                en: {
                    name: initialData.name || "",
                    email: initialData.email || "",
                    phone: initialData.phone || "",
                    password: "",
                    admin_position_id: initialData.admin_position_id,
                    image: initialData.image || null,
                    status: initialData.status === "Active" ? 1 : 0,
                }
            });
        }
    }, [initialData, isEdit]);

    // Fetch position data
    useEffect(() => {
        refetchPositions();
    }, [refetchPositions]);

    useEffect(() => {
        if (PositionsData?.village_positions) {
            setPositions(
                PositionsData.village_positions.map((position) => ({
                    label: position.name,
                    value: position.id.toString(),
                }))
            );

            // If in edit mode, update form data with the loaded options
            if (isEdit && initialData) {
                setFormData(prev => ({
                    en: {
                        ...prev.en,
                        admin_position_id: initialData.admin_position_id || ""
                    }
                }));
            }
        }
    }, [PositionsData, isEdit, initialData]);

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
        body.append("status", formData.en.status.toString() || 0);
        body.append("email", formData.en.email);
        body.append("phone", formData.en.phone);
        body.append("password", formData.en.password);
        body.append("admin_position_id", formData.en.admin_position_id || "");

        // Only append image if it's a new file (not the initial data)
        if (formData.en.image && formData.en.image !== initialData?.image) {
            body.append("image", formData.en.image);
        }

        return body;
    };

    const fields = [
        { type: "input", placeholder: t("AdminName"), name: t("name"), required: true },
        { type: "input", placeholder: t("Phone"), name: t("phone"), required: true },
        { type: "input", inputType: "email", placeholder: t("Email"), name: t("email"), required: true },
        {
            type: "input",
            inputType: "password",
            placeholder: t("Password"),
            name: t("Password"),
            note: isEdit ? t(t("Leaveemptytokeepcurrentpassword")) : "",
            required: !isEdit
        },
        {
            type: "select",
            placeholder: t("AdminRole"),
            name: t("admin_position_id"),
            options: positions,
            value: formData.en.admin_position_id // Make sure this is included
        },
        { type: "file", placeholder: t("Image"), name: t("image"), accept: "image/*" },
        {
            type: "switch",
            name: t("status"),
            placeholder: t("Status"),
            returnType: "binary",
            activeLabel: "Active",
            inactiveLabel: "Inactive"
        },
    ];

    return {
        formData,
        fields,
        loadingPositions,
        handleFieldChange,
        prepareFormData,
        loading: loadingPositions,
    };
};

export const VillageAdminFields = ({ fields, formData, handleFieldChange, loading }) => {
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
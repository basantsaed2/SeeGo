import { useState, useEffect } from "react";
import { useGet } from "@/Hooks/UseGet";
import Add from "@/components/AddFieldSection";
import { useTranslation } from "react-i18next";

export const useOwnerForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            name: "",
            gender: "",
            birthDate: "",
            parent_user_id: "",
            email: "",
            phone: "",
            password: "",
            status: isEdit ? 0 : "", // Default to 0 (Inactive) for edit, empty for add
            image: null,
        },
    });
    const [ownerParents, setOwnerParents] = useState([]);
    const { refetch: refetchOwnerParent, loading: loadingOwnerParent, data: ownerParentData } = useGet({ url: `${apiUrl}/owner` });
  const { t } = useTranslation();

    // Initialize form data for edit mode
    useEffect(() => {
        if (isEdit && initialData) {
            console.log("initialData", initialData)
            setFormData({
                en: {
                    name: initialData.name || "",
                    gender: initialData.gender || "",
                    birthDate: initialData.birthDate || "",
                    parent_user_id: initialData.parent_user_id || "",
                    email: initialData.email || "",
                    phone: initialData.phone || "",
                    password: "",
                    status: initialData.status === "Active" ? 1 : 0,
                    image_link: initialData.image_link || null, // Add this line
                    image: initialData.image_link || null
                }
            });
        }
    }, [initialData, isEdit]);

    // Fetch owner parents data
    useEffect(() => {
        refetchOwnerParent();
    }, [refetchOwnerParent]);

    useEffect(() => {
        if (ownerParentData?.parents) {
            setOwnerParents(
                ownerParentData.parents.map((parent) => ({
                    label: parent.name,
                    value: parent.id.toString(),
                }))
            );

            // If in edit mode, update form data with the loaded options
            if (isEdit && initialData) {
                setFormData(prev => ({
                    en: {
                        ...prev.en,
                        parent_user_id: initialData.parent_user_id || ""
                    }
                }));
            }
        }
    }, [ownerParentData, isEdit, initialData]);

    const handleFieldChange = (lang, name, value) => {
        setFormData(prev => ({
            ...prev,
            [lang]: {
                ...prev[lang],
                [name]: value,
            },
        }));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const prepareFormData = () => {
        const body = new FormData();
        body.append("name", formData.en.name);
        body.append("status", formData.en.status.toString() || 0);
        body.append("email", formData.en.email);
        body.append("phone", formData.en.phone);
        body.append("password", formData.en.password);
        body.append("gender", formData.en.gender);
        body.append("birthDate", formatDate(formData.en.birthDate));
        body.append("parent_user_id", formData.en.parent_user_id || "");

        if (formData.en.image) {
            body.append("image", formData.en.image);
        }

        return body;
    };

  const fields = [
    { type: "input", placeholder: t("OwnerName"), name: t("name"), required: true },
    {
        type: "select",
        placeholder: t("Gender"),
        name: "gender",
        required: true,
        options: [
            { value: "male", label: t("Male") },
            { value: "female", label: t("Female") },
        ],
    },
    { type: "input", inputType: "date", placeholder: t("BirthDate"), name: t("birthDate"), required: true },
    { type: "input", placeholder: t("Phone"), name: t("phone"), required: true },
    { type: "input", inputType: "email", placeholder: t("Email"), name: t("email"), required: true },
    {
        type: "input",
        inputType: "password",
        placeholder: t("Password"),
        name: t("password"),
        note: isEdit ? t("Leave empty to keep current password") : "",
        required: !isEdit
    },
    { type: "file", placeholder: t("OwnerImage"), name: t("image"), accept: "image/*" },
    {
        type: "select",
        placeholder: t("OwnerParent"),
        name: "parent_user_id",
        options: ownerParents,
        value: formData.en.parent_user_id
    },
    {
        type: "switch",
        name: t("status"),
        placeholder: t("Status"),
        returnType: "binary",
        activeLabel: t("Active"),
        inactiveLabel: t("Inactive")
    },
];

    return {
        formData,
        fields,
        loadingOwnerParent,
        handleFieldChange,
        prepareFormData,
    };
};

export const OwnerFormFields = ({ fields, formData, handleFieldChange, loading }) => {
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
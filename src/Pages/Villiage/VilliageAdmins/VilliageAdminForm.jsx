import { useState, useEffect } from "react";
import { useGet } from "@/Hooks/UseGet";
import Add from "@/components/AddFieldSection";

export const useVillageAdminForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            name: "",
            email: "",
            phone: "",
            password: "",
            admin_position_id: "",
            status: isEdit ? 0 : "",
        },
    });
    const [positions, setPositions] = useState([]);
    const { refetch: refetchPositions, loading: loadingPositions, data: PositionsData } = useGet({ url: `${apiUrl}/admin_village` });

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
                    admin_position_id: initialData.admin_position_id ,
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
        return body;
    };

    const fields = [
        { type: "input", placeholder: "Admin Name", name: "name", required: true },
        { type: "input", placeholder: "Phone", name: "phone", required: true },
        { type: "input", inputType: "email", placeholder: "Email", name: "email", required: true },
        {
            type: "input",
            inputType: "password",
            placeholder: "Password",
            name: "password",
            note: isEdit ? "Leave empty to keep current password" : "",
            required: !isEdit
        },
        {
            type: "select",
            placeholder: "Admin Role",
            name: "admin_position_id",
            options: positions,
            value: formData.en.admin_position_id // Make sure this is included
        },
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
        loadingPositions,
        handleFieldChange,
        prepareFormData,
        loading: loadingPositions,
    };
};

export const VillageAdminFields = ({ fields, formData, handleFieldChange, loading }) => {
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
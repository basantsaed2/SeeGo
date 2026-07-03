import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const useInsideGateForm = (initialData = null) => {
    const { t } = useTranslation();

    const [formValues, setFormValues] = useState({
        name: "",
        from: "08:00",
        to: "22:00",
        status: 1,
        visitor: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormValues({
                name: initialData.name || "",
                from: initialData.from ? initialData.from.substring(0, 5) : "08:00",
                to: initialData.to ? initialData.to.substring(0, 5) : "22:00",
                status: initialData.status !== undefined ? (initialData.status === "Active" || initialData.status === 1 ? 1 : 0) : 1,
                visitor: initialData.visitor !== undefined ? Boolean(initialData.visitor) : true,
            });
        }
    }, [initialData]);

    const handleFormChange = (lang, name, value) => {
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const prepareFormData = () => {
        const formatTime = (timeStr) => {
            if (!timeStr) return "00:00:00";
            if (timeStr.length === 5) return `${timeStr}:00`;
            return timeStr;
        };

        return {
            ...formValues,
            from: formatTime(formValues.from),
            to: formatTime(formValues.to),
        };
    };

    const formFields = [
        {
            name: "name",
            placeholder: t("Gate Name") || "Gate Name",
            label: t("Gate Name") || "Gate Name",
            type: "input",
            inputType: "text",
            required: true,
        },
        {
            name: "from",
            placeholder: t("From Time") || "From Time",
            label: t("From Time") || "From Time",
            type: "time",
            step: "1",
        },
        {
            name: "to",
            placeholder: t("To Time") || "To Time",
            label: t("To Time") || "To Time",
            type: "time",
            step: "1",
        },
        {
            name: "visitor",
            placeholder: t("Allow Visitor") || "Allow Visitor",
            label: t("Visitor") || "Visitor",
            type: "switch",
            activeLabel: t("Allowed") || "Allowed",
            inactiveLabel: t("Not Allowed") || "Not Allowed",
        },
        {
            name: "status",
            placeholder: t("Status") || "Status",
            label: t("Status") || "Status",
            type: "switch",
            returnType: "binary",
        },
    ];

    return {
        formValues,
        setFormValues,
        formFields,
        handleFormChange,
        prepareFormData,
    };
};

import { useState, useEffect } from "react";
import Add from "@/components/AddFieldSection";
import { useGet } from "@/Hooks/UseGet";
import { useTranslation } from "react-i18next";

export const useSecurityManForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            name: "",
            phone: "",
            email: "",
            password: "",
            types: [], // Changed to array for multi-select
            status: isEdit ? 0 : "",
            image: null,
            pool_ids: [],
            beach_ids: [],
            gate_ids: [],
        },
    });
    const { t } = useTranslation();

    const { refetch: refetchList,  data: listData } = useGet({ url: `${apiUrl}/security` });

    const [pools, setPools] = useState([]);
    const [beaches, setBeaches] = useState([]);
    const [gates, setGates] = useState([]);
    const [dynamicFields, setDynamicFields] = useState([]);

   useEffect(() => {
  if (isEdit && initialData) {
    console.log("Initial data received:", initialData);
    setFormData({
      en: {
        name: initialData.name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        password: "", // Typically not returned by API for security
        types: initialData.types || [], // Ensure types is an array
        status: initialData.status === t("Active") ? 1 : 0,
        image_link: initialData.image_link || null,
        image: initialData.image_link || null,
        pool_ids: initialData.pool_ids || [], // Should be array of strings
        beach_ids: initialData.beach_ids || [], // Should be array of strings
        gate_ids: initialData.gate_ids || [], // Should be array of strings
      }
    });
  }
}, [initialData, isEdit, t]);


    useEffect(() => {
        refetchList();
    }, [refetchList]);

    useEffect(() => {
        if (listData?.beaches || listData?.pools || listData?.gates) {
            setBeaches(
                listData.beaches?.map((beache) => ({
                    label: beache.name,
                    value: beache.id.toString(),
                })) || []
            );
            setPools(
                listData.pools?.map((pool) => ({
                    label: pool.name,
                    value: pool.id.toString(),
                })) || []
            );
            setGates(
                listData.gates?.map((gate) => ({
                    label: gate.name,
                    value: gate.id.toString(),
                })) || []
            );
        }
    }, [listData]);

    // Update dynamic fields based on selected types
    useEffect(() => {
        const baseFields = [
            { type: "input", placeholder: t("SecurityManName"), name: "name", required: true },
            { type: "input", placeholder: t("SecurityManPhone"), name: "phone", required: true },
            { type: "input", inputType: "email", placeholder: t("SecurityManEmail"), name: "email", required: true },
            { type: "input", inputType: "password", placeholder: t('SecurityManPassword'), name: "password", required: true },
            {
                type: "multi-select",
                placeholder: t("SecurityGateTypes"),
                name: "types",
                required: true,
                options: [
                    { value: "pool", label: t("Pool") },
                    { value: "beach", label: t("Beach") },
                    { value: "gate", label: t("Gate") },
                ],
            },
        ];

        const locationFields = [];

        // Add location fields for each selected type
        if (formData.en.types.includes("pool")) {
            locationFields.push({
                type: "multi-select",
                placeholder: t("SelectPools"),
                name: "pool_ids",
                required: true,
                options: pools,
            });
        }

        if (formData.en.types.includes("beach")) {
            locationFields.push({
                type: "multi-select",
                placeholder: t("SelectBeaches"),
                name: "beach_ids",
                required: true,
                options: beaches,
            });
        }

        if (formData.en.types.includes("gate")) {
            locationFields.push({
                type: "multi-select",
                placeholder: t('SelectGates'),
                name: "gate_ids",
                required: true,
                options: gates,
            });
        }

        const otherFields = [
            { type: "file", placeholder: t("GateImage"), name: "image", accept: "image/*" },
            {
                type: "switch",
                name: "status",
                placeholder: t("Status"),
                returnType: "binary",
                activeLabel: "Active",
                inactiveLabel: "Inactive"
            },
        ];

        const fields = [...baseFields, ...locationFields, ...otherFields];
        setDynamicFields(fields);
    }, [formData.en.types, pools, beaches, gates]);

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

        // Append each type separately
        formData.en.types.forEach(type => body.append("types[]", type));

        body.append("status", formData.en.status.toString() || "0");

        // Append the selected IDs for each type
        if (formData.en.types.includes("pool") && formData.en.pool_ids) {
            formData.en.pool_ids.forEach(id => body.append("pool_ids[]", id));
        }

        if (formData.en.types.includes("beach") && formData.en.beach_ids) {
            formData.en.beach_ids.forEach(id => body.append("beach_ids[]", id));
        }

        if (formData.en.types.includes("gate") && formData.en.gate_ids) {
            formData.en.gate_ids.forEach(id => body.append("gate_ids[]", id));
        }

        if (formData.en.image) {
            body.append("image", formData.en.image);
        }

        return body;
    };

    return {
        formData,
        fields: dynamicFields,
        handleFieldChange,
        prepareFormData,
    };
};

export const SecurityManFormFields = ({ fields, formData, handleFieldChange, loading }) => {
    const { t } = useTranslation();

    if (loading) return <div>{t("Loading")}</div>;
    return <Add fields={fields} lang="en" values={formData.en} onChange={handleFieldChange} />;
};
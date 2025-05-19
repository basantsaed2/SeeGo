import { useState, useEffect } from "react";
import { useGet } from "@/Hooks/UseGet";
import Add from "@/components/AddFieldSection";

export const useAppartmentForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            unit: "",
            floors: "",
            type: "",
            zone: "",
            image: null,
        },
    });
    const { refetch: refetchAppartment, loading: loadingAppartment, data: AppartmentData } = useGet({ url: `${apiUrl}/appartment` });
    const [zones, setZones] = useState([]);
    const [types, setTypes] = useState([]);

    // Initialize form data for edit mode
    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                en: {
                    unit: initialData.unit || "",
                    floors: initialData.floors || "",
                    type: initialData.type || "",
                    zone: initialData.zone || "",
                    image_link: initialData.image_link || null,
                    image: initialData.image_link || null
                }
            });
        }
    }, [initialData, isEdit]);

    useEffect(() => {
        refetchAppartment();
    }, [refetchAppartment]);

    useEffect(() => {
        if (AppartmentData && AppartmentData.zones && AppartmentData.appartment_type) {
            setZones(
                AppartmentData.zones.map((zone) => ({
                    label: zone.name || zone.zone, // Use whichever field exists
                    value: zone.id.toString(),
                }))
            );
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
                        zone: initialData.zone || initialData.zone_id || "",
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
        body.append("unit", formData.en.unit);
        body.append("number_floors", formData.en.floors);
        body.append("appartment_type_id", formData.en.type);
        body.append("zone_id", formData.en.zone);
        if (formData.en.image) {
            body.append("image", formData.en.image);
        }

        return body;
    };

    const fields = [
        { type: "input", placeholder: "Unit Name", name: "unit", required: true },
        { type: "input", inputType: "number", placeholder: "Floor Number", name: "floors", required: true },
        {
            type: "select",
            placeholder: "Type",
            name: "type",
            options: types,
            value: formData.en.type // Ensure this is passed
        },
        {
            type: "select",
            placeholder: "Zone",
            name: "zone",
            options: zones,
            value: formData.en.zone // Ensure this is passed
        },
        { type: "file", placeholder: "Appartment Image", name: "image", accept: "image/*" },
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
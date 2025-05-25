import { useState, useEffect } from "react";
import Add from "@/components/AddFieldSection";

export const usePostsForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            description: "",
            image: null,
        }
    });

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                en: {
                    description: initialData.description || "",
                    image_link: initialData.image_link || null,
                    image: initialData.image_link || null
                },
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
        body.append("description", formData.en.description);
        if (formData.en.image) {
            body.append("image", formData.en.image);
        }
        return body;
    };

    const fields = {
        en: [
            { type: "textarea", placeholder: "Post Description", name: "description", required: true },
            { type: "file", placeholder: "Post Image", name: "image", accept: "image/*" },
        ]
    };

    return {
        formData,
        fields,
        handleFieldChange,
        prepareFormData,
    };
};

export const PostsFields = ({ fields, formData, handleFieldChange, loading, language }) => {
    if (loading) {
        return <div>Loading form data...</div>;
    }

    const fieldsArray = Array.isArray(fields) ? fields : Object.values(fields).flat();

    return (
        <Add
            fields={fieldsArray}
            lang={language}
            values={formData}
            onChange={(lang, name, value) => handleFieldChange(lang, name, value)}
        />
    );
};
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
                    image_link: initialData.image_link ||  null,
                    image: initialData.image_link ||  null
                },
            });
        }
    }, [initialData, isEdit]);

    const handleFieldChange = (lang, name, value) => {
        setFormData(prev => ({
            ...prev,
            [lang]: {
                ...prev[lang],
                [name]: name === "image"
                    ? (value ? Array.from(value) : []) // safe conversion
                    : value,
            },
        }));
    };

    const prepareFormData = () => {
        const body = new FormData();
        const data = formData.en;

        body.append("description", data.description || "");

        // الصور الجديدة فقط
        if (Array.isArray(data.image)) {
            data.image.forEach((img) => {
                if (img instanceof File) {
                    body.append("images[]", img);
                }
            });
        } else {
            body.append("images[]", "");
        }

        // الصور القديمة التي لم يتم حذفها أو استبدالها
        if (Array.isArray(data.image_link)) {
            const keptOldImages = data.image_link.filter(oldImg => {
                return data.image.some(currentImg => {
                    // الصورة لم يتم استبدالها إذا كان لها نفس الـ id
                    return typeof currentImg === "object" &&
                        !("lastModified" in currentImg) &&  // مش File جديد
                        currentImg.id === oldImg.id;
                });
            });

            if (keptOldImages.length > 0) {
                keptOldImages.forEach(img => {
                    body.append("images_id[]", img.id);
                });
            } else {
                body.append("images_id[]", "");
            }
        } else {
            body.append("images_id[]", "");
        }

        return body;
    };



    const fields = {
        en: [
            { type: "textarea", placeholder: "Post", name: "description", required: true },
            { type: "file", placeholder: "Post Images", name: "image", accept: "image/*", multiple: true },
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
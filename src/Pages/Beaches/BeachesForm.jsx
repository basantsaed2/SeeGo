import { useState, useEffect } from "react";
import Add from "@/components/AddFieldSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const useBeachesForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            name: "",
            from: "",
            to: "",
            status: isEdit ? 0 : 0,
        },
        ar: {
            nameAr: "",
        },
    });

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                en: {
                    name: initialData.name || "",
                    from: initialData.from || "",
                    to: initialData.to || "",
                    status: initialData.status === "Active" ? 1 : 0,
                },
                ar: {
                    nameAr: initialData.ar_name || "",
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
        body.append("name", formData.en.name);
        body.append("ar_name", formData.ar.nameAr);
        body.append("from", formData.en.from);
        body.append("to", formData.en.to);
        body.append("status", formData.en.status.toString());
        return body;
    };

    const fields = {
        en: [
            { type: "input", placeholder: "Beach Name (En)", name: "name", required: true },
            {
                type: "time",
                name: "from",
                placeholder: "Opening Time",
                required: true
            },
            {
                type: "time",
                name: "to",
                placeholder: "Closing Time",
                step: "1800" // 30-minute increments (optional)
            },
            {
                type: "switch",
                name: "status",
                placeholder: "Status",
                returnType: "binary",
                activeLabel: "Active",
                inactiveLabel: "Inactive",
            },
        ],
        ar: [
            { type: "input", placeholder: "Beach Name (Ar)", name: "nameAr", required: true },
        ],
    };

    const LanguageTabs = () => (
        <TabsList className="grid w-full md:w-[50%] grid-cols-2 gap-4 bg-transparent mb-6">
            <TabsTrigger
                value="english"
                className="rounded-[10px] border text-bg-primary py-2 transition-all 
                data-[state=active]:bg-bg-primary data-[state=active]:text-white 
                hover:bg-teal-100 hover:text-teal-700"
            >
                English
            </TabsTrigger>
            <TabsTrigger
                value="arabic"
                className="rounded-[10px] border text-bg-primary py-2 transition-all 
                data-[state=active]:bg-bg-primary data-[state=active]:text-white 
                hover:bg-teal-100 hover:text-teal-700"
            >
                Arabic
            </TabsTrigger>
        </TabsList>
    );

    return {
        formData,
        fields,
        handleFieldChange,
        prepareFormData,
        LanguageTabs,
    };
};

export const BeachesFields = ({ fields, formData, handleFieldChange, loading, language }) => {
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
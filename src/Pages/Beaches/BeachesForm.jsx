import { useState, useEffect } from "react";
import Add from "@/components/AddFieldSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";

export const useBeachesForm = (apiUrl, isEdit = false, initialData = null) => {
    const [formData, setFormData] = useState({
        en: {
            name: "",
            from: "",
            to: "",
            image: null,
            status: isEdit ? 0 : 0,
        },
        ar: {
            nameAr: "",
        },
    });
      const { t } = useTranslation();

    useEffect(() => {
        if (isEdit && initialData) {
            setFormData({
                en: {
                    name: initialData.name || "",
                    from: initialData.from || "",
                    to: initialData.to || "",
                    status: initialData.status === "Active" ? 1 : 0,
                    image: initialData.image || null,
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
        // body.append("ar_name", formData.ar.nameAr);
        body.append("from", formData.en.from);
        body.append("to", formData.en.to);
        body.append("status", formData.en.status.toString());

        // Only append image if it's a new file (not the initial data)
        if (formData.en.image && formData.en.image !== initialData?.image) {
            body.append("images[]", formData.en.image);
        }

        return body;
    };
    const fields = {
        en: [
            { type: "input", placeholder: t("BeachName"), name: "name", required: true },
            {
                type: "time",
                name: "from",
                placeholder: t("OpeningTime"),
                required: true
            },
            {
                type: "time",
                name: "to",
                placeholder: t("ClosingTime"),
                required: true
            },
            { type: "file", placeholder: t("BeachImage"), name:"image", accept: "image/*" },
            {
                type: "switch",
                name: t("status"),
                placeholder: t("Status"),
                returnType: "binary",
                activeLabel: "Active",
                inactiveLabel: "Inactive",
            },
        ],
        ar: [
            { type: "input", placeholder: t("BeachName(Ar)"), name: t("nameAr"), required: true },
        ],
    };

    const LanguageTabs = () => (
        <TabsList className="grid w-full md:w-[50%] grid-cols-2 gap-4 bg-transparent !mb-6">
            <TabsTrigger
                value="english"
                className="rounded-[10px] border text-bg-primary !py-2 transition-all 
                data-[state=active]:bg-bg-primary data-[state=active]:text-white 
                hover:bg-teal-100 hover:text-teal-700"
            >
                {t("English")}
            </TabsTrigger>
            <TabsTrigger
                value="arabic"
                className="rounded-[10px] border text-bg-primary !py-2 transition-all 
                data-[state=active]:bg-bg-primary data-[state=active]:text-white 
                hover:bg-teal-100 hover:text-teal-700"
            >
                {t('Arabic')}
            </TabsTrigger>
        </TabsList>
    );

    return {
        formData,
        fields,
        handleFieldChange,
        prepareFormData,
        // LanguageTabs,
    };
};

export const BeachesFields = ({ fields, formData, handleFieldChange, loading, }) => {
          const { t } = useTranslation();

    if (loading) {
        return <div>{t("Loadingformdata")}</div>;
    }

    const fieldsArray = Array.isArray(fields) ? fields : Object.values(fields).flat();

    return (
        <Add
            fields={fieldsArray}
            lang="en"
            values={formData}
            onChange={(lang, name, value) => handleFieldChange(lang, name, value)}
        />
    );
};
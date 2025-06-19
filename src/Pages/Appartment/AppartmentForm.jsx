import { useState, useEffect } from "react";
import { useGet } from "@/Hooks/UseGet";
import Add from "@/components/AddFieldSection";
import { useTranslation } from "react-i18next";

export const useAppartmentForm = (apiUrl, isEdit = false, initialData = null) => {
  const [formData, setFormData] = useState({
    en: {
      name: "",
      type: "",
      map: "",
    },
  });
  const {
    refetch: refetchAppartment,
    loading: loadingAppartment,
    data: AppartmentData,
  } = useGet({ url: `${apiUrl}/appartment` });
  const [types, setTypes] = useState([]);
  const { t } = useTranslation();

  // Initialize form data for edit mode
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        en: {
          name: initialData.name || "",
          type: initialData.appartment_type_id?.toString() || initialData.type?.toString() || "", // Ensure type is a string
          map: initialData.map || "",
        },
      });
    }
  }, [initialData, isEdit]);

  useEffect(() => {
    refetchAppartment();
  }, [refetchAppartment]);

  useEffect(() => {
    if (AppartmentData?.appartment_type) {
      const typeOptions = AppartmentData.appartment_type.map((type) => ({
        label: type.name,
        value: type.id.toString(), // Ensure value is a string
      }));
      setTypes(typeOptions);

      // If in edit mode, ensure formData.type matches an option in types
      if (isEdit && initialData && typeOptions.length > 0) {
        const matchingType = typeOptions.find(
          (type) => type.value === initialData.appartment_type_id?.toString() || type.value === initialData.type?.toString()
        );
        if (matchingType && formData.en.type !== matchingType.value) {
          setFormData((prev) => ({
            en: {
              ...prev.en,
              type: matchingType.value,
            },
          }));
        }
      }
    }
  }, [AppartmentData, isEdit, initialData]);

const handleFieldChange = (lang, name, value) => {
  console.log(`handleFieldChange: lang=${lang}, name=${name}, value=${value}`);
  setFormData((prev) => {
    const updated = {
      ...prev,
      [lang]: {
        ...prev[lang],
        [name]: value,
      },
    };
    console.log("Updated formData:", updated); // Debug log
    return updated;
  });
};

  const prepareFormData = () => {
    const body = new FormData();
    body.append("unit", formData.en.name);
    body.append("appartment_type_id", formData.en.type);
    if (formData.en.map) {
      body.append("location", formData.en.map);
    }
    return body;
  };

  const fields = [
    { type: "input", placeholder: t("UnitName"), name: "name", required: true },
    {
      type: "select",
      placeholder: t("Type"),
      name: "type",
      options: types,
      value: formData.en.type, // Bind to formData.en.type
    },
    { type: "map", placeholder: t("EnterLocation"), name: "map" },
  ];

  return {
    formData,
    fields,
    handleFieldChange,
    prepareFormData,
    loading: loadingAppartment,
  };
};

export const AppartmentFormFields = ({
  fields,
  formData,
  handleFieldChange,
  loading,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return <div>{t("Loading form data")}</div>;
  }

  return (
    <div className="relative z-50">
      <Add
        fields={fields}
        lang="en"
        values={formData.en}
        onChange={handleFieldChange}
      />
    </div>
  );
};

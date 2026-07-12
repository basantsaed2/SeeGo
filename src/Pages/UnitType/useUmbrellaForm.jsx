import { useState, useEffect } from "react";
import { useGet } from "@/Hooks/UseGet";
import Add from "@/components/AddFieldSection";
import { useTranslation } from "react-i18next";

export const useUmbrellaForm = (apiUrl, isEdit = false, initialData = null) => {
  const [formData, setFormData] = useState({
    appartment_type_id: "",
    umbrellas: "",
  });

  // جلب الداتا الخاصة بالـ Select Options
  const {
    refetch: refetchOptions,
    loading: loadingOptions,
    data: optionsData,
  } = useGet({ url: `${apiUrl}/appartment_type_umbrella/list` });

  const [appartmentTypes, setAppartmentTypes] = useState([]);
  const { t } = useTranslation();

  // تهيئة البيانات في حالة التعديل (Edit)
  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        appartment_type_id: initialData.appartment_type_id?.toString() || "",
        umbrellas: initialData.umbrellas?.toString() || "",
      });
    }
  }, [initialData, isEdit]);

  useEffect(() => {
    refetchOptions();
  }, [refetchOptions]);

  // تحضير خيارات الـ Appartment Types
  useEffect(() => {
    if (optionsData?.appartment_types) {
      const typeOptions = optionsData.appartment_types.map((type) => ({
        label: type.name,
        value: type.id.toString(),
      }));
      setAppartmentTypes(typeOptions);
    }
  }, [optionsData]);

  // تحديث الـ State بدون الحاجة للـ Lang إذا لم تكن متعددة اللغات هنا
  const handleFieldChange = (lang, name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const prepareFormData = () => {
    // إرسال البيانات كـ JSON بناءً على الـ API المرفق
    return {
      appartment_type_id: Number(formData.appartment_type_id),
      umbrellas: Number(formData.umbrellas),
    };
  };

  const fields = [
    {
      type: "select",
      placeholder: t("Appartment Type"),
      name: "appartment_type_id",
      options: appartmentTypes,
      value: formData.appartment_type_id,
      required: true,
    },
    {
      type: "input", // 👈 التعديل الأهم هنا: يجب إخبار الكومبوننت أنه حقل إدخال
      inputType: "number", // (اختياري) اتركيها فقط إذا كان الـ Add component الخاص بك مبرمجاً ليقرأها ويجعل الحقل يقبل أرقاماً فقط
      placeholder: t("Umbrellas Count"),
      name: "umbrellas",
      value: formData.umbrellas,
      required: true
    },
  ];

  return {
    formData,
    fields,
    handleFieldChange,
    prepareFormData,
    loading: loadingOptions,
  };
};

export const UmbrellaFormFields = ({
  fields,
  formData,
  handleFieldChange,
  loading,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return <div>{t("Loading form data...")}</div>;
  }

  return (
    <div className="relative z-50">
      <Add
        fields={fields}
        lang="en"
        values={formData}
        onChange={handleFieldChange}
      />
    </div>
  );
};
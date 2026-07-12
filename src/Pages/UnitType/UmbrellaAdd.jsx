import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import { useUmbrellaForm, UmbrellaFormFields } from "./useUmbrellaForm.jsx";
import TitleSection from "@/components/TitleSection";
import { useTranslation } from "react-i18next";

export default function UmbrellaAdd() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // استخدام الـ API الجديد للإضافة
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/appartment_type_umbrella/add` });
  const isLoading = useSelector((state) => state.loader.isLoading);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    formData,
    fields,
    handleFieldChange,
    prepareFormData,
    loading: loadingForm,
  } = useUmbrellaForm(apiUrl);

  const handleSubmit = async (e) => {  
    e.preventDefault();
    const body = prepareFormData();
    postData(body, t("Umbrella added successfully"));
  };

  useEffect(() => {
    if (!loadingPost && response) {
      if (response.status === 200 || response.status === 201) {
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      }
    }
  }, [response, loadingPost, navigate]);

  if (loadingForm) {
    return <FullPageLoader />;
  }

  return (
    <div className="w-full flex flex-col gap-5 p-6 relative">
      {(isLoading || loadingPost) && <FullPageLoader />}
      <ToastContainer />
      <h2 className="text-bg-primary text-center text-2xl font-semibold">
        <TitleSection text={t("Add Umbrella Configuration")}/>
      </h2>
      
      <div className="flex flex-col gap-6 mt-4">
        <UmbrellaFormFields 
          fields={fields}
          formData={formData}
          handleFieldChange={handleFieldChange}
        />
      </div>

      <div>
        <Button
          onClick={handleSubmit}
          className="bg-bg-primary mt-6 !mb-10 !ms-3 cursor-pointer hover:bg-teal-600 !px-5 !py-6 text-white w-[30%] rounded-[15px] transition-all duration-200"
          disabled={loadingPost}
        >
          {loadingPost ? t("Processing") : t("Done")}
        </Button>
      </div>
    </div>
  );
}
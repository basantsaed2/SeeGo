import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { usePost } from "@/Hooks/UsePost";
import { SecurityManFormFields, useSecurityManForm } from "./SecurityManForm";
import TitleSection from "@/components/TitleSection";
import { ToastContainer  } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function SecurityManAdd() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost } = usePost({ url: `${apiUrl}/security/add` });
  const isLoading = useSelector((state) => state.loader.isLoading);
  
  const { t } = useTranslation();

  const {
    formData,
    fields,
    handleFieldChange,
    prepareFormData
  } = useSecurityManForm(apiUrl);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = prepareFormData();
    postData(body, t("Security man added successfully"));
  };

/*useEffect(() => {
  console.log("🧪 useEffect triggered", response);

  if (!response || loadingPost) return;

  const message = response.data?.message;
  const errors = response.data?.errors;

  console.log("🚀 message:", message);
  console.log("🧨 errors:", errors);

  // إذا فيه message تحتوي على subscribe → روح للباكدج
  if (typeof message === "string" && message.includes("subscribe")) {
    toast.error(t("subscribeSuccess"));
    console.log("✅ Navigating to /packages_list");
    navigate("/packages_list");
  }

  // أو لو الـ errors فيها رسالة تدل على الاشتراك
  else if (
    typeof errors === "string" &&
    errors.includes("subscribe")
  ) {
    console.log("✅ Navigating to /packages_list from errors");
    navigate("/packages_list");
  }

  // أي حالة تانية → ارجع للخلف
  else {
    console.log("🔁 Navigating back");
    navigate(-1);
  }
}, [response, loadingPost, navigate]);*/






  return (
    <div className="w-full flex flex-col gap-5 p-6 relative">
      <ToastContainer/>
      {isLoading && <FullPageLoader />}
      <h2 className="text-bg-primary text-center text-2xl font-semibold">
        <TitleSection text={t('AddSecurityMan')}/>
      </h2>
      <Tabs defaultValue="english" className="w-full">
        <TabsContent value="english">
          <SecurityManFormFields 
            fields={fields}
            formData={formData}
            handleFieldChange={handleFieldChange}
          />
        </TabsContent>
      </Tabs>
      <div className="">
        <Button
          onClick={handleSubmit}
          className="bg-bg-primary !mb-10 !ms-3 cursor-pointer hover:bg-teal-600 !px-5 !py-6 text-white w-[30%] rounded-[15px] transition-all duration-200"
          disabled={loadingPost}
        >
          {loadingPost ? t("Processing") : t("Done")}
        </Button>
      </div>
    </div>
  );
}
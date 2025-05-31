
import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import { useGateForm ,GateFormFields } from "./GateForm";
import TitleSection from "@/components/TitleSection";
import { useTranslation } from "react-i18next";

export default function GatesAdd() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/gate/add` });
  const isLoading = useSelector((state) => state.loader.isLoading);
  const navigate = useNavigate();
      const { t } = useTranslation();

  const {
    formData,
    fields,
    handleFieldChange,
    prepareFormData
  } = useGateForm(apiUrl);

  const handleSubmit = async (e) => {  
    e.preventDefault();
    const body = prepareFormData();
    postData(body, t("Gateaddedsuccessfully"));
  }; 
  
  useEffect(() => {
    if (!loadingPost && response) {
        navigate(-1);}
  }, [response, loadingPost]);

  return (
    <div className="w-full flex flex-col gap-5 p-6 relative">
      {isLoading && <FullPageLoader />}
      <h2 className="text-bg-primary text-center text-2xl font-semibold">
        <TitleSection text={t("AddGate")}/>
      </h2>
      <Tabs defaultValue="english" className="w-full">
        <TabsContent value="english">
          <GateFormFields 
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
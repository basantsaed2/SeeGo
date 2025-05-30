
import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import { ServiceTypeFormFields ,useServiceTypeForm } from "./ServiceTypeForm";
import TitleSection from "@/components/TitleSection";

export default function ServiceTypeAdd() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/service_type/add` });
  const isLoading = useSelector((state) => state.loader.isLoading);
  const navigate = useNavigate();
  
  const {
    formData,
    fields,
    handleFieldChange,
    prepareFormData
  } = useServiceTypeForm(apiUrl);

  const handleSubmit = async (e) => {  
    e.preventDefault();
    const body = prepareFormData();
    postData(body, "ServiceType added successfully!");
  }; 
  
  useEffect(() => {
    if (!loadingPost && response) {
        navigate(-1);}
  }, [response, loadingPost]);

  return (
    <div className="w-full flex flex-col gap-5 p-6 relative">
      {isLoading && <FullPageLoader />}
      <h2 className="text-bg-primary text-center text-2xl font-semibold">
        <TitleSection text={"Add Service Type"}/>
      </h2>
      <Tabs defaultValue="english" className="w-full">
        <TabsContent value="english">
          <ServiceTypeFormFields 
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
          {loadingPost ? "Processing..." : "Done"}
        </Button>
      </div>
    </div>
  );
}
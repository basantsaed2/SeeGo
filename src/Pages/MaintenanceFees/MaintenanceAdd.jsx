import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import { useMaintenanceForm, MaintenanceFormFields } from "./MaintenanceForm";
import TitleSection from "@/components/TitleSection";

export default function MaintenancesAdd() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/maintenance_feez/add` });
  const isLoading = useSelector((state) => state.loader.isLoading);
  const navigate = useNavigate();
  
  const {
    formData,
    fields,
    handleFieldChange,
    prepareFormData,
  } = useMaintenanceForm(apiUrl);

  const handleSubmit = async (e) => {  
    e.preventDefault();
    const body = prepareFormData();
    postData(body, "Maintenance Fees added successfully!");
  }; 
  
  useEffect(() => {
    if (!loadingPost && response) {
        navigate(-1);
    }
  }, [response, loadingPost]);

    if (loadingPost) {
    return <FullPageLoader />;
  }
  return (
    <div className="w-full flex flex-col gap-5 p-6 relative">
      {isLoading && <FullPageLoader />}
      <ToastContainer />
      <h2 className="text-bg-primary text-center text-2xl font-semibold">
        <TitleSection text={"Add Maintenance Fees"}/>
      </h2>
      <Tabs defaultValue="english" className="w-full">
        <TabsContent value="english">
          <MaintenanceFormFields 
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
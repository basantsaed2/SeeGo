import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs,TabsContent } from "@/components/ui/tabs";
import Add from "@/components/AddFieldSection";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MaintenanceTypeAdd() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchMaintenanceType, loading: loadingMaintenanceType, data: MaintenanceTypeData } = useGet({ url: `${apiUrl}/maintenance_type` });
  const {postData, loadingPost, response }=usePost({url:`${apiUrl}/maintenance_type/add`})
  const isLoading = useSelector((state) => state.loader.isLoading);
  const dispatch = useDispatch();
  const navigate =useNavigate();
  const [MaintenanceTypes, setMaintenanceTypes] = useState([]);
  const [formData, setFormData] = useState({
    en: {
      maintenance_type_id: "",
    },
  });
  const {t}=useTranslation();

   useEffect(() => {
    refetchMaintenanceType();
  }, [refetchMaintenanceType]);

  useEffect(() => {
    if (MaintenanceTypeData && MaintenanceTypeData.maintenance_types) {
      console.log("maintenance_types Data:", MaintenanceTypeData);
      setMaintenanceTypes(
        MaintenanceTypeData.maintenance_types.map((type) => ({
          label: type.name,
          value: type.id.toString(),
        }))
      );
    }
  }, [MaintenanceTypeData]);

  const handleFieldChange = (lang, name, value) => {
    setFormData((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {  
    e.preventDefault();
    const body = new FormData();
    body.append("maintenance_type_id", formData.en.maintenance_type_id || "");
    postData(body,t("MaintenanceTypeaddedsuccessfully"))   
  }; 
  const fieldsEn = [
    {
      type: "select",
      placeholder: t("MaintenanceType"),
      name: "maintenance_type_id",
      options: MaintenanceTypes,
    },
  ];
  
  useEffect(() => {
    if (!loadingPost && response) {
        navigate(-1);
    }
  }, [response, loadingPost]);

  if(loadingMaintenanceType) {
    return <FullPageLoader />
  }

  return (
    <div className="w-full flex flex-col gap-5 p-6 relative">
      {isLoading && <FullPageLoader />}
      <h2 className="text-bg-primary text-center text-2xl font-semibold">
        {t("AddMaintenanceType")}
      </h2>
      <Tabs defaultValue="english" className="w-full">
        <TabsContent value="english">
          <Add
            fields={fieldsEn}
            lang="en"
            values={formData.en}
            onChange={handleFieldChange}
          />
        </TabsContent>
      </Tabs>
      <div className="">
        <Button
          onClick={(e)=>{handleSubmit(e)}}
          className="bg-bg-primary !mb-10 !ms-3 cursor-pointer hover:bg-teal-600 !px-5 !py-6 text-white w-[30%] rounded-[15px] transition-all duration-200"
        >
          {t("Done")}
        </Button>
      </div>
    </div>
  );
}

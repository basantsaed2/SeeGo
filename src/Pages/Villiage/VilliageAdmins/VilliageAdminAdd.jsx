import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { usePost } from "@/Hooks/UsePost";
import { useVillageAdminForm, VillageAdminFields } from "./VilliageAdminForm";
import TitleSection from "@/components/TitleSection";
import { useTranslation } from "react-i18next";

export default function VillageAdminAdd() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost } = usePost({
    url: `${apiUrl}/admin_village/add`,
  });

  const isLoading = useSelector((state) => state.loader.isLoading);
  const { t } = useTranslation();

  const {
    formData,
    fields,
    handleFieldChange,
    prepareFormData,
    loadingPositions,
  } = useVillageAdminForm(apiUrl);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = prepareFormData();
    postData(body, t("Adminaddedsuccessfully"));
  };



  return (
    <>
      <ToastContainer />
      {(isLoading || loadingPost) && <FullPageLoader />}

      {!isLoading && !loadingPost && (
        <div className="w-full flex flex-col gap-5 p-6 relative">
          <h2 className="text-bg-primary text-center text-2xl font-semibold">
            <TitleSection text={t("AddAdmin")} />
          </h2>

          <Tabs defaultValue="english" className="w-full">
            <TabsContent value="english">
              <VillageAdminFields
                fields={fields}
                formData={formData}
                loadingPositions={loadingPositions}
                handleFieldChange={handleFieldChange}
                language="en"
              />
            </TabsContent>
          </Tabs>

          <div className="mt-4">
            <Button
              onClick={handleSubmit}
              className="bg-bg-primary mb-10 ms-3 cursor-pointer hover:bg-teal-600 px-5 py-6 text-white w-full md:w-[30%] rounded-[15px] transition-all duration-200"
              disabled={loadingPost}
            >
              {loadingPost ? t("Processing") : t("Done")}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import { usePoolsForm, PoolsFields } from "./PoolsForm";
import TitleSection from "@/components/TitleSection";

export default function PoolsAdd() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/pool/add` });
    const isLoading = useSelector((state) => state.loader.isLoading);
    const navigate = useNavigate();

    const { formData, fields, handleFieldChange, prepareFormData, LanguageTabs } =
        usePoolsForm(apiUrl);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = prepareFormData();
        postData(body, "Pool added successfully!");
    };

    useEffect(() => {
        if (!loadingPost && response) {
                navigate(-1);
        }
    }, [response, loadingPost, navigate]);

    if (isLoading || loadingPost) {
        return <FullPageLoader />;
    }

    return (
        <div className="w-full flex flex-col gap-5 p-6 relative">
            <h2 className="text-bg-primary text-center text-2xl font-semibold">
                <TitleSection text={"Add Pool"} />
            </h2>
            <Tabs defaultValue="english" className="w-full">
                {/* <LanguageTabs /> */}
                <TabsContent value="english">
                    <PoolsFields
                        fields={fields.en}
                        formData={formData.en}
                        handleFieldChange={handleFieldChange}
                        language="en"
                    />
                </TabsContent>
                {/* <TabsContent value="arabic">
                    <PoolsFields
                        fields={fields.ar}
                        formData={formData.ar}
                        handleFieldChange={handleFieldChange}
                        language="ar"
                    />
                </TabsContent> */}
            </Tabs>
            <div className="mt-4">
                <Button
                    onClick={handleSubmit}
                    className="bg-bg-primary mb-10 ms-3 cursor-pointer hover:bg-teal-600 px-5 py-6 text-white w-full md:w-[30%] rounded-[15px] transition-all duration-200"
                    disabled={loadingPost}
                >
                    {loadingPost ? "Processing..." : "Done"}
                </Button>
            </div>
        </div>
    );
}
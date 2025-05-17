// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Tabs,TabsContent } from "@/components/ui/tabs";
// import Add from "@/components/AddFieldSection";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useDispatch, useSelector } from "react-redux";
// import { showLoader, hideLoader } from "@/Store/LoaderSpinner";
// import FullPageLoader from "@/components/Loading";
// import { useGet } from "@/Hooks/UseGet";
// import { usePost } from "@/Hooks/UsePost";
// import { useNavigate } from "react-router-dom";
// export default function OwnersAdd() {
//   const apiUrl = import.meta.env.VITE_API_BASE_URL;
//   const { refetch: refetchOwnerParent, loading: loadingOwnerParent, data: OwnerParentData } = useGet({ url: `${apiUrl}/owner` });
//   const {postData, loadingPost, response }=usePost({url:`${apiUrl}/owner/add`})
//   const isLoading = useSelector((state) => state.loader.isLoading);
//   const dispatch = useDispatch();
//   const navigate =useNavigate();
//   const [OwnerParents, setOwnerParents] = useState([]);
//   const [formData, setFormData] = useState({
//     en: {
//       name: "",
//       gender: "",
//       birthDate: "",
//       parent_user_id: "",
//       email: "",
//       phone: "",
//       password: "",
//       status: "",
//       image: null,
//     },
//   });

//    useEffect(() => {
//     refetchOwnerParent();
//   }, [refetchOwnerParent]);

//   useEffect(() => {
//     if (OwnerParentData && OwnerParentData.parents) {
//       console.log("Owner Parent Data:", OwnerParentData);
//       setOwnerParents(
//         OwnerParentData.parents.map((parent) => ({
//           label: parent.name,
//           value: parent.id.toString(),
//         }))
//       );
//     }
//   }, [OwnerParentData]);

//   const handleFieldChange = (lang, name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [lang]: {
//         ...prev[lang],
//         [name]: value,
//       },
//     }));
//   };
//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1; 
//     const day = date.getDate();
//     return `${year}-${month}-${day}`;
//   }; 
//   const handleSubmit = async (e) => {  
//     e.preventDefault();
//     const body = new FormData();
//     body.append("name", formData.en.name);
//     body.append("status", formData.en.status.toString() || 0); // Directly use 1/0 from switch
//     body.append("email", formData.en.email);
//     body.append("phone", formData.en.phone);
//     body.append("password", formData.en.password);
//     body.append("gender", formData.en.gender);
//     body.append("birthDate", formatDate(formData.en.birthDate));
//     body.append("parent_user_id", formData.en.parent_user_id || "");
    
//     // Add image if exists
//     if (formData.en.image) {
//       body.append("image", formData.en.image);
//     }

//     postData(body,"Owner added successfully!")   
//   }; 
//   const fieldsEn = [
//     { type: "input", placeholder: "Owner Name", name: "name" },
//     {
//       type: "select",
//       placeholder: "Gender",
//       name: "gender",
//       options: [
//         { value: "male", label: "Male" },
//         { value: "female", label: "Female" },
//       ],
//     },
//     { type: "input", inputType: "date", placeholder: "BirthDate", name: "birthDate" },
//     { type: "input", placeholder: "Phone", name: "phone" },
//     { type: "input", inputType: "email", placeholder: "Email", name: "email" },
//     { type: "input", inputType: "password", placeholder: "Password", name: "password" },
//     { type: "file",  placeholder: "Owner Image", name: "image"},
//     {
//       type: "select",
//       placeholder: "Owner Parent",
//       name: "parent_user_id",
//       options: OwnerParents,
//     },
//     {
//       type: "switch",
//       name: "status",
//       placeholder: "Status",
//       returnType: "binary", // This will return 1/0
//       activeLabel: "Active", // Label when active
//       inactiveLabel: "Inactive" // Label when inactive
//     },
//   ];
  
//   useEffect(() => {
//     if (!loadingPost && response) {
//       const timer = setTimeout(() => {
//         navigate(-1);
//       }, 1500); // 1 second delay to allow toast to show
//       return () => clearTimeout(timer);
//     }
//   }, [response, loadingPost]);

//   // if(loadingOwnerParent) {
//   //   dispatch(showLoader());
//   // }else{
//   //   dispatch(hideLoader());
//   // }
//   if(loadingOwnerParent) {
//     return <FullPageLoader />
//   }

//   return (
//     <div className="w-full flex flex-col gap-5 p-6 relative">
//       {isLoading && <FullPageLoader />}
//       <ToastContainer />
//       <h2 className="text-bg-primary text-center text-2xl font-semibold">
//         Add Owner
//       </h2>
//       <Tabs defaultValue="english" className="w-full">
//         <TabsContent value="english">
//           <Add
//             fields={fieldsEn}
//             lang="en"
//             values={formData.en}
//             onChange={handleFieldChange}
//           />
//         </TabsContent>
//       </Tabs>
//       <div className="">
//         <Button
//           onClick={(e)=>{handleSubmit(e)}}
//           className="bg-bg-primary !mb-10 !ms-3 cursor-pointer hover:bg-teal-600 !px-5 !py-6 text-white w-[30%] rounded-[15px] transition-all duration-200"
//         >
//           Done
//         </Button>
//       </div>
//     </div>
//   );
// }


import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import { useOwnerForm, OwnerFormFields } from "./OwnerForm";
import TitleSection from "@/components/TitleSection";

export default function OwnersAdd() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/owner/add` });
  const isLoading = useSelector((state) => state.loader.isLoading);
  const navigate = useNavigate();
  
  const {
    formData,
    fields,
    loadingOwnerParent,
    handleFieldChange,
    prepareFormData
  } = useOwnerForm(apiUrl);

  const handleSubmit = async (e) => {  
    e.preventDefault();
    const body = prepareFormData();
    postData(body, "Owner added successfully!");
  }; 
  
  useEffect(() => {
    if (!loadingPost && response) {
      const timer = setTimeout(() => {
        navigate(-1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [response, loadingPost]);

  if (loadingOwnerParent) {
    return <FullPageLoader />;
  }

  return (
    <div className="w-full flex flex-col gap-5 p-6 relative">
      {isLoading && <FullPageLoader />}
      <ToastContainer />
      <h2 className="text-bg-primary text-center text-2xl font-semibold">
        <TitleSection text={"Add Owner"}/>
      </h2>
      <Tabs defaultValue="english" className="w-full">
        <TabsContent value="english">
          <OwnerFormFields 
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
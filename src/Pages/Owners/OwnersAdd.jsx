import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Add from "@/components/AddFieldSection";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { showLoader, hideLoader } from "@/Store/LoaderSpinner";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";

export default function OwnersAdd() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { refetch: refetchOwnerParent, loading: loadingOwnerParent, data: OwnerParentData } = useGet({ url: `${apiUrl}/owner` });

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loader.isLoading);
  const token = localStorage.getItem("token");
  const [OwnerParents, setOwnerParents] = useState([]);
  const [formData, setFormData] = useState({
    en: {
      name: "",
      gender: "",
      birthDate: "",
      parent_user_id: "",
      email: "",
      phone: "",
      password: "",
      status: "",
      image: null,
    },
  });

   useEffect(() => {
    refetchOwnerParent();
  }, [refetchOwnerParent]);

  useEffect(() => {
    if (OwnerParentData && OwnerParentData.parents) {
      console.log("Owner Parent Data:", OwnerParentData);
      setOwnerParents(
        OwnerParentData.parents.map((parent) => ({
          label: parent.name,
          value: parent.id.toString(),
        }))
      );
    }
  }, [OwnerParentData]);


  const handleFieldChange = (lang, name, value) => {
    setFormData((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [name]: value,
      },
    }));
  };
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    return `${year}-${month}-${day}`;
  };
  
  const handleSubmit = async () => {

    const rentFrom = new Date(formData.en.rent_from);
    const rentTo = new Date(formData.en.rent_to);
  
    if (rentTo < rentFrom) {
      toast.error("Rent To date cannot be earlier than Rent From date.", {
        position: "top-right",
        autoClose: 3000,
      });
      return; // لا تتابع في حالة وجود خطأ
    }
  
    dispatch(showLoader());
  
    const body = new FormData();
    body.append("name", formData.en.name);
    body.append("village_id", formData.en.village);
    body.append("status", formData.en.status === "active" ? "1" : "0");
    body.append("email", formData.en.email);
    body.append("phone", formData.en.phone);
    body.append("password", formData.en.password);
    body.append("gender", formData.en.gender);
    body.append("birthDate", formatDate(formData.en.birthDate));
    body.append("rent_from", formatDate(formData.en.rent_from)); 
    body.append("rent_to", formatDate(formData.en.rent_to));     
    body.append("user_type", formData.en.user_type);
    body.append("parent_user_id", formData.en.parent_user_id);
  
    try {
      const response = await fetch("https://bcknd.sea-go.org/admin/user/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });
  
      if (response.ok) {
        toast.success("User added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
  
        setFormData({
          en: {
            name: "",
            village: "",
            status: "",
            user_type: "",
            email: "",
            phone: "",
            password: "",
            gender: "",
            birthDate: "",
            rent_from: "",
            rent_to: "",
            parent_user_id: "",
          },
          ar: {
            name: "",
            village: "",
            status: "",
            user_type: "",
            email: "",
            phone: "",
            password: "",
            gender: "",
            birthDate: "",
            rent_from: "",
            rent_to: "",
            parent_user_id: "",
          },
        });
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        toast.error(errorData.message || "Failed to add User.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error submitting User:", error);
      toast.error("An error occurred!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      dispatch(hideLoader());
    }
  };
  
  const fieldsEn = [
    { type: "input", placeholder: "Owner Name", name: "name" },
    {
      type: "select",
      placeholder: "Gender",
      name: "gender",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
      ],
    },
    { type: "input", inputType: "date", placeholder: "BirthDate", name: "birthDate" },
    { type: "input", placeholder: "Phone", name: "phone" },
    { type: "input", inputType: "email", placeholder: "Email", name: "email" },
    { type: "input", inputType: "password", placeholder: "Password", name: "password" },
    { type: "file",  placeholder: "Owner Image", name: "Owner Image"},
    {
      type: "select",
      placeholder: "Owner Parent",
      name: "parent",
      options: OwnerParents,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-5 p-6 relative">
      {isLoading && <FullPageLoader />}
      <ToastContainer />
      <h2 className="text-bg-primary text-center text-2xl font-semibold">
        Add Owner
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
          onClick={handleSubmit}
          className="bg-bg-primary !mb-10 !ms-3 cursor-pointer hover:bg-teal-600 !px-5 !py-6 text-white w-[30%] rounded-[15px] transition-all duration-200"
        >
          Done
        </Button>
      </div>
    </div>
  );
}

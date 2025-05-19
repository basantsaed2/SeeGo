import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import TitleSection from "@/components/TitleSection";
import { useGet } from "@/Hooks/UseGet";
import Add from "@/components/AddFieldSection";

export default function UnitCode() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/appartment/create_code` });
  const { refetch: refetchAppartment, loading: loadingAppartment, data: AppartmentData } = useGet({ url: `${apiUrl}/appartment` });
  const [users, setUsers] = useState([]);
  const [appartments, setAppartments] = useState([]);
  const isLoading = useSelector((state) => state.loader.isLoading);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    en: {
      type: "",
      appartment: "",
      user: "",
      people: "",
      from: "",
      to: "",
      image: null,
    },
  });

  useEffect(() => {
    refetchAppartment();
  }, [refetchAppartment]);

  useEffect(() => {
    if (AppartmentData && AppartmentData.appartments && AppartmentData.users) {
      console.log("Appartment Data:", AppartmentData);

      setAppartments(
        AppartmentData.appartments.map((appartment) => ({
          label: appartment.unit,
          value: appartment.id.toString(),
        }))
      );
      setUsers(
        AppartmentData.users.map((user) => ({
          label: user.name,
          value: user.id.toString(),
        }))
      );

    }
  }, [AppartmentData]);

  useEffect(() => {
    if (formData.en.type !== "renter") {
      setFormData(prev => ({
        ...prev,
        en: {
          ...prev.en,
          people: "",
          from: "",
          to: "",
          image: null,
        },
      }));
    }
  }, [formData.en.type]);

  const handleFieldChange = (lang, name, value) => {
    setFormData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [name]: value,
      },
    }));
  };

      const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append("appartment_id", formData.en.appartment);
    body.append("type", formData.en.type);
    body.append("user_id", formData.en.user);
    body.append("from", formatDate(formData.en.from));
    body.append("to", formatDate(formData.en.to));
    body.append("people", formData.en.people);

    if (formData.en.image) {
      body.append("image", formData.en.image);
    }

    postData(body, "Appartment added successfully!");
  };

  useEffect(() => {
    if (!loadingPost && response) {
      navigate(-1);
    }
  }, [response, loadingPost]);

  const fields = [
    {
      type: "select",
      placeholder: "Type",
      name: "type",
      required: true,
      options: [
        { value: "owner", label: "Owner" },
        { value: "renter", label: "Renter" },
      ],
    },
    {
      type: "select",
      placeholder: "User",
      name: "user",
      options: users,
      value: formData.en.user
    },
    {
      type: "select",
      placeholder: "Appartment",
      name: "appartment",
      options: appartments,
      value: formData.en.appartment
    },
    // Only show these fields when type is "renter"
    ...(formData.en.type === "renter" ? [
      {
        type: "input",
        inputType: "number",
        placeholder: "Number Of People",
        name: "people",
        required: true
      },
      {
        type: "input", inputType: "date",
        name: "from",
        placeholder: "From",
      },
      {
        type: "input", inputType: "date",
        name: "to",
        placeholder: "To",
      },
      {
        type: "file",
        placeholder: "Appartment Image",
        name: "image",
        accept: "image/*"
      },
    ] : [])
  ];

  return (
    <div className="w-full flex flex-col gap-5 p-6 relative">
      {isLoading && <FullPageLoader />}
      <ToastContainer />
      <h2 className="text-bg-primary text-center text-2xl font-semibold">
        <TitleSection text={"Create Code"} />
      </h2>

      <Add
        fields={fields}
        lang="en"
        values={formData.en}
        onChange={handleFieldChange}
      />

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
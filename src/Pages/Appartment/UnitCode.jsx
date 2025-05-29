import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { usePost } from "@/Hooks/UsePost";
import { useNavigate } from "react-router-dom";
import TitleSection from "@/components/TitleSection";
import { useGet } from "@/Hooks/UseGet";
import Add from "@/components/AddFieldSection";
import { useTranslation } from "react-i18next";

export default function UnitCode() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/appartment/create_code` });
  const { refetch: refetchAppartment, loading: loadingAppartment, data: AppartmentData } = useGet({ url: `${apiUrl}/appartment` });
  const [appartments, setAppartments] = useState([]);
  const [generatedCode, setGeneratedCode] = useState("");
  const isLoading = useSelector((state) => state.loader.isLoading);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    en: {
      type: "",
      appartment: "",
      people: "",
      from: "",
      to: "",
      image: null,
    },
  });
      const { t } = useTranslation();

  useEffect(() => {
    refetchAppartment();
  }, [refetchAppartment]);

  useEffect(() => {
    if (AppartmentData && AppartmentData.appartments) {
      setAppartments(
        AppartmentData.appartments.map((appartment) => ({
          label: appartment.unit,
          value: appartment.id.toString(),
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

  useEffect(() => {
    if (!loadingPost && response) {
      if (response?.data?.success) {
        setGeneratedCode(response.data.success.toString());
      } else {
        toast.error(t("FailedtogeneratecodePleasetryagain."), { position: "bottom-center" });
        console.error("Unexpected response format:", response);
      }
    }
  }, [response, loadingPost, navigate]);

  const handleFieldChange = (lang, name, value) => {
    setFormData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [name]: value,
      },
    }));
    setGeneratedCode("");
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
    setGeneratedCode("");

    const body = new FormData();
    body.append("appartment_id", formData.en.appartment);
    body.append("type", formData.en.type);
    body.append("people", formData.en.people);

    if (formData.en.type === "renter") {
      body.append("from", formatDate(formData.en.from));
      body.append("to", formatDate(formData.en.to));
      if (formData.en.image) {
        body.append("image", formData.en.image);
      }
    }

    postData(body, t("Appartmentaddedsuccessfully!"));
  };

  const copyCodeToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
        .then(() => {
          toast.success(t("Codecopiedtoclipboard"), { position: "bottom-center" });
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
          toast.error(t("Failedtocopycode"), { position: "bottom-center" });
        });
    }
  };

  const fields = [
    {
      type: "select",
      placeholder: t("Type"),
      name: t("type"),
      required: true,
      options: [
        { value: "owner", label: t("Owner") },
        { value: "renter", label: t("Renter") },
      ],
    },
    {
      type: "select",
      placeholder: t("Appartment"),
      name: t("appartment"),
      options: appartments,
      value: formData.en.appartment
    },
    {
      type: "input",
      inputType: "number",
      placeholder: t("NumberOfPeople"),
      name: "people",
      required: true
    },
    ...(formData.en.type === "renter" ? [
      {
        type: "input", inputType: "date",
        name: t("from"),
        placeholder: t("From"),
        value: formData.en.from,
      },
      {
        type: "input", inputType: "date",
        name: t("to"),
        placeholder: t("To"),
        value: formData.en.to,
      },
      {
        type: "file",
        placeholder: t("AppartmentImage"),
        name: t("image"),
        accept: "image/*"
      },
    ] : [])
  ];

  return (
    <div className="w-full flex flex-col  gap-5 p-6 relative">
      {isLoading && <FullPageLoader />}
      <ToastContainer />
      <h2 className="text-bg-primary text-center text-2xl font-semibold">
        <TitleSection text={"Create Code"} />
      </h2>

      {!generatedCode ? (
        <>
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
              {loadingPost ? t("Processing") : t("Done")}
            </Button>
          </div>
        </>
      ) : (
        <div className="!my-8 w-full !p-6 border border-gray-200 rounded-2xl bg-gradient-to-b from-gray-50 to-white shadow-lg max-w-lg !m-auto flex flex-col items-center transition-all duration-300">
          <p className="text-xl  font-semibold text-gray-800 !mb-4">{t("YourGeneratedCode")}</p>
          <div className="relative !mb-3 bg-white !p-3 rounded-xl border border-dashed border-teal-400 text-center font-mono text-lg text-teal-700 w-[90%] break-all shadow-sm hover:shadow-md transition-shadow duration-200">
            {generatedCode}

          </div>
          <div className="!mt-6 flex gap-4">
            <Button
              onClick={copyCodeToClipboard}
              className="bg-teal-600 hover:bg-teal-700 text-white !px-6 !py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              {t("CopyCode")}
            </Button>
            <Button
              onClick={() => navigate(-1)}
              className="bg-gray-600 hover:bg-gray-700 text-white !px-6 !py-3 rounded-lg font-medium transition-all duration-200"
            >
              {t("GoBack")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
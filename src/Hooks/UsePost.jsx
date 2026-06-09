import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export const usePost = ({ url, login = false, type = false }) => {
  const { user } = useSelector((state) => state.auth); // Get user from Redux store
  const [loadingPost, setLoadingPost] = useState(false);
  const [response, setResponse] = useState(null);
  
const navigate = useNavigate();
  const postData = async (data, name) => {
    setLoadingPost(true);
    try {
      const contentType = type ? "application/json" : "multipart/form-data";
      const config =
        !login && user?.token
          ? {
              headers: {
                "Content-Type": contentType,
                Authorization: `Bearer ${user?.token || ""}`,
              },
            }
          : {
              headers: { "Content-Type": contentType },
            };

      const response = await axios.post(url, data, config);

      if (response.status === 200 || response.status === 201) {
        {
          name ? toast.success(name) : "";
        }
        setResponse(response);
      }
// ... الكود العلوي للهوك كما هو

    } catch (error) {
      console.error("Error post JSON:", error);
      setResponse(error.response);
      
      if (error?.response?.data?.errors) {
        if (error.response.data.errors === "You don’t have a package, so you should subscribe.") {
          toast.error("You don’t have a package, so you should subscribe."); 
          setTimeout(() => { navigate("/packages_list"); }, 2000);
        } 
        // 🛠️ الإصلاح هنا: إضافة key قبل messages لاستلام القيم بشكل صحيح
        else if (typeof error.response.data.errors === "object") {
          Object.entries(error.response.data.errors).forEach(([key, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((message) => {
                toast.error(message); 
              });
            } else {
              toast.error(messages);
            }
          });
        } else {
          toast.error(error.response.data.errors);
        }
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message); 
      } else {
        toast.error("An unknown error occurred.");
      }
    } finally {
      setLoadingPost(false);
    }
  };

  return { postData, loadingPost, response };
};
;

import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

export const usePost = ({ url, login = false, type = false }) => {
      const { user } = useSelector((state) => state.auth); // Get user from Redux store
      const [loadingPost, setLoadingPost] = useState(false);
      const [response, setResponse] = useState(null);

       const postData = async (data, name) => {
              setLoadingPost(true);
              try {
                     const contentType = type ? 'application/json' : 'multipart/form-data';
                     const config = !login && user?.token
                            ? {
                                   headers: {
                                          'Content-Type': contentType,
                                          'Authorization': `Bearer ${user?.token || ''}`,
                                   },
                            }
                            : {
                                   headers: { 'Content-Type': contentType },
                            };

                     const response = await axios.post(url, data, config);

                     if (response.status === 200 || response.status === 201) {
                            { name ? toast.success(name) : '' }   
                            setResponse(response);
                     }
              } 
              catch (error) {
                     console.error('Error post JSON:', error);
                   
                     // Check if the error response contains 'error' or just a message
                     if (error?.response?.data?.errors) {
                       // Check if error are an object (field-based error)
                       if (typeof error.response.data.errors === 'object') {
                         Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                           // If messages is an array, loop through them
                           if (Array.isArray(messages)) {
                             messages.forEach(message => {
                              toast.error(message); // Display the error messages
                             });
                           } else {
                             // If it's not an array, display the message directly
                             toast.error(messages);
                           }
                         });
                       } else {
                         // If error is not an object, assume it's just a message
                         toast.error(error.response.data.error);
                       }
                     }
                     else if (error?.response?.data?.message) {
                       // If there's a general message outside of the 'error' object
                       toast.error(error.response.data.message); // Display the general error message
                     } else {
                       // If no specific error messages are found, just display a fallback message
                       toast.error('An unknown error occurred.');
                     }
                   }
                   
              finally {
                     setLoadingPost(false);
              }
       };

       return { postData, loadingPost, response };
};

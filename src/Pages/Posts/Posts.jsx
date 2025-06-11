"use client";
import { useEffect, useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import axios from 'axios';
import DeleteDialog from "@/components/DeleteDialog";
import { Edit, Trash, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PostEdit from "./PostsEdit";
// import { showLoader, hideLoader } from '@/Store/loaderSlice'; // Make sure these exist if you use them

// --- PostsCardLayout Component (No changes needed, keeping as is) ---
const PostsCardLayout = ({ data, onEdit, onDelete }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();

  const openImageModal = (images, index = 0) => {
    setSelectedImages(images);
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImages([]);
    setCurrentIndex(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === selectedImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((post) => {
          const images =
            post.images && post.images.length > 0
              ? post.images.map((img) => img.image_link)
              : post.imageUrl
                ? [post.imageUrl]
                : [];

          return (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                {images.length > 0 ? (
                  <div
                    className="w-full h-48 cursor-pointer"
                    onClick={() => openImageModal(images)}
                  >
                    <img
                      src={images[0]}
                      alt="Thumbnail"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">
                      No Image
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex !space-x-2">
                  {images.length > 0 && (
                    <button
                      onClick={() => openImageModal(images)}
                      className="!p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      title="View Image"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(post)}
                    className="!p-2 bg-bg-primary text-white rounded-full hover:bg-[#58c2c2] transition-colors"
                    title="Edit Post"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(post)}
                    className="!p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Delete Post"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="!p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t("Post")} #{post.id}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {post.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Carousel Modal */}
      {isModalOpen && selectedImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              title="Close"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Carousel */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrev}
                className="text-white hover:text-gray-300 text-3xl px-4"
              >
                ‹
              </button>
              <img
                src={selectedImages[currentIndex]}
                alt="Full view"
                className="max-w-[80vw] max-h-[80vh] object-contain"
              />
              <button
                onClick={handleNext}
                className="text-white hover:text-gray-300 text-3xl px-4"
              >
                ›
              </button>
            </div>

            <div className="text-center text-white mt-4 text-sm">
              {currentIndex + 1} / {selectedImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- Posts Main Component ---
const Posts = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  // const globalIsLoading = useSelector((state) => state.loader.isLoading); // Keep this if you use a global loader
  // const dispatch = useDispatch(); // Keep this if you dispatch loader actions

  // Access token from Redux state (adjust 'auth.token' to your actual state path)
  const token = localStorage.getItem("token"); // Assuming token is in auth.token

  const [posts, setPosts] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const { deleteData, loadingDelete } = useDelete(); // useDelete should be modified to send token too
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State for direct Axios update operation
  const [loadingUpdatePost, setLoadingUpdatePost] = useState(false);
  const [updateError, setUpdateError] = useState(null); // To store potential errors

  const {
    refetch: refetchPost,
    loading: loadingPostData,
    data: postDataFromApi,
    // Assuming useGet also needs to send a token for protected routes
  } = useGet({
    url: `${apiUrl}/post`,
    headers: { // Pass headers with token to useGet
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    refetchPost();
  }, [refetchPost]);

  useEffect(() => {
    if (postDataFromApi && postDataFromApi.post) {
      const formattedPosts = postDataFromApi.post.map((post) => ({
        id: post.id,
        description: post.description || "—",
        images:
          post.images && post.images.length > 0
            ? post.images.map((img) => ({
              id: img.id,
              image_link: img.image_link,
            }))
            : [],
        imageUrl: post.image_link || null,
      }));
      setPosts(formattedPosts);
    }
  }, [postDataFromApi]);

  const handleEdit = (post) => {
    const fullPostData = postDataFromApi?.post.find((p) => p.id === post.id);
    if (fullPostData) {
      setSelectedRow(fullPostData);
      setIsEditOpen(true);
    } else {
      toast.error(t("Error: Post data not found for editing."));
    }
  };

  const handleDelete = (post) => {
    setSelectedRow(post);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!token) {
      toast.error(t("Authentication token is missing. Please log in again."));
      return;
    }

    const success = await deleteData(
      `${apiUrl}/post/delete/${selectedRow.id}`,
      t("NewFeeddeletedsuccessfully"),
      { // Pass headers to useDelete
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (success) {
      setIsDeleteOpen(false);
      setPosts(posts.filter((post) => post.id !== selectedRow.id));
      setSelectedRow(null);
    }
  };


  // This `handleSave` function now performs the Axios POST directly
  const handleSave = async (formDataFromPostEdit) => {
    if (!selectedRow?.id) {
      toast.error(t("Error: No post selected for update."));
      return;
    }

    if (!token) {
      toast.error(t("Authentication token is missing. Please log in again."));
      return;
    }

    console.log("Posts: Initiating update for post ID:", selectedRow.id);
    // dispatch(showLoader()); // Uncomment if you have and want to use a global loader
    setLoadingUpdatePost(true); // Set local loading state
    setUpdateError(null); // Clear previous errors

    try {
      const response = await axios.post(
        `https://bcknd.sea-go.org/village/post/update/${selectedRow.id}`,
        formDataFromPostEdit,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Crucial for FormData
            'Authorization': `Bearer ${token}`, // <-- IMPORTANT: Pass the token here
          },
        }
      );
      console.log("Update response:", response.data);
      toast.success(t("Postupdatedsuccessfully"));
      setIsEditOpen(false);
      setSelectedRow(null);
      refetchPost(); // Refresh posts data

    } catch (error) {
      console.error("Error updating post:", error);
      setUpdateError(error);
      let errorMessage = t("Failedtoupdatepost");
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = t("Authentication failed or not authorized.");
        } else if (error.response.status === 404) {
          errorMessage = t("Endpoint not found or resource missing.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        errorMessage = t("No response from server. Please check your internet connection.");
      } else {
        // Something else happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoadingUpdatePost(false);
      // dispatch(hideLoader()); // Uncomment if you have and want to use a global loader
    }
  };

  const filteredPosts = useMemo(() => {
    let currentPosts = posts;

    if (searchValue) {
      const lowerCaseSearch = searchValue.toLowerCase();
      currentPosts = currentPosts.filter(
        (post) =>
          post.description.toLowerCase().includes(lowerCaseSearch) ||
          String(post.id).includes(lowerCaseSearch)
      );
    }
    return currentPosts;
  }, [posts, searchValue]);

  // Consolidate all loading states for the FullPageLoader
  // Using globalIsLoading from Redux, and local loading states
  // Adjust `globalIsLoading` usage if you removed `dispatch(showLoader)` and `hideLoader`
  // If you removed them, you might just use `loadingUpdatePost || loadingPostData || loadingDelete`
  const overallLoading = loadingUpdatePost || loadingPostData || loadingDelete; // Simplified if no global dispatch
  // const overallLoading = globalIsLoading || loadingUpdatePost || loadingPostData || loadingDelete; // Use this if you keep global loader

  if (overallLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="!p-6 min-h-screen">
      <div className="flex justify-between !mb-6 items-center flex-wrap gap-4">
        <Input
          placeholder={t("Search")}
          className="w-full !p-2 sm:w-1/3 max-w-sm border-bg-primary focus:border-bg-primary focus:ring-bg-primary rounded-[10px]"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={() => navigate("add")}
            className="bg-bg-primary cursor-pointer text-white hover:bg-teal-700 rounded-[10px] !p-3"
          >
            <Plus className="w-5 h-5 !mr-2" />
            {t("Add")}
          </Button>
        </div>
      </div>
      <div className="w-full">
        <PostsCardLayout
          data={filteredPosts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {selectedRow && (
          <>
            <PostEdit
              open={isEditOpen}
              onOpenChange={setIsEditOpen}
              onSave={handleSave}
              postData={selectedRow}
              loading={loadingUpdatePost} // Pass the local loading state
            />
            <DeleteDialog
              open={isDeleteOpen}
              onOpenChange={setIsDeleteOpen}
              onDelete={handleDeleteConfirm}
              name={selectedRow.description || `Post #${selectedRow.id}`}
              isLoading={loadingDelete}
            />
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Posts;
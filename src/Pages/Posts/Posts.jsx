"use client";
import { useEffect, useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import axios from "axios";
import DeleteDialog from "@/components/DeleteDialog";
import { Edit, Trash, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PostEdit from "./PostsEdit";
import clsx from "clsx";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// --- PostsCardLayout Component ---
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
              ? post.images.map((img) => (typeof img === "object" ? (img.image_link || img.url || img.image) : img)).filter(Boolean)
              : post.imageUrl
                ? [post.imageUrl]
                : [];

          return (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
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
                      {t("No Image") || "No Image"}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {images.length > 0 && (
                    <button
                      onClick={() => openImageModal(images)}
                      className="!p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      title={t("View Image") || "View Image"}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(post)}
                    className="!p-2 bg-bg-primary text-white rounded-full hover:bg-[#58c2c2] transition-colors"
                    title={t("Edit Post") || "Edit Post"}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(post)}
                    className="!p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title={t("Delete Post") || "Delete Post"}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="!p-4 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t("Post")} #{post.id}
                  </h3>
                  {post.admin_name && (
                    <span className="text-xs bg-teal-50 text-teal-700 dark:bg-gray-700 dark:text-teal-400 font-medium !px-2.5 !py-0.5 rounded-full border border-teal-200">
                      👤 {post.admin_name}
                    </span>
                  )}
                </div>
                <p className="!mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
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
  const token = localStorage.getItem("token");

  const [posts, setPosts] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const { deleteData, loadingDelete } = useDelete();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State for direct Axios update operation
  const [loadingUpdatePost, setLoadingUpdatePost] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Fetch posts from new_view endpoint
  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page);
  if (searchValue) queryParams.append("search", searchValue);

  const {
    refetch: refetchPost,
    loading: loadingPostData,
    data: postDataFromApi,
  } = useGet({
    url: `${apiUrl}/post/new_view?${queryParams.toString()}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    refetchPost();
  }, [page, searchValue, refetchPost]);

  const rawPostsList = useMemo(() => {
    if (Array.isArray(postDataFromApi?.posts?.data)) {
      return postDataFromApi.posts.data;
    }
    if (Array.isArray(postDataFromApi?.posts)) {
      return postDataFromApi.posts;
    }
    if (Array.isArray(postDataFromApi?.post)) {
      return postDataFromApi.post;
    }
    return [];
  }, [postDataFromApi]);

  const pagination = postDataFromApi?.posts && typeof postDataFromApi.posts === "object" && !Array.isArray(postDataFromApi.posts)
    ? postDataFromApi.posts
    : { current_page: 1, last_page: 1, total: rawPostsList.length };

  useEffect(() => {
    if (rawPostsList) {
      const formattedPosts = rawPostsList.map((post) => {
        const adminName =
          typeof post.admin_name === "string"
            ? post.admin_name
            : post.admin && typeof post.admin === "object"
            ? post.admin.name
            : typeof post.admin === "string"
            ? post.admin
            : post.user?.name || null;

        return {
          id: post.id,
          description: post.description || "—",
          admin_name: adminName,
          images:
            post.images && post.images.length > 0
              ? post.images.map((img) => ({
                  id: img.id,
                  image_link: typeof img === "object" ? (img.image_link || img.url || img.image) : img,
                }))
              : post.image_link
              ? [{ id: 1, image_link: post.image_link }]
              : [],
          imageUrl: post.image_link || null,
          rawPost: post,
        };
      });
      setPosts(formattedPosts);
    }
  }, [rawPostsList]);

  const handleEdit = (post) => {
    const fullPostData = rawPostsList.find((p) => p.id === post.id) || post.rawPost || post;
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
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (success) {
      setIsDeleteOpen(false);
      setPosts(posts.filter((post) => post.id !== selectedRow.id));
      setSelectedRow(null);
      refetchPost();
    }
  };

  const handleSave = async (formDataFromPostEdit) => {
    if (!selectedRow?.id) {
      toast.error(t("Error: No post selected for update."));
      return;
    }

    if (!token) {
      toast.error(t("Authentication token is missing. Please log in again."));
      return;
    }

    setLoadingUpdatePost(true);
    setUpdateError(null);

    try {
      const response = await axios.post(
        `${apiUrl}/post/update/${selectedRow.id}`,
        formDataFromPostEdit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(t("Postupdatedsuccessfully"));
      setIsEditOpen(false);
      setSelectedRow(null);
      refetchPost();
    } catch (error) {
      console.error("Error updating post:", error);
      setUpdateError(error);
      let errorMessage = t("Failedtoupdatepost");
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoadingUpdatePost(false);
    }
  };

  const overallLoading = loadingUpdatePost || (loadingPostData && !posts.length) || loadingDelete;

  if (overallLoading) {
    return <FullPageLoader />;
  }

  const totalPages = pagination.last_page || 1;
  const currentPage = pagination.current_page || page;

  return (
    <div className="!p-6 min-h-screen">
      <div className="flex justify-between !mb-6 items-center flex-wrap gap-4">
        <Input
          placeholder={t("Search")}
          className="w-full !p-2 sm:w-1/3 max-w-sm border-bg-primary focus:border-bg-primary focus:ring-bg-primary rounded-[10px]"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setPage(1);
          }}
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
        {posts.length > 0 ? (
          <PostsCardLayout
            data={posts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="text-center text-gray-500 py-12">
            {t("No posts found.") || "No posts found."}
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 w-full overflow-x-auto pb-2">
            <Pagination>
              <PaginationContent className="flex flex-wrap items-center gap-1 sm:gap-2 justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={clsx(
                      "border border-gray-300 rounded-xl !px-3 !py-1.5 transition-all text-xs font-semibold cursor-pointer select-none",
                      currentPage === 1 ? "pointer-events-none opacity-40 bg-gray-100 text-gray-400" : "text-bg-primary hover:bg-gray-100"
                    )}
                  />
                </PaginationItem>

                {(() => {
                  const pageNumbers = [];
                  const maxVisiblePages = 5;

                  if (totalPages <= maxVisiblePages) {
                    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
                  } else {
                    if (currentPage <= 3) {
                      pageNumbers.push(1, 2, 3, 4, "ellipsis", totalPages);
                    } else if (currentPage >= totalPages - 2) {
                      pageNumbers.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                    } else {
                      pageNumbers.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
                    }
                  }

                  return pageNumbers.map((p, idx) => {
                    if (p === "ellipsis") {
                      return (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis className="text-gray-400 px-1" />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={p}>
                        <PaginationLink
                          onClick={() => setPage(p)}
                          isActive={currentPage === p}
                          className={clsx(
                            "border transition-all !px-3 !py-1.5 rounded-xl text-xs font-bold min-w-[36px] h-9 flex items-center justify-center cursor-pointer select-none",
                            currentPage === p
                              ? "bg-bg-primary text-white border-bg-primary shadow-sm hover:bg-bg-primary/90"
                              : "border-gray-300 text-slate-600 hover:bg-slate-100"
                          )}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  });
                })()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={clsx(
                      "border border-gray-300 rounded-xl !px-3 !py-1.5 transition-all text-xs font-semibold cursor-pointer select-none",
                      currentPage === totalPages ? "pointer-events-none opacity-40 bg-gray-100 text-gray-400" : "text-bg-primary hover:bg-gray-100"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {selectedRow && (
          <>
            <PostEdit
              open={isEditOpen}
              onOpenChange={setIsEditOpen}
              onSave={handleSave}
              postData={selectedRow}
              loading={loadingUpdatePost}
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
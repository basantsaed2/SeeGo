"use client";

import { use, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteDialog from "@/components/DeleteDialog";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { usePost } from "@/Hooks/UsePost";
import { useParams } from "react-router-dom";
import { XCircleIcon, UploadIcon, ImageIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const BeachesGallery = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [galleries, setBeachGallery] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { id } = useParams();

  const { refetch: refetchBeach, loading: loadingBeach, data: beachData, error: fetchError } = useGet({
    url: `${apiUrl}/beach/view_gallery/${id || ""}`,
  });
  const { postData, loadingPost, response, error: postError } = usePost({
    url: `${apiUrl}/beach/add_gallery/${id}`,
  });
  const { deleteData, loadingDelete, error: deleteError } = useDelete();

  useEffect(() => {
    refetchBeach();
  }, [refetchBeach]);

  useEffect(() => {
    if (beachData && beachData.gallary) {
      setBeachGallery(beachData.gallary || []);
    }
    if (fetchError) {
      toast.error("Failed to fetch gallery: " + fetchError.message);
    }
  }, [beachData, fetchError]);

  useEffect(() => {
    if (!loadingPost && response) {
      setIsModelOpen(false);
      setSelectedFiles([]);
      setPreviewImages([]);
      refetchBeach();
      toast.success("Images uploaded successfully!");
    }
    if (postError) {
      toast.error("Upload failed: " + postError.message);
    }
  }, [response, loadingPost, postError, refetchBeach]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.error("Maximum 10 images can be uploaded at once");
      return;
    }
    setSelectedFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select images to upload");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    await postData(formData, "Images uploaded successfully!");
  };

  const handleDelete = (gallery) => {
    setSelectedRow(gallery);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const success = await deleteData(
        `${apiUrl}/beach/delete_gallery/${selectedRow.id}`,
        "Image deleted successfully!"
      );

      if (success) {
        setIsDeleteOpen(false);
        setBeachGallery(galleries.filter((gallery) => gallery.id !== selectedRow.id));
        toast.success("Image deleted successfully!");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed: " + error.message);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(galleries.length / itemsPerPage);
  const paginatedGalleries = galleries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const GalleryModal = () => (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-95 rounded-xl !p-8 w-full max-w-3xl max-h-[80vh] overflow-y-auto shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Upload Images</h2>
        <div className="!mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Images (Up to 10)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-3 file:px-6
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200 transition"
          />
        </div>

        {/* Preview Grid */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={() => {
                    setPreviewImages(previewImages.filter((_, i) => i !== index));
                    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full !p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XCircleIcon size={24} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setIsModelOpen(false);
              setPreviewImages([]);
              setSelectedFiles([]);
            }}
            className="!px-6 !py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={loadingPost}
            className="!px-6 !py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loadingPost ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading || loadingPost || loadingBeach || loadingDelete) {
    return <FullPageLoader />;
  }

  return (
    <div className="!p-6 min-h-screen">
      <ToastContainer />
      
      <div className="flex justify-between items-center !mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Beach Gallery</h1>
        <button
          onClick={() => setIsModelOpen(true)}
          className="flex items-center gap-2 !px-4 !py-2 bg-bg-primary text-white rounded-lg hover:bg-bg-primary hover:text-white transition"
        >
          <UploadIcon size={20} />
          Add Images
        </button>
      </div>

      {/* Pagination */}
      {galleries.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="!p-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition"
          >
            <ChevronLeftIcon size={24} />
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="!p-2 bg-gray-200 rounded-full disabled:opacity-50 hover:bg-gray-300 transition"
          >
            <ChevronRightIcon size={24} />
          </button>
        </div>
      )}

      {galleries.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon size={48} className="mx-auto text-gray-400" />
          <p className="text-gray-500 text-lg mt-4">No images in the gallery yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedGalleries.map((gallery) => (
            <div
              key={gallery.id}
              className="relative group bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={gallery.image_url}
                alt={gallery.name || "Beach image"}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all" />
              <button
                onClick={() => handleDelete(gallery)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full !p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XCircleIcon size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {isModelOpen && <GalleryModal />}
      {isDeleteOpen && (
        <DeleteDialog
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete Image"
          description="Are you sure you want to delete this image?"
        />
      )}
    </div>
  );
};

export default BeachesGallery;
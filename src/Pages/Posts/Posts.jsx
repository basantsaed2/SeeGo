"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGet } from "@/Hooks/UseGet";
import { useDelete } from "@/Hooks/useDelete";
import { usePost } from "@/Hooks/UsePost";
import EditDialog from "@/components/EditDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { usePostsForm, PostsFields } from "./PostsForm";
import { Edit, Trash, Eye, Plus } from "lucide-react"; // Assuming you're using Lucide icons
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const PostsCardLayout = ({ data, onEdit, onDelete }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openImageModal = (imageUrl) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    return (
        <>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((post) => (
                    <div
                        key={post.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="relative">
                            {post.image !== "—" ? (
                                <>
                                    {/* Clickable image area */}
                                    <div
                                        className="w-full h-48 cursor-pointer"
                                        onClick={() => openImageModal(post.imageUrl)}
                                    >
                                        {post.image}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex !space-x-2">
                                {post.image !== "—" && (
                                    <button
                                        onClick={() => openImageModal(post.imageUrl)}
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
                                Post #{post.id}
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                                {post.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Image Modal */}
            {isModalOpen && selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 !p-4"
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
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={selectedImage}
                            alt="Full view"
                            className="max-w-[90vw] max-h-[90vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
};


const Posts = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [posts, setPosts] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rowEdit, setRowEdit] = useState(null);
    const { deleteData, loadingDelete } = useDelete();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const navigate = useNavigate();

    const { refetch: refetchPost, loading: loadingPostData, data: postData } = useGet({
        url: `${apiUrl}/post`,
    });
    const { postData: updatePost, loading: loadingPost, response } = usePost({
        url: `${apiUrl}/post/update/${selectedRow?.id}`,
    });

    const { formData, fields, handleFieldChange, prepareFormData } = usePostsForm(
        apiUrl,
        true,
        rowEdit
    );

    useEffect(() => {
        refetchPost();
    }, [refetchPost]);

    useEffect(() => {
        if (postData && postData.post) {
            const formatted = postData.post.map((post) => ({
                id: post.id,
                description: post.description || "—",
                image: post.image_link ? (
                    <img
                        src={post.image_link}
                        alt={post.description}
                        className="w-full h-48 object-cover"
                    />
                ) : (
                    "—"
                ),
                imageUrl: post.image_link || null, // Add this line
            }));
            setPosts(formatted);
        }
    }, [postData]);

    const handleEdit = (post) => {
        const fullPostData = postData?.post.find((p) => p.id === post.id);
        setSelectedRow(post);
        setIsEditOpen(true);
        setRowEdit({ ...fullPostData });
    };

    const handleDelete = (post) => {
        setSelectedRow(post);
        setIsDeleteOpen(true);
    };

    useEffect(() => {
        if (!loadingPost && response) {
            toast.success("Post updated successfully!");
            setIsEditOpen(false);
            setSelectedRow(null);
            refetchPost();
        }
    }, [response, loadingPost, refetchPost]);

    const handleSave = async () => {
        const body = prepareFormData();
        updatePost(body, "New Feed updated successfully!");
    };

    const handleDeleteConfirm = async () => {
        const success = await deleteData(
            `${apiUrl}/post/delete/${selectedRow.id}`,
            `New Feed deleted successfully!`
        );
        if (success) {
            setIsDeleteOpen(false);
            setPosts(posts.filter((post) => post.id !== selectedRow.id));
        }
    };

    if (isLoading || loadingPost || loadingPostData) {
        return <FullPageLoader />;
    }

    return (
        <div className="!p-6 min-h-screen">
            <div className="flex justify-between !mb-6 items-center flex-wrap gap-4">
                <Input
                    placeholder="Search..."
                    className="w-full !p-5 sm:w-1/3 max-w-sm border-bg-primary focus:border-bg-primary focus:ring-bg-primary rounded-[10px]"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <div className="flex items-center gap-3 flex-wrap">
                    <Button
                        onClick={() => navigate('add')}
                        className="bg-bg-primary cursor-pointer text-white hover:bg-teal-700 rounded-[10px] !p-3"
                    >
                        <Plus className="w-5 h-5 !mr-2" />
                        Add
                    </Button>
                </div>
            </div>
            <div className="w-full">
                <PostsCardLayout
                    data={posts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                {/* Edit Dialog */}
                {selectedRow && (
                    <>
                        <EditDialog
                            title="Edit New Feed"
                            open={isEditOpen}
                            onOpenChange={setIsEditOpen}
                            onSave={handleSave}
                            selectedRow={selectedRow}
                            onCancel={() => setIsEditOpen(false)}
                            onChange={handleFieldChange}
                            isLoading={loadingPostData}
                        >
                            <div className="w-full max-h-[60vh] !p-4 overflow-y-auto">
                                <Tabs defaultValue="english" className="w-full">
                                    <TabsContent value="english">
                                        <PostsFields
                                            fields={fields.en}
                                            formData={formData.en}
                                            handleFieldChange={handleFieldChange}
                                            loading={loadingPostData}
                                            language="en"
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </EditDialog>
                        <DeleteDialog
                            open={isDeleteOpen}
                            onOpenChange={setIsDeleteOpen}
                            onDelete={handleDeleteConfirm}
                            name={selectedRow.name}
                            isLoading={loadingDelete}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Posts;
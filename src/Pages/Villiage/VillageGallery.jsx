import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/Loading";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { useTranslation } from "react-i18next";

// ✅ مكون ImageCard
function ImageCard({ imageUrl, onDelete }) {

  return (
    <div className="relative rounded-md overflow-hidden shadow-md">
      <img
        src={imageUrl}
        alt="Gallery"
        className="w-full h-auto aspect-square object-cover"
      />
      <Button
        onClick={onDelete}
        className="absolute cursor-pointer top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center bg-gray-800 text-white hover:bg-bg-primary"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

// ✅ مكون Gallery
function Gallery() {

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const { changeState, loadingChange } = useChangeState();
    const { deleteData, loadingDelete } = useDelete();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
        const { t } = useTranslation();

    const { refetch: refetchVillageAdmin, loading: loadingVillageAdmin, data: VillageAdminData } = useGet({
        url: `${apiUrl}/admin_village`,
    });
    const { postData, loadingPost, response } = usePost({
        url: `${apiUrl}/admin_village/update/${selectedRow?.id}`,
    });













    
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch(
        `https://bcknd.sea-go.org/admin/village_gallery/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (Array.isArray(data.village_gallary)) {
        setImages(data.village_gallary);
      } else {
        console.error("Unexpected API response:", data);
        toast.error(t("Failedtoloadimages"));
      }
    } catch (error) {
      console.error("Failed to fetch gallery images:", error);
      toast.error(t("Errorloadinggallery"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      const response = await fetch(
        `https://bcknd.sea-go.org/admin/village_gallery/delete/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setImages((prevImages) =>
          prevImages.filter((img) => img.id !== imageId)
        );
        toast.success(t("Imagedeletedsuccessfully"));
      } else {
        toast.error(t("Failedtodeleteimage"));
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(t("Errordeletingimage"));
    }
  };

  useEffect(() => {
    fetchGalleryImages();
  }, [villageId]);

  if (loading) return <Loading />;

  return (
    <div className="grid !p-4 !m-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {images.length > 0 ? (
        images.map((img) => (
          <ImageCard
            key={img.id}
            imageUrl={img.image_link}
            onDelete={() => handleDelete(img.id)}
          />
        ))
      ) : (
        <p className="text-center col-span-full">{t("Noimagesfound")} </p>
      )}
    </div>
  );
}

// ✅ مكون Header
function Header({ onUploadSuccess }) {
          const { t } = useTranslation();

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("1");

  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error(t('Pleaseselectanimage'));
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("status", status);
    formData.append("village_id", id);

    try {
      const response = await fetch(
        `https://bcknd.sea-go.org/admin/village_gallery/add/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setOpenAddDialog(false);
        setImageFile(null);
        setStatus("1");
        onUploadSuccess();
        toast.success(t("Imageuploadedsuccessfully"));
      } else {
        toast.error(t("Failedtouploadimage"));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(t("Erroruploadingimage"));
    }
  };

  return (
    <div className="flex justify-end space-x-2 p-4">
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogTrigger asChild>
          <Button className="bg-bg-primary text-white cursor-pointer !px-4 !py-2 rounded-[16px] hover:bg-teal-500 transition-all ">
            {t('Add')}{" "}
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white !p-6 border-none rounded-lg shadow-lg max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-bg-primary">
              {t("AddNewImage")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full !mb-3 cursor-pointer text-sm text-gray-500 file:!mr-4 file:!py-2 file:!px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-bg-primary file:text-white hover:file:bg-teal-600"
            />
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger
                id="status"
                className="!my-2 text-bg-primary w-full !p-4 border border-bg-primary focus:outline-none focus:ring-2 focus:ring-bg-primary rounded-[8px]"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white border !p-3 border-bg-primary rounded-[10px] text-bg-primary">
                <SelectItem value="1" className="text-bg-primary">
                  {t("Active")}
                </SelectItem>
                <SelectItem value="0" className="text-bg-primary">
                  {t("Inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-6">
            <Button
              onClick={() => setOpenAddDialog(false)}
              variant="outline"
              className="border !px-3 !py-2 cursor-pointer border-teal-500 hover:bg-bg-primary hover:text-white transition-all text-bg-primary"
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleImageUpload}
              className="bg-bg-primary border border-teal-500 hover:bg-white  hover:text-bg-primary transition-all  !px-3 !py-2 cursor-pointer text-white"
            >
              {t('Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ✅ الصفحة الرئيسية
export default function VillageGallery() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const { refetch: refetchVillageGallery, loading: loadingVillageGallery, data: VillageGalleryData } = useGet({
        url: `${apiUrl}/gallery`,
    });

   if (loadingVillageGallery) {
        return <FullPageLoader />;
    }

  return (
    <div>
      <Header/>
      <Gallery/>
    </div>
  );
}
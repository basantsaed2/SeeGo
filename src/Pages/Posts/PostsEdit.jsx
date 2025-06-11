"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit3, Save, Plus, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const PostEdit = ({ open, onOpenChange, onSave, postData, loading }) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState("");
  const [displayImages, setDisplayImages] = useState([]);
  const [replacedImages, setReplacedImages] = useState([]); // { originalId, newFile }
  const [newFilesToUpload, setNewFilesToUpload] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  useEffect(() => {
    if (open && postData) {
      setDescription(postData.description || "");

      const initialImages = Array.isArray(postData.images)
        ? postData.images
            .filter((img) => img.id && img.image_link)
            .map((img) => ({
              id: img.id,
              url: img.image_link,
              file: null,
              isExisting: true,
            }))
        : [];

      setDisplayImages(initialImages);
      setReplacedImages([]);
      setNewFilesToUpload([]);
      setDeletedImageIds([]);
    }
  }, [open, postData]);

  const handleDisplayImageReplace = useCallback((newFile, idToReplace) => {
    if (!newFile) return;

    setDisplayImages((prev) =>
      prev.map((img) => {
        if (img.id === idToReplace) {
          if (img.file) {
            URL.revokeObjectURL(img.url);
          }
          return {
            id: idToReplace,
            url: URL.createObjectURL(newFile),
            file: newFile,
            isExisting: false,
          };
        }
        return img;
      })
    );

    setReplacedImages((prev) => {
      const existing = prev.find((item) => item.originalId === idToReplace);
      if (existing) {
        URL.revokeObjectURL(existing.newFile?.url);
        return prev.map((item) =>
          item.originalId === idToReplace
            ? { originalId: idToReplace, newFile }
            : item
        );
      } else {
        return [...prev, { originalId: idToReplace, newFile }];
      }
    });
  }, []);

  const handleSubmit = () => {
    const form = new FormData();
    form.append("description", description);

    // الصور الجديدة
    newFilesToUpload.forEach((file) => {
      form.append("images[]", file);
    });

    // الصور المستبدلة + ID الصورة الأصلية
    replacedImages.forEach((item) => {
      form.append("images[]", item.newFile);
      form.append("replaced_image_ids[]", item.originalId); // مهم للربط
    });

    // الصور الموجودة التي لم تُعدّل ولم تُحذف
    const untouchedImageIds = displayImages
      .filter(
        (img) =>
          img.isExisting &&
          !deletedImageIds.includes(img.id) &&
          !replacedImages.some((r) => r.originalId === img.id)
      )
      .map((img) => img.id);

    // إرسالها حتى لو فاضية
    (untouchedImageIds.length > 0 ? untouchedImageIds : [""]).forEach((id) => {
      form.append("images_id[]", id);
    });

    // Debug
    console.log("--- FormData Content ---");
    for (let pair of form.entries()) {
      console.log(
        `${pair[0]}: ${pair[1] instanceof File ? pair[1].name : pair[1]}`
      );
    }
    console.log("------------------------");

    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl !p-6 overflow-y-auto rounded-xl bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-bg-primary font-semibold">
            {t("EditPost")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <label htmlFor="description" className="font-medium text-teal-200">
            {t("Description")}
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="resize-none !mt-5 !p-2 border-gray-300 rounded-lg focus:ring-bg-primary focus:border-bg-primary"
            placeholder={t("EnterDescription")}
          />
        </div>

        {displayImages.length > 0 && (
          <div className="!mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayImages.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.url}
                  alt={t("PostImage")}
                  className="w-full min-h-0 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 flex justify-end gap-1 !p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <label
                    className="!p-2 rounded-full cursor-pointer"
                    aria-label={t("ReplaceImage")}
                  >
                    <Edit3 className="w-5 h-5 text-blue-600" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        handleDisplayImageReplace(e.target.files[0], img.id)
                      }
                      onClick={(e) => (e.target.value = null)}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="!mt-6 text-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-teal-600 text-white hover:bg-teal-700 rounded-lg !px-4 !py-2 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {t("SaveChanges")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostEdit;

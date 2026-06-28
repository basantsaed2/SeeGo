"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { useGet } from "@/Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { useSelector } from "react-redux";
import {
  CalendarDays,
  Home,
  Mail,
  Phone,
  User,
  Users,
  Crown,
  MapPin,
  ImageIcon,
  Maximize,
  Trash2,
} from "lucide-react";
import { useChangeState } from "@/Hooks/useChangeState";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import axios from "axios";
import UnitCodeManager from "./UnitCodeManager";
import UnitRenters from "./UnitRenters";
import DeleteDialog from "@/components/DeleteDialog";

const formatDate = (dateString) => {
  return dateString
    ? new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "N/A";
};

const UnitDetails = () => {
  const { t } = useTranslation();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const isLoading = useSelector((state) => state.loader.isLoading);

  // 🔑 جلب الـ Token من الـ Redux
  const token = useSelector((state) => state.auth?.token || localStorage.getItem("token"));

  const [activeTab, setActiveTab] = useState("overview");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  // حالات الـ Delete Dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { refetch, loading, data } = useGet({
    url: `${apiUrl}/appartment_profile/${id}`,
  });
  const { changeState, loadingChange } = useChangeState();

  const handleToggleType = async (user, currentType) => {
    let newType;
    if (currentType === "super") {
      newType = "follower";
    } else {
      const currentSuperOwner = data?.owners?.find((o) => o.user_type === "super");
      if (currentSuperOwner && currentSuperOwner.id !== user.id) {
        await changeState(
          `${apiUrl}/appartment_profile/update/${currentSuperOwner.id}?user_type=follower`,
          `${currentSuperOwner.name} demoted to follower.`
        );
      }
      newType = "super";
    }

    const response = await changeState(
      `${apiUrl}/appartment_profile/update/${user.id}?user_type=${newType}`
    );
    if (response) {
      refetch();
      toast.success(
        t("UserTypeChanged", { name: user.name || "User", type: newType })
      );
    }
  };

  const openDeleteConfirmation = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteOwner = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);

      const response = await axios.post(
        `${apiUrl}/appartment/delete_user_appartment`,
        {
          appartment_id: id,
          user_id: userToDelete.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.data) {
        toast.success(t("OwnerDeletedSuccessfully", { name: userToDelete.name || "User" }));
        setIsDeleteDialogOpen(false);
        refetch();
      }
    } catch (error) {
      console.error("Error deleting owner:", error);
      toast.error(error.response?.data?.message || t("FailedToDeleteOwner"));
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const { data: codesData, refetch: refetchCodes } = useGet({
    url: `${apiUrl}/appartment/view_codes/${id}`,
  });

  useEffect(() => {
    refetch();
    refetchCodes();
  }, [refetch, refetchCodes, id]);

  const openImageModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setIsImageModalOpen(true);
  };

  if (isLoading || loading) {
    return <FullPageLoader />;
  }

  if (!data) {
    return (
      <div className="container mx-auto !py-12 !px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-muted-foreground">
            {t("Nodataavailableforthisunit")}
          </h2>
        </motion.div>
      </div>
    );
  }

  const { appartment, owners, renters } = data;

  // تصفية الملّاك بحيث نحذف أي مالك يحمل الاسم unknown
  const validOwners = (owners || []).filter((owner) => {
    const ownerName = owner.name || owner.owner_name || "";
    return ownerName && ownerName.toLowerCase() !== "unknown";
  });

  const renderUserCard = (user, isOwner = true) => (
    <motion.div
      key={user.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full relative !p-4 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
        <div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50" />
          <CardHeader className="flex flex-row items-center !space-x-4 !pb-2">
            <Avatar className="h-14 w-14 ring-2 ring-primary/20">
              <AvatarImage
                src={user.image || user.owner_image || "/default-avatar.png"}
              />
              <AvatarFallback>
                <User className="h-6 w-6 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="flex items-center justify-between text-lg">
                <span>{user.name || user.owner_name || t("UnknownUser")}</span>
                <Badge
                  variant={user.user_type === "super" ? "default" : "outline"}
                  className="flex items-center gap-1 !px-3 !py-1"
                >
                  {user.user_type === "super" && <Crown className="h-3 w-3" />}
                  {user.user_type ? user.user_type.toUpperCase() : "USER"}
                </Badge>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {isOwner ? t("Owner") : t("Renter")}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email || user.owner_email || t("Noemail")}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone || user.owner_phone || t("Nophone")}</span>
            </div>
            {!isOwner && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>From: {formatDate(user.rent_from)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span>To: {formatDate(user.rent_to)}</span>
                </div>
              </>
            )}
          </CardContent>
        </div>

        {isOwner && (
          <CardFooter className="flex justify-end gap-2 mt-4 !p-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteConfirmation(user.id, user.name || user.owner_name)}
                    disabled={isDeleting}
                    className="flex !p-2 items-center gap-2 text-white bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("Delete")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("DeleteOwnerFromApartment")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={user.user_type === "super" ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleType(user, user.user_type)}
                    disabled={loadingChange || isDeleting}
                    className={`flex !p-2 items-center gap-2 ${user.user_type !== "super"
                      ? "bg-bg-primary hover:text-bg-primary hover:bg-white text-white"
                      : "text-white bg-amber-500 hover:bg-amber-600"
                      }`}
                  >
                    {loadingChange
                      ? "Processing..."
                      : user.user_type === "super"
                        ? t("DemotefromSuper")
                        : t("MakeSuper")}
                    {user.user_type !== "super" && (
                      <Crown className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                </TooltipTrigger>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto !py-12 !px-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="!space-y-8"
      >
        {/* Header Section */}
        <div className="flex justify-center items-center text-center gap-4">
          <div className="relative">
            <Avatar
              className="h-20 w-20 border-4 border-white shadow-lg rounded-full cursor-pointer"
              onClick={() => openImageModal(appartment.image_link)}
            >
              <AvatarImage src={appartment.image_link} />
              <AvatarFallback className="bg-teal-100 text-teal-800 text-3xl font-bold">
                {appartment.unit ? appartment.unit.charAt(0) : "U"}
              </AvatarFallback>
            </Avatar>
            {appartment.image_link && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                      onClick={() => openImageModal(appartment.image_link)}
                    >
                      <Maximize className="h-4 w-4 text-gray-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("ViewApartmentImage")}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-primary"
          >
            {appartment.unit || "Unit Details"}
          </motion.h1>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full bg-gray-100 rounded-lg !p-1 grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2 !p-2">
              <Home className="h-4 w-4" />
              {t("Overview")}
            </TabsTrigger>

            <TabsTrigger value="owners" className="flex items-center gap-2 !p-2">
              <User className="h-4 w-4" />
              {t("Owners")} ({validOwners.length})
            </TabsTrigger>

            <TabsTrigger value="renters" className="flex items-center gap-2 !p-2">
              <Users className="h-4 w-4" />
              {t("Renters")} ({renters.length})
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2 !p-2">
              <Users className="h-4 w-4" />
              {t("Code")}
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="!mt-6">
              <Card className="!p-4 border border-gray-200 ">
                <CardHeader>
                  <CardTitle className="text-xl">{t("ApartmentDetails")}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <Home className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t("UnitName")}</p>
                        <p className="text-base font-semibold">{appartment.unit || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t("Type")}</p>
                        <p className="text-base font-semibold">
                          {appartment.appartment_type_id === 1 ? "Villa" : "Apartment"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t("Location")}</p>
                        <p className="text-base font-semibold">{appartment.location || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">{t("CreatedDate")}</p>
                        <p className="text-base font-semibold">{formatDate(appartment.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="owners" className="!mt-6">
              <motion.div
                key="owners"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {validOwners.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                    {validOwners.map((owner) => renderUserCard(owner, true))}
                  </div>
                ) : (
                  <Card className="text-center !py-12 border border-slate-100 shadow-sm rounded-2xl">
                    <CardContent className="flex flex-col items-center justify-center !p-6 text-muted-foreground">
                      <Users className="h-12 w-12 text-slate-300 !mb-3" />
                      <h3 className="text-lg font-bold text-slate-700">{t("No Owners Found")}</h3>
                      <p className="text-sm font-medium text-slate-400 !mt-1">
                        {t("Noownersfoundforthisunit")}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="renters" className="!mt-6">
              <motion.div
                key="renters"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <UnitRenters appartmentId={id} apiUrl={apiUrl} />
              </motion.div>
            </TabsContent>

            <TabsContent value="code" className="!mt-6">
              {codesData ? (
                <UnitCodeManager
                  codes={codesData}
                  apiUrl={apiUrl}
                  refetchCodes={refetchCodes}
                />
              ) : (
                <p className="text-center p-4">{t("NoCodesFound")}</p>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteOwner}
        name={userToDelete?.name || ""}
        isDeleting={isDeleting}
      />

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="!p-4 !pb-0">
            <DialogTitle>{t("ApartmentImage")}</DialogTitle>
          </DialogHeader>
          {currentImage && (
            <div className="flex justify-center items-center !p-2">
              <img
                src={currentImage}
                alt="Apartment"
                className="max-w-full h-auto max-h-[80vh] object-contain rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitDetails;
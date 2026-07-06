import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CalendarDays,
  Users,
  Key,
  Trash2,
  Edit,
  ChevronDown,
  ChevronUp,
  Loader2,
  User,
  ImageIcon,
  Home
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useChangeState } from "@/Hooks/useChangeState";
import { useGet } from "@/Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import DeleteDialog from "@/components/DeleteDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  formatDateTime, 
  formatDateTimeForInput, 
  deleteRent, 
  deleteCode,
  groupRentsByOwner 
} from "@/utils/rentHelpers";

const Rent = () => {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [status, setStatus] = useState("all");

  const url = status === "all"
    ? `${apiUrl}/rents/all`
    : `${apiUrl}/rents/all?status=${status}`;

  const { data, loading, refetch } = useGet({
    url: url,
  });

  if (loading) {
    return <FullPageLoader />;
  }

  const allRenters = data?.rents?.data || [];

  const rentGroupsArray = groupRentsByOwner(allRenters);

  if (rentGroupsArray.length === 0) {
    return (
      <div className="!p-6">
        <Tabs defaultValue="all" onValueChange={setStatus} className="w-full !mb-6">
          <TabsList className="bg-slate-100 !p-1 rounded-xl w-full flex justify-between">
            {["all", "upcoming", "current", "past"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className={`flex-1 !px-6 !py-2.5 rounded-lg text-sm font-medium transition-all duration-300 capitalize
                  data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm
                  hover:text-primary/80`}
              >
                {t(tab)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Card className="text-center !py-12 border border-slate-100 shadow-sm rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center !p-6 text-muted-foreground">
            <Users className="h-12 w-12 text-slate-300 !mb-3" />
            <h3 className="text-lg font-bold text-slate-700">{t("No Renters Found")}</h3>
            <p className="text-sm font-medium text-slate-400 !mt-1">
              {t("Norentersfoundforthisunit")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="!p-6">
      <Tabs defaultValue="all" onValueChange={setStatus} className="w-full !mb-6">
        <TabsList className="bg-slate-100 !p-1 rounded-xl w-full flex justify-between">
          {["all", "upcoming", "current", "past"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={`flex-1 !px-6 !py-2.5 rounded-lg text-sm font-medium transition-all duration-300 capitalize
                data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm
                hover:text-primary/80`}
            >
              {t(tab)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="grid grid-cols-1 gap-6">
        {rentGroupsArray.map((group) => (
          <RentGroupCard
            key={group.key}
            group={group}
            apiUrl={apiUrl}
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
};

const RentGroupCard = ({ group, apiUrl, refetch }) => {
  const activeRenters = group.codes.filter((code) => code.user !== null && code.user_id !== null);
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth?.token || localStorage.getItem("token"));
  const [showDetails, setShowDetails] = useState(false);
  const [isDeletingRent, setIsDeletingRent] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const handleDeleteRent = async () => {
    setIsDeletingRent(true);
    const primaryCode = group.codes[0];
    
    if (primaryCode) {
      const success = await deleteRent(apiUrl, token, primaryCode.id, t);
      if (success) {
        refetch();
      }
    }
    
    setIsDeletingRent(false);
    setIsDeleteDialogOpen(false);
  };

  const rentImage = group.codes[0]?.image_id_link;
  const hasValidImage = rentImage;

  return (
    <Card className="overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md border border-gray-200 rounded-xl">
      <div className="!p-4 sm:!p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarImage src={group.owner?.image || group.owner?.owner_image || "/default-avatar.png"} />
            <AvatarFallback>
              <User className="h-6 w-6 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-lg font-bold text-gray-900">
              {group.owner?.name || group.owner?.owner_name || t("UnknownOwner")}
            </h4>
            <div className="flex items-center gap-2 text-sm text-gray-500 !mt-1">
              <CalendarDays className="h-4 w-4" />
              <span>
                {formatDateTime(group.from)} - {formatDateTime(group.to)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 !mt-1">
              <Users className="h-4 w-4" />
              <span>{group.people} {t("People")}</span>
            </div>
            {group.unit && (
              <div className="flex items-center gap-2 text-sm text-gray-500 !mt-1">
                <Home className="h-4 w-4" />
                <span>{t("Unit")}: {group.unit?.unit || t("N/A")}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-3 w-full sm:w-auto">
          {hasValidImage && (
            <Button
              variant="outline"
              className="flex-1 sm:flex-none !py-2 !px-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
              onClick={() => {
                setCurrentImage(rentImage);
                setIsImageModalOpen(true);
              }}
            >
              <ImageIcon className="h-4 w-4" />
              {t("View Id")}
            </Button>
          )}

          <Button
            variant="outline"
            className="flex-1 sm:flex-none !py-2 !px-4 flex items-center gap-2"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showDetails ? t("Hide Details") : t("Show Details")}
            <span className="bg-primary/10 text-primary !px-2 !py-0.5 rounded-full text-xs font-bold !ml-1">
              {activeRenters.length} / {group.codes.length}
            </span>
          </Button>
        </div>
      </div>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteRent}
        name={group.owner?.name || group.owner?.owner_name || t("UnknownOwner")}
        isDeleting={isDeletingRent}
      />

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="!p-4 !pb-0">
            <DialogTitle>{t("Rent id Image")}</DialogTitle>
          </DialogHeader>
          {currentImage && (
            <div className="flex justify-center items-center !p-4 bg-slate-50/50">
              <img
                src={currentImage}
                alt="id"
                className="max-w-full h-auto max-h-[75vh] object-contain rounded-md shadow-sm border border-slate-200"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 border-t border-gray-100 !p-4 sm:!p-6 space-y-4">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-white !p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {t("Access Codes")} ({group.codes.length})
                    </h5>
                    <span className="text-lg font-black text-gray-800 tracking-tight">
                      {group.codes[0]?.code}
                    </span>
                  </div>
                </div>
                <GroupPeopleEditor group={group} apiUrl={apiUrl} refetch={refetch} />
              </div>
              <div className="grid gap-3">
                {activeRenters.length > 0 ? (
                  activeRenters.map((code) => (
                    <RenterUserItem
                      key={code.id}
                      code={code}
                      apiUrl={apiUrl}
                      refetch={refetch}
                      token={token}
                    />
                  ))
                ) : (
                  <div className="text-center !py-6 text-sm font-medium text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    {t("No users have claimed this code yet")}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

const GroupPeopleEditor = ({ group, apiUrl, refetch }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth?.token || localStorage.getItem("token"));

  const [people, setPeople] = useState(group.codes[0]?.people || 1);
  const [fromDate, setFromDate] = useState(formatDateTimeForInput(group.from));
  const [toDate, setToDate] = useState(formatDateTimeForInput(group.to));

  const [isDeletingCode, setIsDeletingCode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { changeState, loadingChange } = useChangeState();

  const hasChanges =
    Number(people) !== Number(group.codes[0]?.people) ||
    fromDate !== formatDateTimeForInput(group.from) ||
    toDate !== formatDateTimeForInput(group.to);

  const handleUpdate = async () => {
    const primaryCode = group.codes[0];
    if (!primaryCode) return;

    const formattedFrom = fromDate.replace('T', ' ') + ':00';
    const formattedTo = toDate.replace('T', ' ') + ':00';

    const res = await changeState(
      `${apiUrl}/appartment/update_code/${primaryCode.id}`,
      t("Code Updated Successfully"),
      {
        people: parseInt(people),
        from: formattedFrom, 
        to: formattedTo      
      }
    );

    if (res) {
      refetch();
    }
  };

  const handleDeleteCode = async () => {
    const primaryCode = group.codes[0];
    if (!primaryCode) return;

    setIsDeletingCode(true);
    const success = await deleteCode(
      apiUrl, 
      token, 
      primaryCode.code, 
      primaryCode.user_id || primaryCode.user?.id,
      t
    );
    
    if (success) {
      refetch();
    }
    
    setIsDeletingCode(false);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
      <div className="flex items-center gap-2 bg-gray-50 !px-2 !py-1 rounded-md border border-gray-100">
        <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
          {t("People")}
        </label>
        <Input
          type="number"
          min={1}
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          className="w-14 h-8 text-center font-bold border-none bg-white shadow-inner rounded-sm"
        />
      </div>
      <div className="flex items-center gap-2 bg-gray-50 !px-2 !py-1 rounded-md border border-gray-100">
        <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
          {t("From")}
        </label>
        <Input
          type="datetime-local" 
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="h-8 text-xs font-medium border-none bg-white shadow-inner rounded-sm w-40 md:w-48"
        />
      </div>

      <div className="flex items-center gap-2 bg-gray-50 !px-2 !py-1 rounded-md border border-gray-100">
        <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
          {t("To")}
        </label>
        <Input
          type="datetime-local" 
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="h-8 text-xs font-medium border-none bg-white shadow-inner rounded-sm w-40 md:w-48"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleUpdate}
          disabled={!hasChanges || loadingChange || isDeletingCode}
          size="sm"
          className={`h-8 font-semibold rounded-md transition-all ${hasChanges
            ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-200"
            : "bg-gray-100 text-gray-400 cursor-not-allowed !py-3 !px-4"
            }`}
        >
          {loadingChange ? <Loader2 className="h-3 w-3 animate-spin" /> : <Edit className="h-3 w-3 mr-1" />}
          {t("Edit")}
        </Button>

        <Button
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={loadingChange || isDeletingCode}
          size="sm"
          variant="destructive"
          className="h-8 !py-3 !px-4 font-semibold rounded-md transition-all bg-red-500 hover:bg-red-600 text-white"
        >
          {isDeletingCode ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3 !mr-1" />}
          {t("Delete")}
        </Button>
      </div>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteCode}
        name={group.codes[0]?.code || t("Code")}
        isDeleting={isDeletingCode}
      />
    </div>
  );
};

const RenterUserItem = ({ code, apiUrl, refetch, token }) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteRent(apiUrl, token, code.id, t);
    
    if (success) {
      refetch();
    }
    
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
  };

  const user = code.user;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white !p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10 ring-1 ring-primary/20">
          <AvatarImage src={user?.image || user?.image_link || "/default-avatar.png"} />
          <AvatarFallback>
            <User className="h-4 w-4 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-bold text-gray-800">
            {user?.name || t("User")}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500 !mt-1">
            {user?.email && <span className="font-medium text-gray-600">{user.email}</span>}
            {user?.phone && <span className="font-mono text-gray-500">{user.phone}</span>}
          </div>
        </div>
      </div>

      <Button
        onClick={() => setIsDeleteDialogOpen(true)}
        disabled={isDeleting}
        size="sm"
        variant="ghost"
        className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md !px-3 font-semibold"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-1.5" />}
        {t("Delete Renter")}
      </Button>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
        name={user?.name || t("User")}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Rent;

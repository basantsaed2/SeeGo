import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Users, Key, Trash2, Edit, ChevronDown, ChevronUp, Loader2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useChangeState } from "@/Hooks/useChangeState";
import { useGet } from "@/Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
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

const UnitRenters = ({ appartmentId, apiUrl }) => {
  const { t } = useTranslation();

  const { data, loading, refetch } = useGet({
    url: `${apiUrl}/rents`,
  });

  if (loading) {
    return <FullPageLoader />;
  }

  const allRenters = data?.rents || [];

  // Filter renters to only show those for the current apartment
  const renters = allRenters.filter(
    (renter) => String(renter.appartment_id) === String(appartmentId)
  );

  // Group renters by owner_id, from, and to
  const rentGroups = renters.reduce((acc, renter) => {
    const key = `${renter.owner_id}_${renter.from}_${renter.to}`;
    if (!acc[key]) {
      acc[key] = {
        key,
        owner: renter.owner || renter.user,
        from: renter.from,
        to: renter.to,
        people: renter.people,
        codes: [],
      };
    }
    acc[key].codes.push(renter);
    return acc;
  }, {});

  const rentGroupsArray = Object.values(rentGroups);

  if (rentGroupsArray.length === 0) {
    return (
      <Card className="text-center !py-12 border border-slate-100 shadow-sm rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center !p-6 text-muted-foreground">
          <Users className="h-12 w-12 text-slate-300 !mb-3" />
          <h3 className="text-lg font-bold text-slate-700">{t("No Renters Found")}</h3>
          <p className="text-sm font-medium text-slate-400 !mt-1">
            {t("Norentersfoundforthisunit")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
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
  );
};

const RentGroupCard = ({ group, apiUrl, refetch }) => {
  const { t } = useTranslation();
  const token = useSelector((state) => state.auth?.token || localStorage.getItem("token"));
  const [showDetails, setShowDetails] = useState(false);
  const [isDeletingRent, setIsDeletingRent] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteRent = async () => {
    try {
      setIsDeletingRent(true);
      // Delete all codes sequentially
      for (const code of group.codes) {
        await axios.post(
          `${apiUrl}/rents/delete_user`,
          {
            user_id: code.user_id || code.user?.id,
            code: code.code
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      toast.success(t("Rent deleted successfully"));
      refetch();
    } catch (error) {
      console.error("Error deleting rent:", error);
      toast.error(error.response?.data?.message || t("Failed to delete rent"));
    } finally {
      setIsDeletingRent(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Card className="overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md border border-gray-200 rounded-xl">
      <div className="!p-4 sm:!p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Owner Info & Date */}
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
                {formatDate(group.from)} - {formatDate(group.to)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 !mt-1">
              <Users className="h-4 w-4" />
              <span>{group.people} {t("People")}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none !py-2 !px-4 flex items-center gap-2"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showDetails ? t("Hide Details") : t("Show Details")}
            <span className="bg-primary/10 text-primary !px-2 !py-0.5 rounded-full text-xs font-bold !ml-1">
              {group.codes.length}
            </span>
          </Button>

          <Button
            variant="destructive"
            className="flex-1 sm:flex-none !py-2 !px-4 flex items-center gap-2 bg-red-600 hover:bg-red-700"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeletingRent}
          >
            {isDeletingRent ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {t("Delete Rent")}
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

      {/* Codes Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 border-t border-gray-100 !p-4 sm:!p-6 space-y-4">

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white !p-4 rounded-lg border border-gray-200 shadow-sm">
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
                {group.codes.map((code) => (
                  <RenterUserItem
                    key={code.id}
                    code={code}
                    apiUrl={apiUrl}
                    refetch={refetch}
                    token={token}
                  />
                ))}
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
  const [people, setPeople] = useState(group.codes[0]?.people || 1);
  const { changeState, loadingChange } = useChangeState();

  const hasChanges = Number(people) !== Number(group.codes[0]?.people);

  const handleUpdate = async () => {
    let success = true;
    for (const code of group.codes) {
      const res = await changeState(
        `${apiUrl}/appartment/update_code/${code.id}`,
        t("Code Updated Successfully"),
        { people: parseInt(people) }
      );
      if (!res) success = false;
    }
    if (success) {
      refetch();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      <div className="flex items-center gap-2 bg-gray-50 !px-2 !py-1 rounded-md border border-gray-100">
        <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">
          {t("People")}
        </label>
        <Input
          type="number"
          min={1}
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          className="w-16 h-8 text-center font-bold border-none bg-white shadow-inner rounded-sm"
        />
      </div>

      <Button
        onClick={handleUpdate}
        disabled={!hasChanges || loadingChange}
        size="sm"
        className={`h-8 font-semibold rounded-md transition-all ${hasChanges
          ? "bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-200"
          : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
      >
        {loadingChange ? <Loader2 className="h-3 w-3 animate-spin" /> : <Edit className="h-3 w-3 mr-1" />}
        {t("Edit")}
      </Button>
    </div>
  );
};

const RenterUserItem = ({ code, apiUrl, refetch, token }) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.post(
        `${apiUrl}/rents/delete_code`,
        { 
          code: code.code,
          user_id: code.user_id || code.user?.id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(t("Renter deleted successfully"));
      refetch();
    } catch (error) {
      console.error("Error deleting renter:", error);
      toast.error(error.response?.data?.message || t("Failed to delete renter"));
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
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

export default UnitRenters;

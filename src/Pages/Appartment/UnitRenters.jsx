import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePost } from "@/Hooks/UsePost";
import FullPageLoader from "@/components/Loading";
import { Input } from "@/components/ui/input";
import { groupRentsByOwner } from "@/utils/rentHelpers";
import RentGroupCard from "@/components/Rent/RentGroupCard";

const UnitRenters = ({ appartmentId, apiUrl, onCountChange }) => {
  const { t } = useTranslation();
  const [rentData, setRentData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { postData, loadingPost, response } = usePost({
    url: `${apiUrl}/rents/unit_renters`,
    type: true
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchRents = () => {
    const body = {
      appartment_id: appartmentId,
      ...(debouncedSearch && { search: debouncedSearch })
    };
    postData(body);
  };

  useEffect(() => {
    fetchRents();
  }, [appartmentId, debouncedSearch]);

  useEffect(() => {
    if (response?.data) {
      setRentData(response.data);
      // إرسال العدد للـ parent
      if (onCountChange && response.data.rents_count !== undefined) {
        onCountChange(response.data.rents_count);
      }
    }
  }, [response, onCountChange]);

  if (loadingPost && !rentData) {
    return <FullPageLoader />;
  }

  const allRenters = rentData?.rents || [];
  const rentGroupsArray = groupRentsByOwner(allRenters);

  if (rentGroupsArray.length === 0) {
    return (
      <>
        <div className="relative !mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("Search by name, phone, email...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="!pl-10 h-11 bg-white border-slate-200 focus:border-primary"
          />
        </div>
        <Card className="text-center !py-12 border border-slate-100 shadow-sm rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center !p-6 text-muted-foreground">
            <Users className="h-12 w-12 text-slate-300 !mb-3" />
            <h3 className="text-lg font-bold text-slate-700">{t("No Renters Found")}</h3>
            <p className="text-sm font-medium text-slate-400 !mt-1">
              {searchQuery ? t("No results found for your search") : t("Norentersfoundforthisunit")}
            </p>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <div className="relative !mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("Search by name, phone, email...")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="!pl-10 h-11 bg-white border-slate-200 focus:border-primary"
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        {rentGroupsArray.map((group) => (
          <RentGroupCard
            key={group.key}
            group={group}
            apiUrl={apiUrl}
            refetch={fetchRents}
            showUnit={false}
          />
        ))}
      </div>
    </>
  );
};

export default UnitRenters;

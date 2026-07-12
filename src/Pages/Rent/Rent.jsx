import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGet } from "@/Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { groupRentsByOwner } from "@/utils/rentHelpers";
import RentGroupCard from "@/components/Rent/RentGroupCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const Rent = () => {
  const { t } = useTranslation();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 1. جلب أعداد الإيجارات لكل تاب باستخدام الـ API المطلوب
  const { data: countsData } = useGet({
    url: "https://bcknd.sea-go.org/village/rents/renters_numbers",
  });

  // Build URL with search parameter
  const buildUrl = () => {
    let url = `${apiUrl}/rents/all?page=${currentPage}`;
    if (status !== "all") {
      url += `&status=${status}`;
    }
    if (debouncedSearch) {
      url += `&search=${encodeURIComponent(debouncedSearch)}`;
    }
    return url;
  };

  const { data, loading, refetch } = useGet({
    url: buildUrl(),
  });

  if (loading) {
    return <FullPageLoader />;
  }

  const allRenters = data?.rents?.data || [];
  const paginationData = data?.rents || {};
  const rentGroupsArray = groupRentsByOwner(allRenters);

  // Handle tab change
  const handleTabChange = (newStatus) => {
    setStatus(newStatus);
    setCurrentPage(1); // Reset to page 1 when changing tabs
  };

  // دالة مساعدة لجلب رقم الـ Tab بناءً على اسمه من الـ API response
  const getTabCount = (tabName) => {
    if (!countsData) return 0;
    switch (tabName) {
      case "all":
        return countsData.all_rents || 0;
      case "upcoming":
        return countsData.upcoming_rents || 0;
      case "current":
        return countsData.current_rents || 0;
      case "past":
        return countsData.past_rents || 0;
      default:
        return 0;
    }
  };

  // Generate pagination page numbers
  const generatePaginationPages = () => {
    const pages = [];
    const totalPages = paginationData.last_page || 1;
    const currentPg = paginationData.current_page || 1;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPg <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPg >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPg - 1, currentPg, currentPg + 1, '...', totalPages);
      }
    }

    return pages;
  };

  // مكوّن الـ Tabs مفرول هنا عشان ما نكرروش في الحالتين (لو الداتا فاضية أو مليانة)
  const renderTabs = () => (
    <Tabs value={status} onValueChange={handleTabChange} className="w-full !mb-6">
      <TabsList className="bg-slate-100 !p-1 rounded-xl w-full flex justify-between gap-1">
        {["all", "upcoming", "current", "past"].map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className={`flex-1 !px-4 !py-2.5 rounded-lg text-sm font-medium transition-all duration-300 capitalize
              flex items-center justify-center gap-2
              data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm
              hover:text-primary/80`}
          >
            <span>{t(tab)}</span>
            {/* هنا بيظهر العدد بشكل Badge لطيف جوه الـ Tab */}
            <span className="bg-slate-200/60 data-[state=active]:bg-slate-100 text-slate-600 !px-2 !py-0.5 rounded-full text-xs font-semibold">
              {getTabCount(tab)}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );

  const renderSearchBar = () => (
    <div className="relative !mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={t("Search by name, phone, email, unit...")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="!pl-10 h-11 bg-white border-slate-200 focus:border-primary"
      />
    </div>
  );

  if (rentGroupsArray.length === 0) {
    return (
      <div className="!p-6">
        {renderTabs()}
        {renderSearchBar()}
        <Card className="text-center !py-12 border border-slate-100 shadow-sm rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center !p-6 text-muted-foreground">
            <Users className="h-12 w-12 text-slate-300 !mb-3" />
            <h3 className="text-lg font-bold text-slate-700">{t("No Renters Found")}</h3>
            <p className="text-sm font-medium text-slate-400 !mt-1">
              {searchQuery ? t("No results found for your search") : t("Norentersfoundforthisunit")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="!p-6">
      {renderTabs()}
      {renderSearchBar()}

      <div className="grid grid-cols-1 gap-6">
        {rentGroupsArray.map((group) => (
          <RentGroupCard
            key={group.key}
            group={group}
            apiUrl={apiUrl}
            refetch={refetch}
            showUnit={true}
            showStatus={status === "all"}
          />
        ))}
      </div>

      {/* Pagination */}
      {paginationData.last_page > 1 && (
        <Pagination className="!mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  if (paginationData.current_page > 1) {
                    setCurrentPage(paginationData.current_page - 1);
                  }
                }}
                className={
                  paginationData.current_page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {generatePaginationPages().map((page, index) => (
              <PaginationItem key={index}>
                {page === '...' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={paginationData.current_page === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (paginationData.current_page < paginationData.last_page) {
                    setCurrentPage(paginationData.current_page + 1);
                  }
                }}
                className={
                  paginationData.current_page === paginationData.last_page
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Rent;
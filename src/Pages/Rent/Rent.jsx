import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGet } from "@/Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const url = status === "all"
    ? `${apiUrl}/rents/all?page=${currentPage}`
    : `${apiUrl}/rents/all?status=${status}&page=${currentPage}`;

  const { data, loading, refetch } = useGet({
    url: url,
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

  if (rentGroupsArray.length === 0) {
    return (
      <div className="!p-6">
        <Tabs value={status} onValueChange={handleTabChange} className="w-full !mb-6">
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
      <Tabs value={status} onValueChange={handleTabChange} className="w-full !mb-6">
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

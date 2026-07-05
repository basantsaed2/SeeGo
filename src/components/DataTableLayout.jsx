import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash, Plus, Calendar, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, subDays } from 'date-fns';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DataTable({
  data = [],
  columns = [],
  addRoute,
  onEdit,
  onDelete,
  onToggleStatus,
  showAddButton = true,
  showActionColumns = true,
  detailsData,
  pageDetailsRoute,
  pageDetailsLabel,
  statusLabels = { active: "Active", inactive: "Inactive" },
  statusLabelsText = { active: "Active", inactive: "Inactive" },
  additionalLink,
  additionalLinkLabel,
  dateRangeFilter = false,
  showFilter = true,
  dateRangeKey = 'created_at',
  onDateRangeChange,
  filterOptions = [],
  // 🌟 الخصائص الجديدة لدعم Pagination الباك إند
  isBackendPagination = false,
  backendCurrentPage = 1,
  backendTotalPages = 1,
  onBackendPageChange,
  onSearchChange,
  initialSearchValue = "",
}) {
  if (!Array.isArray(filterOptions)) {
    filterOptions = [];
  }

  const [searchValue, setSearchValue] = useState(initialSearchValue);
  
  const [activeFilters, setActiveFilters] = useState(() => {
    const initialFilters = {};
    filterOptions.forEach((group) => {
      initialFilters[group.key] = "all";
    });
    return initialFilters;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // تحديد الصفحة الحالية والـ Total الفعلي بناءً على نوع الـ Pagination
  const currentPage = isBackendPagination ? backendCurrentPage : localCurrentPage;
  const totalPages = isBackendPagination ? backendTotalPages : Math.ceil(data.length / itemsPerPage);

  const effectivePageDetailsLabel = pageDetailsLabel === undefined ? t("ViewDetails") : pageDetailsLabel;

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [dateRange, setDateRange] = useState([
    {
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const getNestedValue = (obj, path) => {
    return path
      .split(".")
      .reduce((acc, part) => (acc ? acc[part] : undefined), obj);
  };

const filteredData = useMemo(() => {
    let result = data.filter((row) => {
      const matchesSearch = columns.some(col => {
        const cellValue = row[col.key];
        return (typeof cellValue === 'string' || typeof cellValue === 'number') &&
          String(cellValue).toLowerCase().includes(searchValue.toLowerCase());
      });

      // 💡 تخطي الفلترة المحلية للبحث إذا كان هناك Backend Pagination نشط
      const finalMatchesSearch = (searchValue === "" || isBackendPagination) ? true : matchesSearch;
      return finalMatchesSearch;
    });

    Object.entries(activeFilters).forEach(([filterKey, filterValue]) => {
      if (filterValue !== "all") {
        result = result.filter((row) => {
          const rowValue = getNestedValue(row, filterKey);
          const comparableRowValue =
            rowValue !== null && rowValue !== undefined
              ? String(rowValue).toLowerCase()
              : "";
          const comparableFilterValue = String(filterValue).toLowerCase();

          return comparableRowValue === comparableFilterValue;
        });
      }
    });

    if (dateRangeFilter) {
      result = result.filter((row) => {
        if (!row[dateRangeKey]) return false;

        try {
          const rowDate = new Date(row[dateRangeKey]);
          if (isNaN(rowDate.getTime())) return false;

          const startDate = dateRange[0].startDate;
          const endDate = new Date(dateRange[0].endDate);
          endDate.setHours(23, 59, 59, 999);

          return rowDate >= startDate && rowDate <= endDate;
        } catch (e) {
          console.error("Error parsing date for filter:", row[dateRangeKey], e);
          return false;
        }
      });
    }

    return result;
  }, [data, searchValue, activeFilters, dateRange, dateRangeFilter, dateRangeKey, columns]);

  const handleAccordionFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    handlePageChange(1);
  };

  useEffect(() => {
    if (dateRangeFilter && onDateRangeChange) {
      onDateRangeChange({
        startDate: dateRange[0].startDate,
        endDate: dateRange[0].endDate,
      });
    }
  }, [dateRange, dateRangeFilter, onDateRangeChange]);

  // إذا كان الترقيم من الباك إند، نعرض البيانات مباشرة كما جاءت دون عمل slice إضافي لها
  const paginatedData = useMemo(() => {
    if (isBackendPagination) {
      return filteredData;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage, isBackendPagination]);

  const handlePageChange = (page) => {
    if (isBackendPagination) {
      onBackendPageChange?.(page);
    } else {
      setLocalCurrentPage(page);
    }
  };

  const handleViewDetails = (row) => {
    const fullDetails = detailsData?.find((item) => item.id === row.id) || row;
    setSelectedRowData(fullDetails);
    setIsModalOpen(true);
  };

  const renderCellContent = (row, col) => {
    if (col.render) {
      return col.render(row);
    }
    if (col.key === "status") {
      const isActive = row.status === 1 || String(row.status).toLowerCase() === "active";
      return (
        <div className="flex items-center gap-1">
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => onToggleStatus?.(row, checked ? 1 : 0)}
            className={clsx(
              "h-5 w-9 rounded-full transition-colors focus:outline-none",
              isActive ? "bg-bg-primary" : "bg-gray-300"
            )}
          >
            <span
              className={clsx(
                "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
                isActive ? "translate-x-4" : "translate-x-1"
              )}
            />
          </Switch>
          <span className={clsx("text-xs !px-1 !py-0.5 rounded-full", isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800")}>
            {isActive ? statusLabels.active : statusLabels.inactive}
          </span>
        </div>
      );
    }
    if (col.key === "statusText") {
      const statusValue = String(row.status || "").toLowerCase();
      let bgColor = "bg-gray-100";
      let textColor = "text-gray-800";

      if (statusValue === "paid") {
        bgColor = "bg-green-100";
        textColor = "text-green-800";
      } else if (statusValue === "unpaid") {
        bgColor = "bg-red-100";
        textColor = "text-red-800";
      } else if (statusValue === "active") {
        bgColor = "bg-green-100";
        textColor = "text-green-800";
      } else if (statusValue === "inactive") {
        bgColor = "bg-red-100";
        textColor = "text-red-800";
      }

      const statusLabel = statusLabelsText[statusValue] || row.status || t("Unknown");

      return (
        <span className={`inline-flex items-center !px-3 !py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
          {statusLabel}
        </span>
      );
    }
    if (col.key === "rate") {
      const rate = Math.min(5, Math.max(0, parseFloat(row[col.key]) || 0));
      const fullStars = Math.floor(rate);
      const hasHalfStar = rate % 1 >= 0.5;

      return (
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) {
              return (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            } else if (i === fullStars && hasHalfStar) {
              return (
                <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <defs>
                    <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="#D1D5DB" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            } else {
              return (
                <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            }
          })}
          <span className="ml-1 text-sm font-medium text-gray-700">{rate.toFixed(1)}</span>
        </div>
      );
    }
    if (col.key === "map") {
      const url = row[col.key];
      if (!url) return <span className="text-gray-400 italic">{t("-")}</span>;
      const displayText = url.length > 20 ? `${url.substring(0, 10)}...${url.substring(url.length - 10)}` : url;
      return (
        <div className="w-[120px] truncate relative group">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">
            {displayText}
          </a>
          {url.length > 20 && (
            <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs !p-2 rounded whitespace-pre-wrap max-w-xs break-words">
              {url}
            </div>
          )}
        </div>
      );
    }
    return row[col.key] === null || row[col.key] === undefined ? <span className="text-gray-400 italic">{t("-")}</span> : row[col.key];
  };

  const renderNestedObject = (obj, prefix = "", depth = 0) => {
    if (!obj || typeof obj !== "object") return null;

    return Object.entries(obj).map(([key, value]) => {
      if (key === "id" || key === "createdAt" || key === "updatedAt" || key === "created_at" || key === "updated_at") return null;

      const isObject = value && typeof value === "object" && !Array.isArray(value);
      const isArray = Array.isArray(value);
      const isEmptyObject = isObject && Object.keys(value).length === 0;
      const isEmptyArray = isArray && value.length === 0;

      const displayKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

      if (isObject && !isEmptyObject) {
        return (
          <div key={`${prefix}${key}`} className={`mt-2 ${depth > 0 ? "ml-1" : ""}`}>
            <span className="font-semibold text-gray-700 capitalize">{displayKey}:</span>
            <div className={`pl-4 ${depth === 0 ? "border-l-2 border-gray-200" : "border-l border-gray-100"}`}>
              {renderNestedObject(value, `${prefix}${key}.`, depth + 1)}
            </div>
          </div>
        );
      }

      if (isArray && !isEmptyArray) {
        return (
          <div key={`${prefix}${key}`} className={`grid grid-cols-2 gap-4 !py-1 ${depth > 0 ? "pl-2" : ""}`}>
            <span className="font-medium text-gray-600 break-words">{displayKey}</span>
            <div className="break-words">
              {value.map((item, i) => (
                <div key={i} className="mb-1 last:mb-0">
                  {typeof item === 'object'
                    ? renderNestedObject(item, `${prefix}${key}[${i}].`, depth + 2)
                    : item?.toString() || <span className="text-gray-400 italic">{t("-")}</span>
                  }
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (!isObject && !isArray) {
        return (
          <div key={`${prefix}${key}`} className={`grid grid-cols-2 gap-4 !py-1 ${depth > 0 ? "pl-2" : ""}`}>
            <span className="font-medium text-gray-600 break-words">{displayKey}</span>
            <span className="break-words">{value?.toString() || <span className="text-gray-400 italic">{t("-")}</span>}</span>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <>
      <div className="w-full !p-3 !space-y-6">
        <div className="flex justify-between !mb-6 items-center flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
<Input
              placeholder={t("Search...")}
              className="w-full md:!ms-3 sm:!ms-0 !p-2 sm:w-1/3 max-w-sm border-bg-primary focus:border-bg-primary focus:ring-bg-primary rounded-[10px]"
              value={searchValue}
              onChange={(e) => {
                const val = e.target.value;
                setSearchValue(val);
                if (onSearchChange) onSearchChange(val); // 💡 إرسال القيمة للمكون الأب فوراً
              }}
            />
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {t("Total")}: <span className="font-semibold text-bg-primary">{filteredData.length}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {dateRangeFilter && showFilter && (
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger className="border-bg-primary" asChild>
                  <Button variant="outline" className="flex items-center gap-2 !p-4">
                    <Calendar className="h-4 w-4" />
                    {`${format(dateRange[0].startDate, "MMM dd, yyyy")} - ${format(dateRange[0].endDate, "MMM dd, yyyy")}`}
                    {dateRange[0].startDate.toDateString() !== subDays(new Date(), 7).toDateString() ||
                      dateRange[0].endDate.toDateString() !== new Date().toDateString() ? (
                      <XCircle
                        className="ml-2 h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateRange([{ startDate: subDays(new Date(), 7), endDate: new Date(), key: 'selection' }]);
                          setShowDatePicker(false);
                        }}
                      />
                    ) : null}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    className="border-0"
                  />
                  <div className="flex justify-end p-2 border-t">
                    <Button size="sm" onClick={() => setShowDatePicker(false)}>{t("Apply")}</Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {Array.isArray(filterOptions) && filterOptions.length > 0 && showFilter && (
              <div className="flex gap-3 flex-wrap">
                {filterOptions.map((group) => (
                  <div key={group.key} className="w-[150px]">
                    <Select value={activeFilters[group.key]} onValueChange={(val) => handleAccordionFilterChange(group.key, val)}>
                      <SelectTrigger className="text-bg-primary w-full !p-4 border border-bg-primary focus:outline-none focus:ring-2 focus:ring-bg-primary rounded-[10px]">
                        <SelectValue placeholder={group.label} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border !p-3 border-bg-primary rounded-[10px] text-bg-primary">
                        {group.options.map((option) => (
                          <SelectItem key={option.value} className="text-bg-primary" value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {showAddButton && (
              <Button onClick={() => navigate(addRoute)} className="bg-bg-primary cursor-pointer text-white hover:bg-teal-700 rounded-[10px] !p-3">
                <Plus className="w-5 h-5 !mr-2" />
                {t("Add")}
              </Button>
            )}
            {additionalLink && (
              <Button onClick={() => navigate(additionalLink)} className="bg-bg-primary cursor-pointer text-white hover:bg-teal-700 rounded-[10px] !p-3">
                {additionalLinkLabel}
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto w-full mx-auto">
          <Table className="!min-w-[600px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="text-bg-primary font-semibold w-[50px]">#</TableHead>
                {columns.map((col, index) => (
                  <TableHead key={index} className={`text-bg-primary font-semibold ${col.width || "w-auto"}`}>
                    {col.label}
                  </TableHead>
                ))}
                {(detailsData || pageDetailsRoute) && <TableHead className="text-bg-primary font-semibold w-auto">{t("Details")}</TableHead>}
                {showActionColumns && <TableHead className="text-bg-primary font-semibold w-[100px]">{t("Actions")}</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-sm !py-3 !px-1 w-[50px] text-gray-500 font-medium">
                      {isBackendPagination ? (index + 1) : ((currentPage - 1) * itemsPerPage + index + 1)}
                    </TableCell>
                    {columns.map((col, idx) => (
                      <TableCell key={idx} className={`text-sm !py-3 !px-1 whitespace-normal break-words ${col.width || "w-auto"} truncate`}>
                        {renderCellContent(row, col)}
                      </TableCell>
                    ))}
                    {detailsData && (
                      <TableCell className="text-sm !py-3 !px-1 w-[100px]">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(row)} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {t("ViewDetails")}
                        </Button>
                      </TableCell>
                    )}
                    {pageDetailsRoute && (
                      <TableCell className="text-sm !py-3 !px-1 w-[100px]">
                        <Link to={`details/${row.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">
                          {effectivePageDetailsLabel}
                        </Link>
                      </TableCell>
                    )}
                    {showActionColumns && (
                      <TableCell className="w-[100px]">
                        <div className="flex gap-2">
                          {onEdit && (
                            <Button variant="ghost" size="sm" onClick={() => onEdit?.(row)}>
                              <Edit className="w-4 h-4 text-bg-primary" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button variant="ghost" size="sm" onClick={() => onDelete?.(row)}>
                              <Trash className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1 + (detailsData ? 1 : 0) + (pageDetailsRoute ? 1 : 0) + (showActionColumns ? 1 : 0)}
                    className="text-center text-gray-500 !py-4"
                  >
                    {t("Nodatafound")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[650px] !p-6 max-h-[85vh] overflow-y-auto rounded-lg shadow-xl" style={{ backgroundColor: "white", border: "none", padding: "0" }}>
            <DialogHeader>
              <DialogTitle>{t("Details")}</DialogTitle>
            </DialogHeader>
            {selectedRowData && <div className="grid grid-cols-1 md:grid-cols-2 gap-4 !py-4">{renderNestedObject(selectedRowData)}</div>}
          </DialogContent>
        </Dialog>

        {/* 🌟 تعديل الشرط ليعمل ديناميكياً مع الباك إند */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 w-full overflow-x-auto pb-2">
            <Pagination>
              <PaginationContent className="flex flex-wrap items-center gap-1 sm:gap-2 justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={clsx(
                      "border border-gray-300 rounded-xl !px-3 !py-1.5 transition-all text-xs font-semibold cursor-pointer select-none",
                      currentPage === 1 ? "pointer-events-none opacity-40 bg-gray-100 text-gray-400" : "text-bg-primary hover:bg-gray-100"
                    )}
                  />
                </PaginationItem>

                {(() => {
                  const pageNumbers = [];
                  const maxVisiblePages = 5;

                  if (totalPages <= maxVisiblePages) {
                    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
                  } else {
                    if (currentPage <= 3) {
                      pageNumbers.push(1, 2, 3, 4, "ellipsis", totalPages);
                    } else if (currentPage >= totalPages - 2) {
                      pageNumbers.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                    } else {
                      pageNumbers.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
                    }
                  }

                  return pageNumbers.map((page, index) => {
                    if (page === "ellipsis") {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis className="text-gray-400 px-1" />
                        </PaginationItem>
                      );
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className={clsx(
                            "border transition-all !px-3 !py-1.5 rounded-xl text-xs font-bold min-w-[36px] h-9 flex items-center justify-center cursor-pointer select-none",
                            currentPage === page
                              ? "bg-bg-primary text-white border-bg-primary shadow-sm hover:bg-bg-primary/90"
                              : "border-gray-300 text-slate-600 hover:bg-slate-100"
                          )}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  });
                })()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={clsx(
                      "border border-gray-300 rounded-xl !px-3 !py-1.5 transition-all text-xs font-semibold cursor-pointer select-none",
                      currentPage === totalPages ? "pointer-events-none opacity-40 bg-gray-100 text-gray-400" : "text-bg-primary hover:bg-gray-100"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
}
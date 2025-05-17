// import { useState, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Edit, Trash, Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Switch } from "@/components/ui/switch";
// import clsx from "clsx";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination"




// export default function DataTable({
//   data,
//   columns,
//   addRoute,
//   onEdit,
//   onDelete,
//   onToggleStatus,
//   showAddButton = true, // default to true
// }) {
//   const [searchValue, setSearchValue] = useState("");
//   const [filterValue, setFilterValue] = useState("");
//   const navigate = useNavigate();

//   // Memoized filtered data
//   const filteredData = useMemo(() => {
//     return data.filter((row) => {
//       const matchesSearch = row.name
//         ?.toLowerCase()
//         .includes(searchValue.toLowerCase());
//       const matchesFilter =
//         !filterValue || row.status?.toLowerCase() === filterValue.toLowerCase();
//       return matchesSearch && matchesFilter;
//     });
//   }, [data, searchValue, filterValue]);


//     // Render cell content based on column type
// const renderCellContent = (row, col) => {
//   if (col.key === "statusText") {
//     const isActive = row.status?.toLowerCase() === "active";
//     return (
//       <span className={`inline-flex items-center !px-3 !py-1 rounded-full text-xs font-medium ${
//         isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//       }`}>
//         {row[col.key]}
//       </span>
//     );
//   }

//   if (col.key === "rate") {
//     const rate = Math.min(5, Math.max(0, parseFloat(row[col.key]) || 0));
//     const fullStars = Math.floor(rate);
//     const hasHalfStar = rate % 1 >= 0.5;

//     return (
//       <div className="flex items-center">
//         {[...Array(5)].map((_, i) => {
//           if (i < fullStars) {
//             return (
//               <svg
//                 key={i}
//                 className="w-4 h-4 text-yellow-400"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//             );
//           } else if (i === fullStars && hasHalfStar) {
//             return (
//               <svg
//                 key={i}
//                 className="w-4 h-4 text-yellow-400"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <defs>
//                   <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
//                     <stop offset="50%" stopColor="currentColor" />
//                     <stop offset="50%" stopColor="#D1D5DB" />
//                   </linearGradient>
//                 </defs>
//                 <path
//                   fill="url(#half-star)"
//                   d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
//                 />
//               </svg>
//             );
//           } else {
//             return (
//               <svg
//                 key={i}
//                 className="w-4 h-4 text-gray-300"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//               </svg>
//             );
//           }
//         })}
//         <span className="ml-1 text-sm font-medium text-gray-700">
//           {rate.toFixed(1)}
//         </span>
//       </div>
//     );
//   }
//   if (col.key === "map") {
//     return (
//       <a 
//         href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row[col.key])}`}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-600 hover:text-blue-800 hover:underline"
//       >
//         {row[col.key]}
//       </a>
//     );
//   }

//   return row[col.key];
// };
//   return (
//     <div className="w-full !p-3 space-y-6">
//       <div className="flex justify-between !mb-6 items-center flex-wrap gap-4">
//         <Input
//           placeholder="Search..."
//           className="w-full md:!ms-3 sm:!ms-0 !ps-3  sm:w-1/3 max-w-sm border-bg-primary focus:border-bg-primary focus:ring-bg-primary rounded-[10px]"
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//         />
//         <div className="flex items-center gap-3 flex-wrap">
//           <Select value={filterValue} onValueChange={setFilterValue}>
//             <SelectTrigger className="w-[120px] border-bg-primary focus:ring-bg-primary rounded-[10px] !px-2">
//               <SelectValue placeholder="Filter by" />
//             </SelectTrigger>
//             <SelectContent className="bg-white border-bg-primary rounded-md shadow-lg !p-3">
//               <SelectItem value="active">Active</SelectItem>
//               <SelectItem value="inactive">Inactive</SelectItem>
//             </SelectContent>
//           </Select>
//           {showAddButton && (
//             <Button
//               onClick={() => navigate(addRoute)}
//               className="bg-bg-primary cursor-pointer text-white hover:bg-teal-700 rounded-[10px] !p-3"
//             >
//               <Plus className="w-5 h-5 !mr-2" />
//               Add
//             </Button>
//           )}
//         </div>
//       </div>

//       {/* Table */}
//       <div className=" max-h-[calc(100vh-300px)] ">
//         <Table className="!min-w-[600px] ">
//           <TableHeader>
//             <TableRow>
//               {columns.map((col, index) => (
//                 <TableHead
//                   key={index}
//                   className="text-bg-primary font-semibold"
//                 >
//                   {col.label}
//                 </TableHead>
//               ))}
//               <TableHead className="text-bg-primary font-semibold">
//                 Action
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody >
//             {filteredData.length > 0 ? (
//               filteredData.map((row, index) => (
//                 <TableRow key={index}>
//                   {columns.map((col, idx) => (
//                     <TableCell
//                       key={idx}
//                       className="text-sm !py-3 !px-1 whitespace-normal break-words"
//                     >
//                       {col.key === "status" ? (
//                         <Switch
//                           checked={row.status?.toLowerCase() === "active"}
//                           onCheckedChange={(checked) =>
//                             onToggleStatus?.(row, checked ? 1 : 0)
//                           }
//                           className={clsx(
//                             "relative inline-flex h-6 w-11 rounded-full transition-colors focus:outline-none",
//                             row.status?.toLowerCase() === "active"
//                               ? "bg-bg-primary"
//                               : "bg-gray-300"
//                           )}
//                         >
//                           <span
//                             className={clsx(
//                               "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200",
//                               row.status?.toLowerCase() === "active"
//                                 ? "translate-x-5"
//                                 : "translate-x-1"
//                             )}
//                           />
//                         </Switch>
//                       ) : (
//                         renderCellContent(row, col)
//                       )}
//                     </TableCell>
//                   ))}

//                   <TableCell className="">
//                     <div className="flex gap-2">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           console.log("Edit clicked for row:", row);
//                           onEdit?.(row)
//                         }}
//                       >
//                         <Edit className="w-4 h-4 text-bg-primary" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => onDelete?.(row)}
//                       >
//                         <Trash className="w-4 h-4 text-red-600" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length + 1}
//                   className="text-center text-gray-500 py-4"
//                 >
//                   No data found
//                 </TableCell>
//               </TableRow>
//             )}


//           </TableBody>


//         </Table>
//         <div className="w-full !mb-10 max-w-[1200px] mx-auto">
//           <Pagination className="!mb-2 flex justify-center items-center m-auto">
//             <PaginationContent className="text-bg-primary font-semibold flex gap-2">
//               <PaginationItem>
//                 <PaginationPrevious href="#" className="text-bg-primary" />
//               </PaginationItem>

//               <PaginationItem>
//                 <PaginationLink
//                   className="border border-gray-400 hover:bg-gray-200 transition-all   px-3 py-1 rounded-lg text-bg-primary"
//                   href="#"
//                 >
//                   1
//                 </PaginationLink>
//               </PaginationItem>

//               <PaginationItem>
//                 <PaginationEllipsis className="text-bg-primary" />
//               </PaginationItem>

//               <PaginationItem>
//                 <PaginationNext href="#" className="text-bg-primary" />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useMemo } from "react";
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
import { Edit, Trash, Plus, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
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

export default function DataTable({
  data,
  columns,
  addRoute,
  onEdit,
  onDelete,
  onToggleStatus,
  showAddButton = true,
  showActionColumns = true,
  detailsData, // New prop for details data
  pageDetailsRoute,
  statusLabels = { active: "Active", inactive: "Inactive" } // Default values
}) {
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const navigate = useNavigate();

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const matchesSearch = row.name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase());
      const matchesFilter =
        !filterValue || row.status?.toLowerCase() === filterValue.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [data, searchValue, filterValue]);

  const handleViewDetails = (row) => {
    // If detailsData prop exists, use it to find the full details
    const fullDetails = detailsData?.find(item => item.id === row.id) || row;
    setSelectedRowData(fullDetails);
    setIsModalOpen(true);
  };

  // Render cell content based on column type
  const renderCellContent = (row, col) => {
    if (col.render) {
      return col.render(row);
    }
    if (col.key === "status") {
      const isActive = row.status?.toLowerCase() === "active";
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={isActive}
            onCheckedChange={(checked) =>
              onToggleStatus?.(row, checked ? 1 : 0)
            }
            className={clsx(
              "relative inline-flex h-6 w-11 rounded-full transition-colors focus:outline-none",
              isActive ? "bg-bg-primary" : "bg-gray-300"
            )}
          >
            <span
              className={clsx(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200",
                isActive ? "translate-x-5" : "translate-x-1"
              )}
            />
          </Switch>
          <span className={clsx(
            "text-sm !px-2 !py-1 rounded-full",
            isActive
              ? "bg-green-100 text-green-800"  // Active state styles
              : "bg-gray-100 text-gray-800"    // Inactive state styles
          )}>
            {isActive ? statusLabels.active : statusLabels.inactive}
          </span>
        </div>
      );
    }
    if (col.key === "statusText") {
      const isActive = row.status?.toLowerCase() === "active";
      return (
        <span className={`inline-flex items-center !px-3 !py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {row[col.key]}
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
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            } else if (i === fullStars && hasHalfStar) {
              return (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <defs>
                    <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                      <stop offset="50%" stopColor="currentColor" />
                      <stop offset="50%" stopColor="#D1D5DB" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#half-star)"
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              );
            } else {
              return (
                <svg
                  key={i}
                  className="w-4 h-4 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            }
          })}
          <span className="ml-1 text-sm font-medium text-gray-700">
            {rate.toFixed(1)}
          </span>
        </div>
      );
    }
    if (col.key === "map") {
      const url = row[col.key];
      const displayText = url.length > 30
        ? `${url.substring(0, 15)}...${url.substring(url.length - 15)}`
        : url;

      return (
        <div className="group relative inline-block">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {displayText}
          </a>
          {url.length > 30 && (
            <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs !p-2 rounded whitespace-pre-wrap max-w-xs break-words">
              {url}
            </div>
          )}
        </div>
      );
    }

    return row[col.key];
  };

  // Enhanced function to render nested objects in the modal
  const renderNestedObject = (obj, prefix = "", depth = 0) => {
    if (!obj || typeof obj !== "object") return null;

    return Object.entries(obj).map(([key, value]) => {
      const isObject = value && typeof value === "object";
      const isArray = Array.isArray(value);
      const isEmpty = isObject && Object.keys(value).length === 0;
      const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

      // Handle empty objects/arrays
      // if (isEmpty) {
      //   return (
      //     <div key={`${prefix}${key}`} className="mt-2">
      //       <span className="font-medium text-gray-600 capitalize">{displayKey}</span>
      //       <span className="ml-2 text-gray-400 italic">Empty {isArray ? 'array' : 'object'}</span>
      //     </div>
      //   );
      // }

      // Handle nested objects
      if (isObject) {
        return (
          <div key={`${prefix}${key}`} className={`mt-2 ${depth > 0 ? 'ml-1' : ''}`}>
            <div className={`pl-4 ${depth === 0 ? 'border-l-2 border-gray-200' : 'border-l border-gray-100'}`}>
              {renderNestedObject(value, `${prefix}${key}.`, depth + 1)}
            </div>
          </div>
        );
      }

      // Handle primitive values
      return (
        <div key={`${prefix}${key}`} className={`grid grid-cols-2 gap-4 py-1 ${depth > 0 ? 'pl-2' : ''}`}>
          <span className="font-medium text-gray-600 break-words">{displayKey}</span>
          <span className="break-words">
            {value?.toString() || <span className="text-gray-400 italic">—</span>}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="w-full !p-3 space-y-6">
      <div className="flex justify-between !mb-6 items-center flex-wrap gap-4">
        <Input
          placeholder="Search..."
          className="w-full md:!ms-3 sm:!ms-0 !ps-3  sm:w-1/3 max-w-sm border-bg-primary focus:border-bg-primary focus:ring-bg-primary rounded-[10px]"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={filterValue} onValueChange={setFilterValue}>
            <SelectTrigger className="w-[120px] border-bg-primary focus:ring-bg-primary rounded-[10px] !px-2">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent className="bg-white border-bg-primary rounded-md shadow-lg !p-3">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {showAddButton && (
            <Button
              onClick={() => navigate(addRoute)}
              className="bg-bg-primary cursor-pointer text-white hover:bg-teal-700 rounded-[10px] !p-3"
            >
              <Plus className="w-5 h-5 !mr-2" />
              Add
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[calc(100vh-300px)]">
        <Table className="!min-w-[600px]">
          <TableHeader>
            <TableRow>
              {columns.map((col, index) => (
                <TableHead
                  key={index}
                  className="text-bg-primary font-semibold"
                >
                  {col.label}
                </TableHead>
              ))}
              {/* Conditionally render View Details column */}
              {(detailsData || pageDetailsRoute) && (
                <TableHead className="text-bg-primary font-semibold">
                  Details
                </TableHead>
              )}
              {/* {pageDetailsRoute && (
                 <TableHead className="text-bg-primary font-semibold">
                  Details
                </TableHead>
              )} */}
              {showActionColumns && (
                <TableHead className="text-bg-primary font-semibold">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((col, idx) => (
                    <TableCell
                      key={idx}
                      className="text-sm !py-3 !px-1 whitespace-normal break-words"
                    >
                      {renderCellContent(row, col)}
                    </TableCell>
                  ))}
                  {/* View Details column */}
                  {detailsData && (
                    <TableCell className="text-sm !py-3 !px-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(row)}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  )}
                  {pageDetailsRoute && (
                    <TableCell className="text-sm !py-3 !px-1">
                      <Link to={`details/${row.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(row)}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        View Details
                      </Link >
                    </TableCell>
                  )}
                  {/* Actions column */}
                  {showActionColumns && (
                    <TableCell className="">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            console.log("Edit clicked for row:", row);
                            onEdit?.(row)
                          }}
                        >
                          <Edit className="w-4 h-4 text-bg-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(row)}
                        >
                          <Trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (detailsData ? 2 : 1)}
                  className="text-center text-gray-500 py-4"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="sm:max-w-[650px] !p-6 max-h-[85vh] overflow-y-auto rounded-lg shadow-xl"
          style={{
            backgroundColor: 'white',
            border: 'none',
            padding: '0'
          }}
        >
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>
          {detailsData && (
            <div className="grid grid-cols-2 gap-4 !py-4">
              {renderNestedObject(detailsData)}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="w-full !mb-10 max-w-[1200px] mx-auto">
        <Pagination className="!mb-2 flex justify-center items-center m-auto">
          <PaginationContent className="text-bg-primary font-semibold flex gap-2">
            <PaginationItem>
              <PaginationPrevious href="#" className="text-bg-primary" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                className="border border-gray-400 hover:bg-gray-200 transition-all px-3 py-1 rounded-lg text-bg-primary"
                href="#"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis className="text-bg-primary" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="text-bg-primary" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import {
//     Card, CardContent, CardFooter, CardHeader
// } from "@/components/ui/card";
// import {
//     Table, TableBody, TableCell, TableHead, TableHeader, TableRow
// } from "@/components/ui/table";
// import HeaderInvoiceImage from "@/assets/HeaderInvoice.png";
// import FooterInvoiceImage from "@/assets/FooterInvoice.png";
// import { Badge } from "@/components/ui/badge";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Loading from "@/components/Loading";
// import { useGet } from "@/Hooks/UseGet";

// export default function InvoiceCard() {
//     const apiUrl = import.meta.env.VITE_API_BASE_URL;
//     const [invoiceData, setInvoiceData] = useState(null);
//     const { refetch: refetchInvoice, loading: loadingInvoice, data: Invoice, error } = useGet({
//         url: `${apiUrl}/payment_package/invoice`
//     });

//     useEffect(() => {
//         refetchInvoice();
//     }, [refetchInvoice]);

//     useEffect(() => {
//         if (Invoice && Invoice.village && Invoice.package) {
//             console.log("Invoice Data:", Invoice);
//             setInvoiceData(Invoice);
//         }
//     }, [Invoice]);

//     if (loadingInvoice) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <Loading />
//             </div>
//         );
//     }

//     if (!invoiceData || !invoiceData.village || !invoiceData.package) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <p>No invoice data available for this village.</p>
//             </div>
//         );
//     }

//     const { village, package: packageData } = invoiceData;
//     const subtotal = packageData.price || 0;
//     const discount = packageData.discount || 0;
//     const tax = packageData.feez || 0;
//     const invoiceTotal = subtotal - discount + tax;

//     const invoiceDate = new Date().toLocaleDateString("en-US", {
//         year: "numeric", month: "long", day: "numeric",
//     });

//     const parsedRenewalDate = new Date(village.to);
//     const renewalToDate = village.to && !isNaN(parsedRenewalDate.getTime())
//         ? parsedRenewalDate.toLocaleDateString("en-US", {
//             year: "numeric", month: "long", day: "numeric",
//         }) : "N/A";

//     return (
//         <div className="!p-8 !mt-5 !mb-15">
//             <ToastContainer />
//             <Card className="w-full max-h-[150vh] bg-white !m-auto border-none shadow-lg rounded-lg overflow-hidden">
//                 <CardHeader
//                     className="text-start relative !p-9"
//                     style={{
//                         backgroundImage: `url(${HeaderInvoiceImage})`,
//                         backgroundSize: "cover",
//                         backgroundRepeat: "no-repeat",
//                         backgroundPosition: "center",
//                         color: "white",
//                     }}
//                 >
//                     <h1 className="text-xl bg-white top-6 left-3 absolute rounded-[10px] !mt-6 !px-4 !py-2 font-semibold text-bg-primary">
//                         Sea Go
//                     </h1>
//                 </CardHeader>

//                 <CardContent className="!px-6 !py-4">
//                     <div className="grid grid-cols-3 gap-5 !mb-2">
//                         <div>
//                             <Badge
//                                 variant="outline"
//                                 className="!px-2 !mb-1 !py-0.5 cursor-pointer border-none rounded-[10px] text-blue-400 bg-blue-100 text-sm"
//                             >
//                                 Invoice to:
//                             </Badge>
//                             <p className="font-medium text-sm">
//                                 {village?.name || "N/A"}
//                             </p>
//                             <p className="text-gray-500 text-xs">
//                                 {village?.location || "Location N/A"}
//                             </p>
//                         </div>
//                         <div className="text-right">
//                             <Badge
//                                 variant="outline"
//                                 className="!px-2 !me-10 !mb-1 !py-0.5 cursor-pointer border-none rounded-[10px] text-blue-400 bg-blue-100 text-sm"
//                             >
//                                 Date:
//                             </Badge>
//                             <p className="font-medium text-sm">{invoiceDate}</p>
//                         </div>
//                         <div>
//                             <Badge
//                                 variant="outline"
//                                 className="!px-2 !mb-1 !py-0.5 cursor-pointer border-none rounded-[10px] text-blue-400 bg-blue-100 text-sm"
//                             >
//                                 Invoice number:
//                             </Badge>
//                             <p className="font-medium text-sm !px-2">N: {village.id}</p>
//                         </div>
//                     </div>

//                     <Table>
//                         <TableHeader>
//                             <TableRow className="bg-gray-100 !rounded-lg">
//                                 <TableHead className="text-sm">Village Name</TableHead>
//                                 <TableHead className="text-sm">Zone</TableHead>
//                                 <TableHead className="text-sm">Package</TableHead>
//                                 <TableHead className="text-sm">Fees</TableHead>
//                                 <TableHead className="text-sm">Amount</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             <TableRow>
//                                 <TableCell className="text-sm">
//                                     {village.translations?.[0]?.value || village.name || "N/A"}
//                                 </TableCell>
//                                 <TableCell className="text-sm">
//                                     {village.zone?.translations?.[0]?.value ||
//                                         village.zone?.name || "N/A"}
//                                 </TableCell>
//                                 <TableCell className="text-sm">
//                                     {packageData.translations?.[0]?.value ||
//                                         packageData.name || "N/A"}
//                                 </TableCell>
//                                 <TableCell className="text-sm">
//                                     {tax} EGP
//                                 </TableCell>
//                                 <TableCell className="text-sm">
//                                     {subtotal.toFixed(2)} EGP
//                                 </TableCell>
//                             </TableRow>
//                         </TableBody>
//                     </Table>

//                     <div className="flex mt-4 mb-2">
//                         <div className="!p-4 w-full max-w-md">
//                             <div className="text-right space-y-2">
//                                 <p className="text-sm text-gray-600">
//                                     <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
//                                 </p>
//                                 <p className="text-sm text-gray-600">
//                                     <strong>Discount ({discount}%):</strong> -${discount.toFixed(2)}
//                                 </p>
//                                 <p className="text-sm text-gray-600">
//                                     <strong>TAX:</strong> ${tax.toFixed(2)}
//                                 </p>
//                                 <div className="border-t border-gray-200 pt-2">
//                                     <p className="text-base font-bold text-gray-900">
//                                         <strong>Invoice Total:</strong> ${invoiceTotal.toFixed(2)}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex justify-center items-center !my-3">
//                         <span className="text-sm font-medium text-gray-600">
//                             Next Renewal Period:&nbsp;
//                         </span>
//                         <span className="text-sm font-semibold text-gray-900">
//                             {renewalToDate}
//                         </span>
//                     </div>
//                 </CardContent>

//                 <CardFooter
//                     className="text-start !p-9"
//                     style={{
//                         backgroundImage: `url(${FooterInvoiceImage})`,
//                         backgroundSize: "cover",
//                         backgroundRepeat: "no-repeat",
//                         backgroundPosition: "center",
//                         color: "white",
//                     }}
//                 />
//             </Card>
//         </div>
//     );
// }


"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar, MapPin, FileText, ChevronDown, ChevronUp,
    ShieldCheck,
    UserCog,
    Waves,
    Wrench,
    BadgeDollarSign,
    Percent,
    CalendarDays,
    ArrowBigLeftDash,
    ArrowRightIcon
} from "lucide-react"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import HeaderInvoiceImage from "@/assets/HeaderInvoice.png";
import FooterInvoiceImage from "@/assets/FooterInvoice.png";
import { FaArrowRight } from "react-icons/fa6";
export default function InvoiceCard() {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const [invoiceData, setInvoiceData] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const { refetch: refetchInvoice, loading: loadingInvoice, data: Invoice, error } = useGet({
        url: `${apiUrl}/payment_package/invoice`,
    });

    useEffect(() => {
        refetchInvoice();
    }, [refetchInvoice]);

    useEffect(() => {
        if (Invoice && Invoice.village && Invoice.package) {
            console.log("Invoice Data:", Invoice);
            setInvoiceData(Invoice);
        }
    }, [Invoice]);

    if (loadingInvoice) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading />
            </div>
        );
    }

    if (error) {
        toast.error("Failed to load invoice data.", { position: "top-center" });
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 font-medium">Error loading invoice data. Please try again later.</p>
            </div>
        );
    }

    if (!invoiceData || !invoiceData.village || !invoiceData.package) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 font-medium">No invoice data available for this village.</p>
            </div>
        );
    }

    const { village, package: packageData } = invoiceData;
    const subtotal = packageData.price || 0;
    const discount = packageData.discount || 0;
    const tax = packageData.feez || 0;
    const invoiceTotal = subtotal - discount + tax;

    const invoiceDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const parsedRenewalDate = new Date(village.to);
    const renewalToDate =
        village.to && !isNaN(parsedRenewalDate.getTime())
            ? parsedRenewalDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            : "N/A";

    const startDate = new Date(village.from);
    const totalDays = (parsedRenewalDate - startDate) / (1000 * 60 * 60 * 24);
    const daysPassed = (new Date() - startDate) / (1000 * 60 * 60 * 24);
    const progress = totalDays > 0 ? Math.min((daysPassed / totalDays) * 100, 100) : 0;

    return (
        <div className="!p-2 md:!p-6 lg:!p-8 w-full">
            <ToastContainer position="top-center" />
            <Card className="w-full bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-2xl rounded-3xl overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
                <CardHeader
                    className="relative !p-2 md:!p-6 lg:!p-8"
                    style={{
                        backgroundImage: `url(${HeaderInvoiceImage})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="flex items-center !space-x-4">
                        {village.image_link && (
                            <img
                                src={village.image_link}
                                alt="Village Logo"
                                className="w-12 h-12 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 hover:scale-110"
                                aria-label="Village Logo"
                            />
                        )}
                        <h2 className="text-2xl font-semibold tracking-wide drop-shadow-lg">
                            {village.name}
                        </h2>
                    </div>
                </CardHeader>

                <CardContent className="!p-2 md:!p-6 lg:!p-8">
                    {village.cover_image_link && (
                        <div className="relative !mb-5 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={village.cover_image_link}
                                alt="Village Cover"
                                className="w-full h-48 sm:h-64 object-cover"
                                aria-label="Village Cover Image"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end !p-6">
                                <h2 className="text-2xl  font-bold text-white">
                                    {village?.name || "N/A"}
                                </h2>
                            </div>
                        </div>
                    )}

                    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 !mb-6">
                        <div className="flex items-start !space-x-2">
                            <MapPin className="w-5 h-5 text-bg-primary" />
                            <div>
                                <Badge className="!px-4 !py-1 text-sm text-white bg-bg-primary rounded-full !mb-2 transition-colors">
                                    Invoice to:
                                </Badge>
                                <p className="font-semibold text-xl text-gray-800">{village?.name || "N/A"}</p>
                                <p className="text-gray-600 text-sm">{village?.location || "Location N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-start !space-x-2">
                            <Calendar className="w-5 h-5 text-bg-primary" />
                            <div>
                                <Badge className="!px-4 !py-1 text-sm text-white bg-bg-primary rounded-full !mb-2 transition-colors">
                                    Date:
                                </Badge>
                                <p className="font-semibold text-xl text-gray-800">{invoiceDate}</p>
                            </div>
                        </div>
                        <div className="flex items-start !space-x-2">
                            <FileText className="w-5 h-5 text-bg-primary" />
                            <div>
                                <Badge className="!px-4 !py-1 text-sm text-white bg-bg-primary rounded-full !mb-2 transition-colors">
                                    Invoice number:
                                </Badge>
                                <p className="font-semibold text-xl text-gray-800">N: {village.id}</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-blue-100 shadow-sm !mt-4">
                        <table className="min-w-[800px] w-full table-auto text-left">
                            <thead className="bg-blue-100 text-gray-700 text-sm font-semibold">
                                <tr>
                                    <th className="!px-4 !py-3 whitespace-nowrap">Village</th>
                                    <th className="!px-4 !py-3 whitespace-nowrap">Zone</th>
                                    <th className="!px-4 !py-3 whitespace-nowrap">Description</th>
                                    <th className="!px-4 !py-3 whitespace-nowrap">Package</th>
                                    {/* <th className="!px-4 !py-3 whitespace-nowrap">Subscriber Duration</th> */}
                                    <th className="!px-4 !py-3 whitespace-nowrap">Fees</th>
                                    <th className="!px-4 !py-3 whitespace-nowrap">Price</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 divide-y divide-blue-50">
                                <tr className="hover:bg-blue-50 transition-colors">
                                    <td className="!px-4 !py-3 whitespace-nowrap">
                                        {village.translations?.[0]?.value || village.name || "N/A"}
                                    </td>
                                    <td className="!px-4 !py-3 whitespace-nowrap">
                                        {village.zone?.translations?.[0]?.value || village.zone?.name || "N/A"}
                                    </td>
                                    <td className="!px-4 !py-3 whitespace-nowrap">
                                        {village.description || "N/A"}
                                    </td>
                                    <td className="!px-4 !py-3 whitespace-nowrap">
                                        {packageData.translations?.[0]?.value || packageData.name || "N/A"}
                                    </td>
                                     {/* <td className="!px-4 !py-3 flex gap-3 items-center whitespace-nowrap">
                                        {village.from || "N/A"} <FaArrowRight/> {village.to || "N/A"}
                                    </td> */}
                                    <td className="!px-4 !py-3 whitespace-nowrap">{tax.toFixed(2)} </td>
                                    <td className="!px-4 !py-3 whitespace-nowrap">{subtotal.toFixed(2)} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                    <div className="!mt-8 !p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md">
                        <div className="text-right !space-y-4">
                            <p className="text-base text-gray-600">
                                <strong>Subtotal:</strong> {subtotal.toFixed(2)} EGP
                            </p>
                            <p className="text-base text-gray-600">
                                <strong>Discount ({discount}%):</strong> -{discount.toFixed(2)} EGP
                            </p>
                            <p className="text-base text-gray-600">
                                <strong>TAX:</strong> {tax.toFixed(2)} EGP
                            </p>
                            <div className="border-t border-blue-200 pt-4">
                                <p className="text-2xl font-extrabold text-bg-primary animate-pulse">
                                    <strong>Invoice Total:</strong> {invoiceTotal.toFixed(2)} EGP
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="!mt-8">
                        <p className="text-lg font-medium text-gray-600 !mb-2">Subscription Progress:</p>
                        <div className="flex justify-between text-lg text-gray-600 !mt-2">
                            <span>Start: {new Date(village.from).toLocaleDateString("en-US")}</span>
                            <span>End: {new Date(village.to).toLocaleDateString("en-US")}</span>
                        </div>
                    </div>


                    <div className="!mt-6">
                        <Button
                            variant="outline"
                            className="w-full !p-4 flex justify-between items-center text-bg-primary border-bg-primary hover:bg-blue-100 transition-colors"
                            onClick={() => setShowDetails(!showDetails)}
                            aria-expanded={showDetails}
                            aria-controls="package-details"
                        >
                            <span className="font-semibold tracking-wide">View Full Package Details</span>
                            {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </Button>

                        {showDetails && (
                            <div
                                id="package-details"
                                className="!mt-4 !p-6 bg-white border border-blue-100 rounded-xl shadow-sm animate-fade-in grid gap-4 text-gray-700 text-sm"
                            >
                                {/* Title & Description */}
                                <div className="!space-y-2">
                                    <h3 className="text-xl font-bold text-blue-600">{packageData.name}</h3>
                                    <p className="text-gray-500">{packageData.description}</p>
                                </div>

                                {/* Personnel Info */}
                                {/* <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="text-blue-500 w-5 h-5" />
          <span><strong>Security Personnel:</strong> <span className="bg-blue-100 px-2 py-0.5 rounded text-blue-800">{packageData.security_num || "N/A"}</span></span>
        </div>
        <div className="flex items-center space-x-3">
          <UserCog className="text-blue-500 w-5 h-5" />
          <span><strong>Admin Personnel:</strong> <span className="bg-blue-100 px-2 py-0.5 rounded text-blue-800">{packageData.admin_num || "N/A"}</span></span>
        </div>
      </div> */}

                                {/* Pricing Info */}
                                <div className="grid grid-cols-3 gap-4 !pt-2">
                                    <div className="flex items-center !space-x-2">
                                        <BadgeDollarSign className="text-green-500 w-5 h-5" />
                                        <span><strong>Price:</strong> {packageData.price}</span>
                                    </div>
                                    <div className="flex items-center !space-x-2">
                                        <BadgeDollarSign className="text-yellow-500 w-5 h-5" />
                                        <span><strong>Fees:</strong> {packageData.feez}</span>
                                    </div>
                                    <div className="flex items-center !space-x-2">
                                        <Percent className="text-pink-500 w-5 h-5" />
                                        <span><strong>Discount:</strong> {packageData.discount}%</span>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter
                    className="!p-8 sm:!p-12"
                    style={{
                        backgroundImage: `url(${FooterInvoiceImage})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        color: "white",
                    }}
                />
            </Card>
        </div>
    );
}
"use client";
import { useTranslation } from "react-i18next";

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
  Calendar,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
  BadgeDollarSign,
  Percent,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import HeaderInvoiceImage from "@/assets/HeaderInvoice.png";
import FooterInvoiceImage from "@/assets/FooterInvoice.png";
import { FaArrowRight } from "react-icons/fa6";
import { useLocation } from "react-router-dom";

export default function InvoiceCard() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [village, setVillage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const { refetch: refetchInvoice, loading: loadingInvoice, data: Invoice, error } = useGet({
    url: `${apiUrl}/payment_package/invoice`,
  });
  const location = useLocation();
  const invoiceFromState = location.state?.invoiceData;
  const { t ,i18n} = useTranslation();
const dir=i18n.language==="ar"?"rtl":"ltr"
  useEffect(() => {
    refetchInvoice();
  }, [refetchInvoice]);

  useEffect(() => {
    if (Invoice && Invoice.village) {
      console.log("Invoice Data:", Invoice);
      setVillage(Invoice.village);
    }
  }, [Invoice]);

  if (loadingInvoice) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading />
      </div>
    );
  }

    if (error) {
        toast.error("Failed to load invoice data.", { position: "top-center" });
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 font-medium">{t("ErrorloadinginvoicedataPleasetryagainlater")}</p>
            </div>
        );
    }

  if (!invoiceFromState || !village) {
    return (
      <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500 font-medium">{t("Noinvoicedataavailableforthisvillage")}</p>
      </div>
    );
  }

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
    <div className="flex justify-center items-center min-h-screen !p-4 md:!p-6 lg:!p-8">
      <ToastContainer position="top-center" />
      <Card className="w-full max-w-5xl bg-gradient-to-br from-blue-50 to-purple-50 border-none shadow-2xl rounded-3xl overflow-hidden transition-transform duration-500 hover:scale-[1.01]">
        <CardHeader
          className="relative !p-4 md:!p-6 lg:!p-8"
          style={{
            backgroundImage: `url(${HeaderInvoiceImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {dir==="rtl"?(<div  className={`flex items-center  justify-end    !space-x-4`}>
            <h2 className={`text-xl  sm:text-2xl font-semibold tracking-wide drop-shadow-lg  `}>
            </h2>
            {village.image_link && (
              <img
                src={village.image_link}
                alt="Village Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 hover:scale-110"
                aria-label="Village Logo"
              />
            )}

            
          </div>
        ):(<div  className={`flex items-center   !space-x-4`}>
            {village.image_link && (
              <img
                src={village.image_link}
                alt="Village Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 hover:scale-110"
                aria-label="Village Logo"
              />
            )}

            <h2 className={`text-xl  sm:text-2xl font-semibold tracking-wide drop-shadow-lg  `}>
              {village.name}
            </h2>
          </div>)}
        

        </CardHeader>

        <CardContent className="!p-4 md:!p-6 lg:!p-8">
          {village.cover_image_link && (
            <div className="relative !mb-5 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={village.cover_image_link}
                alt="Village Cover"
                className="w-full h-32 sm:h-48 md:h-64 object-cover"
                aria-label="Village Cover Image"
              />
              <div  className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end !p-4 md:!p-6">
                <h2  className={`   text-xl sm:text-2xl font-bold text-white`}>
                  {village?.name || "N/A"}
                </h2>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 !mb-6">
            <div className="flex items-start !space-x-2">
              <MapPin className="w-5 h-5 text-bg-primary flex-shrink-0" />
              <div>
                <Badge className="!px-4 !py-1 text-sm text-white bg-bg-primary rounded-full !mb-2 transition-colors">
                  {t("Invoiceto")}
                </Badge>
                <p className="font-semibold text-lg text-gray-800">{village?.name || "N/A"}</p>
                <p className="text-gray-600 text-sm">{village?.location || "Location N/A"}</p>
              </div>
            </div>
            <div className="flex items-start !space-x-2">
              <Calendar className="w-5 h-5 text-bg-primary flex-shrink-0" />
              <div>
                <Badge className="!px-4 !py-1 text-sm text-white bg-bg-primary rounded-full !mb-2 transition-colors">
                  {t("Date")}
                </Badge>
                <p className="font-semibold text-lg text-gray-800">{invoiceDate}</p>
              </div>
            </div>
             <div className="flex items-start !space-x-2">
              <FileText className="w-5 h-5 text-bg-primary flex-shrink-0" />
              <div>
                <Badge className="!px-4 !py-1 text-sm text-white bg-bg-primary rounded-full !mb-2 transition-colors">
                  {t("Status")}
                </Badge>
                <p className={`font-semibold text-lg !px-3 !py-1 rounded-full ${invoiceFromState.status === "Active"? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>{invoiceFromState.status === "Active"? t("Paid") : t("UnPaid")}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-blue-100 shadow-sm !mt-4">
            <Table className="min-w-full text-left">
              <TableHeader className="bg-blue-100 text-gray-700 text-xs sm:text-sm font-semibold">
                <TableRow>
                  <TableHead className="!px-4 !py-3 whitespace-nowrap">{t("Village")}</TableHead>
                  <TableHead className="!px-4 !py-3 whitespace-nowrap">{t("Zone")}</TableHead>
                  <TableHead className="!px-4 !py-3 whitespace-nowrap">{t("Package")}</TableHead>
                  <TableHead className="!px-4 !py-3 whitespace-nowrap">{t("Price")}</TableHead>
                  <TableHead className="!px-4 !py-3 whitespace-nowrap">{t("Discount")}</TableHead>
                  <TableHead className="!px-4 !py-3 whitespace-nowrap">{t('TotalAfterDiscount')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs sm:text-sm text-gray-700 divide-y divide-blue-50">
                <TableRow className={`${dir==="rtl"?"text-right":" text-left"} hover:bg-blue-50 transition-colors`}>
                  <TableCell className="!px-4 !py-3 whitespace-nowrap">
                    {village.translations?.[0]?.value || village.name || "N/A"}
                  </TableCell>
                  <TableCell className="!px-4 !py-3 whitespace-nowrap">
                    {village.zone?.translations?.[0]?.value || village.zone?.name || "N/A"}
                  </TableCell>
                  <TableCell className="!px-4 !py-3 whitespace-nowrap">
                    {invoiceFromState.translations?.[0]?.value || invoiceFromState.name || "N/A"}
                  </TableCell>
                  <TableCell className="!px-4 !py-3 whitespace-nowrap">
                    {invoiceFromState.total_before_discount || "0"}
                  </TableCell>
                  <TableCell className="!px-4 !py-3 whitespace-nowrap">
                    {invoiceFromState.discount || "0"}
                  </TableCell>
                  <TableCell className="!px-4 !py-3 whitespace-nowrap">
                    {invoiceFromState.amount || "0"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="!mt-8 !p-4 md:!p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md">
            <div className="text-right !space-y-4">
              <p className="text-sm sm:text-base text-gray-600">
                <strong>{t("Subtotal")}</strong> {invoiceFromState.total_before_discount.toFixed(2)} EGP
              </p>
              <p className="text-sm sm:text-base text-gray-600">
                <strong>{t("Discount")} ({invoiceFromState.discount}%):</strong> -{invoiceFromState.discount.toFixed(2)} EGP
              </p>
              <div className="border-t border-blue-200 !pt-4">
                <p className="text-xl sm:text-2xl font-extrabold text-bg-primary animate-pulse">
                  <strong>{t("InvoiceTotal")}</strong> {invoiceFromState.amount.toFixed(2)} EGP
                </p>
              </div>
            </div>
          </div>

          <div className="!mt-8">
            <p className="text-base sm:text-lg font-medium text-gray-600 !mb-2">{t("SubscriptionProgress")}:</p>
            <div className="flex justify-between text-sm md:text-base text-gray-600 !mt-2">
              <span>{t("Start")}{new Date(village.from).toLocaleDateString("en-US")}</span>
              <span>{t("End")} {new Date(village.to).toLocaleDateString("en-US")}</span>
            </div>
          </div>

          <div className="!mt-6">
            <Button
              variant="outline"
              className="w-full !p-4 flex justify-between items-center text-bg-primary border-bg-primary hover:bg-blue-100 transition-colors text-sm sm:text-base"
              onClick={() => setShowDetails(!showDetails)}
              aria-expanded={showDetails}
              aria-controls="package-details"
            >
              <span className="font-semibold tracking-wide">{t("ViewFullPackageDetails")}</span>
              {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>

            {showDetails && (
              <div
                id="package-details"
                className="!mt-4 !p-4 md:p-6 bg-white border border-blue-100 rounded-xl shadow-sm animate-fade-in grid gap-4 text-gray-700 text-sm"
              >
                <div className="!space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-blue-600">{village.name}</h3>
                  <p className="text-gray-500 text-sm">{village.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 !pt-2">
                  <div className="flex items-center !space-x-2">
                    <BadgeDollarSign className="text-green-500 w-5 h-5 flex-shrink-0" />
                    <span><strong>{t("Price")}:</strong> {invoiceFromState.total_before_discount}</span>
                  </div>
                  <div className="flex items-center !space-x-2">
                    <Percent className="text-pink-500 w-5 h-5 flex-shrink-0" />
                    <span><strong>{t("Discount")}:</strong> {invoiceFromState.discount}%</span>
                  </div>
                  <div className="flex items-center !space-x-2">
                    <BadgeDollarSign className="text-yellow-500 w-5 h-5 flex-shrink-0" />
                    <span><strong>{t("TotalAfterDiscount")}:</strong> {invoiceFromState.amount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter
          className="p-6 sm:p-8 lg:p-12"
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


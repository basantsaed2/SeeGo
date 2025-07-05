// InvoiceList.jsx
"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout"; // Make sure this path is correct
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const InvoiceList = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [invoiceData, setInvoiceData] = useState([]);
    const { t } = useTranslation();

    const { refetch, loading, data } = useGet({
        url: `${apiUrl}/payment_package/invoice`,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (data) {
            const formatted = data?.invoices?.map((u) => {
                return {
                    id: u.id,
                    name: u.name,
                    total_before_discount: u.total_before_discount,
                    discount: u.discount,
                    amount: u.amount,
                    status: u.status === "paid" ? "paid" : "unpaid",
                    invoiceDetails: u,
                };
            });
            setInvoiceData(formatted);
        }
    }, [data]);

    const columns = [
        { key: "name", label: t("PackageName") },
        { key: "total_before_discount", label: t("Amount") },
        { key: "discount", label: t("Discount") },
        { key: "amount", label: t("Total") },
        {
            key: "view",
            label: t("ViewInvoice"),
            render: (row) => (
                <Link
                    to={`invoice`}
                    state={{ invoiceData: row.invoiceDetails }}
                    className="text-blue-600 hover:underline"
                >
                    {t("View")}
                </Link>
            ),
        },
        {
            key: "statusText", // This column renders the badge, not the filter itself
            label: t("Status"),
            render: (row) => (
                <span
                    className={`!px-2 !py-1 rounded-full text-white text-xs font-semibold ${
                        row.status === "paid" ? "bg-green-300" : "bg-red-500"
                    }`}
                >
                    {row.status === "paid" ? t("Paid") : t("Unpaid")}
                </span>
            ),
        },
    ];

    if (isLoading || loading) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
<DataTable
  data={invoiceData || []}
  columns={columns}
  showAddButton={false}
  showActionColumns={false}
  filterOptions={[
    {
      key: "status",
      label: t("Status"),
      options: [
        { value: "all", label: t("All") },
        { value: "paid", label: t("Paid") },
        { value: "unpaid", label: t("Unpaid") },
      ],
    },
  ]}
/>


        </div>
    );
};

export default InvoiceList;
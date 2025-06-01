"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const InvoiceList = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [invoiceData, setInvoiceData] = useState([]);
    const nevigate = useNavigate();
  const { t } = useTranslation();

    const { refetch, loading, data } = useGet({
        url: `${apiUrl}/payment_package/invoice`,
    });

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (data) {
            console.log(data)
            setInvoiceData(data);
        }
    }, [data]);

    useEffect(() => {
        if (data) {
            const formatted = data?.invoices?.map((u) => {
                return {
                    name: u.name,
                    total_before_discount: u.total_before_discount,
                    discount: u.discount,
                    amount: u.amount,
                    status: u.status === "paid" ? "Active" : "Inactive",
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
                    state={{ invoiceData: row }}
                    className="text-blue-600 hover:underline"
                >
                    {t("View")}
                </Link>
            ),
        },
        { key: "statusText", label: t("Status") },
    ];

    if (isLoading || loading) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <DataTable
                data={invoiceData}
                columns={columns}
                showAddButton={false}
                showActionColumns={false}
                statusLabelsText={
                    {
                        active: "Paid",
                        inactive: "Unpaid",
                    }
                }
            />
        </div>
    );
};

export default InvoiceList;
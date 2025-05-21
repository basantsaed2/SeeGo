"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const RentSale = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [RentSale, setRentSale] = useState([]);
    const [RentSaleDetails, setRentSaleDetails] = useState([]);

    const { refetch: refetchRentSale, loading: loadingRentSale, data: RentSaleData } = useGet({
        url: `${apiUrl}/for_rent_sale`,
    });

    useEffect(() => {
        refetchRentSale();
    }, [refetchRentSale]);

    useEffect(() => {
        if (RentSaleData && RentSaleData.offers) {
            console.log(RentSaleData.offers)
            // No need to format the data - pass it directly to show all details in modal
            setRentSale(RentSaleData.offers);
        }
    }, [RentSaleData]);

    useEffect(() => {
        if (RentSaleData && RentSaleData.offers) {
            const formattedRentSale = RentSaleData?.offers?.map((u) => {
                return {
                    id: u.id,
                    type: u.type,
                    price: u.price || "0",
                    price_day: u.price_day || "0",
                    price_month: u.price_month || "0",
                    name: u.owner?.name || "—",
                    phone: u.owner.phone || "—",
                    unit: u.appartment?.unit || "—",
                    floor: u.appartment?.number_floors || "—",
                };
            });
            const formattedDetailsRentSale = RentSaleData?.offers?.map((u) => {
                return {
                    Description: u.description
                };
            });
            setRentSaleDetails(formattedDetailsRentSale);
            setRentSale(formattedRentSale);
        }
    }, [RentSaleData]);

    const columns = [
        { key: "type", label: "Type" },
        { key: "name", label: "User Name" },
        { key: "phone", label: "User Phone" },
        { key: "unit", label: "Apartment Unit" },
        { key: "floor", label: "Apartment Floor" },
        { key: "price", label: "Price" },
        { key: "price_day", label: "Daily Price" },
        { key: "price_month", label: "Monthly Price" }
    ];

    if (isLoading || loadingRentSale) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <DataTable
                data={RentSale}
                columns={columns}
                showAddButton={false}
                showActionColumns={false}
                // detailsData={RentSaleDetails}
            />
        </div>
    );
};

export default RentSale;
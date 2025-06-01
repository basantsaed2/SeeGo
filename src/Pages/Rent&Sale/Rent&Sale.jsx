"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Assuming shadcn/ui Dialog component
import { useTranslation } from "react-i18next";

const RentSale = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [rentData, setRentData] = useState([]);
    const [saleData, setSaleData] = useState([]);
    const [rentAndSaleData, setRentAndSaleData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState("");

    const { refetch: refetchRentSale, loading: loadingRentSale, data: RentSaleData } = useGet({
        url: `${apiUrl}/for_rent_sale`,
    });

    useEffect(() => {
        refetchRentSale();
    }, [refetchRentSale]);
  const {t}=useTranslation();

    useEffect(() => {
        if (RentSaleData && RentSaleData.offers) {
            console.log(RentSaleData.offers);

            // Format data for the DataTable, including description
            const formattedData = RentSaleData.offers.map((u) => ({
                id: u.id,
                type: u.type_offer,
                price: u.price || "0",
                price_day: u.price_day || "0",
                price_month: u.price_month || "0",
                name: u.owner || "—",
                phone: u.owner?.phone || "—",
                village: u.village || "—",
                unit: u.unit || "—",
                description: u.description || "No description available", // Include description
            }));

            // Filter data for each tab
            const rent = formattedData.filter((item) => item.type === "Rent");
            const sale = formattedData.filter((item) => item.type === "Sale");
            const rentAndSale = formattedData.filter((item) => item.type === "Sale & Rent");

            setRentData(rent);
            setSaleData(sale);
            setRentAndSaleData(rentAndSale);
        }
    }, [RentSaleData]);

    const columns = [
        { key: "type", label: t("Type") },
        { key: "name", label: t("UserName") },
        { key: "phone", label: t("UserPhone") },
        { key: "village", label: t("Village") },
        { key: "unit", label: t("Unit") },
        { key: "price", label: t("Price") },
        { key: "price_day", label: t("DailyPrice") },
        { key: "price_month", label: t("MonthlyPrice")},
        {
            key: "details",
            label: t("Details"),
            render: (row) => (
                <Button
                    variant="link"
                    className="text-blue-600 underline p-0"
                    onClick={() => {
                        setSelectedDescription(row.description);
                        setIsModalOpen(true);
                    }}
                >
                    {t("ViewDetails")}
                </Button>
            ),
        },
    ];

    if (isLoading || loadingRentSale) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <Tabs defaultValue="rent" className="w-full">
                <TabsList className="grid w-full grid-cols-3 gap-4 bg-transparent !mb-6">
                    <TabsTrigger
                        value="rent"
                        className="rounded-[10px] border text-bg-primary !py-2 transition-all 
                        data-[state=active]:bg-bg-primary data-[state=active]:text-white 
                        hover:bg-teal-100 hover:text-teal-700"
                    >
                        {t("Rent")}
                    </TabsTrigger>
                    <TabsTrigger
                        value="sale"
                        className="rounded-[10px] border text-bg-primary !py-2 transition-all 
                        data-[state=active]:bg-bg-primary data-[state=active]:text-white 
                        hover:bg-teal-100 hover:text-teal-700"
                    >
                        {t("Sale")}
                    </TabsTrigger>
                    <TabsTrigger
                        value="rentAndSale"
                        className="rounded-[10px] border text-bg-primary !py-2 transition-all 
                        data-[state=active]:bg-bg-primary data-[state=active]:text-white 
                        hover:bg-teal-100 hover:text-teal-700"
                    >
                        {t("Rent&Sale")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="rent">
                    <DataTable
                        data={rentData}
                        columns={columns}
                        showAddButton={false}
                        showActionColumns={false}
                    />
                </TabsContent>
                <TabsContent value="sale">
                    <DataTable
                        data={saleData}
                        columns={columns}
                        showAddButton={false}
                        showActionColumns={false}
                    />
                </TabsContent>
                <TabsContent value="rentAndSale">
                    <DataTable
                        data={rentAndSaleData}
                        columns={columns}
                        showAddButton={false}
                        showActionColumns={false}
                    />
                </TabsContent>
            </Tabs>

            {/* Modal for showing description */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("OfferDescription")}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>{selectedDescription}</DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RentSale;
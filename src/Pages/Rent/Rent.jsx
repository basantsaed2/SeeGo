"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/DataTableLayout";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Rent = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [Rent, setRent] = useState([]);
    const [RentDetails, setRentDetails] = useState([]);

    const { refetch: refetchRent, loading: loadingRent, data: RentData } = useGet({
        url: `${apiUrl}/rents`,
    });

    useEffect(() => {
        refetchRent();
    }, [refetchRent]);

    useEffect(() => {
        if (RentData && RentData.offers) {
            console.log(RentData.rents)
            setRent(RentData.rents);
        }
    }, [RentData]);

    useEffect(() => {
        if (RentData && RentData.rents) {
            const formattedRent = RentData?.rents?.map((u) => {
                return {
                    id: u.id,
                    img: u.image_id_link ? (
                        <img
                            src={u.image_id_link}
                            alt={u.user?.name}
                            className="w-12 h-12 object-cover rounded-md"
                        />
                    ) : (
                        <Avatar className="w-12 h-12">
                            <AvatarFallback>{u.user?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    ),
                    renter: u.user?.name,
                    phone: u.user.phone || "—",
                    owner: u.owner?.name,
                    ownerPhone: u.owner?.phone,
                    code: u.code,
                    from: u.from,
                    to: u.to,
                    people: u.people,
                    name: u.owner?.name || "—",
                    unit: u.appartment?.unit || "—",
                    floor: u.appartment?.number_floors || "—",
                };
            });
            // const formattedDetailsRent = RentData?.rents?.map((u) => {
            //     return {
            //         Description: u.description
            //     };
            // });
            // setRentDetails(formattedDetailsRent);
            setRent(formattedRent);
        }
    }, [RentData]);

    const columns = [
        { key: "img", label: "Image" },
        { key: "renter", label: "Renter" },
        { key: "phone", label: "Renter Phone" },
        { key: "owner", label: "Owner" },
        { key: "ownerPhone", label: "Owner Phone" },
        { key: "code", label: "Code" },
        { key: "from", label: "From" },
        { key: "to", label: "To" },
        { key: "people", label: "No.People" },
        { key: "name", label: "User Name" },
        { key: "phone", label: "User Phone" },
        { key: "unit", label: "Apartment Unit" },
        { key: "floor", label: "Apartment Floor" },
    ];

    if (isLoading || loadingRent) {
        return <FullPageLoader />;
    }

    return (
        <div className="p-4">
            <DataTable
                data={Rent}
                columns={columns}
                showAddButton={false}
                showActionColumns={false}
            // detailsData={RentDetails}
            />
        </div>
    );
};

export default Rent;
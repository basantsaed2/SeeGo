// "use client";
// import { useEffect, useState } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { useParams } from "react-router-dom";
// import { useGet } from "@/Hooks/UseGet";
// import FullPageLoader from "@/components/Loading";
// import { useSelector } from "react-redux";
// import { usePost } from "@/Hooks/UsePost";
// const UnitDetails = () => {
//     const apiUrl = import.meta.env.VITE_API_BASE_URL;
//     const { id } = useParams();
//     const isLoading = useSelector((state) => state.loader.isLoading);

//     const { refetch, loading, data } = useGet({url: `${apiUrl}/appartment_profile/${id}`,});
//     const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/appartment_profile/update/${user_id}` });


//     useEffect(() => {
//         refetch();
//     }, [refetch]);

//     if (isLoading) {
//         return <FullPageLoader />;
//     }


//     return (
//         <div className="container !mx-auto !py-6 !px-4">

//         </div>
//     );
// };

// export default UnitDetails;
"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import { useGet } from "@/Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { useSelector } from "react-redux";
import { usePost } from "@/Hooks/UsePost";
import { toast } from "react-toastify";
import { CalendarDays, Home, Mail, Phone, User, Users, Crown } from "lucide-react";
import { useChangeState } from "@/Hooks/useChangeState";

const UnitDetails = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { id } = useParams();
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [activeTab, setActiveTab] = useState("owners");

    const { refetch, loading, data } = useGet({ url: `${apiUrl}/appartment_profile/${id}` });
    const { changeState, loadingChange, responseChange } = useChangeState();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const handleToggleType = async (row, type) => {
        const response = await changeState(
            `${apiUrl}/appartment_profile/update/${row.id}?user_Type=${type}`,
            `${row.name} user Type changed successfully.`
        );
        if (response) {
            refetch();
        }
    };

    if (isLoading || loading) {
        return <FullPageLoader />;
    }

    if (!data) return null;

    const { appartment, owners, renters } = data;

    const renderUserCard = (user, isOwner = true) => (
        <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={user.image || "/default-avatar.png"} />
                    <AvatarFallback>
                        <User className="h-6 w-6" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle className="flex items-center justify-between">
                        <span>{user.name || "Unknown User"}</span>
                        <Badge variant={user.user_type === "super" ? "default" : "secondary"} className="flex items-center gap-1">
                            {user.user_type === "super" && <Crown className="h-3 w-3" />}
                            {user.user_type}
                        </Badge>
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                        {isOwner ? "Owner" : "Renter"}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone || "No phone"}</span>
                </div>
                {!isOwner && (
                    <>
                        <div className="flex items-center gap-2 text-sm">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span>From: {user.rent_from || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span>To: {user.rent_to || "N/A"}</span>
                        </div>
                    </>
                )}
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button
                    variant={user.user_type === "super" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleToggleType(user, user.user_type === "super" ? "follower" : "super")}
                    disabled={loadingChange}
                >
                    {loadingChange ? "Processing..." : user.user_type === "super" ? "Remove Super" : "Make Super"}
                    {user.user_type !== "super" && <Crown className="ml-2 h-4 w-4" />}
                </Button>
            </CardFooter>
        </Card>
    );

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="grid gap-6">
                {/* Apartment Overview Card */}
                <Card className="border-primary">
                    <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3">
                                <Home className="h-6 w-6" />
                                <span>{appartment.unit || "Unknown Unit"}</span>
                            </CardTitle>
                            <Badge variant="outline" className="px-3 py-1">
                                {appartment.appartment_type_id === 1 ? "Villa" : "Apartment"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Owners</p>
                                <p className="font-medium">{owners.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Renters</p>
                                <p className="font-medium">{renters.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CalendarDays className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">Created</p>
                                <p className="font-medium">
                                    {new Date(appartment.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="owners">
                            <User className="mr-2 h-4 w-4" />
                            Owners ({owners.length})
                        </TabsTrigger>
                        <TabsTrigger value="renters">
                            <Users className="mr-2 h-4 w-4" />
                            Renters ({renters.length})
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="owners" className="mt-4">
                        {owners.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {owners.map(owner => renderUserCard(owner, true))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No owners found for this unit
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="renters" className="mt-4">
                        {renters.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {renters.map(renter => renderUserCard(renter, false))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No renters found for this unit
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default UnitDetails;
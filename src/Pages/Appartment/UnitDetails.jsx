// // "use client";
// // import { useEffect, useState } from "react";
// // import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// // import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import { Separator } from "@/components/ui/separator";
// // import { useParams } from "react-router-dom";
// // import { useGet } from "@/Hooks/UseGet";
// // import FullPageLoader from "@/components/Loading";
// // import { useSelector } from "react-redux";
// // import { usePost } from "@/Hooks/UsePost";
// // const UnitDetails = () => {
// //     const apiUrl = import.meta.env.VITE_API_BASE_URL;
// //     const { id } = useParams();
// //     const isLoading = useSelector((state) => state.loader.isLoading);

// //     const { refetch, loading, data } = useGet({url: `${apiUrl}/appartment_profile/${id}`,});
// //     const { postData, loadingPost, response } = usePost({ url: `${apiUrl}/appartment_profile/update/${user_id}` });


// //     useEffect(() => {
// //         refetch();
// //     }, [refetch]);

// //     if (isLoading) {
// //         return <FullPageLoader />;
// //     }


// //     return (
// //         <div className="container !mx-auto !py-6 !px-4">

// //         </div>
// //     );
// // };

// // export default UnitDetails;
// "use client";
// import { useEffect, useState } from "react";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { useParams } from "react-router-dom";
// import { useGet } from "@/Hooks/UseGet";
// import FullPageLoader from "@/components/Loading";
// import { useSelector } from "react-redux";
// import { usePost } from "@/Hooks/UsePost";
// import { toast } from "react-toastify";
// import { CalendarDays, Home, Mail, Phone, User, Users, Crown } from "lucide-react";
// import { useChangeState } from "@/Hooks/useChangeState";

// const UnitDetails = () => {
//     const apiUrl = import.meta.env.VITE_API_BASE_URL;
//     const { id } = useParams();
//     const isLoading = useSelector((state) => state.loader.isLoading);
//     const [activeTab, setActiveTab] = useState("owners");

//     const { refetch, loading, data } = useGet({ url: `${apiUrl}/appartment_profile/${id}` });
//     const { changeState, loadingChange, responseChange } = useChangeState();

//     useEffect(() => {
//         refetch();
//     }, [refetch]);

//     const handleToggleType = async (row, type) => {
//         const response = await changeState(
//             `${apiUrl}/appartment_profile/update/${row.id}?user_type=${type}`,
//             `${row.name} user Type changed successfully.`
//         );
//         if (response) {
//             refetch();
//         }
//     };

//     if (isLoading || loading) {
//         return <FullPageLoader />;
//     }

//     if (!data) return null;

//     const { appartment, owners, renters } = data;

//     const renderUserCard = (user, isOwner = true) => (
//         <Card key={user.id} className="hover:shadow-lg transition-shadow">
//             <CardHeader className="flex flex-row items-center space-x-4 pb-2">
//                 <Avatar className="h-12 w-12">
//                     <AvatarImage src={user.image || "/default-avatar.png"} />
//                     <AvatarFallback>
//                         <User className="h-6 w-6" />
//                     </AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1">
//                     <CardTitle className="flex items-center justify-between">
//                         <span>{user.name || "Unknown User"}</span>
//                         <Badge variant={user.user_type === "super" ? "default" : "secondary"} className="flex items-center gap-1">
//                             {user.user_type === "super" && <Crown className="h-3 w-3" />}
//                             {user.user_type}
//                         </Badge>
//                     </CardTitle>
//                     <div className="text-sm text-muted-foreground">
//                         {isOwner ? "Owner" : "Renter"}
//                     </div>
//                 </div>
//             </CardHeader>
//             <CardContent className="grid gap-2">
//                 <div className="flex items-center gap-2 text-sm">
//                     <Mail className="h-4 w-4 text-muted-foreground" />
//                     <span>{user.email || "No email"}</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm">
//                     <Phone className="h-4 w-4 text-muted-foreground" />
//                     <span>{user.phone || "No phone"}</span>
//                 </div>
//                 {!isOwner && (
//                     <>
//                         <div className="flex items-center gap-2 text-sm">
//                             <CalendarDays className="h-4 w-4 text-muted-foreground" />
//                             <span>From: {user.rent_from || "N/A"}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm">
//                             <CalendarDays className="h-4 w-4 text-muted-foreground" />
//                             <span>To: {user.rent_to || "N/A"}</span>
//                         </div>
//                     </>
//                 )}
//             </CardContent>
//             <CardFooter className="flex justify-end">
//                 <Button
//                     variant={user.user_type === "super" ? "default" : "outline"}
//                     size="sm"
//                     onClick={() => handleToggleType(user, user.user_type === "super" ? "follower" : "super")}
//                     disabled={loadingChange}
//                 >
//                     {loadingChange ? "Processing..." : user.user_type === "super" ? "Remove Super" : "Make Super"}
//                     {user.user_type !== "super" && <Crown className="ml-2 h-4 w-4" />}
//                 </Button>
//             </CardFooter>
//         </Card>
//     );

//     return (
//         <div className="container mx-auto py-6 px-4">
//             <div className="grid gap-6">
//                 {/* Apartment Overview Card */}
//                 <Card className="border-primary">
//                     <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
//                         <div className="flex items-center justify-between">
//                             <CardTitle className="flex items-center gap-3">
//                                 <Home className="h-6 w-6" />
//                                 <span>{appartment.unit || "Unknown Unit"}</span>
//                             </CardTitle>
//                             <Badge variant="outline" className="px-3 py-1">
//                                 {appartment.appartment_type_id === 1 ? "Villa" : "Apartment"}
//                             </Badge>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
//                         <div className="flex items-center gap-3">
//                             <Users className="h-5 w-5 text-muted-foreground" />
//                             <div>
//                                 <p className="text-sm text-muted-foreground">Owners</p>
//                                 <p className="font-medium">{owners.length}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <User className="h-5 w-5 text-muted-foreground" />
//                             <div>
//                                 <p className="text-sm text-muted-foreground">Renters</p>
//                                 <p className="font-medium">{renters.length}</p>
//                             </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                             <CalendarDays className="h-5 w-5 text-muted-foreground" />
//                             <div>
//                                 <p className="text-sm text-muted-foreground">Created</p>
//                                 <p className="font-medium">
//                                     {new Date(appartment.created_at).toLocaleDateString()}
//                                 </p>
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* Users Tabs */}
//                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                     <TabsList className="grid w-full grid-cols-2">
//                         <TabsTrigger value="owners">
//                             <User className="mr-2 h-4 w-4" />
//                             Owners ({owners.length})
//                         </TabsTrigger>
//                         <TabsTrigger value="renters">
//                             <Users className="mr-2 h-4 w-4" />
//                             Renters ({renters.length})
//                         </TabsTrigger>
//                     </TabsList>
//                     <TabsContent value="owners" className="mt-4">
//                         {owners.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {owners.map(owner => renderUserCard(owner, true))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-8 text-muted-foreground">
//                                 No owners found for this unit
//                             </div>
//                         )}
//                     </TabsContent>
//                     <TabsContent value="renters" className="mt-4">
//                         {renters.length > 0 ? (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {renters.map(renter => renderUserCard(renter, false))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-8 text-muted-foreground">
//                                 No renters found for this unit
//                             </div>
//                         )}
//                     </TabsContent>
//                 </Tabs>
//             </div>
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
import { CalendarDays, Home, Mail, Phone, User, Users, Crown, MapPin, ImageIcon } from "lucide-react";
import { useChangeState } from "@/Hooks/useChangeState";
import { motion, AnimatePresence } from "framer-motion"; // For animations
import { toast } from "react-toastify";
// import { Progress } from "@/components/ui/progress"; // For occupancy progress bar
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Utility to format dates
const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }) : "N/A";
};

const UnitDetails = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { id } = useParams();
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [activeTab, setActiveTab] = useState("overview");

    const { refetch, loading, data } = useGet({ url: `${apiUrl}/appartment_profile/${id}` });
    const { changeState, loadingChange } = useChangeState();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const handleToggleType = async (user, type) => {
        const response = await changeState(
            `${apiUrl}/appartment_profile/update/${user.id}?user_type=${type}`,
            `${user.name || "User"} user type changed successfully.`
        );
        if (response) {
            refetch();
            toast.success(`${user.name || "User"} is now a ${type} user.`);
        }
    };

    if (isLoading || loading) {
        return <FullPageLoader />;
    }

    if (!data) {
        return (
            <div className="container mx-auto !py-12 !px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold text-muted-foreground">No data available for this unit</h2>
                </motion.div>
            </div>
        );
    }

    const { appartment, owners, renters } = data;

    const renderUserCard = (user, isOwner = true) => (
        <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative !p-4 overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50" />
                <CardHeader className="flex flex-row items-center !space-x-4 !pb-2">
                    <Avatar className="h-14 w-14 ring-2 ring-primary/20">
                        <AvatarImage src={user.image || "/default-avatar.png"} />
                        <AvatarFallback>
                            <User className="h-6 w-6 text-primary" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <CardTitle className="flex items-center justify-between text-lg">
                            <span>{user.name || "Unknown User"}</span>
                            <Badge
                                variant={user.user_type === "super" ? "default" : "outline"}
                                className="flex items-center gap-1 !px-3 !py-1"
                            >
                                {user.user_type === "super" && <Crown className="h-3 w-3" />}
                                {user.user_type.toUpperCase()}
                            </Badge>
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                            {isOwner ? "Owner" : "Renter"}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-3">
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
                                <span>From: {formatDate(user.rent_from)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                <span>To: {formatDate(user.rent_to)}</span>
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={user.user_type === "super" ? "destructive" : "default"}
                                    size="sm"
                                    onClick={() => handleToggleType(user, user.user_type === "super" ? "follower" : "super")}
                                    disabled={loadingChange}
                                    className="flex items-center gap-2"
                                >
                                    {loadingChange ? "Processing..." : user.user_type === "super" ? "Demote" : "Promote"}
                                    {user.user_type !== "super" && <Crown className="h-4 w-4" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {user.user_type === "super" ? "Remove super user status" : "Grant super user status"}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardFooter>
            </Card>
        </motion.div>
    );

    // Calculate occupancy rate (example: based on renters)
    const occupancyRate = renters.length > 0 ? Math.min((renters.length / (owners.length + renters.length)) * 100, 100) : 0;

    return (
        <div className="container mx-auto !py-12 !px-4 max-w-7xl">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="!space-y-8"
            >
                {/* Header Section */}
                <div className="flex justify-center items-center text-center gap-4">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg rounded-full">
                        <AvatarImage src={appartment.image_link} />
                        <AvatarFallback className="bg-teal-100 text-teal-800 text-3xl font-bold">
                            {appartment.unit.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-bold tracking-tight text-primary"
                    >
                        {appartment.unit || "Unit Details"}
                    </motion.h1>
                </div>

                {/* Apartment Overview Card */}
                <Card className="relative !p-6 overflow-hidden bg-gradient-to-br from-primary/5 to-white dark:from-primary/10 dark:to-gray-900 border border-gray-200 dark:border-gray-700">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary/50" />
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Home className="h-6 w-6 text-primary" />
                            {appartment.unit || "Unknown Unit"}
                        </CardTitle>
                        <Badge variant="outline" className="!px-4 !py-1 text-sm font-medium">
                            {appartment.appartment_type_id === 1 ? "Villa" : "Apartment"}
                        </Badge>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6 !pt-6">
                        <div className="flex items-center gap-3">
                            <Users className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Owners</p>
                                <p className="text-lg font-semibold">{owners.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <User className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Renters</p>
                                <p className="text-lg font-semibold">{renters.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <CalendarDays className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Created</p>
                                <p className="text-lg font-semibold">{formatDate(appartment.created_at)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-6 w-6 text-primary" />
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <p className="text-lg font-semibold">{appartment.location || "Not specified"}</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-4">
                        {/* <div className="w-full">
              <p className="text-sm text-muted-foreground">Occupancy Rate</p>
              <Progress value={occupancyRate} className="mt-2 h-2" />
              <p className="text-sm text-muted-foreground mt-1">{Math.round(occupancyRate)}% Occupied</p>
            </div> */}

                    </CardFooter>
                </Card>

                {/* Tabs for Overview, Owners, Renters */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800 rounded-lg !p-1">
                        <TabsTrigger value="overview" className="flex items-center gap-2 !p-2">
                            <Home className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="owners" className="flex items-center gap-2 !p-2">
                            <User className="h-4 w-4" />
                            Owners ({owners.length})
                        </TabsTrigger>
                        <TabsTrigger value="renters" className="flex items-center gap-2 !p-2">
                            <Users className="h-4 w-4" />
                            Renters ({renters.length})
                        </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <TabsContent value="overview" className="!mt-6">
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="!p-4 border border-gray-200 dark:border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Apartment Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Unit Code</p>
                                                <p className="font-medium">{appartment.appartment_code?.[0]?.code || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Zone ID</p>
                                                <p className="font-medium">{appartment.zone_id || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Village ID</p>
                                                <p className="font-medium">{appartment.village_id || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Last Updated</p>
                                                <p className="font-medium">{formatDate(appartment.updated_at)}</p>
                                            </div>
                                        </div> */}
                                        {appartment.appartment_code?.length > 0 && (
                                            <div>
                                                <p className="text-sm text-muted-foreground !mb-2">Access Codes</p>
                                                <div className="grid gap-2">
                                                    {appartment.appartment_code.map(code => (
                                                        <div key={code.id} className="flex items-center justify-between !p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                                            <div>
                                                                <p className="text-sm font-medium">Code: {code.code || "N/A"}</p>
                                                                <p className="text-sm font-medium">User: {code.user?.name || "N/A"} | Phone: {formatDate(code.user?.phone)}</p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Type: {code.type} | From: {formatDate(code.from)} | To: {formatDate(code.to)}
                                                                </p>
                                                            </div>
                                                            {code.image_id_link && (
                                                                <a
                                                                    href={code.image_id_link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-primary hover:underline"
                                                                >
                                                                    View Image
                                                                </a>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="owners" className="!mt-6">
                            <motion.div
                                key="owners"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {owners.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {owners.map(owner => renderUserCard(owner, true))}
                                    </div>
                                ) : (
                                    <Card className="text-center !py-12">
                                        <CardContent className="text-muted-foreground">
                                            No owners found for this unit
                                        </CardContent>
                                    </Card>
                                )}
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="renters" className="!mt-6">
                            <motion.div
                                key="renters"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renters.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {renters.map(renter => renderUserCard(renter, false))}
                                    </div>
                                ) : (
                                    <Card className="text-center !py-12">
                                        <CardContent className="text-muted-foreground">
                                            No renters found for this unit
                                        </CardContent>
                                    </Card>
                                )}
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            </motion.div>
        </div>
    );
};

export default UnitDetails;
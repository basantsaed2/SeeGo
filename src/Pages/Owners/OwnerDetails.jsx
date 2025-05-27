"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router-dom";
import { useGet } from "@/Hooks/UseGet";
import FullPageLoader from "@/components/Loading";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, MapPin, Clock, Calendar, User, Waves, Droplets, AlertCircle, Wrench, Users ,DoorOpen} from "lucide-react";

const OwnerDetails = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { id } = useParams();
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [activeTab, setActiveTab] = useState("profile");

  const { refetch, loading, data } = useGet({
    url: `${apiUrl}/owner/item/${id}`,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading || loading || !data) {
    return <FullPageLoader />;
  }

  const { owner, entrance, rent, problem_request, maintenance_request, visit_requests } = data;

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const ProfileInfoItem = ({ icon, label, value }) => (
    <div className="flex items-start !space-x-4">
      <div className="!mt-1 text-gray-400">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base text-gray-900">{value || "—"}</p>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="!space-y-6"
    >
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-teal-50/50 to-white rounded-3xl">
        <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start ! space-x-0 sm:space-x-6 space-y-4 sm:space-y-0 !p-6">
          <Avatar className="h-28 w-28 border-4 border-white shadow-lg rounded-full">
            <AvatarImage src={owner.image_link} />
            <AvatarFallback className="bg-teal-100 text-teal-800 text-4xl font-bold">
              {owner.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="!space-y-3 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center !space-y-2 sm:!space-y-0 !space-x-4">
              <h2 className="HolmesBold text-4xl font-bold text-gray-800">{owner.name}</h2>
              <Badge
                variant={owner.status === 1 ? "default" : "destructive"}
                className="!px-4 !py-1.5 text-white rounded-full text-sm font-medium bg-teal-600 hover:bg-teal-700"
              >
                {owner.status === 1 ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center justify-center sm:justify-start !space-x-2 text-sm text-gray-500">
              <User className="h-4 w-4" />
              <span className="capitalize">{owner.gender || "Not specified"}</span>
            </div>
          </div>
        </CardHeader>
        <Separator className="bg-teal-100/50" />
        <CardContent className="!p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="HolmesMedium !space-y-6">
              <h3 className="font-semibold text-xl flex items-center text-teal-800">
                <Info className="h-5 w-5 !mr-2" />
                Basic Information
              </h3>
              <div className="!space-y-6">
                <ProfileInfoItem
                  icon={<Calendar className="h-5 w-5" />}
                  label="Birth Date"
                  value={owner.birthDate}
                />
                <ProfileInfoItem
                  icon={<MapPin className="h-5 w-5" />}
                  label="Email"
                  value={owner.email}
                />
                <ProfileInfoItem
                  icon={<Clock className="h-5 w-5" />}
                  label="Phone"
                  value={owner.phone}
                />
              </div>
            </div>
            <div className="!space-y-6">
              <h3 className="font-semibold text-xl flex items-center text-teal-800">
                <User className="h-5 w-5 !mr-2" />
                Parent Information
              </h3>
              {owner.parent ? (
                <div className="flex items-center !space-x-4 !p-4 bg-teal-50 rounded-xl shadow-sm">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={owner.parent.image_link} />
                    <AvatarFallback className="bg-teal-100 text-teal-800 text-xl">
                      {owner.parent.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-lg text-gray-800">{owner.parent.name}</p>
                    <p className="text-sm text-gray-500">{owner.parent.email}</p>
                  </div>
                </div>
              ) : (
                <div className="!p-6 bg-teal-50 rounded-xl text-center text-gray-500 shadow-sm">
                  No parent assigned
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-teal-50/30 !px-2 !py-4">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(owner.updated_at).toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );

  const renderEntranceTab = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="!space-y-6"
    >
      {/* Gates Section */}
      <Card className="border-0 shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-indigo-600 !p-6">
          <CardTitle className="text-white text-xl flex items-center">
            <DoorOpen className="h-5 w-5 !mr-2" /> {/* You'll need this Lucide icon */}
            Gate Entrances
          </CardTitle>
        </CardHeader>
        <CardContent className="!p-6">
          {entrance.gates.length > 0 ? (
            <div className="!space-y-4">
              {entrance.gates.map((gate) => (
                <div
                  key={gate.id}
                  className="border border-indigo-100 rounded-xl !p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center !space-x-4">
                      {gate.gate.image_link && (
                        <img
                          src={gate.gate.image_link}
                          alt={gate.gate.name}
                          className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-lg text-indigo-800">{gate.gate.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center !mt-1">
                          <Clock className="h-4 w-4 !mr-1" />
                          Entered at: {gate.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant={gate.gate.status === 1 ? "default" : "destructive"} className="!px-3 !py-1 rounded-full">
                      {gate.gate.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Separator className="!my-4 bg-indigo-50" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 !mr-1" />
                        Location
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${encodeURIComponent(gate.gate.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-800 hover:text-indigo-600 hover:underline"
                      >
                        {gate.gate.location.length > 40
                          ? `${gate.gate.location.substring(0, 40)}...`
                          : gate.gate.location}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center !py-10">
              <DoorOpen className="h-12 w-12 !mx-auto text-gray-400" />
              <p className="text-gray-500 !mt-3">No gate entrances recorded</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-teal-600 !p-6">
          <CardTitle className="text-white text-xl flex items-center">
            <Waves className="h-5 w-5 !mr-2" />
            Beach Entrances
          </CardTitle>
        </CardHeader>
        <CardContent className="!p-6">
          {entrance.beaches.length > 0 ? (
            <div className="!space-y-4">
              {entrance.beaches.map((beach) => (
                <motion.div
                  key={beach.id}
                  whileHover={{ scale: 1.02 }}
                  className="border border-teal-100 rounded-xl !p-5 bg-white shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-medium text-lg text-teal-800">{beach.beach.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center !mt-1">
                        <Clock className="h-4 w-4 !mr-1" />
                        Entered at: {beach.time}
                      </p>
                    </div>
                    <Badge variant={beach.beach.status === 1 ? "default" : "destructive"} className="!px-3 !py-1 rounded-full">
                      {beach.beach.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Separator className="!my-4 bg-teal-50" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 !mr-1" />
                        Operating Hours
                      </p>
                      <p className="font-medium text-gray-800">{beach.beach.from} - {beach.beach.to}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center !py-10">
              <Waves className="h-12 w-12 !mx-auto text-gray-400" />
              <p className="text-gray-500 !mt-3">No beach entrances recorded</p>
              {/* <Button variant="outline" className="mt-4 border-teal-600 text-teal-600 hover:bg-teal-50">
                Request Beach Access
              </Button> */}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-blue-600 !p-6">
          <CardTitle className="text-white text-xl flex items-center">
            <Droplets className="h-5 w-5 !mr-2" />
            Pool Entrances
          </CardTitle>
        </CardHeader>
        <CardContent className="!p-6">
          {entrance.pools.length > 0 ? (
            <div className="!space-y-4">
              {entrance.pools.map((pool) => (
                <motion.div
                  key={pool.id}
                  whileHover={{ scale: 1.02 }}
                  className="border border-blue-100 rounded-xl !p-5 bg-white shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-medium text-lg text-blue-800">{pool.pool.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center !mt-1">
                        <Clock className="h-4 w-4 !mr-1" />
                        Entered at: {pool.time}
                      </p>
                    </div>
                    <Badge variant={pool.pool.status === 1 ? "default" : "destructive"} className="!px-3 !py-1 rounded-full">
                      {pool.pool.status === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Separator className="!my-4 bg-blue-50" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 flex items-center">
                        <Clock className="h-4 w-4 !mr-1" />
                        Operating Hours
                      </p>
                      <p className="font-medium text-gray-800">{pool.pool.from} - {pool.pool.to}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center !py-10">
              <Droplets className="h-12 w-12 !mx-auto text-gray-400" />
              <p className="text-gray-500 !mt-3">No pool entrances recorded</p>
              {/* <Button variant="outline" className="mt-4 border-blue-600 text-blue-600 hover:bg-blue-50">
                Request Pool Access
              </Button> */}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderProblemRequestsTab = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="!space-y-6"
    >
      <Card className="border-0 shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-amber-600 !p-6">
          <CardTitle className="text-white text-xl flex items-center">
            <AlertCircle className="h-5 w-5 !mr-2" />
            Problem Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="!p-6">
          {problem_request.length > 0 ? (
            <div className="!space-y-4">
              {problem_request.map((request) => (
                <motion.div
                  key={request.id}
                  whileHover={{ scale: 1.02 }}
                  className="border border-amber-100 rounded-xl !p-5 bg-white shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h4 className="font-medium text-lg text-amber-800">
                        {request.description || "No description provided"}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center !mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={request.status === "resolved" ? "default" : "destructive"} className="!px-3 !py-1 rounded-full">
                      {request.status}
                    </Badge>
                  </div>
                  <Separator className="my-4 bg-amber-50" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 !mr-1" />
                        Location
                      </p>
                      <a
                        href={request.google_map}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        View on Map
                      </a>
                    </div>
                    {request.image_link && (
                      <div>
                        <p className="text-gray-500">Image</p>
                        <img
                          src={request.image_link}
                          alt="Problem report"
                          className="h-32 w-auto rounded-md object-cover border border-gray-200 !mt-1"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center !py-10">
              <AlertCircle className="h-12 w-12 !mx-auto text-gray-400" />
              <p className="text-gray-500 !mt-3">No problem reports submitted</p>
              {/* <Button variant="outline" className="mt-4 border-amber-600 text-amber-600 hover:bg-amber-50">
                Report a Problem
              </Button> */}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderMaintenanceTab = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="!space-y-6"
    >
      <Card className="border-0 shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-purple-600 !p-6">
          <CardTitle className="text-white text-xl flex items-center">
            <Wrench className="h-5 w-5 !mr-2" />
            Maintenance Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="!p-6">
          {maintenance_request.length > 0 ? (
            <div className="!space-y-4">
              {maintenance_request.map((request) => (
                <motion.div
                  key={request.id}
                  whileHover={{ scale: 1.02 }}
                  className="border border-purple-100 rounded-xl !p-5 bg-white shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h4 className="font-medium text-lg text-purple-800">
                        {request.maintenance_type.name}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center !mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={request.status_request === "completed" ? "default" : "destructive"} className="!px-3 !py-1 rounded-full">
                      {request.status_request}
                    </Badge>
                  </div>
                  <Separator className="!my-4 bg-purple-50" />
                  <div>
                    <p className="text-gray-500">Description</p>
                    <p className="!mt-1 text-gray-800">{request.description || "No description provided"}</p>
                  </div>
                  {request.image_link && (
                    <div className="!mt-4">
                      <p className="text-gray-500">Image</p>
                      <img
                        src={request.image_link}
                        alt="Maintenance request"
                        className="h-32 w-auto rounded-md object-cover border border-gray-200 !mt-1"
                      />
                    </div>
                  )}
                  <Separator className="!my-4 bg-indigo-50" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Apartment Details</p>
                      <div className="flex items-center space-x-2 !mt-1">
                        <span className="font-medium text-gray-800">{request.appartment.unit}</span>
                        <span className="text-gray-500 text-xs">
                          ({request.appartment.number_floors} floors)
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center !py-10">
              <Wrench className="h-12 w-12 !mx-auto text-gray-400" />
              <p className="text-gray-500 !mt-3">No maintenance requests submitted</p>
              {/* <Button variant="outline" className="mt-4 border-purple-600 text-purple-600 hover:bg-purple-50">
                Request Maintenance
              </Button> */}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderVisitsTab = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="!space-y-6"
    >
      <Card className="border-0 shadow-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-indigo-600 !p-6">
          <CardTitle className="text-white text-xl flex items-center">
            <Users className="h-5 w-5 !mr-2" />
            Visit Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="!p-6">
          {visit_requests.length > 0 ? (
            <div className="!space-y-4">
              {visit_requests.map((visit) => (
                <motion.div
                  key={visit.id}
                  whileHover={{ scale: 1.02 }}
                  className="border border-indigo-100 rounded-xl !p-5 bg-white shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h4 className="font-medium text-lg text-indigo-800 capitalize">
                        {visit.visitor_type} Visit
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center !mt-1">
                        <MapPin className="h-4 w-4 !mr-1" />
                        Apartment: {visit.appartment.unit}
                      </p>
                    </div>
                  </div>
                  <Separator className="!my-4 bg-indigo-50" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Apartment Details</p>
                      <div className="flex items-center !space-x-2 !mt-1">
                        <span className="font-medium text-gray-800">{visit.appartment.unit}</span>
                        <span className="text-gray-500 text-xs">
                          ({visit.appartment.number_floors} floors)
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center !py-10">
              <Users className="h-12 w-12 !mx-auto text-gray-400" />
              <p className="text-gray-500 !mt-3">No visit requests recorded</p>
              {/* <Button variant="outline" className="mt-4 border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                Request Visitor Access
              </Button> */}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="container !mx-auto !py-6 !px-4">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col gap-5"
      >
        <TabsList className="!p-4 text-md grid w-full grid-cols-2 md:grid-cols-5 gap-4 bg-transparent !mb-6">
          <TabsTrigger
            value="profile"
            className="rounded-xl border text-teal-700 !py-3 transition-all 
              data-[state=active]:bg-teal-600 data-[state=active]:text-white 
              hover:bg-teal-100 hover:text-teal-700 shadow-md flex items-center"
          >
            <User className="h-4 w-4 !mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="entrance"
            className="rounded-xl border text-teal-700 !py-3 transition-all 
              data-[state=active]:bg-teal-600 data-[state=active]:text-white 
              hover:bg-teal-100 hover:text-teal-700 shadow-md flex items-center"
          >
            <MapPin className="h-4 w-4 !mr-2" />
            Entrances
          </TabsTrigger>
          <TabsTrigger
            value="problems"
            className="rounded-xl border text-teal-700 !py-3 transition-all 
              data-[state=active]:bg-teal-600 data-[state=active]:text-white 
              hover:bg-teal-100 hover:text-teal-700 shadow-md flex items-center"
          >
            <AlertCircle className="h-4 w-4 !mr-2" />
            Problems
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="rounded-xl border text-teal-700 !py-3 transition-all 
              data-[state=active]:bg-teal-600 data-[state=active]:text-white 
              hover:bg-teal-100 hover:text-teal-700 shadow-md flex items-center"
          >
            <Wrench className="h-4 w-4 !mr-2" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger
            value="visits"
            className="rounded-xl border text-teal-700 !py-3 transition-all 
              data-[state=active]:bg-teal-600 data-[state=active]:text-white 
              hover:bg-teal-100 hover:text-teal-700 shadow-md flex items-center"
          >
            <Users className="h-4 w-4 !mr-2" />
            Visits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">{renderProfileTab()}</TabsContent>
        <TabsContent value="entrance">{renderEntranceTab()}</TabsContent>
        <TabsContent value="problems">{renderProblemRequestsTab()}</TabsContent>
        <TabsContent value="maintenance">{renderMaintenanceTab()}</TabsContent>
        <TabsContent value="visits">{renderVisitsTab()}</TabsContent>
      </Tabs>
    </div>
  );
};

export default OwnerDetails;
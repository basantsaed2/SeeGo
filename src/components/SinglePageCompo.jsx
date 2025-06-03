import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  FileText,
  Home,
  Users,
  Phone,
  Calendar,
  Globe,
} from "lucide-react";
import VilliageAdmin from "@/Pages/Villiage/VilliageAdmins/VilliageAdmin";
import VGallery from "@/Pages/Villiage/VGallery";
import Units from "@/Pages/Villiage/Units";
import Gallery from "./Gallery";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Profile from "@/Pages/Profile/Profile";

export default function VillageDetailsCard({
  data,
  status = "Active",
  entityType,
}) {
  const { t, i18n } = useTranslation();
  const dira = i18n.language === "ar" ? "rtl" : "ltr";
  const location = useLocation();

  if (!data) return null;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isImagesPath = location.pathname.includes("/images");
  const isProfilePath = location.pathname.includes("/profile");

  let defaultTabValue = "info"; // Default for all other paths
  if (isImagesPath) {
    defaultTabValue = "gallery";
  } else if (isProfilePath) {
    defaultTabValue = "info";
  }

  // Determine the number of columns for TabsList based on which tabs will be visible
  let gridColsClass;
  if (isImagesPath) {
    gridColsClass = 'grid-cols-1'; // Only 'Images' for pure /images path
  } else if (isProfilePath) {
    gridColsClass = 'grid-cols-2'; // Only 'Information' and 'Profile' for /profile path
  } else {
    gridColsClass = 'grid-cols-4'; // Default for village pages (Info, Admin, Images, Units)
  }


  return (
    <div className="w-full">
      <Tabs defaultValue={defaultTabValue} className="w-full">
        <TabsList className={`w-full grid gap-2 md:gap-6 bg-transparent !my-6 ${gridColsClass}`}>
          {/* Information Tab */}
          {/* Show if NOT pure /images path, and also show for /profile path */}
          {!isImagesPath && (
            <TabsTrigger
              className="rounded-[10px] text-md md:text-lg border text-bg-primary !py-3 transition-all
                    data-[state=active]:bg-bg-primary data-[state=active]:text-white
                    hover:bg-teal-100 hover:text-teal-700"
              value="info"
            >
              {t("Infomation")}
            </TabsTrigger>
          )}

          {/* Admin Tab (only for non-image/profile specific pages) */}
          {!isImagesPath && !isProfilePath && (
            <TabsTrigger
              className="rounded-[10px] text-md md:text-lg border text-bg-primary !py-3 transition-all
                        data-[state=active]:bg-bg-primary data-[state=active]:text-white
                        hover:bg-teal-100 hover:text-teal-700"
              value="admin"
            >
              {t("Admins")}
            </TabsTrigger>
          )}

          {/* Images/Gallery Tab */}
          {/* Hide if it's the /profile path */}
          {!isProfilePath && (
            <TabsTrigger
              className="rounded-[10px] text-md md:text-lg border text-bg-primary !py-3 transition-all
                    data-[state=active]:bg-bg-primary data-[state=active]:text-white
                    hover:bg-teal-100 hover:text-teal-700"
              value="gallery"
            >
              {t("Images")}
            </TabsTrigger>
          )}

          {/* Units Tab (only for specific entityType and non-image/profile specific pages) */}
          {!isImagesPath && !isProfilePath && entityType === "village" && (
            <TabsTrigger
              className="rounded-[10px] text-md md:text-lg border text-bg-primary !py-3 transition-all
                                data-[state=active]:bg-bg-primary data-[state=active]:text-white
                                hover:bg-teal-100 hover:text-teal-700"
              value="units"
            >
              {t("Units")}
            </TabsTrigger>
          )}

          {/* Profile Tab (only for profile specific pages) */}
          {isProfilePath && (
            <TabsTrigger
              className="rounded-[10px] text-md md:text-lg border text-bg-primary !py-3 transition-all
                        data-[state=active]:bg-bg-primary data-[state=active]:text-white
                        hover:bg-teal-100 hover:text-teal-700"
              value="profile"
            >
              {t("Profile")}
            </TabsTrigger>
          )}
        </TabsList>

        {/* TabsContent - simplified conditional rendering */}
<TabsContent value="info">
          <Card className="!p-8 !mb-2 bg-gradient-to-br from-[#f3fbfa] to-white w-full shadow-lg border-none rounded-2xl transition-all duration-300 hover:shadow-xl">
            <CardContent className="flex flex-col gap-6">
              {/* Header Section */}
              <div  dir={dira} className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {data.image && (
                    <img
                      src={data.image}
                      alt="Village"
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#297878] transition-transform duration-300 hover:scale-105"
                    />
                  )}
                  <h3 className="text-xl font-bold text-bg-primary tracking-tight">
                    {data.name}
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className={`!px-5 !py-2 text-sm font-medium cursor-pointer rounded-full transition-colors duration-200 ${status === "Active"
                      ? "bg-green-100 hover:bg-green-200 text-green-800"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                    }`}
                >
                  {status}
                </Badge>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 gap-4 text-sm text-bg-primary">
                {[
                  { field: 'location', icon: MapPin, label: t('Location') },
                  { field: 'description', icon: FileText, label: t('Description') },
                  { field: 'units', icon: Home, label: t('Units') },
                  { field: 'population', icon: Users, label: t('Population') },
                  { field: 'zone', icon: Globe, label: t('Zone')},
                  { field: 'village', icon: MapPin, label: t('Village') },
                  { field: 'phone', icon: Phone, label: t('Phone') },
                ].map(({ field, icon: Icon, label }) => (
                  data[field] && (
                    <div
                    dir={dira}
                      key={field}
                      className="flex  items-center gap-3 !p-1 rounded-lg hover:bg-[#e6f0ef] transition-colors duration-200"
                    >
                      <Icon className="w-5 h-5 text-[#297878] flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-[#297878]">{label}:</span>
                        <span className="!ml-2 text-gray-800">{data[field]}</span>
                      </div>
                    </div>
                  )
                ))}

                {/* Date Range Section */}
                {(data.from || data.to) && (
                  <div  dir={dira} className="flex items-center gap-3 !p-1 rounded-lg hover:bg-[#e6f0ef] transition-colors duration-200">
                    <Calendar className="w-5 h-5 text-[#297878] flex-shrink-0" />
                    <div className="flex items-center gap-2">
                      {data.from && (
                        <span className="flex items-center">
                          <span className="font-semibold text-[#297878]">{t('From')}:</span>
                          <span className="!ml-2 text-gray-800">{formatDate(data.from)}</span>
                        </span>
                      )}
                      {data.from && data.to && (
                        <span  className={`text-gray-500  !mx-2 `}>{dira==="rtl"?"←":"→"}</span>
                      )}
                      {data.to && (
                        <span className="flex items-center">
                          <span className="font-semibold text-[#297878]">{t("To")}:</span>
                          <span className="!ml-2 text-gray-800">{formatDate(data.to)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <VilliageAdmin />
        </TabsContent>

        <TabsContent value="gallery">
          <Gallery />
        </TabsContent>

        <TabsContent value="profile">
          <Profile />
        </TabsContent>

        <TabsContent value="units">
          <Units />
        </TabsContent>
      </Tabs>
    </div>
  );
}
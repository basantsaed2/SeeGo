// import React, { useContext } from 'react';
// import { useTranslation } from 'react-i18next';
// import { LanguageContext } from './../context/LanguageContext';
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { LogOut } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "./ui/button";

// export default function Navbar() {
//   const userData = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();
//   const userName = userData?.village?.name; 
//   const userInitials = userName
//     ? userName.split(" ").slice(0, 2).map((word) => word[0]).join("") 
//     : "AD";
//     const handleLogout = () => {
//       localStorage.removeItem("user");
//       localStorage.removeItem("token");
//       navigate("/login");
//     };

//   const { t } = useTranslation();
//   const { changeLanguage } = useContext(LanguageContext);
//   return (
//     <header className="w-full h-16 flex items-center justify-between !p-6">
//       {/* Left: Welcome text with Avatar */}
//       <div className="flex items-center gap-2 text-teal-600 font-semibold text-lg">
//         <Avatar className="w-9 h-9 bg-gray-300 text-white font-bold text-sm">
//           <AvatarFallback>{userInitials}</AvatarFallback>
//         </Avatar>
//         Hello {userName || "Admin"}
//       </div>

//       {/* <div>
//       <h1 className="text-2xl font-bold">{t('welcome')}</h1>
//       <button onClick={() => changeLanguage('en')}>English</button>
//       <button onClick={() => changeLanguage('ar')}>العربية</button>
//     </div> */}

//       {/* Right: Icons */}
//       <div className="flex items-center gap-6 text-teal-600 font-semibold">
//       <Button
//           variant="ghost"
//           onClick={handleLogout}
//           className="text-bg-primary cursor-pointer flex items-center gap-2 hover:text-teal-700"
//         >
//           <LogOut className="w-4 h-4" />
//           Logout
//         </Button>
//       </div>
//     </header>
//   );
// }



import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "./../context/LanguageContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Bell, Wrench, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useGet } from "@/Hooks/UseGet";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const userName = userData?.village?.name;
  const userInitials = userName
    ? userName.split(" ").slice(0, 2).map((word) => word[0]).join("")
    : "AD";
  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);

  // Retrieve totals from Redux store
  const { totalMaintenance, totalProblems } = useSelector((state) => state.notifications);

  // Fetch notification data from API with polling every 10 minutes
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { data: notificationData, loading: notificationLoading } = useGet({
    url: `${apiUrl}/notifications?maintenance=${totalMaintenance}&problem_report=${totalProblems}`,
    pollInterval: 10 * 60 * 1000,
  });

  // Calculate notification counts
  const newMaintenanceCount = Math.max(
    0,
    notificationData?.new_maintenance - notificationData?.maintenance_notification || 0
  );
  const newProblemCount = Math.max(
    0,
    notificationData?.new_problem_report - notificationData?.problem_report_notification || 0
  );
  const totalNotifications = newMaintenanceCount + newProblemCount;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="w-full h-16 flex items-center justify-between !px-6">
      {/* Left: Welcome text with Avatar */}
      <div className="flex items-center gap-3 text-teal-700 font-semibold text-lg">
        <Avatar className="w-10 h-10 bg-teal-100 text-teal-700 font-bold">
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        {t("hello")} {userName || "Admin"}
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-6">
        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative !p-2 rounded-full hover:bg-teal-50 focus:ring-2 focus:ring-teal-200"
              aria-label={totalNotifications > 0 ? `${totalNotifications} new notifications` : "No new notifications"}
            >
              <Bell className="w-5 h-5 text-teal-600" />
              {totalNotifications > 0 && !notificationLoading && (
                <Badge
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full !px-2 !py-0.5 text-xs font-medium transition-transform duration-200 ease-in-out transform hover:scale-110"
                >
                  {totalNotifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 bg-white shadow-lg rounded-lg border border-gray-100 !p-2 transition-all duration-200"
          >
            <DropdownMenuLabel className="text-lg font-semibold text-teal-700 !px-4 !py-2">
              {t("notifications")}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200" />
            {totalNotifications === 0 && !notificationLoading ? (
              <DropdownMenuItem
                className="!px-4 !py-3 text-gray-500 italic cursor-default"
                disabled
              >
                {t("no_new_notifications")}
              </DropdownMenuItem>
            ) : (
              <>
                <DropdownMenuItem
                  onClick={() => navigate("/maintenance_request")}
                  className="flex items-center gap-3 !px-4 !py-3 rounded-md hover:bg-teal-50 focus:bg-teal-50 cursor-pointer transition-colors duration-150"
                >
                  <Wrench className="w-5 h-5 text-teal-600" />
                  <span className="flex-1 text-gray-800">{t("new_maintenance_requests")}</span>
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-700 !px-2 !py-0.5 rounded-full"
                  >
                    {newMaintenanceCount}
                  </Badge>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigate("/problems")}
                  className="flex items-center gap-3 !px-4 !py-3 rounded-md hover:bg-teal-50 focus:bg-teal-50 cursor-pointer transition-colors duration-150"
                >
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <span className="flex-1 text-gray-800">{t("new_problem_reports")}</span>
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-700 !px-2 !py-0.5 rounded-full"
                  >
                    {newProblemCount}
                  </Badge>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-teal-700 hover:text-teal-900 hover:bg-teal-50 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {t("logout")}
        </Button>
      </div>
    </header>
  );
}

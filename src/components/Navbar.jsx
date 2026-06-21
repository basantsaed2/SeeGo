import React, { useContext, useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "./../context/LanguageContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGet } from "@/Hooks/UseGet";
import { usePost } from "@/Hooks/UsePost"; 
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipboardList, LogOut, Bell, Wrench, AlertTriangle, Globe, ArrowLeft, Check, CheckCheck } from "lucide-react";
import notificationSound from "@/assets/sounds/notification.mp3";
export default function Navbar() {
  let userData = null;
  const userString = localStorage.getItem("user");
  
  const previousUnreadRef = useRef(0);
const audioRef = useRef(new Audio(notificationSound));
  if (userString && userString !== "undefined") {
    try {
      userData = JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }

  const navigate = useNavigate();
  const location = useLocation();
  const userName = userData?.village?.name;
  const userInitials = userName
    ? userName.split(" ").slice(0, 2).map((word) => word[0]).join("")
    : "AD";
  const { t, i18n } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // 1. جلب الإشعارات (متوافق مع كود الـ useGet بتاعك)
  const { data: notificationData, loading: notificationLoading, refetch: refetchItems } = useGet({
    url: `${apiUrl}/notifications/items`,
    pollInterval: 1 * 60 * 1000, 
  });

  // 2. استدعاء الـ usePost بالشكل الصحيح لمستنداتك (تفكيك postData و تعيين type لإرسال JSON)
  const { postData } = usePost({
    url: `${apiUrl}/notifications/is_read`,
    type: true, // عشان يبعت البيانات كـ application/json
  });

  const notificationsList = notificationData?.notifications?.data || [];
  
  // إجمالي عدد الإشعارات غير المقروءة للـ Badge الحمراء
  const totalUnreadNotifications = notificationsList.filter(item => item.is_read === 0).length;

  // صوت الإشعارات عند التحديث
  useEffect(() => {
    if (!notificationLoading && notificationData) {
      if (totalUnreadNotifications > previousUnreadRef.current) {
        audioRef.current.play().catch((err) => {
          console.log("Audio playback waiting for user interaction:", err);
        });
      }
      previousUnreadRef.current = totalUnreadNotifications;
    }
  }, [totalUnreadNotifications, notificationLoading, notificationData]);

  // 1️⃣ دالة قراءة إشعار واحد فقط (Read Single Item)
  const handleReadSingleItem = async (e, item) => {
    e.stopPropagation(); // منع الـ Dropdown من الانغلاق
    
    try {
      // بنادي postData وبنستنى تنفيذها (await)
      await postData({ items: [item.id] });
      // بنعمل تحديث فوري للقائمة عشان العداد يقل والإشعار يتحدث
      refetchItems();
      toast.success(t("Notification marked as read"));
    } catch (err) {
      console.error(err);
    }
  };

  // دالة عند الضغط على نص الإشعار نفسه للتوجيه
  const handleNotificationContentClick = async (item) => {
    if (item.is_read === 0) {
      try {
        await postData({ items: [item.id] });
        refetchItems();
      } catch (err) {
        console.error(err);
      }
    }

    if (item.type === "login") {
      navigate("/login-requests"); 
    } else if (item.type === "code") {
      navigate("/pending-requests"); 
    }
  };

  // 2️⃣ دالة قراءة كل الإشعارات مع بعض (Read All)
  const handleReadAllNotifications = async () => {
    const unreadIds = notificationsList.filter(item => item.is_read === 0).map(item => item.id);
    
    if (unreadIds.length > 0) {
      try {
        await postData({ items: unreadIds });
        refetchItems(); // تحديث فوري للكل
        toast.success(t("All notifications marked as read"));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("https://bcknd.sea-go.org/api/logout", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200 || response.status === 204) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("village_id");
        sessionStorage.clear();
        toast.success(t("Logout successful"));
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("village_id");
      navigate("/login");
    }
  };

  const languages = [
    { code: "en", label: t("english"), flag: "EN" },
    { code: "ar", label: t("arabic"), flag: "AR" },
  ];

  return (
    <>
      <SidebarTrigger className="text-teal-600 hover:bg-teal-50 rounded-full" />

      <header className="w-full h-16 flex items-center justify-between !px-6">
        {/* Left Section */}
        <div className="flex items-center gap-2 text-teal-700 font-semibold text-lg">
          {location.pathname !== "/" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-bg-primary hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 font-bold" />
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => navigate("/profile")}
            className="flex cursor-pointer items-center gap-2 !p-0 rounded-full hover:bg-transparent"
          >
            <Avatar className="w-10 h-10 bg-teal-100 text-teal-700 font-bold">
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <span>{t("Hello")} {userName || "Admin"}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/pending-requests")}
            className="text-teal-700 hover:bg-teal-50 relative cursor-pointer"
          >
            <ClipboardList className="w-5 h-5" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="!p-2 rounded-full hover:bg-teal-50">
                <Globe className="w-5 h-5 text-teal-600" />
                <span className="ml-2 text-teal-700 font-medium hidden sm:inline">
                  {languages.find((lang) => lang.code === i18n.language)?.label || "Language"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg rounded-lg border border-gray-100 !p-2">
              <DropdownMenuLabel className="text-base font-semibold text-teal-700">{t("select_language")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center gap-2 rounded-md cursor-pointer ${i18n.language === lang.code ? "bg-teal-100 text-teal-800 font-semibold" : "hover:bg-teal-50"}`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="flex-1">{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative !p-2 rounded-full hover:bg-teal-50">
                <Bell className="w-5 h-5 text-teal-600" />
                {totalUnreadNotifications > 0 && !notificationLoading && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full !px-2 !py-0.5 text-xs font-medium">
                    {totalUnreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-80 sm:w-96 bg-white shadow-xl rounded-lg border border-gray-100 !p-2 max-h-[450px] overflow-y-auto">
              <div className="flex items-center justify-between !px-4 !py-2">
                <DropdownMenuLabel className="text-lg font-semibold text-teal-700 !p-0">
                  {t("notifications")}
                </DropdownMenuLabel>
                
                {/* زرار الـ Read All */}
                {totalUnreadNotifications > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleReadAllNotifications}
                    className="text-xs text-teal-600 hover:text-teal-800 hover:bg-teal-50 gap-1 h-8 !px-2"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    {t("Mark all read")}
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator className="bg-gray-100" />
              
              {notificationsList.length === 0 && !notificationLoading ? (
                <DropdownMenuItem className="!px-4 !py-4 text-gray-500 italic text-center cursor-default" disabled>
                  {t("no_notifications")}
                </DropdownMenuItem>
              ) : (
                <div className="flex flex-col gap-1">
                  {notificationsList.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => handleNotificationContentClick(item)}
                      className={`flex items-start justify-between gap-2 !px-3 !py-2.5 rounded-md cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                        item.is_read === 0 ? "bg-blue-50/60 hover:bg-blue-50 font-medium" : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.type === "login" ? (
                          <Wrench className="w-4 h-4 text-teal-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                      
                      <div className="flex-1 text-xs leading-relaxed text-right dir-rtl">
                        {item.notification}
                      </div>

                      {/* زرار قراءة إشعار واحد فقط */}
                      {item.is_read === 0 && (
                        <Button
                          size="icon"
                          variant="ghost"
                          title={t("Mark as read")}
                          onClick={(e) => handleReadSingleItem(e, item)}
                          className="h-6 w-6 rounded-full text-gray-400 hover:text-teal-600 hover:bg-white shrink-0 self-center ml-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Logout Button */}
          <Button variant="ghost" onClick={handleLogout} className="text-teal-700 hover:bg-teal-50 flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            {t("Logout")}
          </Button>
        </div>
      </header>
    </>
  );
}
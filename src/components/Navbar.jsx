import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from './../context/LanguageContext';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export default function Navbar() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const userName = userData?.village?.name; 
  const userInitials = userName
    ? userName.split(" ").slice(0, 2).map((word) => word[0]).join("") 
    : "AD";
    const handleLogout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    };

  const { t } = useTranslation();
  const { changeLanguage } = useContext(LanguageContext);
  return (
    <header className="w-full h-16 flex items-center justify-between !p-6">
      {/* Left: Welcome text with Avatar */}
      <div className="flex items-center gap-2 text-teal-600 font-semibold text-lg">
        <Avatar className="w-9 h-9 bg-gray-300 text-white font-bold text-sm">
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        {t("Hello")} {userName || "Admin"}
      </div>

    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">

  <select
    onChange={(e) => changeLanguage(e.target.value)}
    className="mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="en">AR</option>
    <option value="ar">EN</option>
  </select>
</div>


      {/* Right: Icons */}
      <div className="flex items-center gap-6 text-teal-600 font-semibold">
      <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-bg-primary cursor-pointer flex items-center gap-2 hover:text-teal-700"
        >
          <LogOut className="w-4 h-4" />
          {t("Logout")}
        </Button>
      </div>
    </header>
  );
}

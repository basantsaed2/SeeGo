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
        Hello {userName || "Admin"}
      </div>

      {/* <div>
      <h1 className="text-2xl font-bold">{t('welcome')}</h1>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ar')}>العربية</button>
    </div> */}

      {/* Right: Icons */}
      <div className="flex items-center gap-6 text-teal-600 font-semibold">
      <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-bg-primary cursor-pointer flex items-center gap-2 hover:text-teal-700"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

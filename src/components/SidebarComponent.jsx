import { useLocation } from "react-router-dom"; // مهم لتحديد المسار الحالي
import {
  Home, CircleDollarSign, Building2, Building, Newspaper, Settings, Users, CreditCard, DollarSign, UserRoundCog, Wrench
} from "lucide-react";
import { FaBuildingUser } from "react-icons/fa6";
import { TbBeach } from "react-icons/tb";
import { MdOutlinePool } from "react-icons/md";
import { RiCustomerServiceLine } from "react-icons/ri";
import { MdOutlineSyncProblem } from "react-icons/md";
import { GrHostMaintenance } from "react-icons/gr";
import { MdOutlineSupervisedUserCircle } from "react-icons/md";
import { GiSecurityGate } from "react-icons/gi";
import { GiOpenGate } from "react-icons/gi";
import { FaUserSecret } from "react-icons/fa";
import { RiCommunityFill } from "react-icons/ri";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTranslation } from 'react-i18next';
import { FaMoneyBillTransfer } from "react-icons/fa6";

const navItems = [
  { label: "Home", to: "/", icon: <Home size={20} /> },
  { label: "Owners", to: "/owners", icon: <FaBuildingUser size={20} /> },
  { label: "Units", to: "/units", icon: <RiCommunityFill size={20} /> },
  { label: "Beaches", to: "/beaches", icon: <TbBeach size={20} /> },
  { label: "Pools", to: "/pools", icon: <MdOutlinePool size={20} /> },
  { label: "Service Provider", to: "/services", icon: <UserRoundCog size={20} /> },
  { label: "Visits", to: "/visits", icon: <MdOutlineSupervisedUserCircle size={20} /> },
  { label: "Problems", to: "/problems", icon: <MdOutlineSyncProblem size={20} /> },
  { label: "Maintenance Request", to: "/maintenance_request", icon: <GrHostMaintenance size={20} /> },
  { label: "Maintenance Fees", to: "/maintenance_fees", icon: <FaMoneyBillTransfer size={20} /> },
  { label: "Maintenance Type", to: "/maintenance_type", icon: <FaMoneyBillTransfer size={20} /> },
  { label: "Gates", to: "/gates", icon: <GiOpenGate size={20} /> },
  { label: "Security Men", to: "/security_man", icon: <FaUserSecret size={20} /> },
  { label: "Rent & Sale", to: "/rent_sale", icon: <Building2 size={20} /> },
  { label: "Rent", to: "/rents", icon: <Building size={20} /> },
  { label: "Payments", to: "/payments", icon: <CircleDollarSign size={20} /> },
  // { label: "Services Type", to: "/service_type", icon: <Wrench size={20} /> },
  { label: "News Feed", to: "/posts", icon: <Newspaper size={20} /> },
  { label: "Villiage Single Page", to: "/villiage_info", icon: <Newspaper size={20} /> },
  { label: "Visitor Limit", to: "/visitor_limit", icon: <Newspaper size={20} /> },
];

export function AppSidebar() {
  const location = useLocation(); // جلب المسار الحالي
  const isSidebarOpen = true; // ممكن تعدله لاحقًا حسب حالتك

  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <Sidebar side={isRTL ? 'right' : 'left'} className="bg-teal-600 rtl:rounded-bl-4xl ltr:rounded-br-4xl  border-none sm:border-none rtl:rounded-tl-4xl ltr:rounded-tr-4xl overflow-x-hidden !pb-10 !pt-10 h-full shadow-lg transition-all duration-300">
      <SidebarContent
        className={`bg-teal-600 !p-6 text-white mt-10 border-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden`}
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        <SidebarGroup>
          <SidebarGroupLabel className="text-white text-3xl font-semibold flex flex-col justify-center items-center text-center  !mb-3">
            SEA GO
            <hr className="w-1/2 mx-auto border-white !mt-3 !mb-6" />
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="list-none p-0 bg-teal-600 flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <SidebarMenuItem key={item.label}>
                    <a href={item.to} className="w-full">
                      <SidebarMenuButton
                        isActive={isActive}
                        className={`flex justify-start items-center gap-3 !px-4 !py-2 text-white transition-all duration-200 text-sm font-medium
                          ${isSidebarOpen ? "rounded-full" : ""}
                          ${isActive
                            ? "bg-white text-bg-primary shadow-md"
                            : "hover:bg-white hover:text-bg-primary"
                          }`}
                      >
                        {item.icon}
                        <span className="text-base">{item.label}</span>
                      </SidebarMenuButton>
                    </a>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

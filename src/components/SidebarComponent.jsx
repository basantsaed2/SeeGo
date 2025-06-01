"use client";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Home,
  DollarSign,
  Building,
  Building2,
  Newspaper,
  Users,
  CreditCard,
  UserCog,
  Wrench,
  ChevronDown,
  ChevronRight,
  Package,
  ReceiptText,
  DoorOpen,
  Settings,
  Info,
  Handshake,
  ScrollText,
  BarChart2,
  ListChecks,
} from "lucide-react";
import { FaBuildingUser, FaMoneyBillTransfer } from "react-icons/fa6";
import { TbBeach } from "react-icons/tb";
import { MdOutlinePool, MdOutlineSyncProblem, MdOutlineSupervisedUserCircle } from "react-icons/md";
import { GrHostMaintenance } from "react-icons/gr";
import { GiOpenGate } from "react-icons/gi";
import { FaUserShield } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";

export function AppSidebar() {
  const { t, i18n } = useTranslation();

  const navItems = [
    { label: t("Home"), to: "/", icon: <Home size={20} /> },
    { label: t("Units"), to: "/units", icon: <Building size={20} /> },
    {
      label: t("Assets"),
      icon: <Building2 size={20} />,
      subItems: [
        { label: t("Gates"), to: "/gates", icon: <GiOpenGate size={20} /> },
        { label: t("Pools"), to: "/pools", icon: <MdOutlinePool size={20} /> },
        { label: t("Beaches"), to: "/beaches", icon: <TbBeach size={20} /> },
      ],
    },
    {
      label: t("UserList"),
      icon: <Users size={20} />,
      subItems: [
        { label: t("Owners"), to: "/owners", icon: <FaBuildingUser size={20} /> },
        { label: t("SecurityMan"), to: "/security_man", icon: <FaUserShield size={20} /> },
        { label: t("Admins"), to: "/admins", icon: <UserCog size={20} /> },
      ],
    },
    {
      label: t("Subscription"),
      icon: <CreditCard size={20} />,
      subItems: [
        { label: t("Packages"), to: "/packages_list", icon: <Package size={20} /> },
        { label: t("Invoices"), to: "/invoice", icon: <ReceiptText size={20} /> },
      ],
    },
    {
      label: t("Request"),
      icon: <ListChecks size={20} />,
      subItems: [
        { label: t("Problems"), to: "/problems", icon: <MdOutlineSyncProblem size={20} /> },
        { label: t("MaintenanceRequest"), to: "/maintenance_request", icon: <GrHostMaintenance size={20} /> },
      ],
    },
    {
      label: t("Entrance"),
      icon: <DoorOpen size={20} />,
      subItems: [
        { label: t("Visits"), to: "/visits", icon: <Handshake size={20} /> },
        { label: t("VisitorLimit"), to: "/visitor_limit", icon: <ScrollText size={20} /> },
      ],
    },
    {
      label: t("Settings"),
      icon: <Settings size={20} />,
      subItems: [
        { label: t("VillageSinglePage"), to: "/villiage_info", icon: <Info size={20} /> },
      ],
    },
    {
      label: t("Maintenance"),
      icon: <Wrench size={20} />,
      subItems: [
        { label: t("MaintenanceFees"), to: "/maintenance_fees", icon: <FaMoneyBillTransfer size={20} /> },
        { label: t("MaintenanceType"), to: "/maintenance_type", icon: <Wrench size={20} /> },
      ],
    },
    {
      label: t("Data"),
      icon: <BarChart2 size={20} />,
      subItems: [
        { label: t("RentSale"), to: "/rent_sale", icon: <DollarSign size={20} /> },
        { label: t("Rent"), to: "/rents", icon: <Building size={20} /> },
        { label: t("ServiceProvider"), to: "/services", icon: <UserCog size={20} /> },
      ],
    },
    { label: t("Payments"), to: "/payments", icon: <DollarSign size={20} /> },
    { label: t("NewsFeed"), to: "/posts", icon: <Newspaper size={20} /> },
  ];
  const location = useLocation();
  const isSidebarOpen = true;
  const isRTL = i18n.dir() === "rtl";
  const user = useSelector((state) => state.auth.user);
  const villageName = user?.village?.village?.name || "SEA GO";
  const villageImage = user?.village?.village?.image_link || null;

  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const initialExpanded = {};
    navItems.forEach((item) => {
      if (item.subItems) {
        const isParentActive = item.subItems.some((sub) =>
          location.pathname.startsWith(sub.to)
        );
        if (isParentActive) {
          initialExpanded[item.label] = true;
        }
      }
    });
    setExpandedItems(initialExpanded);
  }, [location.pathname]);

  const toggleExpand = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <Sidebar
      side={isRTL ? "right" : "left"}
      className="bg-teal-600 rtl:rounded-bl-4xl ltr:rounded-br-4xl border-none sm:border-none rtl:rounded-tl-4xl ltr:rounded-tr-4xl overflow-x-hidden h-full shadow-lg transition-all duration-300"
    >
      <SidebarContent
        className="bg-teal-600 !p-4 text-white border-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <SidebarGroup>
          <SidebarGroupLabel className="text-white flex flex-col items-center justify-center gap-3">
            {villageImage && (
              <img
                src={villageImage}
                alt={villageName || "Village"}
                className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white/30 hover:scale-105 transition-transform duration-200"
              />
            )}
            <span className="text-xl font-semibold text-center tracking-wide text-white drop-shadow-md">
              {villageName || "Unknown Village"}
            </span>
          </SidebarGroupLabel>
          <hr className="w-full border-white !mt-2 !mb-3" />

          <SidebarGroupContent>
            <SidebarMenu className="list-none p-0 bg-teal-600 flex flex-col gap-3">
              {navItems.map((item) => {
                // Determine if the main item is active
                const isActive = (() => {
                  if (item.to === "/") {
                    // For the Home item, only activate if the path is exactly "/"
                    return location.pathname === "/";
                  } else if (item.subItems) {
                    // For parent items with sub-items, check if any sub-item's path starts with the current location
                    return item.subItems.some((sub) => location.pathname.startsWith(sub.to));
                  } else if (item.to) {
                    // For other direct links, check if the current location starts with its 'to' path
                    return location.pathname.startsWith(item.to);
                  }
                  return false;
                })();

                const isExpanded = expandedItems[item.label];

                return (
                  <SidebarMenuItem key={item.label}>
                    {/* Main menu item */}
                    {item.to && !item.subItems ? (
                      // If it's a direct link (like Home, Units, Payments, News Feed)
                      <Link to={item.to}>
                        <SidebarMenuButton
                          isActive={isActive}
                          className={`flex justify-between items-center gap-3 !px-4 !py-2 text-white transition-all duration-200 text-lg font-medium
                            ${isSidebarOpen ? "rounded-full" : ""}
                            ${isActive ? "bg-white text-bg-primary shadow-md" : "hover:bg-white hover:text-bg-primary"}`}
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span className="text-lg">{item.label}</span>
                          </div>
                        </SidebarMenuButton>
                      </Link>
                    ) : (
                      // If it's a parent item with sub-items (like Assets, User List)
                      <SidebarMenuButton
                        onClick={() => toggleExpand(item.label)}
                        isActive={isActive}
                        className={`flex justify-between items-center gap-3 !px-4 !py-2 text-white transition-all duration-200 text-lg font-medium
                          ${isSidebarOpen ? "rounded-full" : ""}
                          ${isActive ? "bg-white text-bg-primary shadow-md" : "hover:bg-white hover:text-bg-primary"}`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="text-lg">{item.label}</span>
                        </div>
                        {item.subItems && (
                          <span>{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>
                        )}
                      </SidebarMenuButton>
                    )}

                    {/* Submenu items */}
                    {item.subItems && isExpanded && (
                      <div className="!ml-6 !mt-1 flex flex-col gap-1">
                        {item.subItems.map((subItem) => {
                          const isSubActive = location.pathname.startsWith(subItem.to);
                          return (
                            <Link to={subItem.to} key={subItem.label}>
                              <SidebarMenuButton
                                isActive={isSubActive}
                                className={`flex justify-start items-center gap-3 !px-4 !py-2 text-white transition-all duration-200 text-base
                                  ${isSidebarOpen ? "rounded-full" : ""}
                                  ${isSubActive ? "bg-white text-bg-primary shadow-md" : "hover:bg-white hover:text-bg-primary"}`}
                              >
                                {subItem.icon}
                                <span className="text-base">{subItem.label}</span>
                              </SidebarMenuButton>
                            </Link>
                          );
                        })}
                      </div>
                    )}
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
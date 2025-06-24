"use client";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import FullPageLoader from "@/components/Loading";
import { useGet } from "@/Hooks/UseGet";
import {
  FaUsers,
  FaUmbrellaBeach,
  FaUserFriends,
  FaStore,
} from "react-icons/fa";
import { MdReportProblem } from "react-icons/md";
import { Link } from "react-router-dom";

// Define some constants for colors if they are used repeatedly
const PRIMARY_COLOR = "#0E7490";
const BACKGROUND_COLOR = "#F2FAFA";

// Reusable Stat Card Component
const StatCard = ({ to, icon: Icon, value, label }) => (
  <Link
    to={to}
    className={`${BACKGROUND_COLOR} text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary transition-all duration-300 hover:shadow-lg hover:scale-[1.01]`}
  >
    <div className="!p-4 flex items-center justify-center">
      <Icon className={`text-6xl text-[${PRIMARY_COLOR}]`} />
    </div>
    <div className="!p-2">
      <div className="text-3xl font-bold">{value}</div>
      <div className="">{label}</div>
    </div>
  </Link>
);

const TotalEntrance = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoadingRedux = useSelector((state) => state.loader.isLoading);
  const [homeStats, setHomeStats] = useState({
    units_count: 0,
    owner_visits_village_count: 0,
    problem_report_count: 0,
    rents_count: 0,
    users_beach: 0,
    users_pool: 0,
    total_visits_count: 0,
    visitor_visits_village_count: {
      guest: 0,
      worker: 0,
      delivery: 0,
    },
  });

  const { t } = useTranslation();

  const {
    refetch: refetchHomeList,
    loading: loadingHomeList,
    data: HomeListData,
    error: homeListError, // Added error handling
  } = useGet({
    url: `${apiUrl}/home`,
  });

  // Use useCallback for refetchHomeList if it's not stable from useGet
  // However, useGet usually provides a stable refetch function.
  useEffect(() => {
    refetchHomeList();
  }, [refetchHomeList]); // Depend on refetchHomeList

  useEffect(() => {
    if (HomeListData) {
      setHomeStats(HomeListData);
    }
    if (homeListError) {
      // You can add more sophisticated error handling here, e.g., toast notification
      console.error("Error fetching home data:", homeListError);
    }
  }, [HomeListData, homeListError]);

  if (isLoadingRedux || loadingHomeList) {
    return <FullPageLoader />;
  }

  // Destructure for cleaner access
  const {
    total_visits_count,
    owner_visits_village_count,
    visitor_visits_village_count,
  } = homeStats;

  return (
    <div className="!p-4 flex !gap-3 md:flex-row flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        
        <StatCard
          to="beaches"
          icon={FaUmbrellaBeach}
          value={total_visits_count}
          label={t("Total")}
        />

        <StatCard
          to="units"
          icon={FaStore}
          value={owner_visits_village_count}
          label={t("Owners")}
        />

        <StatCard
          to="total-entrance" // Consider if this link is correct for 'Guests'
          icon={FaUserFriends}
          value={visitor_visits_village_count?.guest}
          label={t("Guests")}
          className="lg:col-span-3"
        />

        <StatCard
          to="problems" // Consider if this link is correct for 'Workers'
          icon={MdReportProblem}
          value={visitor_visits_village_count?.worker}
          label={t("Workers")}
        />

<StatCard
  to="rents"
  icon={FaUsers}
  value={visitor_visits_village_count?.delivery}
  label={t("Delivers")}
  className="lg:col-span-3"
/>

      </div>
    </div>
  );
};

export default TotalEntrance;
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
  FaSwimmingPool,
  FaUserFriends,
  FaHome,
  FaStore,
  FaWrench 
} from "react-icons/fa";
import { MdReportProblem } from "react-icons/md";
import { Link } from "react-router-dom";

const Home = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const isLoading = useSelector((state) => state.loader.isLoading);
  const [homeStats, setHomeStats] = useState({
    units_count: 0,
    maintenance_request_count: 0,
    problem_report_count: 0,
    rents_count: 0,
    users_beach: 0,
    users_pool: 0,
    visits_village: 0
  });

  const { refetch: refetchHomeList, loading: loadingHomeList, data: HomeListData } = useGet({
    url: `${apiUrl}/home`,
  });
  const { t } = useTranslation();

  useEffect(() => {
    refetchHomeList();
  }, [refetchHomeList]);

  useEffect(() => {
    if (HomeListData) {
      setHomeStats(HomeListData);
    }
  }, [HomeListData]);

  if (isLoading || loadingHomeList) {
    return <FullPageLoader />;
  }

  return (
    <div className="!p-4 flex !gap-3 md:flex-row flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Units Number */}
        
        <Link to={"units"} className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaStore className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.units_count}</div>
            <div className="">{t("NumberOfUnits")}</div>
          </div>
        </Link>

        {/* Today’s Visits */}
        <Link to={"total-entrance"} className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaUserFriends className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.visits_village}</div>
            <div className="">{t("Total Entrance")}</div>
          </div>
        </Link>

        {/* Main Request Problem */}
        <Link to={"problems"} className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <MdReportProblem className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.problem_report_count}</div>
            <div className="">{t("ProblemRequest")}</div>
          </div>
        </Link>



        {/* Beach Entries */}
        <Link to={"beaches"} className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaUmbrellaBeach className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.users_beach}</div>
            <div className="">{t("BeachOccupancy")}</div>
          </div>
        </Link>

        {/* Pool Entries */}
        <Link to={"pools"} className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaSwimmingPool className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.users_pool}</div>
            <div className="">{t("PoolOccupancy")}</div>
          </div>
        </Link>



        {/* Units for Rent */}
        <Link to={"maintenance_request"} className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaWrench  className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.maintenance_request_count}</div>
            <div className="">{t("MaintenanceRequest")}</div>
          </div>
        </Link>
      </div>
      <div>
        {/*Rents Count*/}
        <Link to={"rents"} className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex md:flex-col flex-row items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex flex-row  items-center justify-center  ">
            <FaUsers className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2 ">
            <div className="text-3xl  font-bold">{homeStats.rents_count}</div>
            <div className="">{t("NumberOfRentalUnits")}</div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
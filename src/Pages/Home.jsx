"use client";
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
    <div className="!p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        {/* Units Number */}
        <div className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaStore className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.units_count}</div>
            <div className="">Number Of Units</div>
          </div>
        </div>

        {/* Today’s Visits */}
        <div className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaUserFriends className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.visits_village}</div>
            <div className="">Today’s Visits</div>
          </div>
        </div>

        {/* Main Request Problem */}
        <div className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <MdReportProblem className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.problem_report_count}</div>
            <div className="">Problem Request</div>
          </div>
        </div>

        {/*Rents Count*/}
        <div className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaUsers className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.rents_count}</div>
            <div className="">Number Of Rental Units</div>
          </div>
        </div>

        {/* Beach Entries */}
        <div className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaUmbrellaBeach className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.users_beach}</div>
            <div className="">Beach Occupancy</div>
          </div>
        </div>

        {/* Pool Entries */}
        <div className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaSwimmingPool className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.users_pool}</div>
            <div className="">Pool Occupancy</div>
          </div>
        </div>



        {/* Units for Rent */}
        <div className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaWrench  className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.maintenance_request_count}</div>
            <div className="">Maintenance Request</div>
          </div>
        </div>




      </div>
    </div>
  );
};

export default Home;
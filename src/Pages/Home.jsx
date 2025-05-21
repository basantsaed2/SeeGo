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
  FaChartLine
} from "react-icons/fa";

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

        {/* People Inside */}
        <div className="bg-[#F2FAFA] text-bg-primary !p-4 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaUsers className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-4">
            <div className="text-3xl font-bold">{homeStats.visits_village}</div>
            <div className="">People Inside</div>
          </div>
        </div>

        {/* Beach Entries */}
        <div className="bg-[#F2FAFA] text-bg-primary !p-4 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaUmbrellaBeach className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-4">
            <div className="text-3xl font-bold">{homeStats.users_beach}</div>
            <div className="">Beach Entries</div>
          </div>
        </div>

        {/* Pool Entries */}
        <div className="bg-[#F2FAFA] text-bg-primary !p-4 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaSwimmingPool className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-4">
            <div className="text-3xl font-bold">{homeStats.users_pool}</div>
            <div className="">Pool Entries</div>
          </div>
        </div>


        {/* Visitors */}
        <div className="bg-[#F2FAFA] text-bg-primary !p-4 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaUserFriends className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-4">
            <div className="text-3xl font-bold">{homeStats.visits_village}</div>
            <div className="">Visitors</div>
          </div>
        </div>

        {/* Units for Rent */}
        <div className="bg-[#F2FAFA] text-bg-primary !p-4 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaHome className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-4">
            <div className="text-3xl font-bold">{homeStats.rents_count}</div>
            <div className="">Units for Rent</div>
          </div>
        </div>

        {/* Units For Sale */}
         <div className="bg-[#F2FAFA] text-bg-primary !p-4 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaStore className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-4">
            <div className="text-3xl font-bold">{homeStats.units_count}</div>
            <div className="">Units for Sale</div>
          </div>
        </div>

        {/* Additional Visitors Card */}
          <div className="bg-[#F2FAFA] text-bg-primary !p-4 rounded-2xl shadow flex items-start border-r-4 border-bg-primary">
          <div className="!p-4 flex items-center justify-center">
            <FaChartLine className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-4">
            <div className="text-3xl font-bold">{homeStats.visits_village}</div>
            <div className="">Visitors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
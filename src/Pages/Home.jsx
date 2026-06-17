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
  FaWrench,
  FaBell,
  FaKey,
  FaQrcode
} from "react-icons/fa";
import { MdReportProblem } from "react-icons/md";
import { Link } from "react-router-dom";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
window.Pusher = Pusher;

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

  const { refetch: refetchCodeRequests, data: codeRequestsData } = useGet({ url: `${apiUrl}/code_request` });
  const { refetch: refetchLoginRequests, data: loginRequestsData } = useGet({ url: `${apiUrl}/login_request` });
  
  const [codeNotificationCount, setCodeNotificationCount] = useState(0);
  const [loginNotificationCount, setLoginNotificationCount] = useState(0);

  const { t } = useTranslation();

  useEffect(() => {
    refetchHomeList();
  }, [refetchHomeList]);

  useEffect(() => {
    if (HomeListData) {
      setHomeStats(HomeListData);
    }
  }, [HomeListData]);

  useEffect(() => {
    if (codeRequestsData) {
      const list = codeRequestsData?.code_requests?.data || codeRequestsData?.data || [];
      setCodeNotificationCount(Array.isArray(list) ? list.length : 0);
    }
  }, [codeRequestsData]);

  useEffect(() => {
    if (loginRequestsData) {
      const list = loginRequestsData?.login_requests?.data || loginRequestsData?.data || [];
      setLoginNotificationCount(Array.isArray(list) ? list.length : 0);
    }
  }, [loginRequestsData]);

  useEffect(() => {
      const village_id = localStorage.getItem("village_id");
      if (!village_id) return;

      const echo = new Echo({
          broadcaster: 'pusher',
          key: 'hfauysjmov3blta8zfql',
          wsHost: "bcknd.sea-go.org",
          wsPort: 443,
          wssPort: 443,
          forceTLS: true,
          enabledTransports: ['ws', 'wss'],
          cluster: 'mt1'
      });

      const channelName = "newNotification_" + village_id;
      
      echo.channel(channelName)
          .listen('.NewNotificationEvent', (data) => {
              console.log('New notification received:', data);
              // إعادة جلب البيانات لتحديث الأعداد في الكروت بشكل دقيق
              if (refetchCodeRequests) refetchCodeRequests();
              if (refetchLoginRequests) refetchLoginRequests();
          });

      return () => {
          echo.leaveChannel(channelName);
      };
  }, []);


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
            {/* التعديل هنا: اعرضي العدد الإجمالي من الـ API مباشرة */}
            <div className="text-3xl font-bold">{homeStats.total_visits_count || 0}</div>

            {/* أو بديل آخر باستخدام طول المصفوفة: */}
            {/* <div className="text-3xl font-bold">{homeStats.visits_village?.length || 0}</div> */}

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
            <FaWrench className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{homeStats.maintenance_request_count}</div>
            <div className="">{t("MaintenanceRequest")}</div>
          </div>
        </Link>

        {/* Login Requests Card */}
        <Link to={"login-requests"} className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary relative">
          {loginNotificationCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-bounce shadow-lg">
              <FaBell className="w-3 h-3 mr-1" /> {loginNotificationCount}
            </div>
          )}
          <div className="!p-4 flex items-center justify-center">
            <FaKey className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{loginNotificationCount}</div>
            <div className="">{t("LoginRequests") || "Login Requests"}</div>
          </div>
        </Link>

        {/* Code Requests Card */}
        <Link to={"pending-requests"} className="bg-[#F2FAFA] text-bg-primary !p-2 rounded-2xl shadow flex items-start border-r-4 border-bg-primary relative">
          {codeNotificationCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold animate-bounce shadow-lg">
              <FaBell className="w-3 h-3 mr-1" /> {codeNotificationCount}
            </div>
          )}
          <div className="!p-4 flex items-center justify-center">
            <FaQrcode className="text-6xl text-[#0E7490]" />
          </div>
          <div className="!p-2">
            <div className="text-3xl font-bold">{codeNotificationCount}</div>
            <div className="">{t("PendingRequests") || "Code Requests"}</div>
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
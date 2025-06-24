import { createBrowserRouter } from "react-router-dom";
import Home from "./Pages/Home";
import MainLayout from "./Layout/MainLayout";
import { SidebarProvider } from "./components/ui/sidebar";
import ProtAuth from "./Auth/ProtAuth";
import Login from "./components/Login/Login";
import NotFound from "./Pages/NotFound";
import ProtectedRoute from "./Auth/ProtectedRoute";
import AuthLayout from "./Layout/AuthLayout";
import Owners from "./Pages/Owners/Owners";
import OwnersAdd from "./Pages/Owners/OwnersAdd";
import Beaches from "./Pages/Beaches/Beaches";
import BeachesAdd from "./Pages/Beaches/BeachesAdd";
import Pools from "./Pages/Pools/Pools";
import PoolsAdd from "./Pages/Pools/PoolsAdd";
import Services from "./Pages/Services/Services";
import Problems from "./Pages/Problems/Problems";
import Maintenance from "./Pages/Maintenance/Maintenance";
import Visits from "./Pages/Visits/Visits";
import Gates from "./Pages/Gates/Gates";
import GatesAdd from "./Pages/Gates/GatesAdd";
import SecurityMan from "./Pages/SecurityMan/SecurityMan";
import SecurityManAdd from "./Pages/SecurityMan/SecurityManAdd";
import OwnerDetails from "./Pages/Owners/OwnerDetails";
import Appartments from "./Pages/Appartment/Appartments";
import AppartmentsAdd from "./Pages/Appartment/AppartmentsAdd";
import UnitCode from "./Pages/Appartment/UnitCode";
import MaintenanceFees from "./Pages/MaintenanceFees/MaintenanceFees";
import RentSale from "./Pages/Rent&Sale/Rent&Sale";
import Rent from "./Pages/Rent/Rent";
import Payments from "./Pages/Payments/Payment";
import MaintenanceType from "./Pages/MaintenanceType/MaintenanceType";
import MaintenanceTypeAdd from "./Pages/MaintenanceType/MaintenanceTypeAdd";
import ServicesType from "./Pages/ServicesType/ServiceType";
import ServiceTypeAdd from "./Pages/ServicesType/ServiceTypeAdd";
import Posts from "./Pages/Posts/Posts";
import PostsAdd from "./Pages/Posts/PostsAdd";
import VilliageSinglePage from "./Pages/Villiage/VilliageSinglePage";
import VillageAdminAdd from "./Pages/Villiage/VilliageAdmins/VilliageAdminAdd";
import BeachesGallery from "./Pages/Beaches/BeachesGallery";
import PoolsGallery from "./Pages/Pools/PoolsGallery";
import VisitorLimit from "./Pages/VisitorLimit/VisitorLimit";
import UnitDetails from "./Pages/Appartment/UnitDetails";
import InvoiceCard from "./Pages/Invoice/Invoice";
import MaintenancesAdd from "./Pages/MaintenanceFees/MaintenanceAdd";
import FeesDetails from "./Pages/MaintenanceFees/FeesDetails";
import Packages from "./Pages/Packages/Packages";
import VillageAdmin from "./Pages/Villiage/VilliageAdmins/VilliageAdmin";
import InvoiceList from "./Pages/Invoice/InvoiceList";
import VGalleryPage from "./Pages/Villiage/VGallery";
import ProfileSinglePage from "./Pages/Profile/ProfileSinglePage";
import EPool from "./Pages/Entrance/EPool";
import EBeach from "./Pages/Entrance/EBeach";
import EGate from "./Pages/Entrance/EGate";
import TotalEntrance from "./Pages/TotalEntrance/TotalEntrance";

const router = createBrowserRouter([
  // ✅ صفحات تسجيل الدخول و auth layout
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <ProtAuth>
            <Login />
          </ProtAuth>
        ),
      },
       {
        path: "packages",
        children: [
          { index: true, element: <Packages /> },
        ],
      },
    ],
  },

  // ✅ الصفحات المحمية داخل MainLayout
  {
    element: (
      <SidebarProvider>
        <MainLayout />
      </SidebarProvider>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "owners",
        children: [
          { index: true, element: <Owners /> },
          { path: "add", element: <OwnersAdd /> },
          { path: "details/:id", element: <OwnerDetails /> },
        ],
      },
      {
        path: "units",
        children: [
          { index: true, element: <Appartments /> },
          { path: "add", element: <AppartmentsAdd /> },
          { path: "create_code", element: <UnitCode /> },
          { path: "details/:id", element: <UnitDetails /> },
        ],
      },
      {
        path: "beaches",
        children: [
          { index: true, element: <Beaches /> },
          { path: "add", element: <BeachesAdd /> },
          { path: "details/:id", element: <BeachesGallery /> }, // Assuming this is for gallery
        ],
      },
      {
        path: "pools",
        children: [
          { index: true, element: <Pools /> },
          { path: "add", element: <PoolsAdd /> },
          { path: "details/:id", element: <PoolsGallery /> }, // Assuming this is for gallery
        ],
      },
      {
        path: "services",
        children: [
          { index: true, element: <Services /> },
        ],
      },
      {
        path: "visits",
        children: [
          { index: true, element: <Visits /> },
        ],
      },
      {
        path: "problems",
        children: [
          { index: true, element: <Problems /> },
        ],
      },
      {
        path: "maintenance_request",
        children: [
          { index: true, element: <Maintenance /> },
        ],
      },
      {
        path: "maintenance_fees",
        children: [
          { index: true, element: <MaintenanceFees /> },
          { path: "add", element: <MaintenancesAdd /> },
          { path: "details/:id", element: <FeesDetails /> },
        ],
      },
      {
        path: "maintenance_type",
        children: [
          { index: true, element: <MaintenanceType /> },
          { path: "add", element: <MaintenanceTypeAdd /> },
        ],
      },
      {
        path: "gates",
        children: [
          { index: true, element: <Gates /> },
          { path: "add", element: <GatesAdd /> },
        ],
      },
      {
        path: "security_man",
        children: [
          { index: true, element: <SecurityMan /> },
          { path: "add", element: <SecurityManAdd /> },
        ],
      },
      {
        path: "admins",
        children: [
          { index: true, element: <VillageAdmin /> },
          { path: "add_admin", element: <VillageAdminAdd /> },
        ],
      },
      {
        path: "rent_sale",
        children: [
          { index: true, element: <RentSale /> },
        ],
      },
      {
        path: "rents",
        children: [
          { index: true, element: <Rent /> },
        ],
      },
      {
        path: "payments",
        children: [
          { index: true, element: <Payments /> },
        ],
      },
      {
        path: "service_type",
        children: [
          { index: true, element: <ServicesType /> },
          { path: "add", element: <ServiceTypeAdd /> },
        ],
      },
      {
        path: "posts",
        children: [
          { index: true, element: <Posts /> },
          { path: "add", element: <PostsAdd /> },
        ],
      },
      {
        path: "villiage_info",
        children: [
          { index: true, element: <VilliageSinglePage /> },
          { path: "add_admin", element: <VillageAdminAdd /> },
        ],
      },
      {
        path: "visitor_limit",
        children: [
          { index: true, element: <VisitorLimit /> },
        ],
      },
      {
        path: "packages_list",
        children: [
          { index: true, element: <Packages /> },
        ],
      },
      {
        path: "invoice_list",
        children: [
          { index: true, element: <InvoiceList /> },
          {path: "invoice", element: <InvoiceCard /> },
        ],
      },
      {
        path:"images",element:<VilliageSinglePage/>
      },
            {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfileSinglePage />
          </ProtectedRoute>
        ),
      },
            {
        path: "entrance_pool",
        children: [
          { index: true, element: <EPool /> },
        ],
      },
                  {
        path: "entrance_beach",
        children: [
          { index: true, element: <EBeach /> },
        ],
      },
                        {
        path: "entrance_gate",
        children: [
          { index: true, element: <EGate /> },
        ],
      },
            {
        path:"total-entrance",element:<TotalEntrance/>
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;

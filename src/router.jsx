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
        path: "appartments",
        children: [
          { index: true, element: <Appartments /> },
          { path: "add", element: <AppartmentsAdd /> },
          { path: "create_code", element: <UnitCode /> },
        ],
      },
      {
        path: "beaches",
        children: [
          { index: true, element: <Beaches /> },
          { path: "add", element: <BeachesAdd /> },
        ],
      },
      {
        path: "pools",
        children: [
          { index: true, element: <Pools /> },
          { path: "add", element: <PoolsAdd /> },
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
        path: "maintenance",
        children: [
          { index: true, element: <Maintenance /> },
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
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;

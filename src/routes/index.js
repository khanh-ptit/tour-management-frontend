import { Navigate } from "react-router-dom";
import LayoutAdmin from "../layout/LayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import Rooms from "../pages/admin/Room";
import CreateRoom from "../pages/admin/Room/create";
import RoomDetail from "../pages/admin/Room/detail";
import LoginAdmin from "../pages/admin/Auth/LoginAdmin";
import PrivateRoutesAdmin from "../components/admin/PrivateRoutesAdmin";
import Tours from "../pages/admin/Tour";
import CreateTour from "../pages/admin/Tour/create";
import TourDetail from "../pages/admin/Tour/detail";

export const routes = [
  {
    path: "admin/auth/login",
    element: <LoginAdmin />,
  },
  {
    element: <PrivateRoutesAdmin />,
    children: [
      {
        path: "admin",
        element: <LayoutAdmin />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "rooms",
            element: <Rooms />,
          },
          {
            path: "rooms/create",
            element: <CreateRoom />,
          },
          {
            path: "rooms/detail/:slug",
            element: <RoomDetail />,
          },
          {
            path: "tours",
            element: <Tours />,
          },
          {
            path: "tours/create",
            element: <CreateTour />,
          },
          {
            path: "tours/detail/:slug",
            element: <TourDetail />,
          },
        ],
      },
    ],
  },
];

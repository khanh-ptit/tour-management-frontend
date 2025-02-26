import { Navigate } from "react-router-dom";
import LayoutAdmin from "../layout/LayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import Rooms from "../pages/admin/Room";
import CreateRoom from "../pages/admin/Room/create";
import RoomDetail from "../pages/admin/Room/detail";
import LoginAdmin from "../pages/admin/Auth/LoginAdmin";

export const routes = [
  {
    path: "admin/auth/login",
    element: <LoginAdmin />,
  },
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
    ],
  },
];

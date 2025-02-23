import { Navigate } from "react-router-dom";
import LayoutAdmin from "../layout/LayoutAdmin";
import Dashboard from "../pages/admin/Dashboard";
import Rooms from "../pages/admin/Room";
import CreateRoom from "../pages/admin/Room/create";

export const routes = [
  {
    path: "admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true, // Khi vào "/admin", tự động chuyển đến "dashboard"
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
    ],
  },
];

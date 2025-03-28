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
import TourCategories from "../pages/admin/TourCategories";
import TourCategoryDetail from "../pages/admin/TourCategories/detail";
import CreateTourCategory from "../pages/admin/TourCategories/create";
import LayoutClient from "../layout/LayoutClient";
import Login from "../pages/client/Login";
import Home from "../pages/client/Home";
import Destinations from "../pages/admin/Destination";
import CreateDestination from "../pages/admin/Destination/create";
import Tour from "../pages/client/Tour";
import Destination from "../pages/client/Destination";
import Search from "../pages/client/Search";
import TourDetailClient from "../pages/client/TourDetail";
import Register from "../pages/client/Register";
import Profile from "../pages/client/Profile";
import PrivateRoutesClient from "../components/client/PrivateRoutesClient";
import PasswordReset from "../pages/client/PasswordReset";
import Cart from "../pages/client/Cart";
import Order from "../pages/client/Order";
import OrderDetail from "../pages/client/OrderDetail";
import ChatAdmin from "../pages/admin/Chat";

export const routes = [
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <LayoutClient />,
        children: [
          { path: "/", element: <Home /> },
          {
            path: "/user/login",
            element: <Login />,
          },
          {
            path: "/user/register",
            element: <Register />,
          },
          {
            path: "/cart",
            element: <Cart />,
          },
          {
            element: <PrivateRoutesClient />,
            children: [
              {
                path: "/user/profile",
                element: <Profile />,
              },
              {
                path: "/orders",
                element: <Order />,
              },
              {
                path: "/orders/detail/:id",
                element: <OrderDetail />,
              },
              {
                path: "/user/password/reset",
                element: <PasswordReset />,
              },
            ],
          },
          {
            path: "/tour-categories/:slug",
            element: <Tour />,
          },
          {
            path: "/destinations/:slug",
            element: <Destination />,
          },
          {
            path: "/search",
            element: <Search />,
          },
          {
            path: "/tours/detail/:slug",
            element: <TourDetailClient />,
          },
        ],
      },
    ],
  },
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
            path: "chats",
            element: <ChatAdmin />,
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
          {
            path: "tour-categories",
            element: <TourCategories />,
          },
          {
            path: "tour-categories/detail/:slug",
            element: <TourCategoryDetail />,
          },
          {
            path: "tour-categories/create",
            element: <CreateTourCategory />,
          },
          {
            path: "destinations",
            element: <Destinations />,
          },
          {
            path: "destinations/create",
            element: <CreateDestination />,
          },
        ],
      },
    ],
  },
];

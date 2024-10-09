import "./init.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./pages/error-page/ErrorPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import store from "./redux/app/store.js";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import AdminLayout from "./pages/layout/AdminLayout.jsx";
import Parking from "./pages/dashboard/Parking.jsx";
import Vehicle from "./pages/dashboard/Vehicle.jsx";
import User from "./pages/dashboard/User.jsx";
import Message from "./pages/dashboard/Message.jsx";
import Payment from "./pages/dashboard/Payment.jsx";
import Setting from "./pages/dashboard/Setting.jsx";
import ProtectedRoute from "./pages/auth/ProtectedRoute.jsx";
import Usermanager from "./pages/dashboard/Usermanager.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Useradmin from "./pages/dashboard/Useradmin.jsx";
import ListParking from "./components/dashboard/ListParking.jsx";
import Parking2dView from "./components/dashboard/parking/Parking2dView.jsx";
import UserList from "./pages/dashboard/user/UserList.jsx";
import VehicleList from "./pages/dashboard/vehicle/VehicleList.jsx";
import EditUser from "./pages/dashboard/user/EditUser.jsx";
import AddNewUser from "./pages/dashboard/user/AddNewUser.jsx";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Navigate to="/login" replace />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      // children: [
      //   {
      //     element: <AdminLayout />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "parking",
          element: <Parking />,
          children: [
            {
              path: "list",
              element: <ListParking />,
            },
            {
              path: ":uuid",
              element: <Parking2dView />,
            },
          ],
        },
        // {
        //   path: "vehicle",
        //   element: <Vehicle />,
        // },
        {
          path: "vehicles",
          element: <VehicleList />,
        },
        {
          path: "users",    
          element: <UserList />,
          children: [
            {
              path: "new",
              element: <AddNewUser />,
            },
            {
              path: ":id",
              element: <EditUser />,
            },
          ],
        },
        {
          path: "message",
          element: <Message />,
        },
        {
          path: "payment",
          element: <Payment />,
        },
        {
          path: "setting",
          element: <Setting />,
        },
        {
          path: "usermanager",
          element: <Usermanager />,
        },
      ],
    },
  ]
  //   },
  // ]
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <ToastContainer />
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  </StrictMode>
);

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
const router = createBrowserRouter([
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
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "parking",
            element: <Parking />,
          },
          {
            path: "vehicle",
            element: <Vehicle />,
          },
          {
            path: "user",
            element: <User />,
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
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </HelmetProvider>
  </StrictMode>
);

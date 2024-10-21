import "./init.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import store from "./redux/app/store.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListParking from "./components/dashboard/ListParking.jsx";
import Parking2dView from "./components/dashboard/parking/Parking2dView.jsx";
import UserList from "./pages/dashboard/user/UserList.jsx";
import VehicleList from "./pages/dashboard/vehicle/VehicleList.jsx";
import EditUser from "./pages/dashboard/user/EditUser.jsx";
import AddNewUser from "./pages/dashboard/user/AddNewUser.jsx";
import Profile from "./pages/dashboard/profile/Profile.jsx";
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
          path: "profile",
          element: <Profile />,
        },
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
    <BrowserRouter>
      <HelmetProvider>
        <Provider store={store}>
          <ToastContainer stacked/>
          <App />
        </Provider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);

import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";
import Aos from "aos";
import "aos/dist/aos.css";
import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROLES } from "./config/roles.js";
import RequireAuth from "./pages/auth/RequireAuth.jsx";
import EditCompany from "./pages/company/EditCompany.jsx";
import ViewCompany from "./pages/company/ViewCompany.jsx";

const ParkingView = lazy(() => import("./pages/parking/ParkingView.jsx"));
const HistoryList = lazy(() => import("./pages/history/HistoryList.jsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword.jsx"));
const LoadingOneComponent = lazy(() =>
  import("./components/LoadingOneComponent.jsx")
);
const Security = lazy(() => import("./pages/profile/Security.jsx"));
const Account = lazy(() => import("./pages/profile/Account.jsx"));
const BranchList = lazy(() => import("./pages/branch/BranchList.jsx"));
const AddNewBranch = lazy(() => import("./pages/branch/AddNewBranch.jsx"));
const Error403Component = lazy(() =>
  import("./components/Error403Component.jsx")
);
const EditBranch = lazy(() => import("./pages/branch/EditBranch.jsx"));
const AdminLayout = lazy(() => import("./pages/layout/AdminLayout.jsx"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard.jsx"));
const Prefetch = lazy(() => import("./pages/auth/Prefetch.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const PersistLogin = lazy(() => import("./pages/auth/PersistLogin.jsx"));
const NotFound = lazy(() => import("./pages/not_found/NotFound.jsx"));
const MessagesList = lazy(() => import("./pages/messages/MessagesList.jsx"));
const EditUser = lazy(() => import("./pages/user/EditUser.jsx"));
const AddNewUser = lazy(() => import("./pages/user/AddNewUser.jsx"));
const ViewUser = lazy(() => import("./pages/user/ViewUser.jsx"));
const VehicleList = lazy(() => import("./pages/vehicle/VehicleList.jsx"));
const AddNewVehicle = lazy(() => import("./pages/vehicle/AddNewVehicle.jsx"));
const EditVehicle = lazy(() => import("./pages/vehicle/EditVehicle.jsx"));
const ViewVehicle = lazy(() => import("./pages/vehicle/ViewVehicle.jsx"));
const ParkingEdit = lazy(() => import("./pages/parking/ParkingEdit.jsx"));
const OAuth2RedirectHandler = lazy(() =>
  import("./pages/auth/OAuth2RedirectHandler.jsx")
);
const UserList = lazy(() => import("./pages/user/UserList.jsx"));
const AddNewParking = lazy(() => import("./pages/parking/AddNewParking.jsx"));
const Profile = lazy(() => import("./pages/profile/Profile.jsx"));
const MapViews = lazy(() => import("./pages/map_view/MapViews.jsx"));
const ParkingList = lazy(() => import("./pages/parking/ParkingList.jsx"));
const TestComponent = lazy(() => import("./components/TestComponent.jsx"));
const ReportList = lazy(() => import("./pages/report/ReportList.jsx"));
const CreateReport = lazy(() => import("./pages/report/CreateReport.jsx"));

const SlotList =lazy (()=> import ("./pages/slot/SlotList.jsx"));
const AddNewSlot =lazy(()=>import("./pages/slot/AddNewSlot.jsx"));
const SlotEditeForm=lazy (()=> import ("./pages/slot/SlotEditeForm.jsx"));
const SlotView=lazy(()=>import ("./pages/slot/SlotView.jsx"));
const SlotDetail =lazy (()=> import ("./pages/slot/SlotDetail.jsx"));


const AddCompany =lazy (()=>import ("./pages/company/AddCompany.jsx"));
const ListCompany =lazy(()=>import("./pages/company/ListCompany.jsx"));
// const ViewCompany =lazy (()=>import("./pages/company/ViewCompany.jsx"));
function App() {
  const theme = createTheme({
    typography: {
      fontFamily: ["Roboto", "Hanuman", "Arial", "sans-serif"].join(","),
    },
    palette: {
      primary: {
        main: "#000",
      },
      secondary: {
        main: "#f44336",
      },
    },
   
  });

  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    window.location.reload();
  });

  useEffect(() => {
    Aos.init({
      duration: 500,
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<LoadingOneComponent />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/test" element={<TestComponent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorize" element={<Error403Component />} />

          {/* Protected routes */}
          <Route element={<PersistLogin />}>
            <Route
              element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
            >
              <Route element={<Prefetch />}>
                {/* Start dash */}

                <Route path="/dash" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />

                  <Route path="accounts" element={<Profile />}>
                    <Route index element={<Account />} />
                    <Route path="security" element={<Security />} />
                  </Route>

                  <Route
                    element={
                      <RequireAuth
                        allowedRoles={[ROLES.ROLE_MANAGER, ROLES.ROLE_ADMIN]}
                      />
                    }
                  >
                    <Route path="users">
                      <Route index element={<UserList />} />
                      <Route path="new" element={<AddNewUser />} />
                      <Route path=":id" element={<EditUser />} />
                      <Route path=":id/view" element={<ViewUser />} />
                    </Route>

                  </Route>

                    
                    <Route path="companys">
                    <Route index element={<ListCompany/>} />

                    <Route
                      element={
                        <RequireAuth allowedRoles={[ROLES.ROLE_MANAGER]} />
                      }
                    >
                      <Route path="new" element={<AddCompany/>} />
                      <Route path=":id" element={<EditCompany />} />
                      <Route path=":id/view" element={<ViewCompany/>} />
                    </Route>
                  </Route>

                  <Route path="vehicles">
                    <Route index element={<VehicleList />} />
                    <Route path="new" element={<AddNewVehicle />} />
                    <Route path=":id" element={<EditVehicle />} />
                    <Route path=":id/view" element={<ViewVehicle />} />
                  </Route>

                  <Route path="messages">
                    <Route index element={<MessagesList />} />
                  </Route>

                  <Route path="map-views">
                    <Route index element={<MapViews />} />
                  </Route>

                  <Route path="parkings">
                    <Route index element={<ParkingList />} />

                    <Route
                      element={
                        <RequireAuth allowedRoles={[ROLES.ROLE_MANAGER]} />
                      }
                    >
                      <Route path="new" element={<AddNewParking />} />
                      <Route path=":id" element={<ParkingEdit />} />
                      <Route path=":id/view" element={<ParkingView/>} />
                    </Route>
                  </Route>


                      {/* Path slot */}
                  
                      <Route path="slots">
                    <Route index element={<SlotList/>} />

                    <Route
                      element={
                        <RequireAuth allowedRoles={[ROLES.ROLE_MANAGER]} />
                      }
                    >
                      <Route path="new" element={<AddNewSlot/>} />
                      <Route path=":id" element={<SlotEditeForm />} />
                      <Route path=":id/view" element={<SlotView/>} />
                    </Route>
                  </Route>

                      
                  <Route path="reports">
                    <Route index element={<ReportList />} />
                    <Route path="new" element={<CreateReport />} />
                  </Route>

                  <Route path="history">
                    <Route index element={<HistoryList />} />
                  </Route>

                  <Route
                    element={
                      <RequireAuth allowedRoles={[ROLES.ROLE_MANAGER]} />
                    }
                  >
                    <Route path="branches">
                      <Route index element={<BranchList />} />
                      <Route path="new" element={<AddNewBranch />} />
                      <Route path=":id" element={<EditBranch />} />
                    </Route>
                  </Route>  
                </Route>
                {/* End dash */}
              </Route>
            </Route>
          </Route>
          <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
          <Route
            path={`${
              import.meta.env.VITE_API_BACKEND_URL
            }/oauth2/authorization/azure`}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;

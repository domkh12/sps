import { lazy, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";
const AdminLayout = lazy(()=> import("./pages/layout/AdminLayout.jsx"))
const Dashboard = lazy(()=> import("./pages/dashboard/Dashboard.jsx"))
const Prefetch = lazy(()=> import("./pages/auth/Prefetch.jsx"))
const Login = lazy(()=> import("./pages/auth/Login.jsx"))
const PersistLogin = lazy(()=> import("./pages/auth/PersistLogin.jsx"))
const NotFound = lazy(()=> import("./pages/not_found/NotFound.jsx"))
const MessagesList = lazy(()=> import("./pages/messages/MessagesList.jsx"))
const EditUser = lazy(()=> import("./pages/user/EditUser.jsx"))
const AddNewUser = lazy(()=> import("./pages/user/AddNewUser.jsx"))
const ViewUser = lazy(()=> import("./pages/user/ViewUser.jsx"))
const VehicleList = lazy(()=> import("./pages/vehicle/VehicleList.jsx"))
const AddNewVehicle = lazy(()=> import("./pages/vehicle/AddNewVehicle.jsx"))
const EditVehicle = lazy(()=> import("./pages/vehicle/EditVehicle.jsx"))
const ViewVehicle = lazy(()=> import("./pages/vehicle/ViewVehicle.jsx"))
const HistoryParking = lazy(()=> import("./pages/parking/HistoryParking.jsx"))
const ParkingAreasList = lazy(()=> import("./pages/parking/ParkingAreasList.jsx"))
const OAuth2RedirectHandler = lazy(()=> import("./pages/auth/OAuth2RedirectHandler.jsx"))
const UserList = lazy(()=> import("./pages/user/UserList.jsx"))
const AddNewParking = lazy(()=> import("./pages/parking/AddNewParking.jsx"))
const Profile = lazy(()=> import("./pages/profile/Profile.jsx"))
const ProfileDetails = lazy(()=> import("./pages/profile/components/ProfileDetails.jsx"))
const ParkingAreas = lazy(()=> import("./pages/parking/components/ParkingAreas.jsx"))
const MapViews = lazy(()=> import("./pages/map_view/MapViews.jsx"))
const Parking = lazy(()=> import("./pages/parking/Parking.jsx"))
const TestComponent = lazy(()=> import("./components/TestComponent.jsx"))
const ReportList = lazy(()=> import("./pages/report/ReportList.jsx"))
const CreateReport = lazy(()=> import("./pages/report/CreateReport.jsx"))
const History = lazy(()=> import("./pages/history/History.jsx"))

function App() {
  const preferDarkMode = useMediaQuery("(prefers-color-schema: dark)");
  const [mode, setMode] = useState(false);

  const theme = createTheme({
    typography: {
      fontFamily: ["Roboto", "Hanuman", "Arial", "sans-serif"].join(","),
    },
    palette: {
      primary: {
        light: "#757ce8",
        main: "#000",
        dark: "#000",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#000",
        contrastText: "#000",
      },
      mode: mode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/test" element={<TestComponent />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            {/* Start dash */}
            <Route path="/dash" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profiles" element={<Profile />}>
                <Route path="details" element={<ProfileDetails />} />
              </Route>
              <Route path="users">
                <Route index element={<UserList />} />
                <Route path="new" element={<AddNewUser />} />
                <Route path=":id" element={<EditUser />} />
                <Route path=":id/view" element={<ViewUser />} />
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
                <Route index element={<Parking />} />
                <Route path="new" element={<AddNewParking />} />
                <Route index path=":id" element={<ParkingAreas />} />
                <Route path=":id" element={<ParkingAreasList />} />

                <Route path="history" element={<HistoryParking />} />
              </Route>

              <Route path="reports">
                <Route index element={<ReportList />} />
                <Route path="new" element={<CreateReport />} />
              </Route>

              <Route path="history">
                <Route index element={<History />} />
              </Route>
            </Route>
            {/* End dash */}
          </Route>
        </Route>
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route
          path={`${
            import.meta.env.VITE_API_BACKEND_URL
          }/oauth2/authorization/azure`}
        />
        import Profile from './pages/auth/Profile';
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./pages/layout/AdminLayout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Prefetch from "./pages/auth/Prefetch.jsx";
import Login from "./pages/auth/Login.jsx";
import PersistLogin from "./pages/auth/PersistLogin.jsx";
import NotFound from "./pages/not_found/NotFound.jsx";
import MessagesList from "./pages/messages/MessagesList.jsx";
import EditUser from "./pages/user/EditUser.jsx";
import AddNewUser from "./pages/user/AddNewUser.jsx";
import ViewUser from "./pages/user/ViewUser.jsx";
import VehicleList from "./pages/vehicle/VehicleList.jsx";
import AddNewVehicle from "./pages/vehicle/AddNewVehicle.jsx";
import EditVehicle from "./pages/vehicle/EditVehicle.jsx";
import ViewVehicle from "./pages/vehicle/ViewVehicle.jsx";
import HistoryParking from "./pages/parking/HistoryParking.jsx";
import ParkingAreasList from "./pages/parking/ParkingAreasList.jsx";
import OAuth2RedirectHandler from "./pages/auth/OAuth2RedirectHandler.jsx";
import UserList from "./pages/user/UserList.jsx";
import AddNewParking from "./pages/parking/AddNewParking.jsx";
import { createTheme, ThemeProvider, useMediaQuery } from "@mui/material";
import { useState } from "react";
import Profile from "./pages/profile/Profile.jsx";
import ProfileDetails from "./pages/profile/components/ProfileDetails.jsx";
import ParkingAreas from "./pages/parking/components/ParkingAreas.jsx";
import MapViews from "./pages/map_view/MapViews.jsx";
import Parking from "./pages/parking/Parking.jsx";
import TestComponent from "./components/TestComponent.jsx";
import ReportList from "./pages/report/ReportList.jsx";
import CreateReport from "./pages/report/CreateReport.jsx";
import History from "./pages/history/History.jsx";

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

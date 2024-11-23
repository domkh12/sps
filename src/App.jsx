import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./pages/layout/AdminLayout.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Test from "./components/Test.jsx";
import Prefetch from "./pages/auth/Prefetch.jsx";
import Login from "./pages/auth/Login.jsx";
import PersistLogin from "./pages/auth/PersistLogin.jsx";
import NotFound from "./pages/not_found/NotFound.jsx";
import MessagesList from "./pages/messages/MessagesList.jsx";
import EditUser from "./pages/user/EditUser.jsx";
import UserList from "./pages/user/CustomUserList.jsx";
import AddNewUser from "./pages/user/AddNewUser.jsx";
import Profile from "./pages/dashboard/profile/Profile.jsx";
import ViewUser from "./pages/user/ViewUser.jsx";
import WebSocket from "./pages/websocket/WebSocket.jsx";
import VehicleList from "./pages/vehicle/VehicleList.jsx";
import AddNewVehicle from "./pages/vehicle/AddNewVehicle.jsx";
import EditVehicle from "./pages/vehicle/EditVehicle.jsx";
import ViewVehicle from "./pages/vehicle/ViewVehicle.jsx";
import Parking from "./pages/parking/Parking.jsx";
import ParkingAreas from "./pages/parking/ParkingAreas.jsx";
import HistoryParking from "./pages/parking/HistoryParking.jsx";
import ParkingAreasList from "./pages/parking/ParkingAreasList.jsx";
import OAuth2RedirectHandler from "./pages/auth/OAuth2RedirectHandler.jsx";
import AzureUserList from "./pages/user/AzureUserList.jsx";
import User from "./pages/user/User.jsx";
import CustomUserList from "./pages/user/CustomUserList.jsx";
import Settings from "./pages/setting/Settings.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test" element={<Test />} />
      <Route element={<PersistLogin />}>
        <Route element={<Prefetch />}>
          <Route element={<WebSocket />}>
            {/* Start dash */}
            <Route path="/dash" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<User />}>
                <Route path="custom" element={<CustomUserList />} />
                <Route path="azure" element={<AzureUserList />} />
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
              <Route path="profiles">
                <Route index element={<Profile />} />
              </Route>
              <Route path="parking" element={<Parking />}>
                <Route path=":id" element={<ParkingAreas />}>
                  <Route path=":id" element={<ParkingAreasList />} />
                </Route>
                <Route path="history" element={<HistoryParking />} />
              </Route>             
            </Route>

            {/* End dash */}
          </Route>
        </Route>
      </Route>

      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      <Route path={`${import.meta.env.VITE_API_BACKEND_URL}/oauth2/authorization/azure`}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

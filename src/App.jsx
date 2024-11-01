import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./pages/layout/AdminLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Test from "./components/Test";
import Prefetch from "./pages/auth/Prefetch";
import Login from "./pages/auth/Login";
import PersistLogin from "./pages/auth/PersistLogin";
import NotFound from "./pages/not_found/NotFound";
import MessagesList from "./pages/messages/MessagesList";
import EditUser from "./pages/user/EditUser";
import UserList from "./pages/user/UserList";
import AddNewUser from "./pages/user/AddNewUser";
import Profile from "./pages/dashboard/profile/Profile";
import ViewUser from "./pages/user/ViewUser";
import WebSocket from "./pages/websocket/WebSocket";
import VehicleList from "./pages/vehicle/VehicleList";
import AddNewVehicle from "./pages/vehicle/AddNewVehicle";

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
              <Route path="users">
                <Route index element={<UserList />} />
                <Route path="new" element={<AddNewUser />} />
                <Route path=":id" element={<EditUser />} />
                <Route element={<ViewUser />} path=":id/view" />
              </Route>
              <Route path="vehicles">
                <Route index element={<VehicleList />} />
                <Route path="new" element={<AddNewVehicle />} />
              </Route>
              <Route path="messages">
                <Route index element={<MessagesList />} />
              </Route>
              <Route path="profiles">
                <Route index element={<Profile />} />
              </Route>
            </Route>
            {/* End dash */}
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

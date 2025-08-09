import {CssBaseline, ThemeProvider, useColorScheme} from "@mui/material";
import Aos from "aos";
import "aos/dist/aos.css";
import {lazy, Suspense, useEffect} from "react";
import {Navigate, Route, Routes} from "react-router-dom";
import {ROLES} from "./config/roles.js";
import RequireAuth from "./pages/auth/RequireAuth.jsx";
import {getTheme} from "./config/themeConfig.js";
import {ToastContainer} from "react-toastify";

const CheckOutList = lazy(() => import("./pages/checkOut/CheckOutList.jsx"));
const CheckInList = lazy(() => import("./pages/checkIn/CheckInList.jsx"));
const UserHistory = lazy(() => import("./pages/report/UserHistory.jsx"));
const VehicleHistory = lazy(() => import("./pages/report/VehicleHistory.jsx"));
const EditCompany = lazy(() => import("./pages/company/EditCompany.jsx"));
const ViewCompany = lazy(() => import("./pages/company/ViewCompany.jsx"));
const ManagerLayout = lazy(() => import("./pages/layoutManager/ManagerLayout"));
const ViewSlot = lazy(() => import("./pages/slot/ViewSlot.jsx"));
const EditSlot = lazy(() => import("./pages/slot/EditSlot.jsx"));
const ListParkingSlot = lazy(() => import("./pages/slot/ListParkingSlot"));
const ViewBranch = lazy(() => import("./pages/branch/ViewBranch.jsx"));
const ParkingView = lazy(() => import("./pages/parkingSpace/ViewParkingSpace"));
const HistoryList = lazy(() => import("./pages/history/HistoryList.jsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword.jsx"));
const LoadingOneComponent = lazy(() => import("./components/LoadingOneComponent.jsx"));
const Security = lazy(() => import("./pages/profile/Security.jsx"));
const Account = lazy(() => import("./pages/profile/Account.jsx"));
const BranchList = lazy(() => import("./pages/branch/BranchList.jsx"));
const AddNewBranch = lazy(() => import("./pages/branch/AddNewBranch.jsx"));
const Error403Component = lazy(() => import("./components/Error403Component.jsx"));
const EditBranch = lazy(() => import("./pages/branch/EditBranch.jsx"));
const AdminLayout = lazy(() => import("./pages/layoutAdmin/AdminLayout"));
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
const ParkingEdit = lazy(() => import("./pages/parkingSpace/ParkingEdit.jsx"));
const OAuth2RedirectHandler = lazy(() => import("./pages/auth/OAuth2RedirectHandler.jsx"));
const UserList = lazy(() => import("./pages/user/UserList.jsx"));
const AddNewParking = lazy(() => import("./pages/parkingSpace/AddNewParking.jsx"));
const Profile = lazy(() => import("./pages/profile/Profile.jsx"));
const MapViews = lazy(() => import("./pages/map_view/MapViews.jsx"));
const ParkingList = lazy(() => import("./pages/parkingSpace/ParkingList.jsx"));
const TestComponent = lazy(() => import("./components/TestComponent.jsx"));
const ReportList = lazy(() => import("./pages/report/ReportList.jsx"));
const CreateReport = lazy(() => import("./pages/report/CreateReport.jsx"));
const AddNewSlot = lazy(() => import("./pages/slot/AddNewSlot.jsx"));
const AddCompany = lazy(() => import ("./pages/company/AddCompany.jsx"));
const ListCompany = lazy(() => import("./pages/company/ListCompany.jsx"));

function App() {

    const theme = getTheme();

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
        <>
            <ThemeProvider theme={theme} disableTransitionOnChange>
                <CssBaseline/>
                <Suspense fallback={<LoadingOneComponent/>}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Navigate to="/login" replace/>}/>
                        <Route path="/test" element={<TestComponent/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/forgot-password" element={<ForgotPassword/>}/>
                        <Route path="/reset-password" element={<ResetPassword/>}/>
                        <Route path="/unauthorize" element={<Error403Component/>}/>

                        {/* Protected routes */}
                        <Route element={<PersistLogin/>}>
                            <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>
                                <Route element={<Prefetch/>}>

                                    {/* Start dash */}
                                    <Route element={<RequireAuth allowedRoles={[ROLES.ROLE_ADMIN]}/>}>
                                        <Route path="/admin" element={<AdminLayout/>}>

                                            {/* Dashboard Route*/}
                                            <Route index element={<Dashboard/>}/>

                                            {/* Map View Route */}
                                            <Route path="map-views">
                                                <Route index element={<MapViews/>}/>
                                            </Route>

                                            {/* History Route */}
                                            <Route path="parking-detail">
                                                <Route index element={<HistoryList/>}/>
                                            </Route>

                                            {/* Check in */}
                                            <Route path="vehicle-entry">
                                                <Route index element={<CheckInList/>}/>
                                            </Route>

                                            {/* Check out */}
                                            <Route path="vehicle-exit">
                                                <Route index element={<CheckOutList/>}/>
                                            </Route>

                                            {/* Account Route */}
                                            <Route path="accounts" element={<Profile/>}>
                                                <Route index element={<Account/>}/>
                                                <Route path="security" element={<Security/>}/>
                                            </Route>

                                            {/* Users Route */}
                                            <Route path="users">
                                                <Route index element={<UserList/>}/>
                                                <Route path="new" element={<AddNewUser/>}/>
                                                <Route path=":id" element={<EditUser/>}/>
                                                <Route path=":id/view" element={<ViewUser/>}/>
                                            </Route>

                                            {/* Company Route */}
                                            <Route path="companies">
                                                <Route index element={<ListCompany/>}/>
                                                <Route path="new" element={<AddCompany/>}/>
                                                <Route path=":id" element={<EditCompany/>}/>
                                                <Route path=":id/view" element={<ViewCompany/>}/>
                                            </Route>

                                            {/* Vehicle Route */}
                                            <Route path="vehicles">
                                                <Route index element={<VehicleList/>}/>
                                                <Route path="new" element={<AddNewVehicle/>}/>
                                                <Route path=":id" element={<EditVehicle/>}/>
                                                <Route path=":id/view" element={<ViewVehicle/>}/>
                                            </Route>

                                            {/* Message Route */}
                                            <Route path="messages">
                                                <Route index element={<MessagesList/>}/>
                                            </Route>

                                            {/* Parking Space Route */}
                                            <Route path="parking-spaces">
                                                <Route index element={<ParkingList/>}/>
                                                <Route path="new" element={<AddNewParking/>}/>
                                                <Route path=":id" element={<ParkingEdit/>}/>
                                                <Route path=":id/view" element={<ParkingView/>}/>
                                            </Route>

                                            {/* Path slot Route */}
                                            <Route path="parking-slots">
                                                <Route index element={<ListParkingSlot/>}/>
                                                <Route path="new" element={<AddNewSlot/>}/>
                                                <Route path=":id" element={<EditSlot/>}/>
                                                <Route path=":id/view" element={<ViewSlot/>}/>
                                            </Route>

                                            {/* Report Route */}
                                            <Route path="reports">
                                                <Route index element={<ReportList/>}/>
                                                <Route path="new" element={<CreateReport/>}/>
                                                <Route path="user-history" element={<UserHistory/>}/>
                                                <Route path="vehicle-history" element={<VehicleHistory/>}/>
                                            </Route>

                                            {/* Branch Route */}
                                            <Route path="branches">
                                                <Route index element={<BranchList/>}/>
                                                <Route path="new" element={<AddNewBranch/>}/>
                                                <Route path=":id" element={<EditBranch/>}/>
                                                <Route path=":id/view" element={<ViewBranch/>}/>
                                            </Route>
                                        </Route>
                                    </Route>
                                </Route>
                                {/* End dash */}

                                <Route element={<RequireAuth allowedRoles={[ROLES.ROLE_MANAGER]}/>}>
                                    <Route path="/dash" element={<ManagerLayout/>}>
                                        <Route index element={<Dashboard/>}/>

                                        {/* Account Route */}
                                        <Route path="accounts" element={<Profile/>}>
                                            <Route index element={<Account/>}/>
                                            <Route path="security" element={<Security/>}/>
                                        </Route>

                                        {/* Parking Spaces */}
                                        <Route path="parking-spaces">
                                            <Route index element={<ParkingList/>}/>
                                            <Route path=":id/view" element={<ParkingView/>}/>
                                        </Route>

                                        {/* Parking Slot */}
                                        <Route path="parking-slots">
                                            <Route index element={<ListParkingSlot/>}/>
                                            <Route path=":id/view" element={<ViewSlot/>}/>
                                        </Route>

                                        {/* Vehicle Route */}
                                        <Route path="vehicles">
                                            <Route index element={<VehicleList/>}/>
                                            <Route path="new" element={<AddNewVehicle/>}/>
                                            <Route path=":id" element={<EditVehicle/>}/>
                                            <Route path=":id/view" element={<ViewVehicle/>}/>
                                        </Route>

                                        {/* Account Route */}
                                        <Route path="accounts" element={<Profile/>}>
                                            <Route index element={<Account/>}/>
                                            <Route path="security" element={<Security/>}/>
                                        </Route>

                                        {/* Parking Detail Route */}
                                        <Route path="parking-detail">
                                            <Route index element={<HistoryList/>}/>
                                        </Route>

                                        {/* Map View Route */}
                                        <Route path="map-views">
                                            <Route index element={<MapViews/>}/>
                                        </Route>

                                        {/* Check in */}
                                        <Route path="vehicle-entry">
                                            <Route index element={<CheckInList/>}/>
                                        </Route>

                                        {/* Check out */}
                                        <Route path="vehicle-exit">
                                            <Route index element={<CheckOutList/>}/>
                                        </Route>

                                        {/* Users Route */}
                                        <Route path="users">
                                            <Route index element={<UserList/>}/>
                                            <Route path="new" element={<AddNewUser/>}/>
                                            <Route path=":id" element={<EditUser/>}/>
                                            <Route path=":id/view" element={<ViewUser/>}/>
                                        </Route>

                                        {/* Report Route */}
                                        <Route path="reports">
                                            <Route index element={<ReportList/>}/>
                                            <Route path="new" element={<CreateReport/>}/>
                                            <Route path="user-history" element={<UserHistory/>}/>
                                            <Route path="vehicle-history" element={<VehicleHistory/>}/>
                                        </Route>

                                    </Route>
                                </Route>

                            </Route>
                        </Route>
                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
                        <Route
                            path={`${
                                import.meta.env.VITE_API_BACKEND_URL
                            }/oauth2/authorization/azure`}
                        />

                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </Suspense>
            </ThemeProvider>
            <ToastContainer stacked
                            theme="dark"
            />
        </>
    );
}

export default App;

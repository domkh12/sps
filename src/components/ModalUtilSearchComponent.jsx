import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import {Dialog, DialogContent, Paper, Typography} from "@mui/material";
import {useState} from "react";
import useAuth from "../hook/useAuth.jsx";
import {useNavigate} from "react-router-dom";
import useTranslate from "../hook/useTranslate.jsx";
import {useDispatch, useSelector} from "react-redux";
import {setIsOpenUtilSearch} from "../redux/feature/actions/actionSlice.js";

function ModalUtilSearchComponent(){
    const {t} = useTranslate();
    const open = useSelector((state) => state.action.isOpenUtilSearch);
   
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const {isAdmin, isManager} = useAuth();

    const routes = [];
    if (isAdmin) {
        routes.push({title: t('dashboard'), path: "/admin", action: t('overview')});
        routes.push({title: t('mapView'), path: "/admin/map-views", action: t('overview')});
        routes.push({title: t('vehicleEntry'), path: "/admin/vehicle-entry", action: t('overview')});
        routes.push({title: t('vehicleExit'), path: "/admin/vehicle-exit", action: t('overview')});
        routes.push({title: t('parkingDetail'), path: "/admin/parking-detail", action: t('overview')});
        routes.push({title: t('company'), path: "/admin/companies", action: t('management')});
        routes.push({title: t('newCompany'), path: "/admin/companies/new", action: t('management')});
        routes.push({title: t('branch'), path: "/admin/branches", action: t('management')});
        routes.push({title: t('newBranch'), path: "/admin/branches/new", action: t('management')});
        routes.push({title: t('parkingSpace'), path: "/admin/parking-spaces", action: t('management')});
        routes.push({title: t('newParkingSpace'), path: "/admin/parking-spaces/new", action: t('management')});
        routes.push({title: t('parkingSlot'), path: "/admin/parking-slots", action: t('management')});
        routes.push({title: t('newParkingSlot'), path: "/admin/parking-slots/new", action: t('management')});
        routes.push({title: t('vehicle'), path: "/admin/vehicles", action: t('management')});
        routes.push({title: t('newVehicle'), path: "/admin/vehicles/new", action: t('management')});
        routes.push({title: t('user'), path: "/admin/user", action: t('management')});
        routes.push({title: t('newUser'), path: "/admin/users/new", action: t('management')});
        routes.push({title: t('reportUser'), path: "/admin/reports/user-history", action: t('management')});
        routes.push({title: t('reportVehicle'), path: "/admin/reports/vehicle-history", action: t('management')});
    }

    if (isManager) {
        routes.push({title: t('dashboard'), path: "/dash", action: t('overview')});
        routes.push({title: t('mapView'), path: "/dash/map-views", action: t('overview')});
        routes.push({title: t('vehicleEntry'), path: "/dash/vehicle-entry", action: t('overview')});
        routes.push({title: t('vehicleExit'), path: "/dash/vehicle-exit", action: t('overview')});
        routes.push({title: t('parkingDetail'), path: "/dash/parking-detail", action: t('management')});
        routes.push({title: t('parkingSpace'), path: "/dash/parking-spaces", action: t('management')});
        routes.push({title: t('parkingSlot'), path: "/dash/parking-slots", action: t('management')});
        routes.push({title: t('vehicle'), path: "/dash/vehicles", action: t('management')});
        routes.push({title: t('newVehicle'), path: "/dash/vehicles/new", action: t('management')});
        routes.push({title: t('user'), path: "/dash/users", action: t('management')});
        routes.push({title: t('newUser'), path: "/dash/users/new", action: t('management')});
        routes.push({title: t('reportUser'), path: "/dash/reports/user-history", action: t('management')});
        routes.push({title: t('reportVehicle'), path: "/dash/reports/vehicle-history", action: t('management')});
    }

    const lowerSearch = searchTerm.toLowerCase();

    const filteredRoutes = routes.filter((route) =>
        [route.title, route.path, route.action].some((field) =>
            field.toLowerCase().includes(lowerSearch)
        )
    );

    return (
        <Dialog
            open={open}
            onClose={() => dispatch(setIsOpenUtilSearch(false))}
            fullWidth
            maxWidth="sm"
            sx={{"& .MuiPaper-root": {borderRadius: "26px"}}}
        >
            <Paper>
                <DialogContent sx={{p: 0}} className="h-[600px]">
                    {/* Search Header */}
                    <Paper sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: 3,
                        py: 2,
                        position: "sticky",
                        top: 0,
                    }}>
                        <SearchTwoToneIcon/>
                        <input
                            autoFocus
                            type="text"
                            id="search"
                            placeholder="Search..."
                            className={`w-full bg-transparent outline-none border-none focus:ring-0 
                               
                            `}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span
                            className={`text-xs px-2 py-0.5 rounded `}
                        >
                          Esc
                        </span>
                    </Paper>

                    {/* Route List */}
                    <div className="p-4 overflow-y-auto h-[500px]">
                        {filteredRoutes.map((route) => {
                            const match =
                                route.title.toLowerCase().includes(lowerSearch) ||
                                route.path.toLowerCase().includes(lowerSearch) ||
                                route.action.toLowerCase().includes(lowerSearch);

                            return (
                                <button
                                    key={route.path}
                                    onClick={() => {
                                        navigate(route.path);
                                        dispatch(setIsOpenUtilSearch(false));
                                    }}
                                    className={`w-full text-left flex items-center justify-between p-4 transition-all rounded-lg hover:outline-1 hover:outline-dashed`}
                                >
                                    <div className="min-w-0 flex-1">
                                        <Typography variant="subtitle1"
                                        >
                                            {route.title}
                                        </Typography>
                                        <p
                                            className={`text-sm truncate`}
                                        >
                                            {route.path}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-sm px-3 py-1 rounded `}
                                    >
                                        {route.action}
                                      </span>
                                </button>
                            );
                        })}

                        {filteredRoutes.length === 0 && (
                            <div className={`flex flex-col items-center justify-center py-8 px-4 `}>
                                <SearchTwoToneIcon sx={{fontSize: 48, opacity: 0.5, mb: 2}}/>
                                <Typography variant="h6" sx={{mb: 1}}>
                                    {t('noResultFound')}
                                </Typography>
                                <Typography variant="body2" textAlign="center">
                                    {t('noMatchesFoundFor')} &#34;{searchTerm}&#34;. {t('checkYourKeyword')}
                                </Typography>
                            </div>

                        )}
                    </div>
                </DialogContent>
            </Paper>
        </Dialog>
    );
}

export default ModalUtilSearchComponent;
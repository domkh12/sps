import {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import useTranslate from "../hook/useTranslate.jsx";
import useAuth from "../hook/useAuth.jsx";
import {setIsOpenSidebarDrawer} from "../redux/feature/actions/actionSlice.js";
import {
    Box,
    Collapse,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography
} from "@mui/material";
import LogoComponent from "./LogoComponent.jsx";
import {IoIosArrowDown, IoIosArrowForward} from "react-icons/io";
import {listItemButtonStyle} from "../assets/style.js";
import SpaceDashboardTwoToneIcon from "@mui/icons-material/SpaceDashboardTwoTone";
import FmdGoodTwoToneIcon from "@mui/icons-material/FmdGoodTwoTone";
import ScheduleTwoToneIcon from "@mui/icons-material/ScheduleTwoTone";
import ApartmentTwoToneIcon from "@mui/icons-material/ApartmentTwoTone";
import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
import LocalParkingTwoToneIcon from "@mui/icons-material/LocalParkingTwoTone";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import DescriptionTwoToneIcon from "@mui/icons-material/DescriptionTwoTone";

function SideBarForManagerComponent(){
    const [isOverviewOpen, setIsOverviewOpen] = useState(true);
    const [isManagementOpen, setIsManagementOpen] = useState(true);
    const [isParkingOpen, setIsParkingOpen] = useState(false);
    const [isVehicleOpen, setIsVehicleOpen] = useState(false);
    const [isUserOpen, setIsUserOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isBranchOpen, setIsBranchOpen] = useState(false);
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [isParkingSlotOpen, setIsParkingSlotOpen] = useState(false);
    const location = useLocation();
    const open = useSelector((state) => state.action.isOpenSidebarDrawer);
    const isCompanyListPage = location.pathname === "/dash/companies";
    const isCompanyCreatePage = location.pathname === "/dash/companies/new";
    const isVehiclesListPage = location.pathname === "/dash/vehicles";
    const isVehiclesCreatePage = location.pathname === "/dash/vehicles/new";
    const isParkingListPage = location.pathname === "/dash/parking-spaces";
    const isParkingCreatePage = location.pathname === "/dash/parking-spaces/new";
    const isParkingSlotListPage = location.pathname === "/dash/parking-slots";
    const isParkingSlotCreatePage = location.pathname === "/dash/parking-slots/new";
    const isUserListPage = location.pathname === "/dash/users";
    const isUserCreatePage = location.pathname === "/dash/users/new";
    const isReportListPage = location.pathname === "/dash/reports";
    const isReportCreatePage = location.pathname === "/dash/reports/new";
    const isBranchListPage = location.pathname === "/dash/branches";
    const isBranchCreatePage = location.pathname === "/dash/branches/new";
    const navigate = useNavigate();
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const { isManager } = useAuth();

    const handleOverViewClick = () => {
        setIsOverviewOpen(!isOverviewOpen);
    };

    const handleManagementClick = () => {
        setIsManagementOpen(!isManagementOpen);
    };

    const handleNavigate = (path) => () => {
        navigate(path);
        dispatch(setIsOpenSidebarDrawer(false));
    };

    return (
        <>
            {open && (
                <Drawer
                    anchor="left"
                    open={open}
                    variant="temporary"
                    onClose={() => dispatch(setIsOpenSidebarDrawer(false))}
                >
                    <Box sx={{ width: 280 }}>
                        <LogoComponent />
                        <div className="px-[16px] overflow-auto">
                            <List
                                component="div"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader
                                        sx={{
                                            fontSize: "12px",
                                            minWidth: 0,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "auto",
                                            position: "inherit",
                                        }}
                                        className="group cursor-pointer hover:text-gray-cus"
                                        component="span"
                                        id="overview"
                                        onClick={handleOverViewClick}
                                    >
                                        {isOverviewOpen ? (
                                            <IoIosArrowDown className="absolute w-4 h-auto left-0 opacity-0 group-hover:opacity-100 " />
                                        ) : (
                                            <IoIosArrowForward className="absolute w-4 h-auto left-0 opacity-0 group-hover:opacity-100 " />
                                        )}
                                        <p
                                            className={`group-hover:translate-x-1 transition-[2s] duration-200`}
                                        >
                                            {t("overview")}
                                        </p>
                                    </ListSubheader>
                                }
                            >
                                <Collapse in={isOverviewOpen} timeout="auto" unmountOnExit>
                                    <ListItemButton
                                        sx={{
                                            borderRadius: "10px",
                                            color: "#424242",
                                            mb: "5px",
                                            ...listItemButtonStyle,
                                        }}
                                        onClick={handleNavigate("/dash")}
                                        selected={location.pathname === "/dash"}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: 1,
                                            }}
                                        >
                                            <SpaceDashboardTwoToneIcon className="w-6 h-6" />
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    sx={{
                                                        color: "#424242",
                                                        display: "inline",
                                                    }}
                                                >
                                                    {t("dashboard")}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                    <ListItemButton
                                        sx={{
                                            borderRadius: "10px",
                                            color: "#424242",
                                            mb: "5px",
                                            ...listItemButtonStyle,
                                        }}
                                        onClick={handleNavigate("/dash/map-views")}
                                        selected={location.pathname === "/dash/map-views"}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,

                                                mr: 1,
                                            }}
                                        >
                                            <FmdGoodTwoToneIcon className="w-6 h-6" />
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    sx={{
                                                        color: "#424242",
                                                        display: "inline",
                                                        textWrap: "nowrap",
                                                    }}
                                                >
                                                    {t("mapView")}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                    <ListItemButton
                                        sx={{
                                            borderRadius: "10px",
                                            color: "#424242",
                                            ...listItemButtonStyle,
                                        }}
                                        onClick={handleNavigate("/dash/history")}
                                        selected={location.pathname === "/dash/history"}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: 1,
                                            }}
                                        >
                                            <ScheduleTwoToneIcon className="w-6 h-6" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    sx={{ color: "#424242", display: "inline" }}
                                                >
                                                    {t("history")}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </Collapse>
                            </List>

                            <List
                                component="div"
                                aria-labelledby="nested-list-subheader"
                                subheader={
                                    <ListSubheader
                                        sx={{
                                            fontSize: "12px",
                                            minWidth: 0,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "auto",
                                            position: "inherit",
                                        }}
                                        className="group cursor-pointer hover:text-gray-cus"
                                        component="span"
                                        id="managements"
                                        onClick={handleManagementClick}
                                    >
                                        {isManagementOpen ? (
                                            <IoIosArrowDown className="absolute w-4 h-auto left-0 opacity-0 group-hover:opacity-100 " />
                                        ) : (
                                            <IoIosArrowForward className="absolute w-4 h-auto left-0 opacity-0 group-hover:opacity-100 " />
                                        )}
                                        <p
                                            className={`group-hover:translate-x-1 transition-[2s] duration-200`}
                                        >
                                            {t("management")}
                                        </p>
                                    </ListSubheader>
                                }
                            >
                                <Collapse in={isManagementOpen} timeout="auto" unmountOnExit>

                                    {/* Parking Menu */}
                                    <ListItemButton
                                        sx={{
                                            borderRadius: "10px",
                                            color: "#424242",
                                            ...listItemButtonStyle,
                                        }}
                                        onClick={handleNavigate("/dash/parking-spaces")}
                                        selected={location.pathname === "/dash/parking-spaces"}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: 1,
                                            }}
                                        >
                                            <LocalParkingTwoToneIcon className="w-6 h-6" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    sx={{ color: "#424242", display: "inline" }}
                                                >
                                                    {t("parkingSpace")}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>

                                    {/* Parking Slot Menu*/}
                                    <ListItemButton
                                        sx={{
                                            borderRadius: "10px",
                                            color: "#424242",
                                            mt: "5px",
                                            ...listItemButtonStyle,
                                        }}
                                        onClick={handleNavigate("/dash/parking-slots")}
                                        selected={location.pathname === "/dash/parking-slots"}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: 1,
                                            }}
                                        >
                                            <CarRepairIcon className="w-6 h-6" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    sx={{ color: "#424242", display: "inline" }}
                                                >
                                                    {t("parkingSpace")}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>

                                    {/* Vehicle Menu */}
                                    <>
                                        <ListItemButton
                                            sx={{
                                                borderRadius: "10px",
                                                color: "#424242",
                                                ...((isVehiclesListPage || isVehiclesCreatePage) &&
                                                    listItemButtonStyle),
                                                mt: "5px",
                                            }}
                                            selected={
                                                isVehicleOpen
                                                    ? isVehicleOpen
                                                    : isVehiclesListPage || isVehiclesCreatePage
                                            }
                                            onClick={() => setIsVehicleOpen(!isVehicleOpen)}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 0,
                                                    mr: 1,
                                                }}
                                            >
                                                <DirectionsCarRoundedIcon className="w-6 h-6" />
                                            </ListItemIcon>

                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        component="span"
                                                        variant="body1"
                                                        sx={{ color: "#424242", display: "inline" }}
                                                    >
                                                        {t("vehicle")}
                                                    </Typography>
                                                }
                                            />

                                            {isVehicleOpen ? (
                                                <IoIosArrowDown />
                                            ) : (
                                                <IoIosArrowForward />
                                            )}
                                        </ListItemButton>
                                    </>

                                    <Collapse in={isVehicleOpen}>
                                        <List
                                            component="div"
                                            disablePadding
                                            sx={{ pt: 1 }}
                                            dense={true}
                                        >
                                            <ul className="ml-6 pl-[12px]">
                                                <div className="absolute h-[60px] border-l-[2px] bg-primary left-6 top-0"></div>
                                                <li>
                                                    <img
                                                        src="/images/nav_sublist.svg"
                                                        alt="sub_list_img"
                                                        className="absolute top-[6px] left-6 h-[30px] w-[14px]"
                                                    />
                                                    <ListItemButton
                                                        sx={{
                                                            borderRadius: "10px",
                                                            color: "#424242",
                                                            mb: "5px",
                                                        }}
                                                        onClick={handleNavigate("/dash/vehicles")}
                                                        selected={location.pathname === "/dash/vehicles"}
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    component="span"
                                                                    variant="body1"
                                                                    sx={{ color: "#424242", display: "inline" }}
                                                                >
                                                                    {t("list")}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                </li>
                                                <li>
                                                    <img
                                                        src="/images/nav_sublist.svg"
                                                        alt="sub_list_img"
                                                        className="absolute top-[55px] left-6 h-[14px] w-[14px]"
                                                    />
                                                    <ListItemButton
                                                        sx={{
                                                            borderRadius: "10px",
                                                            color: "#424242",
                                                            mb: "5px",
                                                        }}
                                                        onClick={handleNavigate("/dash/vehicles/new")}
                                                        selected={
                                                            location.pathname === "/dash/vehicles/new"
                                                        }
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    component="span"
                                                                    variant="body1"
                                                                    sx={{ color: "#424242", display: "inline" }}
                                                                >
                                                                    {t("create")}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                </li>
                                            </ul>
                                        </List>
                                    </Collapse>

                                    {/* User Menu */}
                                    <ListItemButton
                                        sx={{
                                            borderRadius: "10px",
                                            color: "#424242",
                                            ...((isUserListPage || isUserCreatePage) &&
                                                listItemButtonStyle),
                                            mt: "5px",
                                        }}
                                        selected={
                                            isUserOpen
                                                ? isUserOpen
                                                : isUserListPage || isUserCreatePage
                                        }
                                        onClick={() => setIsUserOpen(!isUserOpen)}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: 1,
                                            }}
                                        >
                                            <AccountBoxTwoToneIcon className="w-6 h-6" />
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    sx={{ color: "#424242", display: "inline" }}
                                                >
                                                    {t("user")}
                                                </Typography>
                                            }
                                        />

                                        {isUserOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
                                    </ListItemButton>

                                    <Collapse in={isUserOpen}>
                                        <List
                                            component="div"
                                            disablePadding
                                            sx={{ pt: 1 }}
                                            dense={true}
                                        >
                                            <ul className="ml-6 pl-[12px]">
                                                <div className="absolute h-[60px] border-l-[2px] bg-primary left-6 top-0"></div>
                                                <li>
                                                    <img
                                                        src="/images/nav_sublist.svg"
                                                        alt="sub_list_img"
                                                        className="absolute top-[6px] left-6 h-[30px] w-[14px]"
                                                    />
                                                    <ListItemButton
                                                        sx={{
                                                            borderRadius: "10px",
                                                            color: "#424242",
                                                            mb: "5px",
                                                        }}
                                                        onClick={handleNavigate("/dash/users")}
                                                        selected={location.pathname === "/dash/users"}
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    component="span"
                                                                    variant="body1"
                                                                    sx={{ color: "#424242", display: "inline" }}
                                                                >
                                                                    {t("list")}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                </li>
                                                <li>
                                                    <img
                                                        src="/images/nav_sublist.svg"
                                                        alt="sub_list_img"
                                                        className="absolute top-[55px] left-6 h-[14px] w-[14px]"
                                                    />
                                                    <ListItemButton
                                                        sx={{
                                                            borderRadius: "10px",
                                                            color: "#424242",
                                                            mb: "5px",
                                                        }}
                                                        onClick={handleNavigate("/dash/users/new")}
                                                        selected={location.pathname === "/dash/users/new"}
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    component="span"
                                                                    variant="body1"
                                                                    sx={{ color: "#424242", display: "inline" }}
                                                                >
                                                                    {t("create")}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                </li>
                                            </ul>
                                        </List>
                                    </Collapse>

                                    {/* Report Menu */}

                                    <ListItemButton
                                        sx={{
                                            borderRadius: "10px",
                                            color: "#424242",
                                            ...((isReportListPage || isReportCreatePage) &&
                                                listItemButtonStyle),
                                            mt: "5px",
                                        }}
                                        selected={
                                            isReportOpen
                                                ? isReportOpen
                                                : isReportListPage || isReportCreatePage
                                        }
                                        onClick={() => setIsReportOpen(!isReportOpen)}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: 1,
                                            }}
                                        >
                                            <DescriptionTwoToneIcon className="w-6 h-6" />
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    sx={{ color: "#424242", display: "inline" }}
                                                >
                                                    {t("report")}
                                                </Typography>
                                            }
                                        />

                                        {isReportOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
                                    </ListItemButton>

                                    <Collapse in={isReportOpen}>
                                        <List
                                            component="div"
                                            disablePadding
                                            sx={{ pt: 1 }}
                                            dense={true}
                                        >
                                            <ul className="ml-6 pl-[12px]">
                                                <div className="absolute h-[60px] border-l-[2px] bg-primary left-6 top-0"></div>
                                                <li>
                                                    <img
                                                        src="/images/nav_sublist.svg"
                                                        alt="sub_list_img"
                                                        className="absolute top-[6px] left-6 h-[30px] w-[14px]"
                                                    />
                                                    <ListItemButton
                                                        sx={{
                                                            borderRadius: "10px",
                                                            color: "#424242",
                                                            mb: "5px",
                                                        }}
                                                        onClick={() => navigate("/dash/reports")}
                                                        selected={location.pathname === "/dash/reports"}
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    component="span"
                                                                    variant="body1"
                                                                    sx={{ color: "#424242", display: "inline" }}
                                                                >
                                                                    {t("list")}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                </li>
                                                <li>
                                                    <img
                                                        src="/images/nav_sublist.svg"
                                                        alt="sub_list_img"
                                                        className="absolute top-[55px] left-6 h-[14px] w-[14px]"
                                                    />
                                                    <ListItemButton
                                                        sx={{
                                                            borderRadius: "10px",
                                                            color: "#424242",
                                                            mb: "5px",
                                                        }}
                                                        onClick={() => navigate("/dash/reports/new")}
                                                        selected={location.pathname === "/dash/reports/new"}
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    component="span"
                                                                    variant="body1"
                                                                    sx={{ color: "#424242", display: "inline" }}
                                                                >
                                                                    {t("create")}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                </li>
                                            </ul>
                                        </List>
                                    </Collapse>
                                </Collapse>
                            </List>
                        </div>
                    </Box>
                </Drawer>
            )}
        </>
    );
}

export default SideBarForManagerComponent;
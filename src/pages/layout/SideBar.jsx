import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSendLogoutMutation } from "../../redux/feature/auth/authApiSlice";
import {
  PiCaretDownThin,
  PiCarThin,
  PiGearThin,
  PiLetterCirclePThin,
  PiMessengerLogoFill,
  PiMessengerLogoThin,
  PiMoneyWavyFill,
  PiMoneyWavyThin,
  PiPlusThin,
  PiSignInThin,
  PiSquaresFourFill,
  PiSquaresFourThin,
  PiSteeringWheelFill,
  PiSteeringWheelThin,
  PiUserFill,
  PiUserThin,
} from "react-icons/pi";
import Settings from "./../setting/Settings";
import { FaCar, FaMapMarkerAlt } from "react-icons/fa";
import { RiFolderHistoryFill } from "react-icons/ri";
import SpaceDashboardTwoToneIcon from "@mui/icons-material/SpaceDashboardTwoTone";
import FmdGoodTwoToneIcon from "@mui/icons-material/FmdGoodTwoTone";

import {
  Box,
  Button,
  Collapse,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  styled,
  Switch,
  Typography,
} from "@mui/material";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
} from "react-icons/io";
import { FaSquareParking } from "react-icons/fa6";
import LogoComponent from "../../components/LogoComponent.jsx";
import ScheduleTwoToneIcon from "@mui/icons-material/ScheduleTwoTone";
import DriveEtaTwoToneIcon from "@mui/icons-material/DriveEtaTwoTone";
import LocalParkingTwoToneIcon from "@mui/icons-material/LocalParkingTwoTone";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import DescriptionTwoToneIcon from "@mui/icons-material/DescriptionTwoTone";
import { listItemButtonStyle } from "./../../assets/style";

function SideBar() {
  const isCollapsed = useSelector((state) => state.action.isCollapsed);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [isManagementOpen, setIsManagementOpen] = useState(true);
  const [isSubParkingOpen, setIsSubParkingOpen] = useState(false);
  const [isParkingOpen, setIsParkingOpen] = useState(false);
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [sendLogout, { isSuccess, isLoading, isError, error }] =
    useSendLogoutMutation();
  const isVehiclesListPage = location.pathname === "/dash/vehicles";
  const isVehiclesCreatePage = location.pathname === "/dash/vehicles/new";

  const handleManagementClick = () => {
    setIsManagementOpen(!isManagementOpen);
  };

  const handleOverViewClick = () => {
    setIsOverviewOpen(!isOverviewOpen);
  };

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap();
      setTimeout(() => navigate("/login"), 300);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleParkingClick = () => {
    setIsSubParkingOpen((prev) => !prev);
  };

  const handleSettingsClick = () => {
    setIsSettingModalOpen(true);
  };

  const handleSettingModalClose = () => {
    setIsSettingModalOpen(false);
  };

  const content = (
    <>
      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
        }}
        className={`${
          isCollapsed
            ? "w-[4.5rem] transition-all duration-500"
            : "w-[300px] transition-all duration-500"
        } h-full border-r-[1px] border-r-gray-300 w-[15rem] shrink-0`}
      >
        <nav className="flex flex-col relative h-screen">
          <IconButton
            aria-label="collapse_btn"
            sx={{
              border: "0.5px solid #E1E1E1",
              position: "absolute",
              top: "20px",
              right: "-15px",
              zIndex: "30",
              backgroundColor: "white",
            }}
            size="small"
          >
            <IoIosArrowBack />
          </IconButton>
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
                  // component="span"
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
                    OVERVIEW
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
                  onClick={() => navigate("/dash")}
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
                        Dashboard
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
                  onClick={() => navigate("/dash/map-views")}
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
                        sx={{ color: "#424242", display: "inline" }}
                      >
                        Map View
                      </Typography>
                    }
                  />
                </ListItemButton>
                <ListItemButton sx={{ borderRadius: "10px", color: "#424242" }}>
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
                        History
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
                    MANAGEMENT
                  </p>
                </ListSubheader>
              }
            >
              <Collapse in={isManagementOpen} timeout="auto" unmountOnExit>
                {/* Parking Menu */}
                <ListItemButton
                  sx={{ borderRadius: "10px", color: "#424242" }}
                  onClick={() => setIsParkingOpen(!isParkingOpen)}
                  selected={isParkingOpen}
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
                        Parking
                      </Typography>
                    }
                  />
                  {isParkingOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
                </ListItemButton>
                <Collapse in={isParkingOpen}>
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
                        >
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                variant="body1"
                                sx={{ color: "#424242", display: "inline" }}
                              >
                                List
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
                        >
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                variant="body1"
                                sx={{ color: "#424242", display: "inline" }}
                              >
                                Create
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </li>
                    </ul>
                  </List>
                </Collapse>
                {/* Vehicle Menu */}
                <ListItemButton
                  sx={{
                    borderRadius: "10px",
                    color: "#424242",
                    ...((isVehiclesListPage || isVehiclesCreatePage) &&
                      listItemButtonStyle),
                  }}
                  onClick={() => setIsVehicleOpen(!isVehicleOpen)}
                  selected={
                    isVehicleOpen ? ( isVehiclesListPage || isVehiclesCreatePage):(
                      isVehiclesListPage || isVehiclesCreatePage
                    )
                  }
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 1,
                    }}
                  >
                    <DriveEtaTwoToneIcon className="w-6 h-6" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        component="span"
                        variant="body1"
                        sx={{ color: "#424242", display: "inline" }}
                      >
                        Vehicle
                      </Typography>
                    }
                  />
                  {isVehicleOpen ? <IoIosArrowDown /> : <IoIosArrowForward />}
                </ListItemButton>
                <Collapse
                  in={
                    isVehicleOpen ?? ( isVehiclesListPage || isVehiclesCreatePage)
                  }
                >
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
                          onClick={() => navigate("/dash/vehicles")}
                          selected={location.pathname === "/dash/vehicles"}
                        >
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                variant="body1"
                                sx={{ color: "#424242", display: "inline" }}
                              >
                                List
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
                          onClick={() => navigate("/dash/vehicles/new")}
                          selected={location.pathname === "/dash/vehicles/new"}
                        >
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                variant="body1"
                                sx={{ color: "#424242", display: "inline" }}
                              >
                                Create
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
                  sx={{ borderRadius: "10px", color: "#424242" }}
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  selected={isUserOpen}
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
                        User
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
                          onClick={() => navigate("/dash/users")}
                        >
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                variant="body1"
                                sx={{ color: "#424242", display: "inline" }}
                              >
                                List
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
                          onClick={() => navigate("/dash/users/new")}
                        >
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                variant="body1"
                                sx={{ color: "#424242", display: "inline" }}
                              >
                                Create
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
                  sx={{ borderRadius: "10px", color: "#424242" }}
                  onClick={() => setIsReportOpen(!isReportOpen)}
                  selected={isReportOpen}
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
                        Report
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
                        >
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                variant="body1"
                                sx={{ color: "#424242", display: "inline" }}
                              >
                                List
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
                        >
                          <ListItemText
                            primary={
                              <Typography
                                component="span"
                                variant="body1"
                                sx={{ color: "#424242", display: "inline" }}
                              >
                                Create
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
          {/*<NavLink*/}
          {/*  to="/dash"*/}
          {/*  end*/}
          {/*  className={`${*/}
          {/*    isCollapsed ? "w-full h-[3rem]" : "h-[3rem]"*/}
          {/*  } overflow-hidden`}*/}
          {/*>*/}
          {/*  {({ isActive }) => (*/}
          {/*    <>*/}
          {/*      {isActive ? (*/}
          {/*        <PiSquaresFourFill className="h-7 w-7" />*/}
          {/*      ) : (*/}
          {/*        <PiSquaresFourThin className="h-7 w-7" />*/}
          {/*      )}*/}
          {/*      <span*/}
          {/*        className={`${*/}
          {/*          isCollapsed*/}
          {/*            ? "transition-all opacity-0 absolute left-12 duration-500"*/}
          {/*            : "transition-all opacity-100 absolute left-12 duration-500"*/}
          {/*        }`}*/}
          {/*      >*/}
          {/*        Dashboard*/}
          {/*      </span>*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</NavLink>*/}
          {/*<a*/}
          {/*  onClick={handleParkingClick}*/}
          {/*  className={`${*/}
          {/*    isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"*/}
          {/*  } overflow-hidden cursor-pointer`}*/}
          {/*>*/}
          {/*  <>*/}
          {/*    <PiLetterCirclePThin className="h-7 w-7" />*/}

          {/*    <span*/}
          {/*      className={`${*/}
          {/*        isCollapsed*/}
          {/*          ? "transition-all opacity-0 absolute left-12 duration-500"*/}
          {/*          : "transition-all opacity-100 absolute left-12 duration-500"*/}
          {/*      }`}*/}
          {/*    >*/}
          {/*      Parking*/}
          {/*    </span>*/}
          {/*    <PiCaretDownThin*/}
          {/*      className={`${*/}
          {/*        isCollapsed*/}
          {/*          ? "transition-all opacity-0 absolute duration-500 right-4 top-3 h-5 w-5"*/}
          {/*          : "transition-all opacity-100 absolute duration-500 right-4 top-3 h-5 w-5"*/}
          {/*      }`}*/}
          {/*    />*/}
          {/*  </>*/}
          {/*</a>*/}
          {/*{!isCollapsed && isSubParkingOpen && (*/}
          {/*  <div className="ml-4">*/}
          {/*    <NavLink*/}
          {/*      to="/dash/parking/parking-areas"*/}
          {/*      className="h-[3rem] w-full"*/}
          {/*    >*/}
          {/*      <PiCarThin className="h-7 w-7 inline-block" />*/}
          {/*      Parking List*/}
          {/*    </NavLink>*/}
          {/*    <NavLink to="/dash/parking/new" className="h-[3rem] w-full">*/}
          {/*      <PiPlusThin className="h-7 w-7 inline-block" />*/}
          {/*      Create Parking*/}
          {/*    </NavLink>*/}
          {/*  </div>*/}
          {/*)}*/}
          {/*<NavLink*/}
          {/*  to="/dash/vehicles"*/}
          {/*  className={`${*/}
          {/*    isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"*/}
          {/*  } overflow-hidden`}*/}
          {/*>*/}
          {/*  {({ isActive }) => (*/}
          {/*    <>*/}
          {/*      {isActive ? (*/}
          {/*        <PiSteeringWheelFill className="h-7 w-7" />*/}
          {/*      ) : (*/}
          {/*        <PiSteeringWheelThin className="h-7 w-7" />*/}
          {/*      )}*/}
          {/*      <span*/}
          {/*        className={`${*/}
          {/*          isCollapsed*/}
          {/*            ? "transition-all opacity-0 absolute left-12 duration-500"*/}
          {/*            : "transition-all opacity-100 absolute left-12 duration-500"*/}
          {/*        }`}*/}
          {/*      >*/}
          {/*        Vehicle*/}
          {/*      </span>*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</NavLink>*/}
          {/*<NavLink*/}
          {/*  to="/dash/users/custom"*/}
          {/*  className={`${*/}
          {/*    isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"*/}
          {/*  } overflow-hidden`}*/}
          {/*>*/}
          {/*  {({ isActive }) => (*/}
          {/*    <>*/}
          {/*      {isActive ? (*/}
          {/*        <PiUserFill className="h-7 w-7" />*/}
          {/*      ) : (*/}
          {/*        <PiUserThin className="h-7 w-7" />*/}
          {/*      )}*/}
          {/*      <span*/}
          {/*        className={`${*/}
          {/*          isCollapsed*/}
          {/*            ? "transition-all opacity-0 absolute left-12 duration-500"*/}
          {/*            : "transition-all opacity-100 absolute left-12 duration-500"*/}
          {/*        }`}*/}
          {/*      >*/}
          {/*        User*/}
          {/*      </span>*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</NavLink>*/}
          {/*<NavLink*/}
          {/*  to="/dash/messages"*/}
          {/*  className={`${*/}
          {/*    isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"*/}
          {/*  } overflow-hidden`}*/}
          {/*>*/}
          {/*  {({ isActive }) => (*/}
          {/*    <>*/}
          {/*      {isActive ? (*/}
          {/*        <PiMessengerLogoFill className="h-7 w-7" />*/}
          {/*      ) : (*/}
          {/*        <PiMessengerLogoThin className="h-7 w-7" />*/}
          {/*      )}*/}
          {/*      <span*/}
          {/*        className={`${*/}
          {/*          isCollapsed*/}
          {/*            ? "transition-all opacity-0 absolute left-12 duration-500"*/}
          {/*            : "transition-all opacity-100 absolute left-12 duration-500"*/}
          {/*        }`}*/}
          {/*      >*/}
          {/*        Message*/}
          {/*      </span>*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</NavLink>*/}
          {/*<NavLink*/}
          {/*  to="/dash/payments"*/}
          {/*  className={`${*/}
          {/*    isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"*/}
          {/*  } overflow-hidden`}*/}
          {/*>*/}
          {/*  {({ isActive }) => (*/}
          {/*    <>*/}
          {/*      {isActive ? (*/}
          {/*        <PiMoneyWavyFill className="h-7 w-7" />*/}
          {/*      ) : (*/}
          {/*        <PiMoneyWavyThin className="h-7 w-7" />*/}
          {/*      )}*/}
          {/*      <span*/}
          {/*        className={`${*/}
          {/*          isCollapsed*/}
          {/*            ? "transition-all opacity-0 absolute left-12 duration-500"*/}
          {/*            : "transition-all opacity-100 absolute left-12 duration-500"*/}
          {/*        }`}*/}
          {/*      >*/}
          {/*        Payment*/}
          {/*      </span>*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</NavLink>*/}
          {/*<a*/}
          {/*  onClick={handleSettingsClick}*/}
          {/*  className={`${*/}
          {/*    isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"*/}
          {/*  } overflow-hidden cursor-pointer`}*/}
          {/*>*/}
          {/*  <>*/}
          {/*    <PiGearThin className="h-7 w-7" />*/}
          {/*    <span*/}
          {/*      className={`${*/}
          {/*        isCollapsed*/}
          {/*          ? "transition-all opacity-0 absolute left-12 duration-500"*/}
          {/*          : "transition-all opacity-100 absolute left-12 duration-500"*/}
          {/*      }`}*/}
          {/*    >*/}
          {/*      Setting*/}
          {/*    </span>*/}
          {/*  </>*/}
          {/*</a>*/}
          {/*<a*/}
          {/*  onClick={handleLogout}*/}
          {/*  className="h-[3rem] w-full cursor-pointer overflow-hidden"*/}
          {/*>*/}
          {/*  <PiSignInThin className="h-7 w-7" />*/}
          {/*  <span*/}
          {/*    className={`${*/}
          {/*      isCollapsed*/}
          {/*        ? "transition-all opacity-0 absolute left-12 duration-500"*/}
          {/*        : "transition-all opacity-100 absolute left-12 duration-500"*/}
          {/*    }`}*/}
          {/*  >*/}
          {/*    Logout*/}
          {/*  </span>*/}
          {/*</a>          */}
        </nav>
      </Box>
      {isSettingModalOpen && (
        <Settings
          open={isSettingModalOpen}
          handleClose={handleSettingModalClose}
        />
      )}
    </>
  );

  return content;
}

export default SideBar;

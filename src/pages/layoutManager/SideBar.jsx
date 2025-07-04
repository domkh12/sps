import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import SpaceDashboardTwoToneIcon from "@mui/icons-material/SpaceDashboardTwoTone";
import FmdGoodTwoToneIcon from "@mui/icons-material/FmdGoodTwoTone";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import CarRepairIcon from '@mui/icons-material/CarRepair';
import {
    Box,
    Collapse,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader, Paper,
    Typography,
} from "@mui/material";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import LogoComponent from "../../components/LogoComponent.jsx";
import ScheduleTwoToneIcon from "@mui/icons-material/ScheduleTwoTone";
import LocalParkingTwoToneIcon from "@mui/icons-material/LocalParkingTwoTone";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import DescriptionTwoToneIcon from "@mui/icons-material/DescriptionTwoTone";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import { listItemButtonStyle } from "./../../assets/style";
import { toggleCollapsed } from "../../redux/feature/actions/actionSlice.js";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";
import HoverPopover from "material-ui-popup-state/HoverPopover";
import useAuth from "./../../hook/useAuth";
import useTranslate from "./../../hook/useTranslate";

function SideBar() {
  const isCollapsed = useSelector((state) => state.action.isCollapsed);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [isManagementOpen, setIsManagementOpen] = useState(true);
  const [isSubParkingOpen, setIsSubParkingOpen] = useState(false);
  const [isParkingOpen, setIsParkingOpen] = useState(false);
  const [isVehicleOpen, setIsVehicleOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isCompanyOpen,setIsCompanyOpen]=useState(false);
  const [isSlotOpen,setIsSlotOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isManager, isDash, isUser } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const isVehiclesListPage = location.pathname === "/dash/vehicles";
  const isVehiclesCreatePage = location.pathname === "/dash/vehicles/new";
  const isParkingListPage = location.pathname === "/dash/parking-spaces";
  const isParkingCreatePage = location.pathname === "/dash/parking-spaces/new";
  const isUserListPage = location.pathname === "/dash/users";
  const isUserCreatePage = location.pathname === "/dash/users/new";
  const isReportListPage = location.pathname === "/dash/reports";
  const isReportCreatePage = location.pathname === "/dash/reports/new";
  const isHistoryPage = location.pathname === "/dash/history";
  const isBranchListPage = location.pathname === "/dash/branches";
  const isBranchCreatePage = location.pathname === "/dash/branches/new";
  const isCompanyCreatePage=location.pathname === "/dash/companies";
  const isCompanyListPage=location.pathname === "/dash/companies/new";
  const isSlotCreatePage = location.pathname === "/dash/parking-slots";
  const isSlotListPage = location.pathname === "/dash/parking-slots/new";



  const { t } = useTranslate();

  const handleManagementClick = () => {
    setIsManagementOpen(!isManagementOpen);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  const handleOverViewClick = () => {
    setIsOverviewOpen(!isOverviewOpen);
  };

  const content = (
    <>
      <Paper
        elevation={0}
        sx={{
          color: "text.primary",
        }}
        className={`${
          isCollapsed
            ? "w-[90px] transition-all duration-500"
            : "w-[300px] transition-all duration-500"
        } h-full border-r-[1px] border-r-gray-200 w-[15rem] shrink-0 hidden xl:block`}
      >
        <nav className="flex flex-col relative h-screen">
          <IconButton
            aria-label="collapse_btn"
            sx={{
              border: "0.5px solid #e5e7eb",
              position: "absolute",
              top: "23px",
              right: "-14px",
              width: "28px",
              height: "28px",
              zIndex: "30",
              backgroundColor: "white",
              ":hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={() => dispatch(toggleCollapsed(true))}
            size="small"
          >
            {isCollapsed ? (
              <KeyboardArrowRightRoundedIcon />
            ) : (
              <KeyboardArrowLeftRoundedIcon />
            )}
          </IconButton>
          <LogoComponent />

          <div
            className={`${
              isCollapsed ? "px-[5px]" : "px-[16px]"
            }  overflow-auto`}
          >
            <List
              component="div"
              aria-labelledby="nested-list-subheader"
              subheader={
                !isCollapsed && (
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
                      {t("overview")}
                    </p>
                  </ListSubheader>
                )
              }
            >
              <Collapse
                in={isCollapsed ? isCollapsed : isOverviewOpen}
                timeout="auto"
                unmountOnExit
              >

                  <ListItemButton
                    sx={{
                      borderRadius: "10px",
                      color: "#424242",
                      mb: "5px",
                      ...(isCollapsed && {
                        padding: "5px",
                      }),
                      ...listItemButtonStyle,
                    }}
                    onClick={() => navigate("/dash")}
                    selected={location.pathname === "/dash"}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        ...(!isCollapsed && {
                          mr: 1,
                        }),
                      }}
                      className={`${
                        isCollapsed &&
                        "flex flex-col justify-center items-center w-full"
                      }`}
                    >
                      <SpaceDashboardTwoToneIcon className="w-6 h-6" />
                      {isCollapsed && (
                        <ListItemText
                          secondary={
                            <Typography
                              component="span"
                              variant="caption"
                              sx={{
                                color: "#424242",
                                display: "inline",
                              }}
                            >
                              {t("dashboard")}
                            </Typography>
                          }
                        />
                      )}
                    </ListItemIcon>

                    {!isCollapsed && (
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
                    )}
                  </ListItemButton>

                <ListItemButton
                  sx={{
                    borderRadius: "10px",
                    color: "#424242",
                    mb: "5px",
                    ...listItemButtonStyle,
                  }}
                  onClick={() => navigate("/dash/map-views")}
                  selected={location.pathname === "/dash/map-views"}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      ...(!isCollapsed && {
                        mr: 1,
                      }),
                    }}
                    className={`${
                      isCollapsed &&
                      "flex flex-col justify-center items-center w-full"
                    }`}
                  >
                   
                    <FmdGoodTwoToneIcon className="w-6 h-6" />
                    {isCollapsed && (
                      <ListItemText
                        secondary={
                          <Typography
                            component="span"
                            variant="caption"
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
                    )}
                  </ListItemIcon>
                  {!isCollapsed && (
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
                  )}
                </ListItemButton>

                <ListItemButton
                  sx={{
                    borderRadius: "10px",
                    color: "#424242",
                    ...listItemButtonStyle,
                  }}
                  onClick={() => navigate("/dash/history")}
                  selected={location.pathname === "/dash/history"}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      ...(!isCollapsed && {
                        mr: 1,
                      }),
                    }}
                    className={`${
                      isCollapsed &&
                      "flex flex-col justify-center items-center w-full"
                    }`}
                  >
                    <ScheduleTwoToneIcon className="w-6 h-6" />
                    {isCollapsed && (
                      <ListItemText
                        secondary={
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              color: "#424242",
                              display: "inline",
                              textWrap: "nowrap",
                            }}
                          >
                            {t("history")}
                          </Typography>
                        }
                      />
                    )}
                  </ListItemIcon>
                  {!isCollapsed && (
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
                  )}
                </ListItemButton>
              </Collapse>
            </List>

              <>
                <List
                  component="div"
                  aria-labelledby="nested-list-subheader"
                  sx={{
                    ...(isCollapsed && { padding: "0" }),
                  }}
                  subheader={
                    !isCollapsed && (
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
                    )
                  }
                >
                  <Collapse
                    in={isCollapsed ? isCollapsed : isManagementOpen}
                    timeout="auto"
                    unmountOnExit
                  >

                      {/* Parking spaces */}
                      <ListItemButton
                          sx={{
                              borderRadius: "10px",
                              color: "#424242",
                              ...listItemButtonStyle,
                          }}
                          onClick={() => navigate("/dash/parking-spaces")}
                          selected={location.pathname === "/dash/parking-spaces"}
                      >
                          <ListItemIcon
                              sx={{
                                  minWidth: 0,
                                  ...(!isCollapsed && {
                                      mr: 1,
                                  }),
                              }}
                              className={`${
                                  isCollapsed &&
                                  "flex flex-col justify-center items-center w-full"
                              }`}
                          >
                              <LocalParkingTwoToneIcon className="w-6 h-6" />
                              {isCollapsed && (
                                  <ListItemText
                                      secondary={
                                          <Typography
                                              component="span"
                                              variant="caption"
                                              sx={{
                                                  color: "#424242",
                                                  display: "inline",
                                                  textWrap: "nowrap",
                                              }}
                                          >
                                              {t("parkingSpace")}
                                          </Typography>
                                      }
                                  />
                              )}
                          </ListItemIcon>
                          {!isCollapsed && (
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
                          )}
                      </ListItemButton>

                    {/* Parking Slot menu */}

                      <ListItemButton
                          sx={{
                              borderRadius: "10px",
                              color: "#424242",
                              mt: "5px",
                              ...listItemButtonStyle,
                          }}
                          onClick={() => navigate("/dash/parking-slots")}
                          selected={location.pathname === "/dash/parking-slots"}
                      >
                          <ListItemIcon
                              sx={{
                                  minWidth: 0,
                                  ...(!isCollapsed && {
                                      mr: 1,
                                  }),
                              }}
                              className={`${
                                  isCollapsed &&
                                  "flex flex-col justify-center items-center w-full"
                              }`}
                          >
                              <CarRepairIcon className="w-6 h-6" />
                              {isCollapsed && (
                                  <ListItemText
                                      secondary={
                                          <Typography
                                              component="span"
                                              variant="caption"
                                              sx={{
                                                  color: "#424242",
                                                  display: "inline",
                                                  textWrap: "nowrap",
                                              }}
                                          >
                                              {t("parkingSlot")}
                                          </Typography>
                                      }
                                  />
                              )}
                          </ListItemIcon>
                          {!isCollapsed && (
                              <ListItemText
                                  primary={
                                      <Typography
                                          component="span"
                                          variant="body1"
                                          sx={{ color: "#424242", display: "inline" }}
                                      >
                                          {t("parkingSlot")}
                                      </Typography>
                                  }
                              />
                          )}
                      </ListItemButton>

                      {/* Vehicle Menu */}
                      {isCollapsed ? (
                          <>
                              <PopupState variant="popover" popupId="demoPopover">
                                  {(popupState) => (
                                      <div>
                                          <ListItemButton
                                              {...bindHover(popupState)}
                                              sx={{
                                                  borderRadius: "10px",
                                                  color: "#424242",
                                                  ...((isVehiclesListPage ||
                                                          isVehiclesCreatePage) &&
                                                      listItemButtonStyle),
                                                  mt: "5px",
                                              }}
                                              selected={
                                                  isVehicleOpen
                                                      ? isVehiclesListPage || isVehiclesCreatePage
                                                      : isVehiclesListPage || isVehiclesCreatePage
                                              }
                                          >
                                              <ListItemIcon
                                                  sx={{
                                                      minWidth: 0,
                                                  }}
                                                  className={`
                                flex flex-col justify-center items-center w-full
                              `}
                                              >
                                                  <DirectionsCarRoundedIcon className="w-6 h-6" />
                                                  <KeyboardArrowRightRoundedIcon className="absolute top-2 right-0" />
                                                  <ListItemText
                                                      secondary={
                                                          <Typography
                                                              component="span"
                                                              variant="caption"
                                                              sx={{
                                                                  color: "#424242",
                                                                  display: "inline",
                                                                  textWrap: "nowrap",
                                                              }}
                                                          >
                                                              {t("vehicle")}
                                                          </Typography>
                                                      }
                                                  />
                                              </ListItemIcon>
                                          </ListItemButton>
                                          <HoverPopover
                                              {...bindPopover(popupState)}
                                              slotProps={{
                                                  paper: {
                                                      style: {
                                                          padding: 10,
                                                          backgroundColor: "transparent",
                                                          boxShadow: "none",
                                                      },
                                                  },
                                              }}
                                              anchorOrigin={{
                                                  vertical: "center",
                                                  horizontal: "right",
                                              }}
                                              transformOrigin={{
                                                  vertical: "center",
                                                  horizontal: "left",
                                              }}
                                          >
                                              <List
                                                  component="div"
                                                  disablePadding
                                                  dense={true}
                                                  sx={{
                                                      minWidth: 0,
                                                      width: "200px",
                                                      padding: "5px",
                                                      borderRadius: "10px",
                                                      background:
                                                          "linear-gradient(to top right,#FFE4D6,#fff, #E0E0F6)",
                                                      boxShadow:
                                                          "0px 0px 15px rgba(0, 0, 0, 0.15)",
                                                  }}
                                              >
                                                  <ListItemButton
                                                      sx={{
                                                          borderRadius: "6px",
                                                          color: "#424242",
                                                          mb: "5px",
                                                      }}
                                                      onClick={() => {
                                                          if (
                                                              location.pathname !== "/dash/vehicles"
                                                          ) {
                                                              popupState.close();
                                                          }
                                                          navigate("/dash/vehicles");
                                                      }}
                                                      selected={
                                                          location.pathname === "/dash/vehicles"
                                                      }
                                                  >
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
                                                                  {t("list")}
                                                              </Typography>
                                                          }
                                                      />
                                                  </ListItemButton>

                                                  <ListItemButton
                                                      sx={{
                                                          borderRadius: "6px",
                                                          color: "#424242",
                                                      }}
                                                      onClick={() => {
                                                          if (
                                                              location.pathname !==
                                                              "/dash/vehicles/new"
                                                          ) {
                                                              popupState.close();
                                                          }
                                                          navigate("/dash/vehicles/new");
                                                      }}
                                                      selected={
                                                          location.pathname === "/dash/vehicles/new"
                                                      }
                                                  >
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
                                                                  {t("create")}
                                                              </Typography>
                                                          }
                                                      />
                                                  </ListItemButton>
                                              </List>
                                          </HoverPopover>
                                      </div>
                                  )}
                              </PopupState>
                          </>
                      ) : (
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
                      )}

                      <Collapse in={isCollapsed ? !isCollapsed : isVehicleOpen}>
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
                                          onClick={() => navigate("/dash/vehicles/new")}
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

                    {isCollapsed ? (
                      <>
                        <PopupState variant="popover" popupId="demoPopover">
                          {(popupState) => (
                            <div>
                              <ListItemButton
                                {...bindHover(popupState)}
                                sx={{
                                  borderRadius: "10px",
                                  color: "#424242",
                                  ...((isUserListPage || isUserCreatePage) &&
                                    listItemButtonStyle),
                                  mt: "5px",
                                }}
                                selected={
                                  isUserOpen
                                    ? isUserListPage || isUserCreatePage
                                    : isUserListPage || isUserCreatePage
                                }
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 0,
                                  }}
                                  className={`
                                flex flex-col justify-center items-center w-full
                              `}
                                >
                                  <AccountBoxTwoToneIcon className="w-6 h-6" />
                                  <KeyboardArrowRightRoundedIcon className="absolute top-2 right-0" />
                                  <ListItemText
                                    secondary={
                                      <Typography
                                        component="span"
                                        variant="caption"
                                        sx={{
                                          color: "#424242",
                                          display: "inline",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {t("user")}
                                      </Typography>
                                    }
                                  />
                                </ListItemIcon>
                              </ListItemButton>
                              <HoverPopover
                                {...bindPopover(popupState)}
                                slotProps={{
                                  paper: {
                                    style: {
                                      padding: 10,
                                      backgroundColor: "transparent",
                                      boxShadow: "none",
                                    },
                                  },
                                }}
                                anchorOrigin={{
                                  vertical: "center",
                                  horizontal: "right",
                                }}
                                transformOrigin={{
                                  vertical: "center",
                                  horizontal: "left",
                                }}
                              >
                                <List
                                  component="div"
                                  disablePadding
                                  dense={true}
                                  sx={{
                                    minWidth: 0,
                                    width: "200px",
                                    padding: "5px",
                                    borderRadius: "10px",
                                    background:
                                      "linear-gradient(to top right,#FFE4D6,#fff, #E0E0F6)",
                                    boxShadow:
                                      "0px 0px 15px rgba(0, 0, 0, 0.15)",
                                  }}
                                >
                                  <ListItemButton
                                    sx={{
                                      borderRadius: "6px",
                                      color: "#424242",
                                      mb: "5px",
                                    }}
                                    onClick={() => {
                                      if (location.pathname !== "/dash/users") {
                                        popupState.close();
                                      }
                                      navigate("/dash/users");
                                    }}
                                    selected={
                                      location.pathname === "/dash/users"
                                    }
                                  >
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
                                          {t("list")}
                                        </Typography>
                                      }
                                    />
                                  </ListItemButton>

                                  <ListItemButton
                                    sx={{
                                      borderRadius: "6px",
                                      color: "#424242",
                                    }}
                                    onClick={() => {
                                      if (
                                        location.pathname !== "/dash/users/new"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/dash/users/new");
                                    }}
                                    selected={
                                      location.pathname === "/dash/users/new"
                                    }
                                  >
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
                                          {t("create")}
                                        </Typography>
                                      }
                                    />
                                  </ListItemButton>
                                </List>
                              </HoverPopover>
                            </div>
                          )}
                        </PopupState>
                      </>
                    ) : (
                      <>
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

                          {isUserOpen ? (
                            <IoIosArrowDown />
                          ) : (
                            <IoIosArrowForward />
                          )}
                        </ListItemButton>
                      </>
                    )}

                    <Collapse in={isCollapsed ? !isCollapsed : isUserOpen}>
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
                              onClick={() => navigate("/dash/users/new")}
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

                    {isCollapsed ? (
                      <>
                        <PopupState variant="popover" popupId="demoPopover">
                          {(popupState) => (
                            <div>
                              <ListItemButton
                                {...bindHover(popupState)}
                                sx={{
                                  borderRadius: "10px",
                                  color: "#424242",
                                  ...((isReportListPage ||
                                    isReportCreatePage) &&
                                    listItemButtonStyle),
                                  mt: "5px",
                                }}
                                selected={
                                  isReportOpen
                                    ? isReportListPage || isReportCreatePage
                                    : isReportListPage || isReportCreatePage
                                }
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 0,
                                  }}
                                  className={`
                                flex flex-col justify-center items-center w-full
                              `}
                                >
                                  <DescriptionTwoToneIcon className="w-6 h-6" />
                                  <KeyboardArrowRightRoundedIcon className="absolute top-2 right-0" />
                                  <ListItemText
                                    secondary={
                                      <Typography
                                        component="span"
                                        variant="caption"
                                        sx={{
                                          color: "#424242",
                                          display: "inline",
                                          textWrap: "nowrap",
                                        }}
                                      >
                                        {t("report")}
                                      </Typography>
                                    }
                                  />
                                </ListItemIcon>
                              </ListItemButton>
                              <HoverPopover
                                {...bindPopover(popupState)}
                                slotProps={{
                                  paper: {
                                    style: {
                                      padding: 10,
                                      backgroundColor: "transparent",
                                      boxShadow: "none",
                                    },
                                  },
                                }}
                                anchorOrigin={{
                                  vertical: "center",
                                  horizontal: "right",
                                }}
                                transformOrigin={{
                                  vertical: "center",
                                  horizontal: "left",
                                }}
                              >
                                <List
                                  component="div"
                                  disablePadding
                                  dense={true}
                                  sx={{
                                    minWidth: 0,
                                    width: "200px",
                                    padding: "5px",
                                    borderRadius: "10px",
                                    background:
                                      "linear-gradient(to top right,#FFE4D6,#fff, #E0E0F6)",
                                    boxShadow:
                                      "0px 0px 15px rgba(0, 0, 0, 0.15)",
                                  }}
                                >
                                  <ListItemButton
                                    sx={{
                                      borderRadius: "6px",
                                      color: "#424242",
                                      mb: "5px",
                                    }}
                                    onClick={() => {
                                      if (
                                        location.pathname !== "/dash/reports"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/dash/reports");
                                    }}
                                    selected={
                                      location.pathname === "/dash/reports"
                                    }
                                  >
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
                                          {t("list")}
                                        </Typography>
                                      }
                                    />
                                  </ListItemButton>

                                  <ListItemButton
                                    sx={{
                                      borderRadius: "6px",
                                      color: "#424242",
                                    }}
                                    onClick={() => {
                                      if (
                                        location.pathname !==
                                        "/dash/reports/new"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/dash/reports/new");
                                    }}
                                    selected={
                                      location.pathname === "/dash/reports/new"
                                    }
                                  >
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
                                          {t("create")}
                                        </Typography>
                                      }
                                    />
                                  </ListItemButton>
                                </List>
                              </HoverPopover>
                            </div>
                          )}
                        </PopupState>
                      </>
                    ) : (
                      <>
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

                          {isReportOpen ? (
                            <IoIosArrowDown />
                          ) : (
                            <IoIosArrowForward />
                          )}
                        </ListItemButton>
                      </>
                    )}

                    <Collapse in={isCollapsed ? !isCollapsed : isReportOpen}>
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
                              selected={
                                location.pathname === "/dash/reports/new"
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
                  </Collapse>
                </List>
              </>

          </div>
        </nav>
      </Paper>
    </>
  );

  return content;
}

export default SideBar;

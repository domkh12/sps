import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import SpaceDashboardTwoToneIcon from "@mui/icons-material/SpaceDashboardTwoTone";
import FmdGoodTwoToneIcon from "@mui/icons-material/FmdGoodTwoTone";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import ApartmentTwoToneIcon from "@mui/icons-material/ApartmentTwoTone";
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
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
  const { isManager, isAdmin, isUser } = useAuth();
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
  const isParkingSlotPage=location.pathname === " /dash/slot";
  const isCompanyCreatePage=location.pathname === "/dash/companies";
  const isCompanyListPage=location.pathname === "/dash/companies/new";

  const isSlotCreatePage = location.pathname === " /dash/slots";
  const isSlotListPage = location.pathname === " /dash/slots/new";



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
      <Box
        sx={{
          bgcolor: "background.default",
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
                {(isManager || isAdmin) && (
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
                )}
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
            {(isManager || isAdmin) && (
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

             {/* Company  */}
                   {isManager && (
                      <>
                        {isCollapsed ? (
                          <>
                            <PopupState variant="popover" popupId="demoPopover">
                              {(popupState) => (
                                <div>
                                  <ListItemButton
                                    {...bindHover(popupState)}
                                    sx={{
                                      borderRadius: "10px",
                                      mb: "5px",
                                      color: "#424242",
                                      ...((isCompanyListPage ||
                                        isCompanyCreatePage) &&
                                        listItemButtonStyle),
                                    }}
                                    selected={
                                      isCompanyOpen
                                        ? isCompanyListPage || isCompanyCreatePage
                                        : isCompanyListPage || isCompanyCreatePage
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
                                      < ApartmentTwoToneIcon  className="w-6 h-6" />

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
                                            {t("company")}
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
                                            location.pathname !==
                                            "/dash/companies"
                                          ) {
                                            popupState.close();
                                          }
                                          navigate("/dash/companies");
                                        }}
                                        selected={
                                          location.pathname === "/dash/companies"
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
                                            "/dash/companies/new"
                                          ) {
                                            popupState.close();
                                          }
                                          navigate("/dash/companies/new");
                                        }}
                                        selected={
                                          location.pathname ===
                                          "/dash/companies/new"
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
                                ...((isCompanyListPage || isCompanyCreatePage) &&
                                  listItemButtonStyle),
                              }}
                              selected={
                                isCompanyOpen
                                  ? isCompanyOpen
                                  : isCompanyListPage || isCompanyCreatePage
                              }
                              onClick={() => setIsCompanyOpen(!isCompanyOpen)}
                              className="group relative"
                              aria-owns={open ? "parkingPopover" : undefined}
                              aria-haspopup="true"
                              onMouseEnter={handlePopoverOpen}
                              onMouseLeave={handlePopoverClose}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 1,
                                }}
                              >
                                < ApartmentTwoToneIcon  className="w-6 h-6" />
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
                                      {t("company")}
                                    </Typography>
                                  }
                                />
                              )}

                              {isCompanyOpen ? (
                                <IoIosArrowDown />
                              ) : (
                                <IoIosArrowForward />
                              )}
                            </ListItemButton>
                          </>
                        )}

                        <Collapse
                          in={isCollapsed ? !isCollapsed : isCompanyOpen}
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
                                  onClick={() => navigate("/dash/companies")}
                                  selected={
                                    location.pathname === "/dash/companies"
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
                                  onClick={() => navigate("/dash/companies/new")}
                                  selected={
                                    location.pathname === "/dash/companies/new"
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
                              </li>
                            </ul>
                          </List>
                        </Collapse>
                      </>
                    )}



            
                {/* Branch Menu */}
                    {isManager && (
                      <>
                        {isCollapsed ? (
                          <>
                            <PopupState variant="popover" popupId="demoPopover">
                              {(popupState) => (
                                <div>
                                  <ListItemButton
                                    {...bindHover(popupState)}
                                    sx={{
                                      borderRadius: "10px",
                                      mb: "5px",
                                      color: "#424242",
                                      ...((isBranchListPage ||
                                        isBranchCreatePage) &&
                                        listItemButtonStyle),
                                    }}
                                    selected={
                                      isBranchOpen
                                        ? isBranchListPage || isBranchCreatePage
                                        : isBranchListPage || isBranchCreatePage
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
                                      <EmojiTransportationIcon className="w-6 h-6" />

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
                                            {t("branch")}
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
                                            location.pathname !==
                                            "/dash/branches"
                                          ) {
                                            popupState.close();
                                          }
                                          navigate("/dash/branches");
                                        }}
                                        selected={
                                          location.pathname === "/dash/branches"
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
                                            "/dash/branch/new"
                                          ) {
                                            popupState.close();
                                          }
                                          navigate("/dash/branches/new");
                                        }}
                                        selected={
                                          location.pathname ===
                                          "/dash/branches/new"
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
                                  mt:"5px",
                                ...((isBranchListPage || isBranchCreatePage) &&
                                  listItemButtonStyle),
                              }}
                              selected={
                                isBranchOpen
                                  ? isBranchOpen
                                  : isBranchListPage || isBranchCreatePage
                              }
                              onClick={() => setIsBranchOpen(!isBranchOpen)}
                              className="group relative"
                              aria-owns={open ? "parkingPopover" : undefined}
                              aria-haspopup="true"
                              onMouseEnter={handlePopoverOpen}
                              onMouseLeave={handlePopoverClose}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 1,
                                }}
                              >
                                <EmojiTransportationIcon className="w-6 h-6" />
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
                                      {t("branch")}
                                    </Typography>
                                  }
                                />
                              )}

                              {isBranchOpen ? (
                                <IoIosArrowDown />
                              ) : (
                                <IoIosArrowForward />
                              )}
                            </ListItemButton>
                          </>
                        )}

                        <Collapse
                          in={isCollapsed ? !isCollapsed : isBranchOpen}
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
                                  onClick={() => navigate("/dash/branches")}
                                  selected={
                                    location.pathname === "/dash/branches"
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
                                  onClick={() => navigate("/dash/branches/new")}
                                  selected={
                                    location.pathname === "/dash/branches/new"
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
                              </li>
                            </ul>
                          </List>
                        </Collapse>
                      </>
                    )}

                    {/* Parking Menu */}
                    {(isManager || isAdmin) && (
                      <>
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
                                      ...((isParkingListPage ||
                                        isParkingCreatePage) &&
                                        listItemButtonStyle),
                                    }}
                                    selected={
                                      isParkingOpen
                                        ? isParkingListPage ||
                                          isParkingCreatePage
                                        : isParkingListPage ||
                                          isParkingCreatePage
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
                                      <LocalParkingTwoToneIcon className="w-6 h-6" />

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
                                            {t("parkingSpace")}
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
                                            location.pathname !==
                                            "/dash/parking-spaces"
                                          ) {
                                            popupState.close();
                                          }
                                          navigate("/dash/parking-spaces");
                                        }}
                                        selected={
                                          location.pathname === "/dash/parking-spaces"
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
                                      {isManager && (
                                        <ListItemButton
                                          sx={{
                                            borderRadius: "6px",
                                            color: "#424242",
                                          }}
                                          onClick={() => {
                                            if (
                                              location.pathname !==
                                              "/dash/parking-spaces/new"
                                            ) {
                                              popupState.close();
                                            }
                                            navigate("/dash/parking-spaces/new");
                                          }}
                                          selected={
                                            location.pathname ===
                                            "/dash/parking-spaces/new"
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
                                      )}
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
                                mt: "5px",
                                ...((isParkingListPage ||
                                  isParkingCreatePage) &&
                                  listItemButtonStyle),
                              }}
                              selected={
                                isParkingOpen
                                  ? isParkingOpen
                                  : isParkingListPage || isParkingCreatePage
                              }
                              onClick={() => setIsParkingOpen(!isParkingOpen)}
                              className="group relative"
                              aria-owns={open ? "parkingPopover" : undefined}
                              aria-haspopup="true"
                              onMouseEnter={handlePopoverOpen}
                              onMouseLeave={handlePopoverClose}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 1,
                                }}
                              >
                                <LocalParkingTwoToneIcon className="w-6 h-6" />
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
                                      {t("parkingSpace")}
                                    </Typography>
                                  }
                                />
                              )}

                              {isParkingOpen ? (
                                <IoIosArrowDown />
                              ) : (
                                <IoIosArrowForward />
                              )}
                            </ListItemButton>
                          </>
                        )}
                      </>
                    )}

                    <Collapse in={isCollapsed ? !isCollapsed : isParkingOpen}>
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
                              onClick={() => navigate("/dash/parking-spaces")}
                              selected={location.pathname === "/dash/parking-spaces"}
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

                          {isManager && (
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
                                onClick={() => navigate("/dash/parking-spaces/new")}
                                selected={
                                  location.pathname === "/dash/parking-spaces/new"
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
                            </li>
                          )}
                        </ul>
                      </List>
                    </Collapse>

                    {/* Parking Slot menu */}
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
                                  ...((isSlotListPage ||
                                    isSlotCreatePage) &&
                                    listItemButtonStyle),
                                  mt: "5px",
                                }}
                                selected={
                                  isSlotOpen
                                    ? isSlotListPage || isSlotCreatePage
                                    : isSlotListPage || isSlotCreatePage
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
                                   <CarRepairIcon className="w-6 h-6" /> 
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
                                        {t("parkingslot")}
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
                                        location.pathname !== "/dash/slots"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/dash/slots");
                                    }}
                                    selected={
                                      location.pathname === "/dash/slots"
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
                                        "/dash/slots/new"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/dash/slots/new");
                                    }}
                                    selected={
                                      location.pathname === "/dash/slots/new"
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
                            ...((isSlotListPage || isSlotCreatePage) &&
                              listItemButtonStyle),
                            mt: "5px",
                          }}
                          selected={
                            isSlotOpen
                              ? isSlotOpen
                              : isSlotListPage || isSlotCreatePage
                          }
                          onClick={() => setIsSlotOpen(!isSlotOpen)}
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
                                {t("parkingslot")}
                              </Typography>
                            }
                          />

                          {isSlotOpen ? (
                             <IoIosArrowDown />
                          ) : (
                            <IoIosArrowForward />
                          )}
                        </ListItemButton>
                      </>
                    )}

                    <Collapse in={isCollapsed ? !isCollapsed : isSlotOpen}>
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
                              onClick={() => navigate("/dash/slots")}
                              selected={location.pathname === "/dash/slots"}
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
                              onClick={() => navigate("/dash/slots/new")}
                              selected={
                                location.pathname === "/dash/slots/new"
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
            )}
          </div>
        </nav>
      </Box>
    </>
  );

  return content;
}

export default SideBar;

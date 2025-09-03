import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import SpaceDashboardTwoToneIcon from "@mui/icons-material/SpaceDashboardTwoTone";
import FmdGoodTwoToneIcon from "@mui/icons-material/FmdGoodTwoTone";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import ApartmentTwoToneIcon from "@mui/icons-material/ApartmentTwoTone";
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
  Paper,
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
import ArrowCircleRightTwoToneIcon from '@mui/icons-material/ArrowCircleRightTwoTone';
import ArrowCircleLeftTwoToneIcon from '@mui/icons-material/ArrowCircleLeftTwoTone';
import GarageTwoToneIcon from '@mui/icons-material/GarageTwoTone';

function SideBar() {
  const isCollapsed = useSelector((state) => state.action.isCollapsed);
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [isManagementOpen, setIsManagementOpen] = useState(true);
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
  const isVehiclesListPage = location.pathname === "/admin/vehicles";
  const isVehiclesCreatePage = location.pathname === "/admin/vehicles/new";
  const isParkingListPage = location.pathname === "/admin/parking-spaces";
  const isParkingCreatePage = location.pathname === "/admin/parking-spaces/new";
  const isUserListPage = location.pathname === "/admin/users";
  const isUserCreatePage = location.pathname === "/admin/users/new";
  const isReportListPage = location.pathname === "/admin/reports/parking-history";
  const isReportCreatePage = location.pathname === "/admin/reports/user-history";
  const isReportVehicle = location.pathname === "/admin/reports/vehicle-history";
  const isBranchListPage = location.pathname === "/admin/branches";
  const isBranchCreatePage = location.pathname === "/admin/branches/new";
  const isCompanyCreatePage=location.pathname === "/admin/companies";
  const isCompanyListPage=location.pathname === "/admin/companies/new";
  const isSlotCreatePage = location.pathname === "/admin/parking-slots";
  const isSlotListPage = location.pathname === "/admin/parking-slots/new";

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
            ? "w-[95px] transition-all duration-500"
            : "w-[300px] transition-all duration-500"
        } h-full border-r-[1px] border-r-gray-200 dark:border-gray-700 bg-white dark:bg-[#141A21] w-[15rem] shrink-0 hidden xl:block`}
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
                backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
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
                     
                      mb: "5px",
                      ...(isCollapsed && {
                        padding: "5px",
                      }),
                      ...listItemButtonStyle,
                    }}
                    onClick={() => navigate("/admin")}
                    selected={location.pathname === "/admin"}
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
                    mb: "5px",
                    ...listItemButtonStyle,
                  }}
                  onClick={() => navigate("/admin/map-views")}
                  selected={location.pathname === "/admin/map-views"}
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

                {/* Vehicle Entry */}

                <ListItemButton
                  sx={{
                    borderRadius: "10px",
                    mt: "5px",
                   
                    ...listItemButtonStyle,
                  }}
                  onClick={() => navigate("/admin/vehicle-entry")}
                  selected={location.pathname === "/admin/vehicle-entry"}
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
                    <ArrowCircleRightTwoToneIcon className="w-6 h-6" />
                    {isCollapsed && (
                      <ListItemText
                        secondary={
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                             
                              display: "inline",
                              textWrap: "nowrap",
                            }}
                          >
                            {t("vehicleEntry")}
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
                          sx={{ display: "inline" }}
                        >
                          {t("vehicleEntry")}
                        </Typography>
                      }
                    />
                  )}
                </ListItemButton>

                {/* Vehicle Exit */}

                <ListItemButton
                  sx={{
                    borderRadius: "10px",
                    mt: "5px",
                   
                    ...listItemButtonStyle,
                  }}
                  onClick={() => navigate("/admin/vehicle-exit")}
                  selected={location.pathname === "/admin/vehicle-exit"}
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
                    <ArrowCircleLeftTwoToneIcon className="w-6 h-6" />
                    {isCollapsed && (
                      <ListItemText
                        secondary={
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                             
                              display: "inline",
                              textWrap: "nowrap",
                            }}
                          >
                            {t("vehicleExit")}
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
                          sx={{ display: "inline" }}
                        >
                          {t("vehicleExit")}
                        </Typography>
                      }
                    />
                  )}
                </ListItemButton>

                {/* History */}
                <ListItemButton
                  sx={{
                    borderRadius: "10px",
                   
                    mt: "5px",
                    ...listItemButtonStyle,
                  }}
                  onClick={() => navigate("/admin/parking-detail")}
                  selected={location.pathname === "/admin/parking-detail"}
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
                    <GarageTwoToneIcon className="w-6 h-6" />
                    {isCollapsed && (
                      <ListItemText
                        secondary={
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                             
                              display: "inline",
                              textWrap: "nowrap",
                            }}
                          >
                            {t("parkingDetail")}
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
                          sx={{ display: "inline" }}
                        >
                          {t("parkingDetail")}
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

             {/* Company  */}
                   
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
                                        borderRadius: "10px",
                                      }}
                                    >
                                      <ListItemButton
                                        sx={{
                                          borderRadius: "6px",
                                          mb: "5px",
                                        }}
                                        onClick={() => {
                                          if (
                                            location.pathname !==
                                            "/admin/companies"
                                          ) {
                                            popupState.close();
                                          }
                                          navigate("/admin/companies");
                                        }}
                                        selected={
                                          location.pathname === "/admin/companies"
                                        }
                                      >
                                        <ListItemText
                                          primary={
                                            <Typography
                                              component="span"
                                              variant="body1"
                                              sx={{
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
                                         
                                        }}
                                        onClick={() => {
                                          if (
                                            location.pathname !==
                                            "/admin/companies/new"
                                          ) {
                                            popupState.close();
                                          }
                                          navigate("/admin/companies/new");
                                        }}
                                        selected={
                                          location.pathname ===
                                          "/admin/companies/new"
                                        }
                                      >
                                        <ListItemText
                                          primary={
                                            <Typography
                                              component="span"
                                              variant="body1"
                                              sx={{
                                               
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
                               
                                ...((isCompanyListPage || isCompanyCreatePage)),
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
                                    mb: "5px",
                                  }}
                                  onClick={() => navigate("/admin/companies")}
                                  selected={
                                    location.pathname === "/admin/companies"
                                  }
                                >
                                  <ListItemText
                                    primary={
                                      <Typography
                                        component="span"
                                        variant="body1"
                                        sx={{
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
                                    mb: "5px",
                                  }}
                                  onClick={() => navigate("/admin/companies/new")}
                                  selected={
                                    location.pathname === "/admin/companies/new"
                                  }
                                >
                                  <ListItemText
                                    primary={
                                      <Typography
                                        component="span"
                                        variant="body1"
                                        sx={{
                                         
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
                      
                {/* Branch Menu */}
                  
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
                                     
                                      ...((isBranchListPage ||
                                        isBranchCreatePage)),
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
                                        borderRadius: "10px",
                                      }}
                                    >
                                      <ListItemButton
                                        sx={{
                                          borderRadius: "6px",
                                         
                                          mb: "5px",
                                        }}
                                        onClick={() => {
                                          if (
                                            location.pathname !==
                                            "/admin/branches"
                                          ) {
                                            popupState.close();
                                          }
                                          navigate("/admin/branches");
                                        }}
                                        selected={
                                          location.pathname === "/admin/branches"
                                        }
                                      >
                                        <ListItemText
                                          primary={
                                            <Typography
                                              component="span"
                                              variant="body1"
                                              sx={{
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
                                        }}
                                        onClick={() => {
                                          if (
                                            location.pathname !==
                                            "/admin/branch/new"
                                          ) {
                                            popupState.close();
                                          }
                                          navigate("/admin/branches/new");
                                        }}
                                        selected={
                                          location.pathname ===
                                          "/admin/branches/new"
                                        }
                                      >
                                        <ListItemText
                                          primary={
                                            <Typography
                                              component="span"
                                              variant="body1"
                                              sx={{
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
                                  mt:"5px",
                                ...((isBranchListPage || isBranchCreatePage)),
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
                                    mb: "5px",
                                  }}
                                  onClick={() => navigate("/admin/branches")}
                                  selected={
                                    location.pathname === "/admin/branches"
                                  }
                                >
                                  <ListItemText
                                    primary={
                                      <Typography
                                        component="span"
                                        variant="body1"
                                        sx={{
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
                                    mb: "5px",
                                  }}
                                  onClick={() => navigate("/admin/branches/new")}
                                  selected={
                                    location.pathname === "/admin/branches/new"
                                  }
                                >
                                  <ListItemText
                                    primary={
                                      <Typography
                                        component="span"
                                        variant="body1"
                                        sx={{
                                         
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
                    

                    {/* Parking Menu */}
                   
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
                                     
                                      ...((isParkingListPage ||
                                        isParkingCreatePage)),
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
                                        borderRadius: "10px",
                                      }}
                                    >
                                      <ListItemButton
                                        sx={{
                                          borderRadius: "6px",
                                         
                                          mb: "5px",
                                        }}
                                        onClick={() => {
                                          if (
                                            location.pathname !==
                                            "/admin/parking-spaces"
                                          ) {
                                            popupState.close();
                                          }
                                          navigate("/admin/parking-spaces");
                                        }}
                                        selected={
                                          location.pathname === "/admin/parking-spaces"
                                        }
                                      >
                                        <ListItemText
                                          primary={
                                            <Typography
                                              component="span"
                                              variant="body1"
                                              sx={{
                                               
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
                                           
                                          }}
                                          onClick={() => {
                                            if (
                                              location.pathname !==
                                              "/admin/parking-spaces/new"
                                            ) {
                                              popupState.close();
                                            }
                                            navigate("/admin/parking-spaces/new");
                                          }}
                                          selected={
                                            location.pathname ===
                                            "/admin/parking-spaces/new"
                                          }
                                        >
                                          <ListItemText
                                            primary={
                                              <Typography
                                                component="span"
                                                variant="body1"
                                                sx={{
                                                 
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
                               
                                mt: "5px",
                                ...((isParkingListPage ||
                                  isParkingCreatePage)),
                              }}
                              selected={isParkingOpen ? isParkingOpen : isParkingListPage || isParkingCreatePage}
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
                                mb: "5px",
                              }}
                              onClick={() => navigate("/admin/parking-spaces")}
                              selected={location.pathname === "/admin/parking-spaces"}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ display: "inline" }}
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
                                  mb: "5px",
                                }}
                                onClick={() => navigate("/admin/parking-spaces/new")}
                                selected={
                                  location.pathname === "/admin/parking-spaces/new"
                                }
                              >
                                <ListItemText
                                  primary={
                                    <Typography
                                      component="span"
                                      variant="body1"
                                      sx={{
                                       
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
                                 
                                  ...((isSlotListPage || isSlotCreatePage) &&
                                    listItemButtonStyle),
                                  mt: "5px",
                                }}
                                selected={isSlotOpen ? isSlotListPage || isSlotCreatePage : isSlotListPage || isSlotCreatePage}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 0,
                                  }}
                                  className={`flex flex-col justify-center items-center w-full`}
                                >
                                   <CarRepairIcon className="w-6 h-6" /> 
                                 <KeyboardArrowRightRoundedIcon className="absolute top-2 right-0" />
                                  <ListItemText
                                    secondary={
                                      <Typography
                                        component="span"
                                        variant="caption"
                                        sx={{
                                         
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
                                    borderRadius: "10px",
                                   
                                  }}
                                >
                                  <ListItemButton
                                    sx={{
                                      borderRadius: "6px",
                                     
                                      mb: "5px",
                                    }}
                                    onClick={() => {
                                      if (
                                        location.pathname !== "/admin/parking-slots"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/admin/parking-slots");
                                    }}
                                    selected={
                                      location.pathname === "/admin/parking-slots"
                                    }
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography
                                          component="span"
                                          variant="body1"
                                          sx={{
                                           
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
                                     
                                    }}
                                    onClick={() => {
                                      if (
                                        location.pathname !==
                                        "/admin/parking-slots/new"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/admin/parking-slots/new");
                                    }}
                                    selected={
                                      location.pathname === "/admin/parking-slots/new"
                                    }
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography
                                          component="span"
                                          variant="body1"
                                          sx={{
                                           
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
                           
                            ...((isSlotListPage || isSlotCreatePage)),
                            mt: "5px",
                          }}
                          selected={isSlotOpen ? isSlotOpen : isSlotListPage || isSlotCreatePage}
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
                                sx={{ display: "inline" }}
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
                               
                                mb: "5px",
                              }}
                              onClick={() => navigate("/admin/parking-slots")}
                              selected={location.pathname === "/admin/parking-slots"}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ display: "inline" }}
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
                               
                                mb: "5px",
                              }}
                              onClick={() => navigate("/admin/parking-slots/new")}
                              selected={location.pathname === "/admin/parking-slots/new"}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ display: "inline" }}
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
                                    borderRadius: "10px",
                                   
                                  }}
                                >
                                  <ListItemButton
                                    sx={{
                                      borderRadius: "6px",
                                      mb: "5px",
                                    }}
                                    onClick={() => {
                                      if (
                                        location.pathname !== "/admin/vehicles"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/admin/vehicles");
                                    }}
                                    selected={
                                      location.pathname === "/admin/vehicles"
                                    }
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography
                                          component="span"
                                          variant="body1"
                                          sx={{
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
                                     
                                    }}
                                    onClick={() => {
                                      if (
                                        location.pathname !==
                                        "/admin/vehicles/new"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/admin/vehicles/new");
                                    }}
                                    selected={
                                      location.pathname === "/admin/vehicles/new"
                                    }
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography
                                          component="span"
                                          variant="body1"
                                          sx={{
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
                            ...((isVehiclesListPage || isVehiclesCreatePage)),
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
                                sx={{ display: "inline" }}
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
                               
                                mb: "5px",
                              }}
                              onClick={() => navigate("/admin/vehicles")}
                              selected={location.pathname === "/admin/vehicles"}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ display: "inline" }}
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
                               
                                mb: "5px",
                              }}
                              onClick={() => navigate("/admin/vehicles/new")}
                              selected={
                                location.pathname === "/admin/vehicles/new"
                              }
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ display: "inline" }}
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
                                    borderRadius: "10px",
                                   
                                  }}
                                >
                                  <ListItemButton
                                    sx={{
                                      borderRadius: "6px",
                                      mb: "5px",
                                    }}
                                    onClick={() => {
                                      if (location.pathname !== "/admin/users") {
                                        popupState.close();
                                      }
                                      navigate("/admin/users");
                                    }}
                                    selected={
                                      location.pathname === "/admin/users"
                                    }
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography
                                          component="span"
                                          variant="body1"
                                          sx={{
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
                                    }}
                                    onClick={() => {
                                      if (
                                        location.pathname !== "/admin/users/new"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/admin/users/new");
                                    }}
                                    selected={
                                      location.pathname === "/admin/users/new"
                                    }
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography
                                          component="span"
                                          variant="body1"
                                          sx={{
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
                            ...((isUserListPage || isUserCreatePage)),
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
                                sx={{ display: "inline" }}
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
                               
                                mb: "5px",
                              }}
                              onClick={() => navigate("/admin/users")}
                              selected={location.pathname === "/admin/users"}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ display: "inline" }}
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
                               
                                mb: "5px",
                              }}
                              onClick={() => navigate("/admin/users/new")}
                              selected={location.pathname === "/admin/users/new"}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ display: "inline" }}
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
                                  ...((isReportListPage ||
                                    isReportCreatePage || isReportVehicle)),
                                  mt: "5px",
                                }}
                                selected={
                                  isReportOpen
                                    ? isReportListPage || isReportCreatePage || isReportVehicle
                                    : isReportListPage || isReportCreatePage || isReportVehicle
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
                                    borderRadius: "10px",
                                   
                                  }}
                                >
                                    <ListItemButton
                                        sx={{
                                            borderRadius: "6px",
                                            mb: "5px",
                                        }}
                                        onClick={() => {
                                            if (
                                                location.pathname !== "/admin/reports/user-history"
                                            ) {
                                                popupState.close();
                                            }
                                            navigate("/admin/reports/parking-history");
                                        }}
                                        selected={
                                            location.pathname === "/admin/reports/parking-history"
                                        }
                                    >
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    component="span"
                                                    variant="body1"
                                                    sx={{
                                                        display: "inline",
                                                    }}
                                                >
                                                    {t("parkingHistory")}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>

                                  <ListItemButton
                                    sx={{
                                      borderRadius: "6px",
                                      mb: "5px",
                                    }}
                                    onClick={() => {
                                      if (
                                        location.pathname !== "/admin/reports/user-history"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/admin/reports/user-history");
                                    }}
                                    selected={
                                      location.pathname === "/admin/reports/user-history"
                                    }
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography
                                          component="span"
                                          variant="body1"
                                          sx={{
                                            display: "inline",
                                          }}
                                        >
                                          {t("userHistory")}
                                        </Typography>
                                      }
                                    />
                                  </ListItemButton>

                                  <ListItemButton
                                    sx={{
                                      borderRadius: "6px",
                                    }}
                                    onClick={() => {
                                      if (
                                        location.pathname !==
                                        "/admin/reports/vehicle-history"
                                      ) {
                                        popupState.close();
                                      }
                                      navigate("/admin/reports/vehicle-history");
                                    }}
                                    selected={
                                      location.pathname === "/admin/reports/vehicle-history"
                                    }
                                  >
                                    <ListItemText
                                      primary={
                                        <Typography
                                          component="span"
                                          variant="body1"
                                          sx={{
                                            display: "inline",
                                          }}
                                        >
                                          {t("vehicleHistory")}
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
                            ...((isReportListPage || isReportCreatePage || isReportVehicle)),
                            mt: "5px",
                          }}
                          selected={
                            isReportOpen
                              ? isReportOpen
                              : isReportListPage || isReportCreatePage || isReportVehicle
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
                                sx={{ display: "inline" }}
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
                            <li>
                                <img
                                    src="/images/nav_sublist.svg"
                                    alt="sub_list_img"
                                    className="absolute top-[55px] left-6 h-[14px] w-[14px]"
                                />
                                <ListItemButton
                                    sx={{
                                        borderRadius: "10px",

                                        mb: "5px",
                                    }}
                                    onClick={() => navigate("/admin/reports/parking-history")}
                                    selected={
                                        location.pathname === "/admin/reports/parking-history"
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Typography
                                                component="span"
                                                variant="body1"
                                                sx={{ display: "inline" }}
                                            >
                                                {t("parkingHistory")}
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </li>
                            <div className="absolute h-[110px] border-l-[2px] bg-primary left-6 top-0"></div>

                          <li>
                            <img
                              src="/images/nav_sublist.svg"
                              alt="sub_list_img"
                              className="absolute top-[6px] left-6 h-[30px] w-[14px]"
                            />
                            <ListItemButton
                              sx={{
                                borderRadius: "10px",
                               
                                mb: "5px",
                              }}
                              onClick={() => navigate("/admin/reports/user-history")}
                              selected={location.pathname === "/admin/reports/user-history"}
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ display: "inline" }}
                                  >
                                    {t("userHistory")}
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          </li>
                          <li>
                            <img
                              src="/images/nav_sublist.svg"
                              alt="sub_list_img"
                              className="absolute top-[110px] left-6 h-[14px] w-[14px]"
                            />
                            <ListItemButton
                              sx={{
                                borderRadius: "10px",
                               
                                mb: "5px",
                              }}
                              onClick={() => navigate("/admin/reports/vehicle-history")}
                              selected={
                                location.pathname === "/admin/reports/vehicle-history"
                              }
                            >
                              <ListItemText
                                primary={
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ display: "inline" }}
                                  >
                                    {t("vehicleHistory")}
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

import { useDispatch, useSelector } from "react-redux";
import { toggleCollapsed } from "../../redux/feature/actions/actionSlice";
import { HiMiniBell } from "react-icons/hi2";
import { FiSearch } from "react-icons/fi";
import {
  Avatar,
  Divider,
  Grid2,
  IconButton,
  Menu,
  MenuItem, Popper,
} from "@mui/material";
import { useState } from "react";
import { Badge } from "flowbite-react";
import { IoMenu, IoSettings } from "react-icons/io5";
import { PiUserSquareThin } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
import {TiArrowUnsorted} from "react-icons/ti";
import UnfoldMoreTwoToneIcon from '@mui/icons-material/UnfoldMoreTwoTone';
import SettingsTwoToneIcon from '@mui/icons-material/SettingsTwoTone';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

function NavBarDashboard() {
  const dispatch = useDispatch();
  const isLoadingBar = useSelector((state) => state.action.isLoadingBar);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleToggleCollapse = () => {
    dispatch(toggleCollapsed());
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleProfileClick = () => {
    navigate("profiles");
    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            overflow: "visible",
            width: "18rem",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            "& .MuiAvatar-root": {
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        },
      }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <div className="py-2 px-4">
        <div className="flex gap-3 items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src={user.profileImage || "/images/profile_placeholder.svg"}
              alt="avatar"
              className="w-auto h-auto object-cover"
            />
          </div>
          <Grid2 size={9}>
            <p className="truncate">{user.fullName}</p>
            <p className="truncate">{user.email}</p>
          </Grid2>
        </div>
      </div>
      <Divider />
      <MenuItem onClick={handleProfileClick} sx={{ mt: 1 }}>
        <PiUserSquareThin className="h-7 w-7 mr-3" />
        Your Profile
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgecontent={4} color="error">
            <IoMenu />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgecontent={17} color="error">
            {/* <NotificationsIcon /> */}
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {/* <AccountCircle /> */}
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <div className="header">
        <div className="text-black">
          <div className="flex justify-between items-center gap-3">
          <img src="/images/logo.png" alt="company_logo" className="h-auto w-6"/>
          <span className="text-xl ">NPIC 1</span>
            <UnfoldMoreTwoToneIcon className="w-5 h-5 text-opacity-50 text-black"/>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <button className="bg-black bg-opacity-5 hover:bg-opacity-10 w-[100px] h-[40px] rounded-xl gap-2 flex justify-evenly items-center px-[7px] mr-[8px] shadow-inner">
            <SearchTwoToneIcon className="w-5 h-5 text-black text-opacity-50"/>
            <span className="text-black bg-white px-[7px] py-[2px] rounded-lg shadow-sm">
              ⌘ K
            </span>
          </button>
          <IconButton aria-label="settings" size="large" sx={{position:"relative",width:"44px",height:"44px"}} className="active-scale hover-scale ">
            <div className="absolute w-8 h-6 overflow-hidden rounded-md flex justify-center">
            <img src="/images/english_flag.png" alt="flag" className="object-fill"/>
            </div>
          </IconButton>
          <IconButton aria-label="settings" size="large" className="active-scale hover-scale">
            <NotificationsNoneTwoToneIcon className="w-6 h-6" />
          </IconButton>
          <IconButton aria-label="settings" size="large" className="active-scale hover-scale">
            <SettingsTwoToneIcon className="w-6 h-6 animate-spin-slow" />
          </IconButton>

          <div className="w-auto h-auto hover-scale active-scale flex justify-center items-center">
            <Avatar alt="Profile" src={user.profileImage} />
          </div>
        </div>
      </div>
      {/* <AppBar
          position="static"
          color="inherit"
          sx={{ boxShadow: "none" }}
          className="border-b-[1px] border-b-gray-300"
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={handleToggleCollapse}
            >
              <PiListThin className="h-6 w-6" />
            </IconButton>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <img
                src="/images/logo.png"
                alt="logoNpic"
                className="w-8 h-auto"
              />
              <span>SPS - NPIC</span>
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <PiEnvelopeThin />
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <PiBellThin />
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
                disableRipple
                sx={{
                  cursor: "pointer",
                }}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                  <img
                    src={user.profileImage || "/images/profile_placeholder.svg"}
                    alt="avatar"
                    className="w-auto h-auto object-cover"
                  />
                </div>
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu} */}
    </>
  );
}

export default NavBarDashboard;

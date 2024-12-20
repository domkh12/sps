import { useDispatch, useSelector } from "react-redux";
import { toggleCollapsed } from "../../redux/feature/actions/actionSlice";
import { Avatar, Button, Drawer, IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CgMenuLeftAlt, CgMenuRightAlt } from "react-icons/cg";
import UnfoldMoreTwoToneIcon from "@mui/icons-material/UnfoldMoreTwoTone";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import NotificationsNoneTwoToneIcon from "@mui/icons-material/NotificationsNoneTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import ToolTipButtonComponent from "../../components/ToolTipButtonComponent";
import SidebarDrawerComponent from "../../components/SidebarDrawerComponent";
import { IoSearch } from "react-icons/io5";
import SettingComponent from "../../components/SettingComponent";
import TranslateComponent from "../../components/TranslateComponent";
import ProfileDrawerComponent from "../../components/ProfileDrawerComponent";

function NavBarDashboard() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const user = useSelector((state) => state.users.user);  
  
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };


  const listGroup1 = [
    { text: "Inbox" },
    { text: "Starred" },
    { text: "Send email", onClick: () => console.log("Send email clicked") },
    { text: "Drafts" },
  ];

  const listGroup2 = [
    { text: "All mail" },
    { text: "Trash" },
    { text: "Spam", onClick: () => console.log("Spam Clicked") },
  ];

  const combinedLists = [listGroup1, listGroup2];

  return (
    <>
      <div className="header">
        <div className=" flex items-center gap-[10px]">
          <div className="xl:hidden">
            <SidebarDrawerComponent listGroups={combinedLists} />
          </div>

          <div className="text-black">
            <div className="flex justify-between w-[60px] xl:w-auto items-center gap-3">
              <img
                src="/images/logo.png"
                alt="company_logo"
                className="h-auto w-6"
              />
              <span className="text-xl hidden sm:block text-nowrap">
                NPIC 1
              </span>
              <UnfoldMoreTwoToneIcon className="w-5 h-5 text-opacity-50 text-black" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <button className="hidden  bg-black bg-opacity-5 hover:bg-opacity-10 w-[100px] h-[40px] rounded-xl gap-2 xl:flex justify-evenly items-center px-[7px] mr-[8px] shadow-inner">
            <SearchTwoToneIcon className="w-5 h-5 text-black text-opacity-50" />
            <span className="text-black bg-white px-[7px] py-[2px] rounded-lg shadow-sm">
              ⌘ K
            </span>
          </button>
          <div>
            <ToolTipButtonComponent title={"Search"} icon={IoSearch} />
          </div>

          <TranslateComponent />

          <IconButton
            aria-label="settings"
            size="large"
            className="active-scale hover-scale"
          >
            <NotificationsNoneTwoToneIcon className="w-6 h-6" />
          </IconButton>

          <SettingComponent />

          <IconButton
            className="w-auto h-auto hover-scale active-scale flex justify-center items-center"
            onClick={handleDrawerOpen}
          >
            <Avatar alt="Profile" src={user.profileImage} />
          </IconButton>
        </div>
      </div>

      <ProfileDrawerComponent open={drawerOpen} onClose={handleDrawerClose} />
    </>
  );
}

export default NavBarDashboard;

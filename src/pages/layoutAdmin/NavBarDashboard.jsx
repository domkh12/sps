import {useDispatch, useSelector} from "react-redux";
import {Avatar, IconButton, Paper, Typography} from "@mui/material";
import NotificationsNoneTwoToneIcon from "@mui/icons-material/NotificationsNoneTwoTone";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import ToolTipButtonComponent from "../../components/ToolTipButtonComponent";
import {IoSearch} from "react-icons/io5";
import SettingComponent from "../../components/SettingComponent";
import TranslateComponent from "../../components/TranslateComponent";
import ProfileDrawerComponent from "../../components/ProfileDrawerComponent";
import {
    setIsOpenDrawerProfiles,
    setIsOpenSidebarDrawer,
} from "../../redux/feature/actions/actionSlice";
import {CgMenuLeftAlt} from "react-icons/cg";
import {useGetUserProfileQuery} from "../../redux/feature/auth/authApiSlice.js";
import UtilSearchComponent from "../../components/UtilSearchComponent.jsx";

function NavBarDashboard() {
    const drawerOpen = useSelector((state) => state.action.isOpenDrawerProfiles);
    const {data: user} = useGetUserProfileQuery("userProfile");
    const dispatch = useDispatch();

    return (
        <>
            <div
                className="h-[70px] backdrop-blur-md flex justify-between flex-nowrap items-center xl:px-[40px] px-[10px] sm:px-[20px]">
                <div className=" flex items-center gap-[10px]">
                    <div className="xl:hidden">
                        <ToolTipButtonComponent
                            title={"Collapse"}
                            icon={CgMenuLeftAlt}
                            onClick={() => dispatch(setIsOpenSidebarDrawer(true))}
                        />
                    </div>
                </div>

                <div className="flex lg:gap-2 items-center flex-nowrap">
                    <UtilSearchComponent/>

                    <TranslateComponent/>

                    <IconButton
                        aria-label="settings"
                        size="large"
                        className="active-scale hover-scale"
                    >
                        <NotificationsNoneTwoToneIcon className="w-6 h-6"/>
                    </IconButton>

                    <SettingComponent/>
                    <div className="relative p-[2px] flex justify-center items-center active-scale hover-scale">
                        <div
                            className="w-full h-full bg-gradient-to-r from-primary to-secondary animate-spin-slow absolute rounded-full "></div>
                        <IconButton
                            sx={{p: 0}}
                            className="w-auto h-auto  flex justify-center items-center"
                            onClick={() => dispatch(setIsOpenDrawerProfiles(!drawerOpen))}
                        >
                            <Avatar alt="Profile" src={user.profileImage}/>
                        </IconButton>
                    </div>
                </div>
            </div>
            {drawerOpen && (
                <ProfileDrawerComponent
                    open={drawerOpen}
                    onClose={() => dispatch(setIsOpenDrawerProfiles(false))}
                />
            )}

        </>
    );
}

export default NavBarDashboard;

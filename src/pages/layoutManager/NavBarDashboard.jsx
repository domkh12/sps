import {useDispatch, useSelector} from "react-redux";
import {Avatar, IconButton} from "@mui/material";
import {useEffect} from "react";
import NotificationsNoneTwoToneIcon from "@mui/icons-material/NotificationsNoneTwoTone";
import ToolTipButtonComponent from "../../components/ToolTipButtonComponent";
import {IoSearch} from "react-icons/io5";
import SettingComponent from "../../components/SettingComponent";
import TranslateComponent from "../../components/TranslateComponent";
import ProfileDrawerComponent from "../../components/ProfileDrawerComponent";
import SelectSiteComponent from "../../components/SelectSiteComponent";
import useAuth from "../../hook/useAuth";
import {selectCurrentToken} from "../../redux/feature/auth/authSlice";
import {useGetUserProfileQuery, useVerifySitesMutation} from "../../redux/feature/auth/authApiSlice";
import {setChangedSite} from "../../redux/feature/site/siteSlice";
import {
    setIsOpenDrawerProfiles,
    setIsOpenSidebarDrawer,
} from "../../redux/feature/actions/actionSlice";
import {CgMenuLeftAlt} from "react-icons/cg";
import {useGetListBranchQuery} from "../../redux/feature/site/siteApiSlice.js";
import UtilSearchComponent from "../../components/UtilSearchComponent.jsx";

function NavBarDashboard() {
    const drawerOpen = useSelector((state) => state.action.isOpenDrawerProfiles);
    const dispatch = useDispatch();
    const token = useSelector(selectCurrentToken);
    const {
        data: userProfile,
        isSuccess: isSuccessGetUserProfile,
        isLoading: isLoadingGetUserProfile
    } = useGetUserProfileQuery("userProfile");
    const {
        data: sitesData,
        isSuccess: isSuccessGetSites,
        isLoading: isLoadingGetSites
    } = useGetListBranchQuery("siteList");
    const {sites} = useAuth();
    const [
        verifySites,
        {
            isSuccess: isVerifySiteSuccess,
            isLoading: isVerifySiteLoading,
            isError: isVerifySiteError,
            error: errorVerifySite,
        },
    ] = useVerifySitesMutation();

    const handleChange = async (value) => {
        console.log(value);
        await verifySites({
            uuid: value,
            token: token,
        });
    };

    useEffect(() => {
        if (isVerifySiteSuccess) {
            dispatch(setChangedSite(true));
        }
    }, [isVerifySiteSuccess]);

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
                    <SelectSiteComponent
                        options={sitesData}
                        optionLabelKey="siteName"
                        onChange={handleChange}
                        selectFistValue={sites[0]}
                    />
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
                            <Avatar alt="Profile" src={userProfile?.profileImage}/>
                        </IconButton>
                    </div>
                </div>
            </div>

            <ProfileDrawerComponent
                open={drawerOpen}
                onClose={() => dispatch(setIsOpenDrawerProfiles(false))}
            />
        </>
    );
}

export default NavBarDashboard;

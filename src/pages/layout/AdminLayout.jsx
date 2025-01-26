import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavBarDashboard from "./NavBarDashboard";
import SideBar from "./SideBar";
import { useEffect, useRef, useState } from "react";
import {
  setIsPaginationSuccess,
  setIsScrolling,
} from "../../redux/feature/actions/actionSlice";
import { useConnectedUserMutation } from "../../redux/feature/users/userApiSlice";
import useWebSocket from "../../hook/useWebSocket";
import { setIsOnlineUser } from "../../redux/feature/users/userSlice";
import SnackBarComponent from "../../components/SnackBarComponent";
import { DESTINATION } from "../../config/destination";
import { useGetUserProfileMutation } from "../../redux/feature/auth/authApiSlice";
import LoadingFetchingDataComponent from "./../../components/LoadingFetchingDataComponent";
import { setSites, setSitesForChange } from "../../redux/feature/site/siteSlice";
import { useGetSitesListMutation } from "../../redux/feature/site/siteApiSlice";
import DeleteConfirmComponent from "../../components/DeleteConfirmComponent";
import { setUserProfile } from "../../redux/feature/auth/authSlice";

function AdminLayout() {
  const isPaginationSuccess = useSelector(
    (state) => state.action.isPaginationSuccess
  );
  const user = useSelector((state) => state.users.user);
  const mainContentRef = useRef(null);
  const dispatch = useDispatch();
  const [scrolling, setScrolling] = useState();
  const { loading, error, messages } = useWebSocket(DESTINATION.isOnline);
  const isErrorSnackbar = useSelector((state) => state.action.isErrorSnackbar);
  const isLoadingSnackbar = useSelector(
    (state) => state.action.isLoadingSnackbar
  );
  const changedSite = useSelector((state) => state.sites.changedSite);
  const isOpenSnackBar = useSelector((state) => state.action.isOpenSnackBar);
  const captionSnackBar = useSelector((state) => state.action.captionSnackBar);

  const [
    getSitesList,
    {
      isSuccess: isGetSitesSuccess,
      isLoading: isGetSitesLoading,
      isError: isGetSitesError,
      error: errorGetSites,
    },
  ] = useGetSitesListMutation();

  const [
    connectedUser,
    { isSuccess: isSuccessConnectUser, isLoading: isLoadingConnectUser },
  ] = useConnectedUserMutation();

  const [
    getUserProfile,
    { isSuccess: isSuccessGetUserProfile, isLoading: isLoadingGetUserProfile },
  ] = useGetUserProfileMutation();

  useEffect(() => {
    if (messages) {
      dispatch(setIsOnlineUser(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (isPaginationSuccess) {
      console.log("Scrolling to top");
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({ top: 0 });
        dispatch(setIsPaginationSuccess(false));
      }
    }
  }, [isPaginationSuccess]);

  useEffect(() => {
    if (isSuccessGetUserProfile) {      
      const connectUser = async () => {
        await connectedUser({ uuid: user?.uuid, isOnline: true });
      };
      connectUser();
    }
  }, [isSuccessGetUserProfile]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await getUserProfile().unwrap();
      dispatch(setUserProfile(res));
    };
    const fetchSite = async () => {
      const response = await getSitesList().unwrap();
      dispatch(setSitesForChange({ response }));
    };
    fetchSite();
    fetchUserProfile();

    const handleScroll = () => {
      if (mainContentRef.current) {
        setScrolling(mainContentRef.current.scrollTop > 0);
      }
    };

    const currentRef = mainContentRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        alert("Search Text");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  useEffect(() => {
    if (changedSite) window.location.reload(true);
  }, [changedSite]);
  
  useEffect(() => {
    dispatch(setIsScrolling(scrolling));
  }, [scrolling]);

  let content;

  if (isLoadingGetUserProfile || loading || isLoadingConnectUser) {
    content = <LoadingFetchingDataComponent />;
  }

  if (isSuccessGetUserProfile || isSuccessConnectUser) {
    content = (
      <div className="fixed top-0 left-0 w-full h-screen dark:bg-[#282828]">
        <div className="flex h-full bg-white">
          <SideBar />
          {/* <main className="flex flex-grow h-full overflow-auto"> */}
          <div className="flex-grow h-full overflow-auto">
            <header className="sticky top-0 w-full z-20">
              <NavBarDashboard />
            </header>
            <main
              ref={mainContentRef}
              className="xl:px-[40px] px-[10px] sm:px-[20px] pt-[8px] pb-[64px] "
            >
              <Outlet />
            </main>
          </div>
          {/* </main> */}
        </div>
        <SnackBarComponent
          isError={isErrorSnackbar}
          isLoading={isLoadingSnackbar}
          caption={captionSnackBar}
          isOpen={isOpenSnackBar}
        />
        <DeleteConfirmComponent />
      </div>
    );
  }

  return content;
}

export default AdminLayout;

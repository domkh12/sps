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
import LoadingOneComponent from "./../../components/LoadingOneComponent"; // IMPORT LoadingOneComponent
import { setSitesForChange } from "../../redux/feature/site/siteSlice";
import { useGetSitesListMutation } from "../../redux/feature/site/siteApiSlice";
import DeleteConfirmComponent from "../../components/DeleteConfirmComponent";
import { setUserProfile } from "../../redux/feature/auth/authSlice";
import {
  selectIsInitialLoading,
  setInitialLoading,
} from "../../redux/feature/app/appSlice";
import SidebarDrawerComponent from "../../components/SidebarDrawerComponent";

function AdminLayout() {
  const isPaginationSuccess = useSelector(
    (state) => state.action.isPaginationSuccess
  );
  const user = useSelector((state) => state.auth.userProfile);
  const mainContentRef = useRef(null);
  const dispatch = useDispatch();
  const [scrolling, setScrolling] = useState();
  const { error: wsError, messages } = useWebSocket(DESTINATION.isOnline); //Destructured loading and error
  const isErrorSnackbar = useSelector((state) => state.action.isErrorSnackbar);
  const isLoadingSnackbar = useSelector(
    (state) => state.action.isLoadingSnackbar
  );
  const changedSite = useSelector((state) => state.sites.changedSite);
  const isOpenSnackBar = useSelector((state) => state.action.isOpenSnackBar);
  const captionSnackBar = useSelector((state) => state.action.captionSnackBar);
  const isInitialLoading = useSelector(selectIsInitialLoading);

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
    {
      isSuccess: isSuccessConnectUser,
      isLoading: isLoadingConnectUser,
      isError: isConnectUserError,
      error: connectUserError,
    },
  ] = useConnectedUserMutation();

  const [
    getUserProfile,
    {
      isSuccess: isSuccessGetUserProfile,
      isLoading: isLoadingGetUserProfile,
      isError: isGetUserProfileError,
      error: getUserProfileError,
    },
  ] = useGetUserProfileMutation();

  useEffect(() => {
    if (messages) {
      dispatch(setIsOnlineUser(messages));
    }
  }, [messages, dispatch]);

  useEffect(() => {
    if (isPaginationSuccess) {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({ top: 0 });
        dispatch(setIsPaginationSuccess(false));
      }
    }
  }, [isPaginationSuccess, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userProfileRes = await getUserProfile().unwrap();
        dispatch(setUserProfile(userProfileRes));

        // Fetch site list
        const sitesRes = await getSitesList().unwrap();
        dispatch(setSitesForChange({ response: sitesRes }));

        //connect User only after user profile is loaded
        await connectedUser({
          uuid: userProfileRes.uuid,
          isOnline: true,
        }).unwrap();
      } catch (err) {
        //Error handled by RTK Query
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [dispatch, getUserProfile, getSitesList, connectedUser]);

  useEffect(() => {
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
  }, [scrolling, dispatch]);

  const isError =
    isGetUserProfileError || isGetSitesError || isConnectUserError || wsError;

  if (isInitialLoading) {
    return <LoadingOneComponent />; // Use LoadingOneComponent
  }

  if (isError) {
    //Combine errors to display in ErrorComponent.  Could be made more sophisticated.
    const combinedError =
      getUserProfileError || errorGetSites || connectUserError || wsError;
    return <>Error</>;
  }

  //If no loading or errors, then all calls were successful
  return (
    <div className="fixed top-0 left-0 w-full h-screen dark:bg-[#282828]">
      <div className="flex h-full bg-white">
        <SideBar />
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
      </div>
      <SnackBarComponent
        isError={isErrorSnackbar}
        isLoading={isLoadingSnackbar}
        caption={captionSnackBar}
        isOpen={isOpenSnackBar}
      />
      <DeleteConfirmComponent />
      <SidebarDrawerComponent />
    </div>
  );
}

export default AdminLayout;

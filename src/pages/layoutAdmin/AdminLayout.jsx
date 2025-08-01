import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavBarDashboard from "./NavBarDashboard";
import SideBar from "./SideBar";
import { useEffect, useRef, useState } from "react";
import {
  setIsScrolling,
} from "../../redux/feature/actions/actionSlice";
import useWebSocket from "../../hook/useWebSocket";
import SnackBarComponent from "../../components/SnackBarComponent";
import { DESTINATION } from "../../config/destination";
import {useGetUserProfileQuery} from "../../redux/feature/auth/authApiSlice";
import LoadingOneComponent from "./../../components/LoadingOneComponent";
import DeleteConfirmComponent from "../../components/DeleteConfirmComponent";
import {  selectIsInitialLoading } from "../../redux/feature/app/appSlice";
import SidebarDrawerComponent from "../../components/SidebarDrawerComponent";
import {toast, Slide} from "react-toastify";
import {setIsRefetchCheckIn} from "../../redux/feature/checkIn/checkInSlice.js";
import {setIsRefetchCheckOut} from "../../redux/feature/checkOut/checkOutSlice.js";

function AdminLayout() {
  const mainContentRef = useRef(null);
  const dispatch = useDispatch();
  const [scrolling, setScrolling] = useState();
  const { error: wsError, messages } = useWebSocket(DESTINATION.isOnline);
  const isErrorSnackbar = useSelector((state) => state.action.isErrorSnackbar);
  const isLoadingSnackbar = useSelector((state) => state.action.isLoadingSnackbar);
  const changedSite = useSelector((state) => state.sites.changedSite);
  const isOpenSnackBar = useSelector((state) => state.action.isOpenSnackBar);
  const captionSnackBar = useSelector((state) => state.action.captionSnackBar);
  const isInitialLoading = useSelector(selectIsInitialLoading);
  const {data: userProfile, isSuccess: isSuccessGetUserProfile, isLoading: isLoadingGetUserProfile} = useGetUserProfileQuery("userProfile");
  const {messages: messageCheckOut, isConnected: isConnectedCheckOut, isLoading: isLoadingCheckOut} = useWebSocket("/topic/check-out");
  const {messages: messageCheckIn, isConnected, isLoading} = useWebSocket("/topic/check-in");

    useEffect(() => {
        if (messageCheckIn) {
            dispatch(setIsRefetchCheckIn(true));
            toast(
                `🎉 Vehicle Check-In Successful!\n\n` +
                `🚗 License: ${messageCheckIn?.vehicle?.numberPlate || 'N/A'}\n` +
                `📍 Province: ${messageCheckIn?.vehicle?.licensePlateProvince?.provinceNameEn || 'Unknown'}\n` +
                `⏰ Time In: ${messageCheckIn?.timeIn || 'Not recorded'}`,
                {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    icon: "🚗",
                    transition: Slide,
                    style: {
                        whiteSpace: 'pre-line'
                    }
                }
            );
        }
    }, [messageCheckIn, dispatch]);

    useEffect(() => {
        if (messageCheckOut) {
            dispatch(setIsRefetchCheckOut(true));
            toast(
                `✅ Vehicle Check-Out Completed!\n\n` +
                `🚗 License: ${messageCheckOut?.vehicle?.numberPlate || 'N/A'}\n` +
                `📍 Province: ${messageCheckOut?.vehicle?.licensePlateProvince?.provinceNameEn || 'Unknown'}\n` +
                `🚪 Time Out: ${messageCheckOut?.timeOut || 'Not recorded'}\n` +
                `⏱️ Duration: ${messageCheckOut?.duration || 'Not calculated'}`,
                {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    icon: "🚪",
                    transition: Slide,
                    style: {
                        whiteSpace: 'pre-line'
                    }
                }
            );
        }
    }, [messageCheckOut, dispatch]);

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

  let content;

  if (isInitialLoading || isLoadingCheckOut || isLoading) {
    content = <LoadingOneComponent />;
  }

  if (isConnectedCheckOut && isConnected){
    content = (
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
    )
  }

  return content;
}

export default AdminLayout;

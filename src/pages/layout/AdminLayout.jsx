import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavBarDashboard from "./NavBarDashboard";
import SideBar from "./SideBar";
import { useEffect, useRef, useState } from "react";
import {
  setIsPaginationSuccess,
  setIsScrolling,
} from "../../redux/feature/actions/actionSlice";
import {
  useConnectedUserMutation,
  useFindUserByUuidMutation,
} from "../../redux/feature/users/userApiSlice";
import { selectCurrentToken } from "../../redux/feature/auth/authSlice";
import useWebSocket from "../../hook/useWebSocket";
import { STATUS } from "../../config/status";
import {
  setIsLoadingUser,
  setUserActive,
} from "../../redux/feature/users/userSlice";
import { Grid2 } from "@mui/material";

function AdminLayout() {
  const isPaginationSuccess = useSelector(
    (state) => state.action.isPaginationSuccess
  );
  const userUuid = useSelector((state) => state.users.uuid);
  const mainContentRef = useRef(null);
  const dispatch = useDispatch();
  const [scrolling, setScrolling] = useState();
  const dynamicDestination = `/topic/online-status`;

  const { loading, error, messages } = useWebSocket(dynamicDestination);

  const [connectedUser, { isSuccess: isSuccessConnectUser }] =
    useConnectedUserMutation();

  const [
    findUserByUuid,
    { isSuccess: isFindUserByUuidSuccess, isLoading: isFindUserByUuidLoading },
  ] = useFindUserByUuidMutation();

  useEffect(() => {
    if (messages) {
      dispatch(setUserActive(messages));
    }
  }, [messages]);

  useEffect(() => {
    const fetchUser = async () => {
      if (userUuid) {
        await findUserByUuid(userUuid);
      }
    };
    fetchUser();
  }, [userUuid]);

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
    const connectUser = async () => {
      await connectedUser({ uuid: userUuid, isOnline: true });
    };

    connectUser();

    const handleScroll = () => {
      if (mainContentRef.current) {
        setScrolling(mainContentRef.current.scrollTop > 0);
      }
    };

    const currentRef = mainContentRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    dispatch(setIsScrolling(scrolling));
  }, [scrolling]);
  let content;

  useEffect(() => {
    if (isFindUserByUuidLoading || loading) {
      content = <div>Loading...</div>;
      dispatch(setIsLoadingUser(true));
    }
  }, [isFindUserByUuidLoading]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault(); // Prevent default browser behavior
        alert('Search Text');
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  content = (
    <div className="fixed top-0 left-0 w-full h-screen dark:bg-[#282828]">
      <div className="flex h-full bg-white">
        <SideBar />
        {/* <main className="flex flex-grow h-full overflow-auto"> */}
        <div className="flex-grow h-full overflow-auto">
          <header className="sticky top-0 w-full z-20">
            <NavBarDashboard />
          </header>
          <main ref={mainContentRef} className="xl:px-[40px] px-[20px] pt-[8px] pb-[64px]">
            <Outlet />
          </main>
        </div>
        {/* </main> */}
      </div>
    </div>
  );

  return content;
}

export default AdminLayout;

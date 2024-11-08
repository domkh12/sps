import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavBarDashboard from "./NavBarDashboard";
import SideBar from "./SideBar";
import { useEffect, useRef, useState } from "react";
import {
  setIsPaginationSuccess,
  setIsScrolling,
} from "../../redux/feature/actions/actionSlice";
function AdminLayout() {
  
  const isPaginationSuccess = useSelector(
    (state) => state.action.isPaginationSuccess
  );
  const mainContentRef = useRef(null);
  const dispatch = useDispatch();
  const [scrolling, setScrolling] = useState();

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
  const content = (
    <div className="fixed top-0 left-0 w-full h-screen dark:bg-[#282828]">
      <header>
        <NavBarDashboard />        
      </header>
      <div className="flex h-full">
        <SideBar />
        <main className="flex flex-grow h-full overflow-auto">
          <div
            className=" flex-grow h-full customScrollBar max-h-[calc(100vh-4rem)]"
            ref={mainContentRef}
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );

  return content;
}

export default AdminLayout;

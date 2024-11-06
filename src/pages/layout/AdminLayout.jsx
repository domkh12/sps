import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NavBarDashboard from "./NavBarDashboard";
import SideBar from "./SideBar";
import { useEffect, useRef } from "react";
import { setIsPaginationSuccess } from "../../redux/feature/actions/actionSlice";
function AdminLayout() {
  const isLoadingBar = useSelector((state) => state.action.isLoadingBar);
  const isCollapsed = useSelector((state) => state.action.isCollapsed);
  const isPaginationSuccess = useSelector(
    (state) => state.action.isPaginationSuccess
  );
  const mainContentRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isPaginationSuccess) {
      console.log("Scrolling to top");
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({ top: 0 });
        dispatch(setIsPaginationSuccess(false));
      }
    }
  }, [isPaginationSuccess]);

  const content = (
    <div className="fixed top-0 left-0 w-full h-screen dark:bg-[#282828]">
      <header>
        <NavBarDashboard />
        {isLoadingBar ? (
          <div className="w-full">
            <div className="h-[2px] absolute w-full bg-pink-100 overflow-hidden">
              <div className="progress w-full h-full bg-gray-600 left-right"></div>
            </div>
          </div>
        ) : (
          <></>
        )}
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

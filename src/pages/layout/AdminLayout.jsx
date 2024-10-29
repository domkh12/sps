import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Flowbite } from "flowbite-react";
import { useSelector } from "react-redux";
import NavBarDashboard from "./NavBarDashboard";
import SideBar from "./SideBar";
function AdminLayout() {
  const isCollapsed = useSelector((state) => state.action.isCollapsed);  
  return (
    <Flowbite>
      <div className="flex flex-col h-screen">
        <div className="fixed top-0 left-0 right-0 z-[11]">
          <NavBarDashboard />
        </div>
        <div className="flex flex-grow pt-16">
          {" "}
          <div className="fixed top-16 left-0 bottom-0 z-[10]">
            {" "}
            <SideBar />
          </div>
          <div
            className={`${
              isCollapsed ? "ml-20 md:ml-0" : "ml-56 md:ml-0"
            } flex-grow overflow-auto  dark:bg-gray-900 z-0`}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </Flowbite>
  );
}

export default AdminLayout;

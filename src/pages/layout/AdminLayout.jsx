import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../components/dashboard/SideBar.jsx";
import NavBarDashboard from "../../components/dashboard/NavBarDashboard.jsx";
import { Flowbite } from "flowbite-react";
function AdminLayout() {
 
  return (
    <Flowbite>
      <div className="flex flex-col h-screen">
        <div className="fixed top-0 left-0 right-0 z-[9999]">
          <NavBarDashboard />
        </div>
        <div className="flex flex-grow pt-16">
          {" "}
          {/* Adjust pt value based on NavBarDashboard height */}
          <div className="fixed top-16 left-0 bottom-0">
            {" "}
            {/* Adjust top value based on NavBarDashboard height */}
            <SideBar />
          </div>
          <div className="flex-grow ml-64 overflow-auto p-4 dark:bg-gray-900">
            {" "}
            {/* Adjust ml value based on SideBar width */}
            <Outlet />
          </div>
        </div>
      </div>
    </Flowbite>
  );
}

export default AdminLayout;

import React, { useState } from "react";
import { Drawer, Label, Sidebar, TextInput } from "flowbite-react";
import useTranslation from "../hook/UseTranslation";
import { useLocation, Link } from "react-router-dom";
import { FaChartPie } from "react-icons/fa";
import { FaParking, FaCar, FaUser } from "react-icons/fa";
import { TbMessageFilled } from "react-icons/tb";
import { HiMiniBanknotes } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/feature/auth/authSlice";
import InputSearch from "../util/InputSearch";
import { toggleCollapsed } from "../../redux/feature/actions/ActionSlice";

function SideBar() {
  const { translate } = useTranslation();
  const isCollapsed = useSelector((state) => state.action.isCollapsed);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleCollapse = () => {
    dispatch(toggleCollapsed());
  };

  const location = useLocation();

  const sidebarContent = (
    <Sidebar.Items className="flex flex-col gap-2">
      <Sidebar.ItemGroup>
        <Drawer.Items>
          <div className="mb-6 mt-3">
            <InputSearch />
          </div>
        </Drawer.Items>

        <Sidebar.Item
          as={Link}
          to="/admin/dashboard"
          icon={FaChartPie}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/admin/dashboard"}
        >
          {!(isCollapsed && window.innerWidth > 768) && translate("dashboard")}
        </Sidebar.Item>

        <Sidebar.Item
          as={Link}
          to="/admin/parking"
          icon={FaParking}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/admin/parking"}
        >
          {!(isCollapsed && window.innerWidth > 768) && "Parking Map"}
        </Sidebar.Item>

        <Sidebar.Item
          as={Link}
          to="/admin/vehicle"
          icon={FaCar}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/admin/vehicle"}
        >
          {!(isCollapsed && window.innerWidth > 768) && translate("vehicle")}
        </Sidebar.Item>

        <Sidebar.Item
          as={Link}
          to="/admin/message"
          icon={TbMessageFilled}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/admin/message"}
        >
          {!(isCollapsed && window.innerWidth > 768) && translate("message")}
        </Sidebar.Item>

        <Sidebar.Item
          as={Link}
          to="/admin/payment"
          icon={HiMiniBanknotes}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/admin/payment"}
        >
          {!(isCollapsed && window.innerWidth > 768) && translate("payment")}
        </Sidebar.Item>
      </Sidebar.ItemGroup>
      <Sidebar.ItemGroup>
        <Sidebar.Item
          as={Link}
          to="/admin/setting"
          icon={IoMdSettings}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/admin/setting"}
        >
          {!(isCollapsed && window.innerWidth > 768) && translate("setting")}
        </Sidebar.Item>

        <Sidebar.Item
          as={Link}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          onClick={handleLogout}
          icon={IoLogIn}
        >
          {!(isCollapsed && window.innerWidth > 768) && translate("logout")}
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
  );

  return (
    <>
      <div className="flex h-full md:hidden">
        <Sidebar
          aria-label="side bar"
          className={`border-r-[1px] border-gray-200 dark:border-gray-700 py-[10px] h-full bg-gray-50 dark:bg-gray-800 ${
            isCollapsed ? "w-20" : "w-56"
          }`}
        >
          <Sidebar.Items className="flex flex-col gap-2 ">
            <Sidebar.ItemGroup>
              <Sidebar.Item
                as={Link}
                to="/admin/dashboard"
                icon={FaChartPie}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/admin/dashboard"}
              >
                {!isCollapsed && translate("dashboard")}
              </Sidebar.Item>

              <Sidebar.Item
                as={Link}
                to="/admin/parking"
                icon={FaParking}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/admin/parking"}
              >
                {!isCollapsed && "Parking Map"}
              </Sidebar.Item>

              <Sidebar.Item
                as={Link}
                to="/admin/vehicle"
                icon={FaCar}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/admin/vehicle"}
              >
                {!isCollapsed && translate("vehicle")}
              </Sidebar.Item>

              <Sidebar.Item
                as={Link}
                to="/admin/message"
                icon={TbMessageFilled}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/admin/message"}
              >
                {!isCollapsed && translate("message")}
              </Sidebar.Item>

              <Sidebar.Item
                as={Link}
                to="/admin/payment"
                icon={HiMiniBanknotes}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/admin/payment"}
              >
                {!isCollapsed && translate("payment")}
              </Sidebar.Item>
            </Sidebar.ItemGroup>

            <Sidebar.ItemGroup>
              <Sidebar.Item
                as={Link}
                to="/admin/setting"
                icon={IoMdSettings}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/admin/setting"}
              >
                {!isCollapsed && translate("setting")}
              </Sidebar.Item>

              <Sidebar.Item
                as={Link}
                className={`${isCollapsed ? "grid" : ""}`}
                onClick={handleLogout}
                icon={IoLogIn}
              >
                {!isCollapsed && translate("logout")}
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
      <div className="hidden md:block">
        <Drawer
          open={isCollapsed}
          onClose={handleToggleCollapse}
          className="fixed inset-y-0 left-0 mt-16"
          backdrop={true}
        >
          <Drawer.Header title="MENU" titleIcon={() => <></>} />
          <Drawer.Items>
            <Sidebar
              aria-label="Sidebar with multi-level dropdown example"
              className="[&>div]:bg-transparent [&>div]:p-0"
            >
              <div className="flex h-full flex-col justify-between py-2">
                {sidebarContent}
              </div>
            </Sidebar>
          </Drawer.Items>
        </Drawer>
      </div>
    </>
  );
}

export default SideBar;

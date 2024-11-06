import React, { useEffect, useState } from "react";
import { Drawer, Label, Sidebar, TextInput } from "flowbite-react";
import useTranslation from "../../components/hook/UseTranslation";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { FaChartPie, FaUsers } from "react-icons/fa";
import { FaParking, FaCar, FaUser } from "react-icons/fa";
import { TbMessageFilled } from "react-icons/tb";
import { HiMiniBanknotes } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import InputSearch from "../../components/util/InputSearch";
import { toggleCollapsed } from "../../redux/feature/actions/actionSlice";
import { useSendLogoutMutation } from "../../redux/feature/auth/authApiSlice";

function SideBar() {
  const { translate } = useTranslation();
  const isCollapsed = useSelector((state) => state.action.isCollapsed);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [sendLogout, { isSuccess, isLoading, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  const handleLogout = () => sendLogout();

  const handleToggleCollapse = () => {
    dispatch(toggleCollapsed());
  };

  const sidebarContent = (
    <Sidebar.Items className="flex flex-col gap-2">
      <Sidebar.ItemGroup>
        <Sidebar.Item
          as={NavLink}
          to="/dash"
          icon={FaChartPie}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/dash"}
        >
          {!(isCollapsed && window.innerWidth > 768) && translate("dashboard")}
        </Sidebar.Item>

        <Sidebar.Item
          as={NavLink}
          to="/admin/parking"
          icon={FaParking}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/admin/parking"}
        >
          {!(isCollapsed && window.innerWidth > 768) && "Parking Map"}
        </Sidebar.Item>

        <Sidebar.Item
          as={NavLink}
          to="/dash/vehicles"
          icon={FaCar}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/admin/vehicle"}
        >
          {!(isCollapsed && window.innerWidth > 768) && translate("vehicle")}
        </Sidebar.Item>

        <Sidebar.Item
          as={NavLink}
          to="/dash/users"
          icon={FaUsers}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/dash/users"}
        >
          {!(isCollapsed && window.innerWidth > 768) && "Users"}
        </Sidebar.Item>

        <Sidebar.Item
          as={NavLink}
          to="/admin/message"
          icon={TbMessageFilled}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/admin/message"}
        >
          {!(isCollapsed && window.innerWidth > 768) && translate("message")}
        </Sidebar.Item>

        <Sidebar.Item
          as={NavLink}
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
          as={NavLink}
          to="/admin/setting"
          icon={IoMdSettings}
          className={`${isCollapsed && window.innerWidth > 768 ? "grid" : ""}`}
          active={location.pathname === "/admin/setting"}
        >
          {!(isCollapsed && window.innerWidth > 768) && translate("setting")}
        </Sidebar.Item>

        <Sidebar.Item
          as={NavLink}
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
          }  transition-all duration-500`}
        >
          <Sidebar.Items className="flex flex-col gap-2">
            <Sidebar.ItemGroup>
              <Sidebar.Item
                as={NavLink}
                to="/dash"
                icon={FaChartPie}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/dash"}
              >
                {!isCollapsed && translate("dashboard")}
              </Sidebar.Item>

              <Sidebar.Item
                as={NavLink}
                to="/dash/parking"
                icon={FaParking}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/dash/parking"}
              >
                {!isCollapsed && "Parking Map"}
              </Sidebar.Item>

              <Sidebar.Item
                as={NavLink}
                to="/dash/vehicles"
                icon={FaCar}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/dash/vehicles"}
              >
                {!isCollapsed && translate("vehicle")}
              </Sidebar.Item>

              <Sidebar.Item
                as={NavLink}
                to="/dash/users"
                icon={FaUsers}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/dash/users"}
              >
                {!isCollapsed && "Users"}
              </Sidebar.Item>

              <Sidebar.Item
                as={NavLink}
                to="/dash/messages"
                icon={TbMessageFilled}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/dash/messages"}
              >
                {!isCollapsed && "Message"}
              </Sidebar.Item>

              <Sidebar.Item
                as={NavLink}
                to="/dash/payment"
                icon={HiMiniBanknotes}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/dash/payment"}
              >
                {!isCollapsed && "Payment"}
              </Sidebar.Item>
            </Sidebar.ItemGroup>

            <Sidebar.ItemGroup>
              <Sidebar.Item
                as={NavLink}
                to="/dash/setting"
                icon={IoMdSettings}
                className={`${isCollapsed ? "grid" : ""}`}
                active={location.pathname === "/dash/setting"}
              >
                {!isCollapsed && "Setting"}
              </Sidebar.Item>

              <Sidebar.Item
                as={NavLink}
                className={`${isCollapsed ? "grid" : ""}`}
                onClick={handleLogout}
                icon={IoLogIn}
              >
                {!isCollapsed && "Logout"}
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

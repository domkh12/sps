import React from "react";
import { Sidebar } from "flowbite-react";
import useTranslation from "../hook/UseTranslation";
import { useLocation, Link } from "react-router-dom";
import { FaChartPie } from "react-icons/fa";
import { FaParking, FaCar, FaUser } from "react-icons/fa";
import { TbMessageFilled } from "react-icons/tb";
import { HiMiniBanknotes } from "react-icons/hi2";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/feature/auth/authSlice";

function SideBar() {
  const { translate } = useTranslation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };
  const location = useLocation();

  return (
    <Sidebar
      aria-label="Sidebar with content separator example"
      className="border-r-[1px] border-gray-200 dark:border-gray-700  z-0 py-[10px] h-full bg-gray-50 dark:bg-gray-800"
    >
      <Sidebar.Items className="flex flex-col gap-2">
        <Sidebar.ItemGroup>
          <Sidebar.Item
            as={Link}
            to="/admin/dashboard"
            icon={FaChartPie}
            active={location.pathname === "/admin/dashboard"}
          >
            {translate("dashboard")}
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            to="/admin/parking"
            icon={FaParking}
            active={location.pathname === "/admin/parking"}
          >
            {translate("parking")}
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            to="/admin/vehicle"
            icon={FaCar}
            active={location.pathname === "/admin/vehicle"}
          >
            {translate("vehicle")}
          </Sidebar.Item>
          <Sidebar.Collapse label="User" icon={FaUser}>
            <Sidebar.Item as={Link} to="/admin/user/general">
              General User
            </Sidebar.Item>
            <Sidebar.Item as={Link} to="/admin/user/management">
              Management
            </Sidebar.Item>
            <Sidebar.Item as={Link} to="/admin/user/admin">
              Admin
            </Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Item
            as={Link}
            to="/admin/message"
            icon={TbMessageFilled}
            active={location.pathname === "/admin/message"}
          >
            {translate("message")}
          </Sidebar.Item>
          <Sidebar.Item
            as={Link}
            to="/admin/payment"
            icon={HiMiniBanknotes}
            active={location.pathname === "/admin/payment"}
          >
            {translate("payment")}
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            as={Link}
            to="/admin/setting"
            icon={IoMdSettings}
            active={location.pathname === "/admin/setting"}
          >
            {translate("setting")}
          </Sidebar.Item>
          <Sidebar.Item as={Link} onClick={handleLogout} icon={IoLogIn}>
            {translate("logout")}
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default SideBar;

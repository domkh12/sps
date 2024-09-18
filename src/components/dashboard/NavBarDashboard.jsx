import React from "react";
import useTranslation from "../hook/UseTranslation";
import {
  Avatar,
  DarkThemeToggle,
  Dropdown,
  Navbar,
  Tooltip,
} from "flowbite-react";
import InputSearch from "../util/InputSearch";
import Notification from "../util/Notification";
import { Link, useNavigate } from "react-router-dom";

function NavBarDashboard() {
  const { translate } = useTranslation();

  return (
    <Navbar
      fluid
      rounded
      className="border-b-[1px] border-gray-200 dark:border-gray-700 px-4"
    >
      <Navbar.Brand className="flex items-center gap-[80px]">
        <div  className="flex items-center">
        <img
          src="/logo/logo.png"
          className="mr-3 h-10 sm:h-9"
          alt="Flowbite React Logo"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:hidden">
          SPS - NPIC
        </span>
        </div>
        <InputSearch />
      </Navbar.Brand>

      <div className="flex md:order-2 gap-4 items-center">
        <DarkThemeToggle />
        <Notification />
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">
              name@flowbite.com
            </span>
          </Dropdown.Header>
          <Dropdown.Item>Dashboard</Dropdown.Item>
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item>Earnings</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>Sign out</Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
}

export default NavBarDashboard;

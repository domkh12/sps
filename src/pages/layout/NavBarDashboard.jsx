import React from "react";
import useTranslation from "../../components/hook/UseTranslation";
import {
  Avatar,
  Button,
  DarkThemeToggle,
  Dropdown,
  Navbar,
  Tooltip,
} from "flowbite-react";
import InputSearch from "../../components/util/InputSearch";
import Notification from "../../components/util/Notification";
import { HiMenuAlt2 } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toggleCollapsed } from "../../redux/feature/actions/actionSlice";
import { IoSearch } from "react-icons/io5";

function NavBarDashboard() {
  const { translate } = useTranslation();
  const dispatch = useDispatch();

  const handleToggleCollapse = () => {
    dispatch(toggleCollapsed());
  };

  return (
    <Navbar
      fluid
      rounded
      className="border-b-[1px] border-gray-200 dark:border-gray-700 px-4"
    >
      <Navbar.Brand className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <Button onClick={handleToggleCollapse} className="w-10 h-10 mr-2">
            <HiMenuAlt2 className="h-5 w-5 text-black" />
          </Button>
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
        <div className="flex-grow flex justify-center md:hidden">
          {/* <InputSearch /> */}
        </div>

        <div className="flex md:order-2 gap-4 items-center">
          <Button
            onClick={handleToggleCollapse}
            className="hidden md:flex w-10 h-10"
          >
            <IoSearch className="h-5 w-5 text-gray-700" />
          </Button>
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
      </Navbar.Brand>
    </Navbar>
  );
}

export default NavBarDashboard;

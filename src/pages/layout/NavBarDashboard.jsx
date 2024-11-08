import {
  Avatar,  
  DarkThemeToggle,
  Dropdown,
  Navbar,  
} from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCollapsed } from "../../redux/feature/actions/actionSlice";
import { PiListThin } from "react-icons/pi";
import Notification from "../../components/util/Notification";

function NavBarDashboard() {
  const dispatch = useDispatch();
  const isLoadingBar = useSelector((state) => state.action.isLoadingBar);

  const handleToggleCollapse = () => {
    dispatch(toggleCollapsed());
  };

  return (
    <div className="relative">
    <Navbar
      fluid
      rounded
      className="border-b-[1px] border-gray-200 dark:border-gray-700 dark:bg-[#282828]"
    >
      <Navbar.Brand className="flex items-center justify-between w-full">
        <div className="flex items-center">
         
          <button onClick={handleToggleCollapse} className="w-[3rem] h-[3rem] rounded-full flex justify-center items-center mr-2 ring-transparent hover:bg-gray-200 dark:hover:bg-gray-700">
            <PiListThin className="h-6 w-6 text-black text-xl dark:text-gray-100" />
          </button>
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
    {isLoadingBar ? (
      <div className="w-full fixed z-10">
        <div className="h-[2px] w-full bg-pink-100 overflow-hidden">
          <div className="progress w-full h-full bg-gray-600 left-right"></div>
        </div>
      </div>
    ) : (
      <></>
    )}
    </div>
  );
}

export default NavBarDashboard;

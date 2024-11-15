import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSendLogoutMutation } from "../../redux/feature/auth/authApiSlice";
import {
  PiGearFill,
  PiGearThin,
  PiLetterCirclePFill,
  PiLetterCirclePThin,
  PiMessengerLogoFill,
  PiMessengerLogoThin,
  PiMoneyWavyFill,
  PiMoneyWavyThin,
  PiSignInThin,
  PiSquaresFourFill,
  PiSquaresFourThin,
  PiSteeringWheelFill,
  PiSteeringWheelThin,
  PiUserFill,
  PiUserThin,
} from "react-icons/pi";

function SideBar() {
  const isCollapsed = useSelector((state) => state.action.isCollapsed);
  const navigate = useNavigate();

  const [sendLogout, { isSuccess, isLoading, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) {
      console.log(isSuccess);
      navigate("/login");
    }
  }, [isSuccess, navigate]);

  const handleLogout = () => sendLogout();

  const content = (
    <>
      <div
        className={`${
          isCollapsed
            ? "w-[4rem] transition-all duration-500"
            : "w-[15rem] transition-all duration-500"
        }  h-full border-r-[1px] border-r-gray-300 w-[15rem] shrink-0`}
      >
        <nav id="sidebar" className="flex flex-col">
          <NavLink
            to="/dash"
            end
            className={`${
              isCollapsed ? "w-full h-[3rem]" : "h-[3rem]"
            } overflow-hidden`}
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <PiSquaresFourFill className="h-6 w-6" />
                ) : (
                  <PiSquaresFourThin className="h-6 w-6" />
                )}
                <span
                  className={`${isCollapsed ? "transition-all opacity-0 absolute left-12 duration-500" : "transition-all opacity-100 absolute left-12 duration-500"}`}
                >
                  Dashboard
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/dash/parking"
            className={`${
              isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"
            } overflow-hidden`}
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <PiLetterCirclePFill className="h-6 w-6" />
                ) : (
                  <PiLetterCirclePThin className="h-6 w-6" />
                )}
                <span
                  className={`${isCollapsed ? "transition-all opacity-0 absolute left-12 duration-500" : "transition-all opacity-100 absolute left-12 duration-500"}`}
                >
                  Parking
                </span>
              </>
            )}
          </NavLink>       
          <NavLink
            to="/dash/vehicles"
            className={`${
              isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"
            } overflow-hidden`}
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <PiSteeringWheelFill className="h-6 w-6" />
                ) : (
                  <PiSteeringWheelThin className="h-6 w-6" />
                )}
                <span
                  className={`${isCollapsed ? "transition-all opacity-0 absolute left-12 duration-500" : "transition-all opacity-100 absolute left-12 duration-500"}`}
                >
                  Vehicle
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/dash/users"
            className={`${
              isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"
            } overflow-hidden`}
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <PiUserFill className="h-6 w-6" />
                ) : (
                  <PiUserThin className="h-6 w-6" />
                )}
                <span
                  className={`${isCollapsed ? "transition-all opacity-0 absolute left-12 duration-500" : "transition-all opacity-100 absolute left-12 duration-500"}`}
                >
                  User
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/dash/messages"
            className={`${
              isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"
            } overflow-hidden`}
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <PiMessengerLogoFill className="h-6 w-6" />
                ) : (
                  <PiMessengerLogoThin className="h-6 w-6" />
                )}
                <span
                  className={`${isCollapsed ? "transition-all opacity-0 absolute left-12 duration-500" : "transition-all opacity-100 absolute left-12 duration-500"}`}
                >
                  Message
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/dash/payments"
            className={`${
              isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"
            } overflow-hidden`}
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <PiMoneyWavyFill className="h-6 w-6" />
                ) : (
                  <PiMoneyWavyThin className="h-6 w-6" />
                )}
                <span
                  className={`${isCollapsed ? "transition-all opacity-0 absolute left-12 duration-500" : "transition-all opacity-100 absolute left-12 duration-500"}`}
                >
                  Payment
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/dash/settings"
            className={`${
              isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"
            } overflow-hidden`}
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <PiGearFill className="h-6 w-6" />
                ) : (
                  <PiGearThin className="h-6 w-6" />
                )}
                <span
                  className={`${isCollapsed ? "transition-all opacity-0 absolute left-12 duration-500" : "transition-all opacity-100 absolute left-12 duration-500"}`}
                >
                  Setting
                </span>
              </>
            )}
          </NavLink>
          <a
            onClick={handleLogout}
            className="h-[3rem] w-full cursor-pointer overflow-hidden"
          >
            <PiSignInThin className="h-6 w-6" />
            <span
              className={`${isCollapsed ? "transition-all opacity-0 absolute left-12 duration-500" : "transition-all opacity-100 absolute left-12 duration-500"}`}
            >
              Logout
            </span>
          </a>
        </nav>
      </div>
    </>
  );

  return content;

  // const sidebarContent = (
  //   <Sidebar.Items className="flex flex-col gap-2 dark:bg-[#282828]">
  //     <Sidebar.ItemGroup>
  //       <Sidebar.Item
  //         as={NavLink}
  //         to="/dash"
  //         icon={FaChartPie}
  //         className={`${isCollapsed && window.innerWidth > 768 ? "grid" : "h-[3rem]"}`}
  //         active={location.pathname === "/dash"}
  //       >
  //         {!(isCollapsed && window.innerWidth > 768) && translate("dashboard")}
  //       </Sidebar.Item>

  //       <Sidebar.Item
  //         as={NavLink}
  //         to="/admin/parking"
  //         icon={FaParking}
  //         className={`${isCollapsed && window.innerWidth > 768 ? "grid" : "h-[3rem]"}`}
  //         active={location.pathname === "/admin/parking"}
  //       >
  //         {!(isCollapsed && window.innerWidth > 768) && "Parking Map"}
  //       </Sidebar.Item>

  //       <Sidebar.Item
  //         as={NavLink}
  //         to="/dash/vehicles"
  //         icon={FaCar}
  //         className={`${isCollapsed && window.innerWidth > 768 ? "grid" : "h-[3rem]"}`}
  //         active={location.pathname === "/admin/vehicle"}
  //       >
  //         {!(isCollapsed && window.innerWidth > 768) && translate("vehicle")}
  //       </Sidebar.Item>

  //       <Sidebar.Item
  //         as={NavLink}
  //         to="/dash/users"
  //         icon={FaUsers}
  //         className={`${isCollapsed && window.innerWidth > 768 ? "grid" : "h-[3rem]"}`}
  //         active={location.pathname === "/dash/users"}
  //       >
  //         {!(isCollapsed && window.innerWidth > 768) && "Users"}
  //       </Sidebar.Item>

  //       <Sidebar.Item
  //         as={NavLink}
  //         to="/admin/message"
  //         icon={TbMessageFilled}
  //         className={`${isCollapsed && window.innerWidth > 768 ? "grid" : "h-[3rem]"}`}
  //         active={location.pathname === "/admin/message"}
  //       >
  //         {!(isCollapsed && window.innerWidth > 768) && translate("message")}
  //       </Sidebar.Item>

  //       <Sidebar.Item
  //         as={NavLink}
  //         to="/admin/payment"
  //         icon={HiMiniBanknotes}
  //         className={`${isCollapsed && window.innerWidth > 768 ? "grid" : "h-[3rem]"}`}
  //         active={location.pathname === "/admin/payment"}
  //       >
  //         {!(isCollapsed && window.innerWidth > 768) && translate("payment")}
  //       </Sidebar.Item>
  //     </Sidebar.ItemGroup>
  //     <Sidebar.ItemGroup>
  //       <Sidebar.Item
  //         as={NavLink}
  //         to="/admin/setting"
  //         icon={IoMdSettings}
  //         className={`${isCollapsed && window.innerWidth > 768 ? "grid" : "h-[3rem]"}`}
  //         active={location.pathname === "/admin/setting"}
  //       >
  //         {!(isCollapsed && window.innerWidth > 768) && translate("setting")}
  //       </Sidebar.Item>

  //       <Sidebar.Item
  //         as={NavLink}
  //         className={`${isCollapsed && window.innerWidth > 768 ? "grid" : "h-[3rem]"}`}
  //         onClick={handleLogout}
  //         icon={IoLogIn}
  //       >
  //         {!(isCollapsed && window.innerWidth > 768) && translate("logout")}
  //       </Sidebar.Item>
  //     </Sidebar.ItemGroup>
  //   </Sidebar.Items>
  // );

  // return (
  //   <>
  //     <div className="flex h-full md:hidden">
  //       <Sidebar
  //         aria-label="side bar"
  //         className={`border-r-[1px] border-gray-200 dark:bg-[#282828] dark:border-gray-700 py-[10px] h-full bg-gray-50 ${
  //           isCollapsed ? "w-20" : "w-56"
  //         }  transition-all duration-500`}
  //       >
  //         <Sidebar.Items className="flex flex-col gap-2">
  //           <Sidebar.ItemGroup>
  //             <Sidebar.Item
  //               as={NavLink}
  //               to="/dash"
  //               icon={FaChartPie}
  //               className={`${isCollapsed ? "grid" : "h-[3rem]"}`}
  //               active={location.pathname === "/dash"}
  //             >
  //               {!isCollapsed && translate("dashboard")}
  //             </Sidebar.Item>

  //             <Sidebar.Item
  //               as={NavLink}
  //               to="/dash/parking"
  //               icon={FaParking}
  //               className={`${isCollapsed ? "grid" : "h-[3rem]"}`}
  //               active={location.pathname === "/dash/parking"}
  //             >
  //               {!isCollapsed && "Parking Map"}
  //             </Sidebar.Item>

  //             <Sidebar.Item
  //               as={NavLink}
  //               to="/dash/vehicles"
  //               icon={FaCar}
  //               className={`${isCollapsed ? "grid" : "h-[3rem]"}`}
  //               active={location.pathname === "/dash/vehicles"}
  //             >
  //               {!isCollapsed && translate("vehicle")}
  //             </Sidebar.Item>

  //             <Sidebar.Item
  //               as={NavLink}
  //               to="/dash/users"
  //               icon={FaUsers}
  //               className={`${isCollapsed ? "grid" : "h-[3rem]"}`}
  //               active={location.pathname === "/dash/users"}
  //             >
  //               {!isCollapsed && "Users"}
  //             </Sidebar.Item>

  //             <Sidebar.Item
  //               as={NavLink}
  //               to="/dash/messages"
  //               icon={TbMessageFilled}
  //               className={`${isCollapsed ? "grid" : "h-[3rem]"}`}
  //               active={location.pathname === "/dash/messages"}
  //             >
  //               {!isCollapsed && "Message"}
  //             </Sidebar.Item>

  //             <Sidebar.Item
  //               as={NavLink}
  //               to="/dash/payment"
  //               icon={HiMiniBanknotes}
  //               className={`${isCollapsed ? "grid" : "h-[3rem]"}`}
  //               active={location.pathname === "/dash/payment"}
  //             >
  //               {!isCollapsed && "Payment"}
  //             </Sidebar.Item>
  //           </Sidebar.ItemGroup>

  //           <Sidebar.ItemGroup>
  //             <Sidebar.Item
  //               as={NavLink}
  //               to="/dash/setting"
  //               icon={IoMdSettings}
  //               className={`${isCollapsed ? "grid" : "h-[3rem]"}`}
  //               active={location.pathname === "/dash/setting"}
  //             >
  //               {!isCollapsed && "Setting"}
  //             </Sidebar.Item>

  //             <Sidebar.Item
  //               as={NavLink}
  //               className={`${isCollapsed ? "grid" : "h-[3rem]"}`}
  //               onClick={handleLogout}
  //               icon={IoLogIn}
  //             >
  //               {!isCollapsed && "Logout"}
  //             </Sidebar.Item>
  //           </Sidebar.ItemGroup>
  //         </Sidebar.Items>
  //       </Sidebar>
  //     </div>
  //     <div className="hidden md:block">
  //       <Drawer
  //         open={isCollapsed}
  //         onClose={handleToggleCollapse}
  //         className="fixed inset-y-0 left-0 mt-16"
  //         backdrop={true}
  //       >
  //         <Drawer.Header title="MENU" titleIcon={() => <></>} />
  //         <Drawer.Items>
  //           <Sidebar
  //             aria-label="Sidebar with multi-level dropdown example"
  //             className="[&>div]:bg-transparent [&>div]:p-0"
  //           >
  //             <div className="flex h-full flex-col justify-between py-2">
  //               {sidebarContent}
  //             </div>
  //           </Sidebar>
  //         </Drawer.Items>
  //       </Drawer>
  //     </div>
  //   </>
  // );
}

export default SideBar;

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
import Settings from "./../setting/Settings";

function SideBar() {
  const isCollapsed = useSelector((state) => state.action.isCollapsed);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sendLogout, { isSuccess, isLoading, isError, error }] =
    useSendLogoutMutation();

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap();
      setTimeout(() => navigate("/login"), 300);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSettingsClick = () => {
    setIsSettingModalOpen(true);
  };

  const handleSettingModalClose = () => {
    setIsSettingModalOpen(false);
  };

  const content = (
    <>
      <div
        className={`${
          isCollapsed
            ? "w-[4.8rem] transition-all duration-500"
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
                  className={`${
                    isCollapsed
                      ? "transition-all opacity-0 absolute left-12 duration-500"
                      : "transition-all opacity-100 absolute left-12 duration-500"
                  }`}
                >
                  Dashboard
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/dash/parking/parking-areas"
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
                  className={`${
                    isCollapsed
                      ? "transition-all opacity-0 absolute left-12 duration-500"
                      : "transition-all opacity-100 absolute left-12 duration-500"
                  }`}
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
                  className={`${
                    isCollapsed
                      ? "transition-all opacity-0 absolute left-12 duration-500"
                      : "transition-all opacity-100 absolute left-12 duration-500"
                  }`}
                >
                  Vehicle
                </span>
              </>
            )}
          </NavLink>
          <NavLink
            to="/dash/users/custom"
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
                  className={`${
                    isCollapsed
                      ? "transition-all opacity-0 absolute left-12 duration-500"
                      : "transition-all opacity-100 absolute left-12 duration-500"
                  }`}
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
                  className={`${
                    isCollapsed
                      ? "transition-all opacity-0 absolute left-12 duration-500"
                      : "transition-all opacity-100 absolute left-12 duration-500"
                  }`}
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
                  className={`${
                    isCollapsed
                      ? "transition-all opacity-0 absolute left-12 duration-500"
                      : "transition-all opacity-100 absolute left-12 duration-500"
                  }`}
                >
                  Payment
                </span>
              </>
            )}
          </NavLink>
          <a
            onClick={handleSettingsClick}
            className={`${
              isCollapsed ? "h-[3rem] w-full" : "h-[3rem]"
            } overflow-hidden cursor-pointer`}
          >
            <>
              <PiGearThin className="h-6 w-6" />
              <span
                className={`${
                  isCollapsed
                    ? "transition-all opacity-0 absolute left-12 duration-500"
                    : "transition-all opacity-100 absolute left-12 duration-500"
                }`}
              >
                Setting
              </span>
            </>
          </a>
          <a
            onClick={handleLogout}
            className="h-[3rem] w-full cursor-pointer overflow-hidden"
          >
            <PiSignInThin className="h-6 w-6" />
            <span
              className={`${
                isCollapsed
                  ? "transition-all opacity-0 absolute left-12 duration-500"
                  : "transition-all opacity-100 absolute left-12 duration-500"
              }`}
            >
              Logout
            </span>
          </a>
        </nav>
      </div>
      {isSettingModalOpen && (
        <Settings
          open={isSettingModalOpen}
          handleClose={handleSettingModalClose}
        />
      )}
    </>
  );

  return content;
}

export default SideBar;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../../redux/feature/users/userApiSlice";
import { Link, useNavigate } from "react-router-dom";
import {
  getContrastingTextColor,
  stringToColor,
} from "../../redux/feature/utils/colorUtils";
import { FaEdit, FaEye } from "react-icons/fa";
import AvartarCustom from "./components/AvartarCustom";
import { STATUS } from "../../config/status";
import { Badge, Chip, styled } from "@mui/material";

function UserRow({ userId, uuid, status, isActionButton }) {
  const navigate = useNavigate();
  const user = useSelector((state) => selectUserById(state, userId));
  const [updatedUser, setUpdatedUser] = useState("");
  const userActive = useSelector((state) => state.users.userActive);

  const StyledBadge = styled(Badge, {
    shouldForwardProp: (prop) => prop !== "isOnline",
  })(({ theme, isOnline }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isOnline ? "#44b700" : "gray",
      color: isOnline ? "#44b700" : "gray",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: isOnline ? "ripple 1.2s infinite ease-in-out" : "none",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));

  useEffect(() => {
    if (user && user.uuid === uuid) {
      setUpdatedUser({ ...user, status: status });
    } else if (user && userActive.uuid === user.uuid) {
      setUpdatedUser({ ...user, status: userActive.status });
    }
  }, [user, uuid, status, userActive]);

  if (user) {
    var handleEdit = () => navigate(`/dash/users/${userId}`);
    var handleView = () => navigate(`/dash/users/${userId}/view`);

    var fullName = user.fullName;
    var firstLetterOfFullName = fullName.substring(0, 1);

    var userRolesString = user.roleNames.map((role, index) => (
      <Chip key={index} label={role} variant="outlined" />
    ));

    var createdAt = user.createdAt;
    var createdAtResult = createdAt.substring(0, createdAt.indexOf("T"));

    var avatarColor = stringToColor(userId);
    var textColor = getContrastingTextColor(avatarColor);
  } else {
    return null;
  }

  return (
    <tr className="text-left">
      <td>
        <Link
          to={`/dash/users/${userId}/view`}
          onClick={handleView}
          className="flex justify-start items-center gap-2 cursor-pointer"
        >
          {user.profileImage ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              isOnline={
                updatedUser
                  ? updatedUser.status === STATUS.ONLINE
                  : user.status === STATUS.ONLINE
              }
            >
              <img
                src={user.profileImage}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            </StyledBadge>
          ) : (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              isOnline={
                updatedUser
                  ? updatedUser.status === STATUS.ONLINE
                  : user.status === STATUS.ONLINE
              }
            >
              <AvartarCustom
                placeholderInitials={firstLetterOfFullName}
                bgColor={avatarColor}
                textColor={textColor}
              />
            </StyledBadge>
          )}
          <span className="text-blue-600 underline-offset-2 underline">
            {user.fullName ? user.fullName : "N/A"}
          </span>
        </Link>
      </td>
      <td>{user.email ? user.email : "N/A"}</td>
      <td>{user.phoneNumber ? user.phoneNumber : "N/A"}</td>
      <td>
        <div className="flex gap-2">
          {userRolesString ? userRolesString : "N/A"}
        </div>
      </td>
      <td className="text-left text-nowrap">
        {user.dateOfBirth ? user.dateOfBirth : "N/A"}
      </td>
      <td className="text-right text-nowrap">
        {createdAtResult ? createdAtResult : "N/A"}
      </td>
      {isActionButton ? (
        <td>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleEdit}
              className="button-squar text-white bg-primary hover:bg-primary-hover ring-transparent"
            >
              <FaEdit />
            </button>
            <button
              onClick={handleView}
              className="button-squar text-white bg-secondary hover:bg-secondary-hover"
            >
              <FaEye />
            </button>
          </div>
        </td>
      ) : null}
    </tr>
  );
}

export default UserRow;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../../redux/feature/users/userApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "flowbite-react";
import {
  getContrastingTextColor,
  stringToColor,
} from "../../redux/feature/utils/colorUtils";
import { FaEdit, FaEye } from "react-icons/fa";
import AvartarCustom from "./components/AvartarCustom";
import { STATUS } from "../../config/status";

function UserRow({ userId, uuid, status, isActionButton }) {
  const navigate = useNavigate();
  const user = useSelector((state) => selectUserById(state, userId));
  const [updatedUser, setUpdatedUser] = useState("");

  useEffect(() => {
    if (user && user.uuid == uuid) {
      setUpdatedUser({ ...user, status: status });
    }
  }, [user, uuid, status]);

  if (user) {
    var handleEdit = () => navigate(`/dash/users/${userId}`);
    var handleView = () => navigate(`/dash/users/${userId}/view`);

    var fullName = user.fullName;
    var firstLetterOfFullName = fullName.substring(0, 1);

    var userRolesString = user.roleNames.map((role, index) => (
      <Badge key={index} color="success">
        {role}
      </Badge>
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
            <img
              src={user.profileImage}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <AvartarCustom
              placeholderInitials={firstLetterOfFullName}
              bgColor={avatarColor}
              textColor={textColor}
            />
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
      <td>
        {updatedUser ? (
          <div className="flex justify-end items-center gap-2">
            <span
              className={
                updatedUser.status === STATUS.ONLINE
                  ? "w-2 h-2 bg-green-600 rounded-full"
                  : "w-2 h-2 bg-red-600 rounded-full"
              }
            ></span>
            <span
              className={
                updatedUser.status === STATUS.ONLINE
                  ? "text-green-600 pt-1"
                  : "text-red-600 pt-1"
              }
            >
              {updatedUser.status}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <div
              className={
                user.status === STATUS.ONLINE
                  ? "w-2 h-2 bg-green-600 rounded-full"
                  : "w-2 h-2 bg-red-600 rounded-full"
              }
            ></div>
            <div
              className={
                user.status === STATUS.ONLINE
                  ? "text-green-600 pt-1"
                  : "text-red-600 pt-1"
              }
            >
              {user.status}
            </div>
          </div>
        )}
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

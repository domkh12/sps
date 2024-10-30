import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../../redux/feature/users/userApiSlice";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Checkbox,
  TableCell,
  TableRow,
  Tooltip,
} from "flowbite-react";
import {
  getContrastingTextColor,
  stringToColor,
} from "../../redux/feature/utils/colorUtils";
import { FaEdit, FaEye } from "react-icons/fa";
import AvartarCustom from "./components/AvartarCustom";
import { STATUS } from "../../config/status";

function UserRow({ userId, uuid, status }) {
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
    <TableRow>
      <TableCell className="p-4">
        <Checkbox />
      </TableCell>
      <TableCell className="flex justify-start items-center gap-2 underline underline-offset-2 cursor-pointer text-nowrap text-blue-600">
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

        {user.fullName ? user.fullName : "N/A"}
      </TableCell>
      <TableCell>{user.email ? user.email : "N/A"}</TableCell>
      <TableCell>{user.phoneNumber ? user.phoneNumber : "N/A"}</TableCell>
      <TableCell className="">
        <div className="flex gap-2">
          {userRolesString ? userRolesString : "N/A"}
        </div>
      </TableCell>
      <TableCell>{createdAtResult ? createdAtResult : "N/A"}</TableCell>
      <TableCell>
        {updatedUser ? (
          <Badge
          className="flex justify-center "
          color={updatedUser.status === STATUS.ONLINE ? "success" : "failure"}
        >
          {" "}
          <div className="flex justify-start items-center gap-2">
            <span className={updatedUser.status === STATUS.ONLINE ? "w-2 h-2 bg-green-600 rounded-full flex" : "w-2 h-2 bg-red-600 rounded-full flex"}></span>
            <span>{updatedUser.status}</span>
          </div>
        </Badge>
        ) : (
          <Badge
            className="flex justify-center "
            color={user.status === STATUS.ONLINE ? "success" : "failure"}
          >
            {" "}
            <div className="flex justify-start items-center gap-2">
              <span className={user.status === STATUS.ONLINE ? "w-2 h-2 bg-green-600 rounded-full flex" : "w-2 h-2 bg-red-600 rounded-full flex"}></span>
              <span>{user.status}</span>
            </div>
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Tooltip content="Edit" trigger="hover">
            <Button
              onClick={handleEdit}
              className="bg-primary hover:bg-primary-hover ring-transparent"
            >
              <FaEdit />
            </Button>
          </Tooltip>
          <Tooltip content="View" trigger="hover">
            <Button
              onClick={handleView}
              className="bg-secondary hover:bg-secondary-hover ring-transparent"
            >
              <FaEye />
            </Button>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default UserRow;

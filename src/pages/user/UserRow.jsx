import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../../redux/feature/users/userApiSlice";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Checkbox,
  TableCell,
  TableRow,
  ToggleSwitch,
  Tooltip,
} from "flowbite-react";
import {
  getContrastingTextColor,
  stringToColor,
} from "../../redux/feature/utils/colorUtils";
import { FaEdit, FaEye } from "react-icons/fa";
import AvartarCustom from "./components/AvartarCustom";

function UserRow({ userId }) {
  const navigate = useNavigate();

  const user = useSelector((state) => selectUserById(state, userId));
  const [toggleDisabled, setToggleDisabled] = useState(false);

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
        <ToggleSwitch
          checked={toggleDisabled}
          onChange={() => setToggleDisabled(!toggleDisabled)}
          color="green"
          theme={{
            toggle: {
              base: "relative rounded-full border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-0 group-focus:ring-cyan-500/25",
            },
          }}
        />
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
            <Button onClick={handleView} className="bg-secondary hover:bg-secondary-hover ring-transparent">
              <FaEye />
            </Button>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default UserRow;

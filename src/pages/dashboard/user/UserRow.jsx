import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../../../redux/feature/users/userApiSlice";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Checkbox, TableCell, TableRow } from "flowbite-react";
import AvartarCustom from "../../../components/util/AvartarCustom";
import {
  getContrastingTextColor,
  stringToColor,
} from "../../../redux/feature/utils/colorUtils";

function UserRow({ userId }) {
  const user = useSelector((state) => selectUserById(state, userId));

  const navigate = useNavigate();

  if (user) {
    const handleEdit = () => navigate(`/admin/users/${userId}`);

    var fullName = user.fullName;
    var firstLetterOfFullName = fullName.substring(0, 1);

    var userRolesString = user.roleNames.map((role, index) => (
      <Badge key={index} color="success">
        {role}
      </Badge>
    ));

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
      <TableCell className="flex justify-start items-center gap-2">
        <AvartarCustom
          placeholderInitials={firstLetterOfFullName}
          bgColor={avatarColor}
          textColor={textColor}
        />
        {user.fullName ? user.fullName : "N/A"}
      </TableCell>
      <TableCell>{user.email ? user.email : "N/A"}</TableCell>
      <TableCell>{user.phoneNumber ? user.phoneNumber : "N/A"}</TableCell>
      <TableCell className="flex justify-start items-center gap-2">
        {userRolesString ? userRolesString : "N/A"}
      </TableCell>
      <TableCell>{user.createdAt ? user.createdAt : "N/A"}</TableCell>
    </TableRow>
  );
}

export default UserRow;

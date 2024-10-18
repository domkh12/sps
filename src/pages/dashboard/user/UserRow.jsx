import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  selectUserById,
  useDeleteUserMutation,
} from "../../../redux/feature/users/userApiSlice";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Label,
  Popover,
  TableCell,
  TableRow,
  TextInput,
  Tooltip,
} from "flowbite-react";
import AvartarCustom from "../../../components/util/AvartarCustom";
import {
  getContrastingTextColor,
  stringToColor,
} from "../../../redux/feature/utils/colorUtils";
import { FaEdit } from "react-icons/fa";
import { BsTrash3Fill } from "react-icons/bs";
import DeleteConfirmComponent from "../../../components/DeleteConfirmComponent";
import { toast } from "react-toastify";

function UserRow({ userId }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => selectUserById(state, userId));

  const [deleteUser, { isLoading, isSuccess, isError, error }] =
    useDeleteUserMutation();

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      toast.success("Delete Successful", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark",
      });
    }
  }, [isSuccess]);

  if (user) {
    var handleEdit = () => navigate(`/dash/users/${userId}`);

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

  const handleBtnDeleteClicked = () => {
    setOpen(!open);
  };

  const handleConfirmDelete = async () => {
    await deleteUser({ id: userId });
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

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
      <TableCell>{createdAtResult ? createdAtResult : "N/A"}</TableCell>
      <TableCell className="flex gap-2">
        <Tooltip content="Edit" trigger="hover">
          <Button onClick={handleEdit} className="bg-primary hover:bg-primary-hover ring-transparent">
            <FaEdit />
          </Button>
        </Tooltip>
        <Tooltip content="Delete" trigger="hover">
          <Button className="bg-red-600" onClick={handleBtnDeleteClicked}>
            <BsTrash3Fill />
          </Button>
        </Tooltip>
        <DeleteConfirmComponent
          isOpen={open}
          onClose={handleCloseModal}
          handleConfirmDelete={handleConfirmDelete}
        />
      </TableCell>
    </TableRow>
  );
}

export default UserRow;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { selectUserById } from "../redux/feature/users/userApiSlice";
import {
  getContrastingTextColor,
  stringToColor,
} from "../redux/feature/utils/colorUtils";
import EditButtonComponent from "./EditButtonComponent";
import MoreActionComponent from "./MoreActionComponent";
import { FaPen, FaTrashCan } from "react-icons/fa6";

function UserRowComponent({ userId, uuid, status, isActionButton }) {
  const navigate = useNavigate();
  const user = useSelector((state) => selectUserById(state, userId));
  const [updatedUser, setUpdatedUser] = useState("");
  const userActive = useSelector((state) => state.users.userActive);

  const handleDelete = () => {
    console.log("Download action triggered");
  };

  useEffect(() => {
    if (user && user.uuid === uuid) {
      setUpdatedUser({ ...user, status: status });
    } else if (user && userActive.uuid === user.uuid) {
      setUpdatedUser({ ...user, status: userActive.status });
    }
  }, [user, uuid, status, userActive]);

  if (user) {
    var handleEdit = () => navigate(`/dash/users/${userId}`);
    // var handleView = () => navigate(`/dash/users/${userId}/view`);

    var menuActions = [
      {
        label: "Edit",
        icon: <FaPen className="w-5 h-5" />,
        onClick: handleEdit,
      },
      {
        label: "Delete",
        icon: <FaTrashCan className="w-5 h-5" />,
        onClick: handleDelete,
        textColor: "red",
        buttonColor: "red",
      },
    ];

    var fullName = user.fullName;

    const dateObj = new Date(user.createdAt);
    var formattedDate = dateObj.toLocaleDateString("en-GB");
    var formattedTime = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use 24-hour format
    });

    var roles = user.roles.map((role) => <p key={role.id}>{role.name}</p>);

    var avatarColor = stringToColor(userId);
  } else {
    return null;
  }

  return (
    <TableRow hover>
      <TableCell padding="checkbox" sx={{ borderBottomStyle: "dashed" }}>
        <Checkbox color="primary" />
      </TableCell>
      <TableCell sx={{ borderBottomStyle: "dashed" }}>
        <List sx={{ padding: "0" }}>
          <ListItem alignItems="flex-start" sx={{ padding: "0", gap: "10px" }}>
            <ListItemAvatar>
              <Avatar
                alt={user.fullName}
                sx={{ width: 46, height: 46 }}
                src={user.profileImage}
              />
            </ListItemAvatar>
            <ListItemText
              primary={user.fullName || "N/A"}
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: "gray", display: "inline" }}
                >
                  {user.email || "N/A"}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </TableCell>
      <TableCell sx={{ borderBottomStyle: "dashed" }}>
        {user.phoneNumber}
      </TableCell>
      <TableCell sx={{ borderBottomStyle: "dashed" }}>
        <div className="flex gap-5 items-center">{roles}</div>
      </TableCell>
      <TableCell sx={{ borderBottomStyle: "dashed" }}>
        <Chip
          sx={{
            backgroundColor: "#D2E3D6",
            borderRadius: "6px",
            color: "#207234",
            fontWeight: "500",
          }}
          size="small"
          label={user.status}
        />
      </TableCell>
      <TableCell sx={{ borderBottomStyle: "dashed" }}>
        <Typography variant="body1">{formattedDate}</Typography>
        <Typography variant="body2" color="gray">
          {formattedTime}
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          borderBottomStyle: "dashed",
          px: 0,
        }}
      >
        <div className="flex justify-center items-center">
          <EditButtonComponent />
          <MoreActionComponent menuItems={menuActions} />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default UserRowComponent;

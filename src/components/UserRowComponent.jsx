import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Checkbox,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
  styled,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import EditButtonComponent from "./EditButtonComponent";
import MoreActionComponent from "./MoreActionComponent";
import { FaEye, FaPen, FaTrashCan } from "react-icons/fa6";
import {
  setIdUserToDelete,
  setIsOpenQuickEdit,
  setUserForQuickEdit,
} from "../redux/feature/users/userSlice";
import { useGetUsersQuery } from "../redux/feature/users/userApiSlice";
import { setIsOpenConfirmDelete } from "../redux/feature/actions/actionSlice";
import useAuth from "../hook/useAuth";
import useDateFormatter from "../hook/useDateFormatter";
import useTranslate from "../hook/useTranslate.jsx";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return {
      sx: {
        bgcolor: "#9E9E9E",
      },
      children: "?",
    };
  }
  const parts = name.trim().split(" ");
  let initials = "";

  if (parts.length >= 2) {
    initials = `${parts[0][0]}${parts[1][0]}`;
  } else if (parts.length === 1) {
    initials = parts[0].slice(0, 2);
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}

function UserRowComponent({ userId, user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();
  const {t} = useTranslate();

  const quickEditUserResponse = useSelector(
    (state) => state.users?.quickEditUserReponse
  );

  const userActive = useSelector((state) => state.users.isOnlineUser);

  const [loadedUser, setLoadedUser] = useState(user || {});

  useEffect(() => {
    if (quickEditUserResponse.data?.uuid === loadedUser.uuid) {
      setLoadedUser(quickEditUserResponse.data);
    }
  }, [quickEditUserResponse]);

  useEffect(() => {
    if (userActive?.uuid === user?.uuid) {
      setLoadedUser({ ...user, isOnline: userActive.isOnline });
    }
  }, [userActive]);

  const handleDelete = () => {
    dispatch(setIsOpenConfirmDelete(true));
    dispatch(setIdUserToDelete(user.uuid));
  };

  const handleQuickEdit = () => {
    dispatch(setIsOpenQuickEdit(true));
    dispatch(setUserForQuickEdit(loadedUser));
  };

  const StyledBadge = styled(Badge)(({ theme, isonline }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isonline === "true" ? "#44b700" : "#9E9E9E",
      color: isonline === "true" ? "#44b700" : "#9E9E9E",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation:
          isonline === "true" ? "ripple 1.2s infinite ease-in-out" : "none",
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

  if (user) {
    var handleEdit = () => navigate(`/${isAdmin ? "admin" : "dash"}/users/${userId}`);
    var handleView = () => navigate(`/${isAdmin ? "admin" : "dash"}/users/${userId}/view`);

    var menuActions = [
      {
        label: t('edit'),
        icon: <FaPen className="w-5 h-5" />,
        onClick: handleEdit,
      },
      {
        label: t('view'),
        icon: <FaEye className="w-5 h-5" />,
        onClick: handleView,
      },
      {
        label: t('delete'),
        icon: <FaTrashCan className="w-5 h-5" />,
        onClick: handleDelete,
        textColor: "red",
        buttonColor: "red",
      },
    ];

    var roles = loadedUser.roles.map((role) => (
      <p key={role.uuid}>{role.name}</p>
    ));

    const getChipStyles = () => {
      let backgroundColor = "#D2E3D6";
      let color = "#207234";

      if (loadedUser.status === "Banned") {
        backgroundColor = "#FFD6D6";
        color = "#981212";
      } else if (loadedUser.status === "Pending") {
        backgroundColor = "#FFF5D6";
        color = "#B68D0F";
      } else if (loadedUser.status === "Active") {
        backgroundColor = "#D2E3D6";
        color = "#207234";
      }

      return {
        backgroundColor,
        color,
        borderRadius: "6px",
        fontWeight: "500",
      };
    };

    return (
      <>
        <TableRow hover>
          <TableCell
            padding="checkbox"
            sx={{ borderTopStyle: "dashed", borderBottomStyle: "dashed" }}
          >
            <Checkbox color="primary" />
          </TableCell>
          <TableCell
            sx={{ borderTopStyle: "dashed", borderBottomStyle: "dashed" }}
          >
            <List sx={{ padding: "0" }}>
              <ListItem sx={{ padding: "0", gap: "10px" }}>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  isonline={String(loadedUser?.isOnline)}
                >
                  <Avatar
                    alt={loadedUser.fullName}
                    src={loadedUser.profileImage}
                    {...stringAvatar(loadedUser.fullName)}
                  />
                </StyledBadge>
                <ListItemText
                  primary={
                    (
                      <Link className="hover:underline" to={`/${isAdmin ? "admin" : "dash"}/users/${userId}/view`}>
                        {loadedUser.fullName}
                      </Link>
                    ) || "N/A"
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: "gray", display: "inline" }}
                    >
                      {loadedUser.email || "N/A"}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </TableCell>
          <TableCell
            sx={{ borderTopStyle: "dashed", borderBottomStyle: "dashed" }}
          >
            {loadedUser.phoneNumber}
          </TableCell>
          <TableCell
            sx={{ borderTopStyle: "dashed", borderBottomStyle: "dashed" }}
          >
            <div className="flex gap-5 items-center">{roles}</div>
          </TableCell>
          <TableCell sx={{ borderTopStyle: "dashed", borderBottomStyle: "dashed" }}>
            <Stack direction="column" spacing={1}>
              {loadedUser?.sites?.length > 0 ? (
                loadedUser?.sites?.map((site) => (
                  <div key={site?.uuid}>
                    <Chip
                      avatar={
                        <Avatar
                          alt="Branch_Img"
                          src={site?.image || ""}
                          {...stringAvatar(site?.siteName || "N/A")}/>
                      }
                        className="w-fit"
                        label={site?.siteName || "N/A"}
                        variant="outlined"
                        />
                  </div>
                ))):(
                    <Typography variant="body2" color="gray">N/A</Typography>
                )}
              </Stack>
          </TableCell>

          <TableCell
            sx={{ borderTopStyle: "dashed", borderBottomStyle: "dashed" }}
          >
            <Chip sx={getChipStyles()} size="small" label={loadedUser.status} />
          </TableCell>
          <TableCell sx={{borderBottomStyle: "dashed"}}>
            <Typography variant="body1">
              {loadedUser.createdAt.substring(
                  0,
                  loadedUser.createdAt.lastIndexOf(" ")
              )}
            </Typography>
            <Typography variant="body2" color="gray">
              {loadedUser.createdAt.substring(
                  loadedUser.createdAt.lastIndexOf(" "),
                  loadedUser.createdAt.length
              )}
            </Typography>
          </TableCell>
          <TableCell
            sx={{
              borderTopStyle: "dashed",
              borderBottomStyle: "dashed",
              px: 0,
            }}
          >
            <div className="flex justify-center items-center">
              <EditButtonComponent
                handleQuickEdit={handleQuickEdit}
                user={loadedUser}
              />
              <MoreActionComponent menuItems={menuActions} />
            </div>
          </TableCell>
        </TableRow>
      </>
    );
  } else {
    return null;
  }
}
const memoizedUsersRow = memo(UserRowComponent);
export default memoizedUsersRow;

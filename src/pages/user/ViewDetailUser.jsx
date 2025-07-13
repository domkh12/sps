import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import {
  Typography,
  Box,
  Paper,
  Avatar,
  Stack,
  Badge,
  Grid,
  Card, Grid2, List, ListItem, ListItemText, Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditButtonComponent from "../../components/EditButtonComponent";
import {
  setIsOpenQuickEdit,
  setUserForQuickEdit,
} from "../../redux/feature/users/userSlice";
import QuickEditUserComponent from "../../components/QuickEditUserComponent";
import useTranslate from "../../hook/useTranslate.jsx";
import useAuth from "../../hook/useAuth.jsx";
import {cardStyle} from "../../assets/style.js";

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


function ViewDetailUser({ user }) {
  const userActive = useSelector((state) => state.users.isOnlineUser);
  const navigate = useNavigate();
  const { t } = useTranslate();
  const {isAdmin, isManager} = useAuth();

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

  const breadcrumbs = [
    <button
        className="text-black hover:underline"
        onClick={() => navigate(`${isAdmin ? "/admin" : "/dash"}`)}
        key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("user")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {user?.fullName}
    </Typography>,
  ];
  const getChipStyles = () => {
    let backgroundColor = "#D2E3D6";
    let color = "#207234";

    if (user.status === "Banned") {
      backgroundColor = "#FFD6D6";
      color = "#981212";
    } else if (user.status === "Pending") {
      backgroundColor = "#FFF5D6";
      color = "#B68D0F";
    } else if (user.status === "Active") {
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
      <div>
        <MainHeaderComponent
            breadcrumbs={breadcrumbs}
            title={user?.fullName}
            handleBackClick={() => navigate(`/${isAdmin ? "admin" : "dash"}/users`)}
        />
        <Grid2 container spacing={2}>

            <Card sx={{ ...cardStyle, p: "16px", width: "100%" }}>
              <div className="flex justify-between items-center mb-5">
                <Typography variant="h6">User info</Typography>
              </div>
              <div className="flex justify-between">
                <List sx={{ padding: "0" }}>
                  <ListItem sx={{ padding: "0", gap: "10px" }}>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        variant="dot"
                        isonline={String(user?.isOnline)}
                    >
                      <Avatar
                          alt={user?.fullName}
                          src={user?.profileImage}
                          {...stringAvatar(user?.fullName)}
                      />
                    </StyledBadge>
                    <ListItemText
                        primary={<>{user?.fullName}</> || "N/A"}
                        secondary={
                          <Typography
                              component="span"
                              variant="body2"
                              sx={{ color: "gray", display: "inline" }}
                          >
                            {user?.email || "N/A"}
                          </Typography>
                        }
                    />
                  </ListItem>
                </List>

                <Chip
                    sx={getChipStyles()}
                    size="small"
                    label={user?.status}
                />
              </div>

              <div className="flex flex-col gap-3 mt-5">
                <Typography variant="body1">
                  <span className="text-gray-cus">{t('gender')}</span>
                  {`${"\u00a0"}:${"\u00a0"}${user?.gender?.gender || "N/A"}`}
                </Typography>
                <Typography variant="body1">
                  <span className="text-gray-cus">{t('dateOfBirth')}</span>
                  {`${"\u00a0"}:${"\u00a0"}${user?.dateOfBirth || "N/A"}`}
                </Typography>
                <Typography variant="body1">
                  <span className="text-gray-cus">{t('phoneNumber')}</span>
                  {`${"\u00a0"}:${"\u00a0"}${user?.phoneNumber || "N/A"}`}
                </Typography>
                <Typography variant="body1">
                  <span className="text-gray-cus">{t('role')}</span>
                  {`${"\u00a0"}:${"\u00a0"}${user?.roles?.length ? user?.roles?.map((role) => role?.name) : "N/A"}`}
                </Typography>
                <Typography variant="body1">
                  <span className="text-gray-cus">{t('branch')}</span>
                  {`${"\u00a0"}:${"\u00a0"}${user?.sites?.length > 0 ? user?.sites?.map((site) => site?.siteName) : "N/A"}`}
                </Typography>
              </div>
            </Card>
          </Grid2>
      </div>
  );
}

export default ViewDetailUser;

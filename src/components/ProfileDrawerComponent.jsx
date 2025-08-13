import {
  Avatar,
  Box,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import {useGetUserProfileQuery, useSendLogoutMutation} from "../redux/feature/auth/authApiSlice";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import useAuth from "../hook/useAuth";
import { FaUserTie } from "react-icons/fa";
import { listItemButtonStyle } from "../assets/style";
import { useConnectedUserMutation } from "../redux/feature/users/userApiSlice";
import PortraitTwoToneIcon from "@mui/icons-material/PortraitTwoTone";
import useTranslate from "../hook/useTranslate";
import useLocalStorage from "../hook/useLocalStorage.jsx";

function ProfileDrawerComponent({ open: initialOpen, onClose }) {
  const { username, status } = useAuth();
  const {data: user} = useGetUserProfileQuery("profileUser");
  const [open, setOpen] = useState(initialOpen);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [sendLogout, { isLoading, isSucess, isError, error }] =
    useSendLogoutMutation();

  const [authData, setAuthData] = useLocalStorage('authData', {
     isRemember: false,
     userRoles: "",
     uuid: null,
     siteUuid: null
 });

  const handleDrawerClose = () => {
    onClose();
  };

  const [
    connectedUser,
    { isSuccess: isSuccessConnectUser, isLoading: isLoadingConnectUser },
  ] = useConnectedUserMutation();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSendLogout = async () => {
    try {
        setAuthData({
            isRemember: false,
            userRoles: "",
            uuid: null,
            siteUuid: null
        });
      await connectedUser({ uuid: user?.uuid, isOnline: false });
      await sendLogout().unwrap();
      navigate("/login");
      localStorage.removeItem("isRemember");
      onClose();
    } catch (err) {
      console.error("Logout failed:", err);
      onClose();
    }
  };

  useEffect(() => {
    setOpen(initialOpen);
  }, [initialOpen]);

  return (
    <div>
      <Drawer open={open} onClose={handleDrawerClose} anchor={"right"}>
        <Box
          sx={{ width: 320 }}
          role="presentation"
          onClick={toggleDrawer(true)}
        >
          <div className="overflow-auto pb-[20px]">
            <Box sx={{ mt: "10px", paddingX: "10px" }}>
              <IconButton onClick={handleDrawerClose}>
                <IoClose />
              </IconButton>
            </Box>

            <List
              component="div"
              aria-labelledby="nested-list-subheader"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                paddingBottom: "30px",
                gap: "30px",
              }}
              className="border-b border-dashed"
            >
              <div className="relative p-[3px] flex justify-center items-center  w-fit ">
                <div className="w-full h-full bg-gradient-to-r from-primary to-secondary animate-spin-slow absolute rounded-full "></div>
                <IconButton
                  sx={{
                    p: 0,
                    cursor: "auto",
                  }}
                  className="flex justify-center items-center"
                  disableRipple
                >
                  <Avatar
                    alt="Profile"
                    src={user?.profileImage}
                    sx={{ width: 100, height: 100 }}
                  />
                </IconButton>
              </div>
              <Box className="flex flex-col justify-center items-center">
                <Typography>{user?.fullName}</Typography>
                <Chip icon={<FaUserTie className="w-5 h-5" />} label={status} />
                <Typography variant="body1" color="gray">
                  {username}
                </Typography>
              </Box>
            </List>

            <List
              component="div"
              aria-labelledby="nested-list-subheader"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                paddingBottom: "30px",
                gap: "30px",
                mt: "20px",
                paddingX: "20px",
              }}
              className="border-b border-dashed"
            >
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("accounts");
                    handleDrawerClose();
                  }}
                  sx={{ borderRadius: "6px", ...listItemButtonStyle }}
                >
                  <ListItemIcon sx={{ mr: "10px", minWidth: 0 }}>
                    <PortraitTwoToneIcon />
                  </ListItemIcon>
                  <ListItemText primary={t("account")} />
                </ListItemButton>
              </ListItem>
            </List>

            <List
              component="div"
              aria-labelledby="nested-list-subheader"
              sx={{ paddingX: "20px" }}
            >
              <LoadingButton
                variant="contained"
                loading={isLoading}
                sx={{
                  backgroundColor: "#E9B6B3",
                  color: "#B60A00",
                  width: "100%",
                  height: "50px",
                  borderRadius: "6px",
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
                onClick={handleSendLogout}
              >
                {t("logout")}
              </LoadingButton>
            </List>
          </div>
        </Box>
      </Drawer>
    </div>
  );
}

export default ProfileDrawerComponent;

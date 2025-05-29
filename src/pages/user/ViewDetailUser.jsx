import React from "react";
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
  Card,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditButtonComponent from "../../components/EditButtonComponent";
import {
  setIsOpenQuickEdit,
  setUserForQuickEdit,
} from "../../redux/feature/users/userSlice";
import QuickEditUserComponent from "../../components/QuickEditUserComponent";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": { transform: "scale(.8)", opacity: 1 },
    "100%": { transform: "scale(2.4)", opacity: 0 },
  },
}));

function ViewDetailUser({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isOpenQuickEditUser = useSelector(
    (state) => state.users.isOpenQuickEdit
  );

  const breadcrumbs = [
    <button
      key="dashboard"
      className="text-black hover:underline"
      onClick={() => navigate("/dash")}
    >
      Dashboard
    </button>,
    <Typography key="user">User</Typography>,
    <Typography key="user-fullName">{user?.fullName || "N/A"}</Typography>,
  ];

  return (
    <div>
      <Box sx={{ padding: 3 }}>
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={user?.fullName || "User Details"}
          handleBackClick={() => navigate("/dash")}
        />
        {/* <Grid container spacing={2}> */}
          {/* Profile Section */}
          <Grid item xs={12} md={4}>
            <Item>
              <Card sx={{ padding: 2 }}>
                <Stack direction="row" spacing={2}>
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                   <Avatar
                      alt={user?.fullName}
                      src={
                        user?.avatarUrl ||"https://www.anthropics.com/portraitpro/img/page-images/homepage/v24/out-now.jpg"
                      }
                      sx={{ width: 100, height: 100 }}
                    />
                    </StyledBadge>
                      <div >
                        <Typography variant="h6" sx={{ marginTop: 2, fontWeight: "bold" }}>{user?.fullName || "N/A"} </Typography>
                        <Typography className=" flex float: left;"> {user?.email|| "N/A"} </Typography>
                      </div>
                </Stack>
              </Card>
            </Item>
          </Grid>

          {/* User Details Section */}
          <Grid item xs={12} md={8}>
            <Item>
              <EditButtonComponent
                handleQuickEdit={() => {
                  dispatch(setIsOpenQuickEdit(true));
                  dispatch(setUserForQuickEdit(user));
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="body1">
                  <strong>Full Name:</strong> {user?.fullName || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Gender:</strong> {user?.gender?.gender || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Date of Birth:</strong> {user?.dateOfBirth || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {user?.email || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone Number:</strong> {user?.phoneNumber || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Address:</strong> {user?.address || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Branch:</strong>{" "}
                  {user?.sites?.map((site) => site.siteName).join(", ") || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Roles:</strong>{" "}
                  {user?.roles?.map((role) => role.name).join(", ") || "N/A"}
                </Typography>
              </Box>
            </Item>
          </Grid>
        {/* </Grid> */}
      </Box>
      {isOpenQuickEditUser && <QuickEditUserComponent />}
    </div>
  );
}

export default ViewDetailUser;

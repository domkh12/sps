import {
  Box,
  Button,
  Chip,
  Grid2,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  PiCalendarDotsThin,
  PiCameraThin,
  PiCheckThin,
  PiEnvelopeSimpleThin,
  PiPencilSimpleThin,
  PiPhoneCallThin,
  PiUserThin,
} from "react-icons/pi";
import { useSelector } from "react-redux";
import { useUpdateUserMutation } from "../../redux/feature/users/userApiSlice";
import { toast } from "react-toastify";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import { Outlet, useNavigate } from "react-router-dom";

export default function Profile() {
  const navigator = useNavigate();
  const bannerInputRef = useRef(null);
  const profileInputRef = useRef(null);
  const user = useSelector((state) => state.users.user);
  const isLoading = useSelector((state) => state.users.isLoadingUser);
  const [activeTab, setActiveTab] = useState("details");
  const [value, setValue] = useState(0);

  const [uploadImage, { isLoading: isLoadingUploadImage }] =
    useUploadImageMutation();

  const [
    updateUser,
    { isSuccess: isUpdateSuccess, isLoading: isUpdateLoading },
  ] = useUpdateUserMutation();

  const handleBtnBannerClick = () => {
    bannerInputRef.current.click();
  };

  const handleBtnProfileClick = () => {
    profileInputRef.current.click();
  };  

  const validateImage = (file) => {
    const validExtensions = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

    if (!validExtensions.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
      return false;
    }

    if (file.size > maxSizeInBytes) {
      toast.error('File size exceeds 2 MB.');
      return false;
    }

    return true;
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (file && validateImage(file)) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadImage(formData);
      await updateUser({
        id: user.uuid,
        profileImage: response.data.uri,
      });
    }
  };

  useEffect(() => {
    navigator(activeTab);
  }, [activeTab]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const tabMapping = ["details"];
    setActiveTab(tabMapping[newValue]);
  };

  const handleBannerImageChange = async (event) => {
    const file = event.target.files[0];
    if (file && validateImage(file)) {
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadImage(formData);
      await updateUser({
        id: user.uuid,
        bannerImage: response.data.uri,
      });
    }
  };

  let content;

  if (isLoading || !user) {
    content = <p>Loading...</p>;
  }

  content = (
    <Box>
      <div className="relative">
        <div className="relative w-full group bg-black h-56 rounded-b-3xl flex justify-center items-center overflow-hidden">
          <img
            src={user.bannerImage || "/images/bannerPlaceHolder.svg"}
            alt="banner"
            className="w-auto h-auto object-cover"
          />
          <Button
            variant="contained"
            disableRipple
            onClick={handleBtnBannerClick}
            sx={{
              px: "1.5rem",
              display: "none",
              textTransform: "none",
              position: "absolute",
              bottom: "1rem",
              right: "1rem",
              zIndex: 1,
              borderRadius: "24px",
              backgroundColor: "gray",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
            className="group-hover:flex"
            startIcon={<PiCameraThin className="w-7 h-7" />}
          >
            Edit
          </Button>
          <input
            type="file"
            ref={bannerInputRef}
            style={{ display: "none" }}
            onChange={handleBannerImageChange}
          />
        </div>
        <div className="absolute group overflow-hidden flex justify-center items-center -bottom-14 left-10 h-40 w-40 rounded-full bg-black outline outline-gray-50">
          <img
            src={user.profileImage || "/images/profile_placeholder.svg"}
            alt="profile"
            className="object-cover"
          />

          <IconButton
            variant="contained"
            disableRipple
            onClick={handleBtnProfileClick}
            sx={{
              width: "100%",
              height: "100%",
              display: "none",
              textTransform: "none",
              position: "absolute",
              top: "0",
              left: "0",
              zIndex: 1,
              borderRadius: "24px",
              backgroundColor: "rgba(128, 128, 128, 0.5)",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
            className="group-hover:flex"
          >
            <PiCameraThin className="w-7 h-7 text-gray-50" />
          </IconButton>
          <input
            type="file"
            ref={profileInputRef}
            style={{ display: "none" }}
            onChange={handleProfileImageChange}
          />
        </div>
      </div>

      <Box sx={{ mt: 10, ml: 5 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            display: "flex",
            justifyContent: "space-start",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {user.fullName || "Unknown"}
          <Chip
            color="success"
            sx={{
              px: 1,
            }}
            label={
              user.roleNames &&
              user.roleNames.some((role) => role.toLowerCase() === "admin")
                ? "ADMIN"
                : "Unknown"
            }
            variant="outlined"
          />
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#6b7280",
          }}
        >
          <PiEnvelopeSimpleThin className="h-7 w-7" />
          {user.email || "Unknown"}
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", paddingX: "2.5rem" }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="tabs"
            TabIndicatorProps={{
              sx: {
                display: "flex",
                justifyContent: "center",
                width: "100%",
                backgroundColor: "#111827",
                padding: "0px",
              },
            }}
          >
            <Tab
              label="Details"
              sx={{
                textTransform: "none",
                color: "#4b5563",
                "&.Mui-selected": {
                  color: "#111827",
                },
                padding: "0px",
                minWidth: 0,
                marginRight: "2rem",
              }}
              disableRipple
            />
          </Tabs>
        </Box>
      </Box>

      <Box sx={{ mt: 8, ml: 5 }}>
        <Outlet />
      </Box>
    </Box>
  );

  return content;
}

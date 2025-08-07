import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toggleDrawerDetail } from "../redux/feature/mapView/mapViewSlice";
import { drawerStyle } from "./../assets/style";
import { IoIosClose } from "react-icons/io";
import { Link } from "react-router-dom";
import useFormatDate from "../hook/useFormatDate";

function ParkingDetailDrawerComponent() {
  const dispatch = useDispatch();
  const openDrawer = useSelector((state) => state.mapView.isOpenDrawerDetail);
  const parkingDetailData = useSelector(
    (state) => state.parkingDetail.parkingLotDetail
  );
  const formatDate = useFormatDate();
  const [duration, setDuration] = useState("N/A");
  console.log("parkingDetailData", parkingDetailData);
  // Function to calculate the duration with seconds
  const calculateDuration = (timeIn) => {
    if (!timeIn) return "N/A";

    const now = new Date();
    const timeInDate = new Date(timeIn);
    const diffInSeconds = Math.floor((now - timeInDate) / 1000);

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const seconds = diffInSeconds % 60;

    return `${hours} h ${minutes} mn ${seconds} sec`;
  };

  // Update duration every second
  useEffect(() => {
    if (!parkingDetailData?.timeIn) return;

    const interval = setInterval(() => {
      setDuration(calculateDuration(parkingDetailData.timeIn));
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [parkingDetailData?.timeIn]);

  const drawerList = (
    <Box sx={{ width: 360, px: 2, pt: 1, pb: 10 }} role="presentation">
      <div className="flex justify-between items-center">
        <Typography variant="body1">
          {parkingDetailData?.parkingLot?.lotName}
        </Typography>
        <IconButton
          size="small"
          onClick={() => dispatch(toggleDrawerDetail(false))}
        >
          <IoIosClose className="w-7 h-7" />
        </IconButton>
      </div>
      <div className="flex justify-between items-center bg-white border-[3px] border-blue-500 rounded-xl px-5 py-3 mt-10">
        <div className="flex flex-col gap-2">
          <Typography
            variant="body1"
            sx={{
              fontSize: "20px",
              color: "#3f83f8",
            }}
          >
            {parkingDetailData?.vehicle?.licensePlateProvince?.provinceNameKh}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "16px",
              color: "#f05252",
            }}
          >
            {parkingDetailData?.vehicle?.licensePlateProvince?.provinceNameEn}
          </Typography>
        </div>
        <Typography
          variant="body1"
          sx={{
            fontSize: "24px",
            textDecoration: "underline",
            color: "#3f83f8",
          }}
        >
          {parkingDetailData?.vehicle?.numberPlate}
        </Typography>
      </div>

      {/* Vehicle Details */}
      <section className="mt-10 border border-black rounded-lg px-5 py-3 relative">
        <div className="absolute -top-3 left-7 bg-black text-white px-4 py-1 rounded-xl">
          Vehicle
        </div>

        <List sx={{ padding: "0", mt: 3 }}>
          <ListItem sx={{ padding: "0", gap: "10px" }}>
            <div className="w-32 h-20 rounded-[12px] overflow-hidden">
              <img
                src={
                  parkingDetailData?.vehicle?.image ||
                  "/images/car-img-placeholder.jpg"
                }
                alt="car_image"
                className="w-full h-full object-cover"
              />
            </div>
            <ListItemText
              primary={
                (
                  <Link
                    className="hover:underline"
                    // to={`/dash/vehicles/${vehicleId}/view`}
                  >
                    {parkingDetailData?.vehicle?.vehicleMake}
                  </Link>
                ) || "N/A"
              }
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  sx={{  display: "inline" }}
                >
                  {parkingDetailData?.vehicle?.vehicleModel}
                </Typography>
              }
            />
          </ListItem>
        </List>

        <div className="grid grid-cols-2 mt-5">
          <div className="flex flex-col gap-3">
            <Typography variant="body1" color="gray">
              Type
            </Typography>
            <Typography variant="body1" color="gray">
              Color
            </Typography>
            <Typography variant="body1" color="gray">
              Time In
            </Typography>
            <Typography variant="body1" color="gray">
              Duration
            </Typography>
            <Typography variant="body1" color="gray">
              Lot
            </Typography>
          </div>
          <div className="flex flex-col gap-3">
            <Typography variant="body1" color="gray">
              {parkingDetailData?.vehicle?.vehicleType?.name || "N/A"}
            </Typography>
            <Typography variant="body1" color="gray">
              {parkingDetailData?.vehicle?.color || "N/A"}
            </Typography>
            <Typography variant="body1" color="gray">
              {formatDate(parkingDetailData?.timeIn || "N/A")}
            </Typography>
            <Typography
              variant="body1"
              color="green"
              sx={{ fontSize: "18px", fontWeight: "600" }}
            >
              {duration || "N/A"}
            </Typography>
            <Typography variant="body1" color="gray">
              {parkingDetailData?.parkingLot?.lotName || "N/A"}
            </Typography>
          </div>
        </div>
      </section>

      {/* User Details */}
      <section className="mt-10 border border-black rounded-lg px-5 py-3 relative">
        <div className="absolute -top-3 left-7 bg-black text-white px-4 py-1 rounded-xl">
          User
        </div>

        <List sx={{ padding: "0", mt: 3 }}>
          <ListItem sx={{ padding: "0", gap: "10px" }}>
            <Avatar
              alt={parkingDetailData?.vehicle?.user?.fullName}
              src={parkingDetailData?.vehicle?.user?.image}
            />
          </ListItem>
        </List>

        <div className="grid grid-cols-2 mt-5">
          <div className="flex flex-col gap-3">
            <Typography variant="body1" color="gray">
              Name
            </Typography>
            <Typography variant="body1" color="gray">
              Email
            </Typography>
            <Typography variant="body1" color="gray">
              Gender
            </Typography>
            <Typography variant="body1" color="gray">
              Date of Birth
            </Typography>
            <Typography variant="body1" color="gray">
              Phone
            </Typography>
            <Typography variant="body1" color="gray">
              Role
            </Typography>
          </div>
          <div className="flex flex-col gap-3">
            <Typography variant="body1" color="gray">
              {parkingDetailData?.vehicle?.user?.fullName || "N/A"}
            </Typography>
            <Typography variant="body1" color="gray">
              {parkingDetailData?.vehicle?.user?.email || "N/A"}
            </Typography>
            <Typography variant="body1" color="gray">
              {parkingDetailData?.vehicle?.user?.gender?.gender || "N/A"}
            </Typography>
            <Typography variant="body1" color="gray">
              {formatDate(parkingDetailData?.vehicle?.user?.dateOfBirth) ||
                "N/A"}
            </Typography>
            <Typography variant="body1" color="gray">
              {parkingDetailData?.vehicle?.user?.phoneNumber || "N/A"}
            </Typography>
            <Typography variant="body1" color="gray">
              {parkingDetailData?.vehicle?.user?.roles.map(
                (role) => role.name
              ) || "N/A"}
            </Typography>
          </div>
        </div>
      </section>
    </Box>
  );

  return (
    <>
      <Drawer
        sx={{ ...drawerStyle }}
        anchor={"right"}
        open={openDrawer}
        onClose={() => dispatch(toggleDrawerDetail(false))}
      >
        {drawerList}
      </Drawer>
    </>
  );
}

export default ParkingDetailDrawerComponent;

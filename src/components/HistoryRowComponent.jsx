import React, { memo, useEffect, useState } from "react";
import { useGetAllParkingDetailQuery } from "../redux/feature/parking/parkingDetailApiSlice";
import {
  Avatar,
  Badge,
  Box,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import useAuth from "../hook/useAuth";
import useDateFormatter from "../hook/useDateFormatter";
import useTranslate from "./../hook/useTranslate";

function formatDuration(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24; // Remaining seconds after removing days
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  let result = "";
  if (days > 0) {
    result += `${days}d `;
  }
  result += `${String(h).padStart(2, "0")}h : ${String(m).padStart(
    2,
    "0"
  )}m : ${String(s).padStart(2, "0")}s`;
  return result;
}

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

function HistoryRowComponent({ historyId }) {
  const [open, setOpen] = useState(false);
  const [durations, setDurations] = useState("");
  const { isManager } = useAuth();
  const { t } = useTranslate();

  const { parkingDetail } = useGetAllParkingDetailQuery("parkingDetailList", {
    selectFromResult: ({ data }) => ({
      parkingDetail: data?.entities[historyId],
    }),
  });

  console.log("parkingDetail", parkingDetail);

  useEffect(() => {
    let intervalId;

    const calculateInitialDuration = () => {
      let durationInSeconds = 0;
      if (parkingDetail?.timeIn) {
        //timeOut might be null
        const startTime = new Date(parkingDetail.timeIn);
        const endTime = parkingDetail?.timeOut
          ? new Date(parkingDetail.timeOut)
          : new Date(); // Use current time if no timeOut
        const duration = endTime - startTime;
        durationInSeconds = Math.ceil(duration / 1000);
      }
      setDurations(durationInSeconds);
      return durationInSeconds;
    };

    if (parkingDetail?.isParking && parkingDetail?.timeIn) {
      // 1. Calculate initial duration and start the timer.
      calculateInitialDuration(); // Important: Calculate *before* setting the interval

      intervalId = setInterval(() => {
        setDurations((prevDurations) => prevDurations + 1); // Increment seconds
      }, 1000);
    } else {
      // 2.  Calculate duration (for cases where it's NOT parking).
      calculateInitialDuration();
    }

    // Cleanup function: Clear the interval when unmounting or isParking changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    parkingDetail?.isParking,
    parkingDetail?.timeIn,
    parkingDetail?.timeOut,
    historyId,
  ]);

  const dateObj = new Date(parkingDetail?.timeIn);
  var { formattedDateDDMMYYYYNoZeros: timeInformatedDate } = useDateFormatter(
    new Date(parkingDetail.timeIn)
  );
  var timeInformattedTime = dateObj.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const getChipStyles = () => {
    let backgroundColor = "#D2E3D6";
    let color = "#207234";

    if (parkingDetail?.vehicle?.user?.status === "Banned") {
      backgroundColor = "#FFD6D6";
      color = "#981212";
    } else if (parkingDetail?.vehicle?.user?.status === "Pending") {
      backgroundColor = "#FFF5D6";
      color = "#B68D0F";
    } else if (parkingDetail?.vehicle?.user?.status === "Active") {
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
      <TableRow hover sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell padding="checkbox" sx={{ borderBottomStyle: "none" }}>
          <Checkbox color="primary" />
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "none" }}>
          <List sx={{ padding: "0" }}>
            <ListItem sx={{ padding: "0", gap: "10px" }}>
              <div className="w-32 h-20 rounded-[12px] overflow-hidden">
                <img
                  src={
                    parkingDetail?.vehicle?.image ||
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
                      to={`/dash/vehicles/${parkingDetail}/view`}
                    >
                      {parkingDetail?.vehicle?.vehicleMake || "N/A"}
                    </Link>
                  ) || "N/A"
                }
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "gray", display: "inline" }}
                  >
                    {parkingDetail?.vehicle?.vehicleModel || "N/A"}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "none" }}>
          <div className="w-[250px]  rounded-[12px] border-blue-600 border-[3px] px-3 py-2 flex items-center justify-between">
            <div className="flex flex-col">
              <Typography variant="body1" className="text-blue-600">
                {parkingDetail?.vehicle?.licensePlateProvince?.provinceNameKh}
              </Typography>
              <Typography variant="body1" className="text-red-600">
                {parkingDetail?.vehicle?.licensePlateProvince?.provinceNameEn}
              </Typography>
            </div>
            <Typography variant="h5" className="underline text-blue-600">
              {parkingDetail?.vehicle?.numberPlate}
            </Typography>
          </div>
        </TableCell>

        <TableCell component="th" scope="row">
          <Tooltip title="Location - ( Lot )" placement="bottom-start" arrow>
            <p>
              {`${parkingDetail?.parkingSpace?.label} - ( ${parkingDetail?.parkingLot?.lotName} )`}
            </p>
          </Tooltip>
        </TableCell>

        <TableCell
          sx={{ borderTopStyle: "none", borderBottomStyle: "none" }}
        >
          <Typography variant="body1">{timeInformatedDate}</Typography>
          <Typography variant="body2" color="gray">
            {timeInformattedTime}
          </Typography>
        </TableCell>

        <TableCell
          sx={{ borderTopStyle: "none", borderBottomStyle: "none" }}
        >
          <Typography variant="body1">{formatDuration(durations)}</Typography>
        </TableCell>

        <TableCell
          sx={{ borderTopStyle: "none", borderBottomStyle: "none" }}
        >
          {parkingDetail?.isParking ? (
            <Chip
              sx={{
                backgroundColor: "#D2E3D6",
                color: "#207234",
                borderRadius: "6px",
                fontWeight: "500",
              }}
              size="small"
              label="Parking"
            />
          ) : (
            <Chip
              sx={{
                backgroundColor: "#FFD6D6",
                color: "#981212",
                borderRadius: "6px",
                fontWeight: "500",
              }}
              size="small"
              label="Not Parking"
            />
          )}
        </TableCell>

        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          sx={{ backgroundColor: "#F4F6F8" }}
          colSpan={8}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 1,
                minWidth: 0,
                borderRadius: 3,
              }}
              className="bg-white"
            >
              <Table size="small" aria-label="driver-detail">
                <TableHead sx={{ backgroundColor: "transparent" }}>
                  <TableRow>
                    <TableCell
                      minWidth={120}
                      align="left"
                      sx={{ pl: 3, py: 2 }}
                    >
                      {t("driver")}
                    </TableCell>
                    <TableCell minWidth={120} align="left">
                      {t("gender")}
                    </TableCell>
                    <TableCell minWidth={120} align="left">
                      {t("phoneNumber")}
                    </TableCell>
                    <TableCell minWidth={120} align="left">
                      {t("role")}
                    </TableCell>
                    <TableCell minWidth={120} align="left">
                      {t("branch")}
                    </TableCell>
                    <TableCell minWidth={120} align="left">
                      {t("status")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    borderTopStyle: "none",
                    borderBottomStyle: "none",
                  }}
                >
                  <TableRow>
                    <TableCell
                      sx={{
                        borderTopStyle: "none",
                        borderBottomStyle: "none",
                        pl: 3,
                      }}
                    >
                      <List sx={{ padding: "0" }}>
                        <ListItem sx={{ padding: "0", gap: "10px" }}>
                          <Avatar
                            alt={
                              parkingDetail?.vehicle?.user?.fullName || "N/A"
                            }
                            src={
                              parkingDetail?.vehicle?.user?.profileImage ||
                              "N/A"
                            }
                            {...stringAvatar(
                              parkingDetail?.vehicle?.user?.fullName || "N/A"
                            )}
                          />
                          <ListItemText
                            primary={
                              (
                                <Link className="hover:underline" to={"/dash"}>
                                  {parkingDetail?.vehicle?.user?.fullName ||
                                    "N/A"}
                                </Link>
                              ) || "N/A"
                            }
                            secondary={
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{ color: "gray", display: "inline" }}
                              >
                                {parkingDetail?.vehicle?.user?.email || "N/A"}
                              </Typography>
                            }
                          />
                        </ListItem>
                      </List>
                    </TableCell>

                    <TableCell
                      sx={{
                        borderTopStyle: "none",
                        borderBottomStyle: "none",
                      }}
                    >
                      <Typography variant="body1">
                        {parkingDetail?.vehicle?.user?.gender?.gender || "N/A"}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        borderTopStyle: "none",
                        borderBottomStyle: "none",
                      }}
                    >
                      <Typography variant="body1">
                        {parkingDetail?.vehicle?.user?.phoneNumber || "N/A"}
                      </Typography>
                    </TableCell>

                    <TableCell
                      sx={{
                        borderTopStyle: "none",
                        borderBottomStyle: "none",
                      }}
                    >
                      <div className="flex gap-5 items-center">
                        {parkingDetail?.vehicle?.user ? (
                          parkingDetail?.vehicle?.user?.roles.map((role) => (
                            <p key={role.uuid}>{role.name}</p>
                          ))
                        ) : (
                          <p>N/A</p>
                        )}
                      </div>
                    </TableCell>

                    {isManager && (
                      <TableCell
                        sx={{
                          borderTopStyle: "none",
                          borderBottomStyle: "none",
                        }}
                      >
                        <Stack direction="column" spacing={1}>
                          {parkingDetail?.vehicle?.user ? (
                            parkingDetail?.vehicle?.user?.sites.map((site) => (
                              <div key={site.uuid}>
                                <Chip
                                  avatar={
                                    <Avatar
                                      alt="Branch_Img"
                                      src={site.image}
                                      {...stringAvatar(site.siteName)}
                                    />
                                  }
                                  className="w-fit"
                                  label={site.siteName}
                                  variant="outlined"
                                />
                              </div>
                            ))
                          ) : (
                            <p>N/A</p>
                          )}
                        </Stack>
                      </TableCell>
                    )}

                    <TableCell
                      sx={{
                        borderTopStyle: "none",
                        borderBottomStyle: "none",
                      }}
                    >
                      {parkingDetail?.vehicle?.user ? (
                        <Chip
                          sx={getChipStyles()}
                          size="small"
                          label={parkingDetail?.vehicle?.user?.status}
                        />
                      ) : (
                        <p>N/A</p>
                      )}
                    </TableCell>
                  </TableRow>
                  {/* {row.history.map((historyRow) => (
                    <TableRow key={historyRow.date}>
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100}
                      </TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const memoizedHistoryRow = memo(HistoryRowComponent);

export default memoizedHistoryRow;

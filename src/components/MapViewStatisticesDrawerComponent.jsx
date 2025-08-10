import { Box, Drawer, IconButton, Typography } from "@mui/material";
import React from "react";
import { drawerStyle } from "../assets/style";
import { useDispatch, useSelector } from "react-redux";
import MapViewStatisticsComponent from "./MapViewStatisticsComponent";
import { IoIosClose } from "react-icons/io";
import { toggleStatisticesDrawer } from "../redux/feature/mapView/mapViewSlice";
import { MdAnalytics } from "react-icons/md";

function MapViewStatisticesDrawerComponent() {
  const open = useSelector((state) => state.mapView.isStatisticesDrawerOpen);
  const dispatch = useDispatch();

  const drawerList = (
    <Box sx={{ width: 400, px: 2, pt: 1, pb: 10 }} role="presentation">
      <div className="flex justify-between items-center">
        <Typography variant="body1">Details</Typography>
        <IconButton
          size="small"
          onClick={() => dispatch(toggleStatisticesDrawer(false))}
        >
          <IoIosClose className="w-7 h-7" />
        </IconButton>
      </div>
      <div className="grid gap-5 mt-10">
        <MapViewStatisticsComponent />
      </div>
    </Box>
  );

  return (
    <div>
      <Drawer
        open={open}
        anchor={"right"}
        onClose={() => dispatch(toggleStatisticesDrawer(false))}
      >
        {drawerList}
      </Drawer>
    </div>
  );
}

export default MapViewStatisticesDrawerComponent;

import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  selectAllParking,
  useGetParkingQuery,
} from "../../redux/feature/parking/parkingApiSlice";
import TabParking from "./TabParking";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Slot from "./components/Slot";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div className="grid grid-cols-5">{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function ParkingAreas() {
  const parkingArea = useSelector((state) => selectAllParking(state));
  const [value, setValue] = useState(0);
  console.log("parkingArea",parkingArea);
  const {
    data: parkingAreas,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetParkingQuery();

  let content;

  useEffect(() => {
    if (isLoading) {
      content = <p>Loading...</p>;
    }
  }, [isLoading]);

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  content = (
    <div>
      <Box
        sx={{
          maxWidth: { xs: 320, sm: 480 },
          bgcolor: "#e5e7eb",
          marginX: "2rem",
          marginY: "1.7rem",
          borderRadius: "0.6rem",
          padding: "0.3rem",
        }}
      >
        <Tabs
          value={value}
          variant="scrollable"
          onChange={handleChange}
          scrollButtons="auto"
          aria-label="tab"
          TabIndicatorProps={{
            sx: {
              display: "flex",
              justifyContent: "center",
              width: "100%",
              background: "linear-gradient(140deg, #2C3092 30%, #1a56db 100%)",
              height: "100%",
              zIndex: "0",
              borderRadius: "0.5rem",
            },
          }}
        >
          {parkingArea.map((p, index) => (
            <Tab
              key={index}
              label={p.parkingName}
              value={index}
              sx={{
                textTransform: "none",
                color: "#4b5563",
                "&.Mui-selected": {
                  color: "#f9fafb",
                },
                paddingX: "1rem",
                minWidth: "0",
                zIndex: "1",
              }}
              disableRipple
            />
          ))}
        </Tabs>
      </Box>
      {parkingArea.map((p, index) => (
        <TabPanel value={value} index={index} key={index}>
          {p?.parkingSlots.length > 0
            ? p.parkingSlots.map((slot) => (
                <div key={slot.uuid}>
                  <Slot
                    key={slot.uuid}
                    isAvailable={slot.isAvailable}
                    slotName={slot.slotName}
                    uuid={slot.uuid}
                  />
                </div>
              ))
            : "No parking slots available"}
        </TabPanel>
      ))}
      <div>
        <Outlet />
      </div>
    </div>
  );

  return content;
}

export default ParkingAreas;

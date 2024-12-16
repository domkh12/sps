import React, { useState } from "react";
import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  IconButton,
  Select,
  InputAdornment,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";
import { cardStyle, textFieldStyle } from "../../assets/style";
import { selectStyle } from "./../../assets/style";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import SearchIcon from "@mui/icons-material/Search";
import { BarChart } from "@mui/x-charts";
import { Link, useNavigate } from "react-router-dom";

function MapViews() {
  const [valueGauge, setValueGauge] = useState(90);
  const navitage = useNavigate();

  const calculateColor = () => {
    if (valueGauge >= 90) {
      return "#FF0000"; // Red
    } else if (valueGauge >= 70) {
      return "#FFC107"; // Yellow
    } else {
      return "#2C3092"; // Default blue color
    }
  };

  const valueColor = calculateColor();

  const breadcrumbs = [
    <button className="text-black hover:underline" onClick={() => navitage("/dash")}>
      Dashboard
    </button>,
    <Typography color="inherit">Map Views</Typography>,
  ];

  return (
    <>
      <div className="pb-10 pt-1 flex flex-col gap-5">
        <Typography variant="h5" sx={{ fontSize: "24px", fontWeight: "500" }}>
          Map Views
        </Typography>
        <Breadcrumbs
          separator={
            <div className="w-[5px] h-[5px] mx-1 rounded-full bg-light-gray"></div>
          }
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </div>
      <div className="flex gap-5">
        <Card
          minWidth={275}
          sx={{
            padding: "20px",
            ...cardStyle,
          }}
          className="flex-1"
        >
          <div className="grid grid-cols-4 gap-4 mb-5">
            <FormControl fullWidth>
              <InputLabel id="location_label">Location</InputLabel>
              <Select
                labelId="location_label"
                id="location"
                label="Location"
                sx={{ ...selectStyle }}
                IconComponent={() => (
                  <IconButton disableRipple>
                    <KeyboardArrowDownRoundedIcon />
                  </IconButton>
                )}
              >
                <MenuItem value={10}>Ten</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth className="col-span-3">
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
                placeholder="Search..."
                sx={{ ...textFieldStyle }}
              />
            </FormControl>
          </div>
          <div className="grid grid-cols-6">
            <div className="py-5 border border-dashed border-gray-400 flex justify-center items-center flex-col gap-4">
              <span className="border border-dashed px-4 py-1 rounded-xl border-gray-400">
                D-12
              </span>
              <img src="/images/car.png" alt="car" />
            </div>
          </div>
        </Card>
        {/* Data Summary */}
        <div className="grid gap-5">
          <Card
            minWidth={275}
            sx={{
              padding: "20px",
              ...cardStyle,
            }}
          >
            <Typography variant="body1" component="div">
              Space Status
            </Typography>
            <Gauge
              width={200}
              height={200}
              value={valueGauge}
              cornerRadius={50}
              valueMin={0}
              valueMax={100}
              sx={{
                margin: "0 auto",
                "& .MuiGauge-valueText": {
                  fontSize: 25,
                },
                "& .MuiGauge-referenceArc": {
                  strokeWidth: 7,
                  stroke: "#fff",
                },
                "& .MuiGauge-valueArc": {
                  fill: valueColor,
                },
              }}
              text={({ value }) => `${value} %`}
            />

            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-[6px]"
                  style={{ backgroundColor: valueColor }}
                ></div>
                <span>Fill</span>
              </div>
              <span>10 Slot</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-300 rounded-[6px]"></div>
                <span>Empty</span>
              </div>
              <span>2 Slot</span>
            </div>
          </Card>
          <Card
            minWidth={275}
            sx={{
              padding: "20px",
              ...cardStyle,
            }}
          >
            <Typography variant="body1" component="div">
              In and Out Summary
            </Typography>
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: [
                    "group A",
                    "group B",
                    "group C",
                    "group D",
                    "group E",
                    "group F",
                  ],
                },
              ]}
              series={[
                { data: [1, 6, 3, 4, 5, 6] },
                { data: [2, 5, 6, 4, 6, 18] },
              ]}
              width={380}
              height={300}
              grid={{ horizontal: true }}
              borderRadius={5}
              sx={{
                "& .MuiChartsGrid-root": {
                  strokeDasharray: "3 3",
                },
                "& .MuiChartsAxis-directionY": {
                  strokeOpacity: 0,
                },
                "& .MuiChartsAxis-directionX": {
                  strokeOpacity: 0,
                },
              }}
            />
          </Card>
          <Card
            minWidth={275}
            sx={{
              padding: "20px",
              ...cardStyle,
            }}
          >
            <Typography variant="body1" component="div" sx={{ mb: 2 }}>
              Activity Logs
            </Typography>
            <div className="flex gap-3 relative mb-3">
              <div className="w-[2px] h-[70%] absolute top-6 left-[9px] bg-light-gray"></div>
              <div className="w-5 h-5 rounded-full bg-primary"></div>
              <div className="flex flex-col">
                <span>ក្រោយអគារ IT</span>
                <span className="text-sm text-gray-500">
                  13 Feb 2025 1:45pm
                </span>
                <p>
                  <span className="text-primary">2KS-3456</span> is parked at{" "}
                  <span className="text-primary">D12</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3 relative mb-3">
              <div className="w-[2px] h-[70%] absolute top-6 left-[9px] bg-light-gray"></div>
              <div className="w-5 h-5 rounded-full bg-primary"></div>
              <div className="flex flex-col">
                <span>ក្រោយអគារ IT</span>
                <span className="text-sm text-gray-500">
                  13 Feb 2025 1:45pm
                </span>
                <p>
                  <span className="text-primary">2KS-3456</span> is parked at{" "}
                  <span className="text-primary">D12</span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default MapViews;

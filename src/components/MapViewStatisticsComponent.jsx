import { Card, Typography } from "@mui/material";
import { BarChart, Gauge } from "@mui/x-charts";
import React from "react";
import { useSelector } from "react-redux";
import { cardStyle } from "../assets/style";
import useGaugeData from "../hook/useGaugeData";
import useBarChartData from "../hook/useBarChartData";

function MapViewStatisticsComponent() {
  const parkingData = useSelector((state) => state.parking.parking);
  const { valueGauge, valueColor } = useGaugeData(parkingData);
  const { lastSixHours, seriesData } = useBarChartData();

  return (
    <>
      {/* Data Summary */}

      <Card
        sx={{
          width: "100%"
        }}
      >
        <Typography variant="body1" component="div" className="p-[20px]">
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

        <div className="flex justify-between items-center mb-3  mx-[20px]  mt-[10px]">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-[6px]"
              style={{ backgroundColor: valueColor }}
            ></div>
            <span>Fill</span>
          </div>
          <span>{parkingData?.filled || "0"} Slot</span>
        </div>

        <div className="flex justify-between items-center  mx-[20px]  mb-[20px]">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-300 rounded-[6px]"></div>
            <span>Empty</span>
          </div>
          <span>{parkingData?.empty || "0"} Slot</span>
        </div>
      </Card>

      <Card>
        <div className="flex justify-between">
          <Typography
            variant="body1"
            className="pl-[20px] pt-[20px]"
            component="div"
          >
            Vehicle In and Out Summary
          </Typography>
          <Typography
            variant="body1"
            className="pr-[20px] pt-[20px]"
            component="div"
            color="gray"
          >
            Last 6 hours
          </Typography>
        </div>
        <div className="flex items-center gap-5 my-4 px-[20px]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <Typography variant="body1">IN</Typography>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <Typography variant="body1">OUT</Typography>
          </div>
        </div>

        <BarChart
          xAxis={[
            {
              scaleType: "band",
              data: lastSixHours,
            },
          ]}
          height={350}
          slotProps={{ legend: { hidden: true } }}
          margin={{ top: 20, bottom: 30, left: 40, right: 10 }}
          series={seriesData}
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
        sx={{
          padding: "20px"
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
            <span className="text-sm text-gray-500">13 Feb 2025 1:45pm</span>
            <p>
              <span className="text-primary">2KS-3456</span> is parked at
              <span className="text-primary">D12</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3 relative mb-3">
          <div className="w-[2px] h-[70%] absolute top-6 left-[9px] bg-light-gray"></div>
          <div className="w-5 h-5 rounded-full bg-primary"></div>
          <div className="flex flex-col">
            <span>ក្រោយអគារ IT</span>
            <span className="text-sm text-gray-500">13 Feb 2025 1:45pm</span>
            <p>
              <span className="text-primary">2KS-3456</span> is parked at{" "}
              <span className="text-primary">D12</span>
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}

export default MapViewStatisticsComponent;

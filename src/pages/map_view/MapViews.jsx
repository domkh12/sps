import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
} from "@mui/material";
import { Gauge } from "@mui/x-charts/Gauge";
import { cardStyle } from "../../assets/style";
import { BarChart } from "@mui/x-charts";
import { useNavigate } from "react-router-dom";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import SearchComponent from "../../components/SearchComponent";
import { useSelector } from "react-redux";
import {
  useFindAllLabelsMutation,
  useFindParkingByUuidMutation,
  useGetParkingQuery,
} from "../../redux/feature/parking/parkingApiSlice";
import ParkingSlotComponent from "../../components/ParkingSlotComponent";
import useTranslate from "./../../hook/useTranslate";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import SeoComponent from "../../components/SeoComponent";
import useWebSocket from "../../hook/useWebSocket";
import DataNotFound from "../../components/DataNotFound";
import SelectSingleComponent from "../../components/SelectSingleComponent";

function MapViews() {
  const [valueGauge, setValueGauge] = useState(0);
  const [label, setLabel] = useState("");
  const navitage = useNavigate();
  const { t } = useTranslate();
  const parkingLabels = useSelector((state) => state.parking.labels);
  const parkingData = useSelector((state) => state.parking.parking);
  const [selectFirstLabel, setSelectedLabel] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    loading,
    error: websocketError,
    messages,
  } = useWebSocket("/topic/slot-update");

  const {
    data: parkings,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetParkingQuery({ pageNo: 1, pageSize: 1 });

  const [
    findParkingByUuid,
    {
      isSuccess: isSuccessFindParking,
      isLoading: isLoadingFindParking,
      isError: isErrorFindParking,
      error: errorFindParking,
    },
  ] = useFindParkingByUuidMutation();

  const [
    findAllLabels,
    {
      isSuccess: isSuccessLabel,
      isLoading: isLoaingLabel,
      isError: isErrorLabel,
      error: errorLabel,
    },
  ] = useFindAllLabelsMutation();

  useEffect(() => {
    if (isSuccessLabel) {
      setSelectedLabel(parkingLabels.data[0].uuid);
    }
  }, [isSuccessLabel]);

  useEffect(() => {
    if (selectFirstLabel != null) {
      const fetchFistParking = async () => {
        await findParkingByUuid(selectFirstLabel);
      };
      fetchFistParking();
    }
  }, [selectFirstLabel]);

  useEffect(() => {
    if (parkingData) {
      if (parkingData) {
        const totalSlots = parkingData.filled + parkingData.empty;
        let filledPercentage =
          totalSlots > 0 ? (parkingData.filled / totalSlots) * 100 : 0;

        filledPercentage = Math.round(filledPercentage);
        setValueGauge(filledPercentage);
      }
    }
  }, [parkingData]);

  useEffect(() => {
    const fetchAllLabels = async () => {
      await findAllLabels();
    };
    fetchAllLabels();
  }, []);

  const calculateColor = () => {
    if (valueGauge >= 90) {
      return "#FF0000"; // Red
    } else if (valueGauge >= 70) {
      return "#FFC107"; // Yellow
    } else {
      return "#2C3092"; // Default blue color
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleChange = async (value) => {
    await findParkingByUuid(value);
    setSelectedLabel(null);
    setLabel(value);
  };
  
  const valueColor = calculateColor();

  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navitage("/dash")}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("mapView")}
    </Typography>,
  ];

  let content;

  if (isLoading || isLoaingLabel || isLoadingFindParking || isFetching) {
    content = <LoadingFetchingDataComponent />;
  }

  if (isError) {
    content = <p>Error: {error?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = parkings;

    const filteredSlots = parkingData?.parkingLots
      ?.filter((slot) => {
        if (!searchTerm) return true; // If no search term, show all slots
        return slot.lotName.toLowerCase().includes(searchTerm.toLowerCase());
      })
      ?.map((slot) => <ParkingSlotComponent key={slot.uuid} slot={slot}/>);

    const slotContent =
      filteredSlots && filteredSlots.length > 0 ? (
        filteredSlots
      ) : (
        <DataNotFound />
      );
      
    content = (
      <>
        <SeoComponent title={"Map Views"} />
        <MainHeaderComponent breadcrumbs={breadcrumbs} title={t("mapView")} />

        <div className="w-full grid gap-5 lg:grid-cols-12" data-aos="fade-left">
          <div className="col-span-8">
            <Card
              sx={{
                ...cardStyle,
                overflow:"auto"
              }}
              className=" max-h-[700px]"
            >
              <div className="flex gap-5 flex-col lg:flex-row p-[20px]">
                <SelectSingleComponent
                  label="Parking spaces"
                  options={parkingLabels?.data}
                  onChange={handleChange}
                  className="lg:w-60 w-full shrink-0"
                  fullWidth={false}
                  optionLabelKey="label"
                  selectFistValue={selectFirstLabel}
                />
                <SearchComponent onSearchChange={handleSearchChange} />
              </div>
              <div className="grid grid-cols-1 px-[20px] gap-[10px] pb-[20px] xxs:grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
                {slotContent}
              </div>
            </Card>
          </div>
          {/* Data Summary */}
          <div className="lg:grid gap-5 hidden col-span-4">
            <Card
              sx={{
                width: "100%",
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
                <span>{parkingData.filled} Slot</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-300 rounded-[6px]"></div>
                  <span>Empty</span>
                </div>
                <span>{parkingData.empty} Slot</span>
              </div>
            </Card>

            <Card
              sx={{
                ...cardStyle,
              }}
            >
              <Typography
                variant="body1"
                className="px-[20px] pt-[20px]"
                component="div"
              >
                In and Out Summary
              </Typography>
              <div className="flex items-center gap-5 my-4 px-[20px]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary"></div>
                  <Typography variant="body1">IN</Typography>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-secondary"></div>
                  <Typography variant="body1">OUT</Typography>
                </div>
              </div>
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
                height={300}
                width={300}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                series={[
                  { data: [1, 6, 3, 4, 5, 6] },
                  { data: [2, 5, 6, 4, 6, 18] },
                ]}
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
  return content;
}

export default MapViews;

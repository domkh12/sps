import React, { useEffect, useState } from "react";
import { Card, Typography } from "@mui/material";
import { cardStyle } from "../../assets/style";
import { useNavigate } from "react-router-dom";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import SearchComponent from "../../components/SearchComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  useFindAllLabelsMutation,
  useFindParkingByUuidMutation,
  useGetParkingSpacesQuery,
} from "../../redux/feature/parking/parkingApiSlice";
import ParkingSlotComponent from "../../components/ParkingSlotComponent";
import useTranslate from "./../../hook/useTranslate";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import SeoComponent from "../../components/SeoComponent";
import DataNotFound from "../../components/DataNotFound";
import SelectSingleComponent from "../../components/SelectSingleComponent";
import {
  clearParking,
  setParkingFromWB,
} from "../../redux/feature/parking/parkingSlice";
import MapViewStatisticsComponent from "../../components/MapViewStatisticsComponent";
import ParkingDetailDrawerComponent from "../../components/ParkingDetailDrawerComponent";
import { MdAnalytics } from "react-icons/md";
import MapViewStatisticesDrawerComponent from "../../components/MapViewStatisticesDrawerComponent";
import {
  setIsSelectFistLabel,
  setSelectFirstLabel,
  toggleStatisticesDrawer,
} from "../../redux/feature/mapView/mapViewSlice";
import useWebSocket from "./../../hook/useWebSocket";

function MapViews() {
  const dispatch = useDispatch();
  const navitage = useNavigate();
  const { t } = useTranslate();
  const parkingLabels = useSelector((state) => state.parking.labels);
  const parkingData = useSelector((state) => state.parking.parking);
  const selectFirstLabel = useSelector(
    (state) => state.mapView.selectFirstLabel
  );
  const [searchTerm, setSearchTerm] = useState("");
  const isSelectFirstLabel = useSelector(
    (state) => state.mapView.isSelectFirstLabel
  );
  console.log("parkingData", parkingData);

  const {
    loading,
    error: websocketError,
    messages,
  } = useWebSocket("/topic/slot-update");

  useEffect(() => {
    if (messages) {
      dispatch(setParkingFromWB(messages?.parkingSpace));
    }
  }, [messages]);

  const {
    data: parkings,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetParkingSpacesQuery("parkingSpacesList");

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
      dispatch(setSelectFirstLabel(parkingLabels?.data[0]?.uuid));
      dispatch(setIsSelectFistLabel(false));
    }
  }, [isSuccessLabel]);

  useEffect(() => {
    if (selectFirstLabel) {
      const fetchFistParking = async () => {
        await findParkingByUuid(selectFirstLabel);
      };
      fetchFistParking();
    } else {
      dispatch(clearParking());
    }
  }, [selectFirstLabel, dispatch]);

  useEffect(() => {
    if (isSelectFirstLabel) {
      const fetchAllLabels = async () => {
        await findAllLabels();
      };
      fetchAllLabels();
    }
  }, [isSelectFirstLabel]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleChange = async (value) => {
    await findParkingByUuid(value);
  };

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
      ?.map((slot) => <ParkingSlotComponent key={slot.uuid} slot={slot} />);

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
                overflow: "auto",
              }}
              className=" max-h-[700px]"
            >
              <div className="flex gap-5 flex-col lg:flex-row p-[20px]">
                <SelectSingleComponent
                  label={t('parkingSpace')}
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

          <div className="hidden lg:grid  gap-5 col-span-4">
            <MapViewStatisticsComponent />
          </div>
        </div>

        <button
          onClick={() => dispatch(toggleStatisticesDrawer(true))}
          className="px-5 py-2 absolute top-[100px] right-[0px] lg:hidden bg-primary text-white  rounded-tl-lg rounded-bl-lg"
        >
          <MdAnalytics className="w-7 h-7" />
        </button>

        <MapViewStatisticesDrawerComponent />
        <ParkingDetailDrawerComponent />
      </>
    );
  }
  return content;
}

export default MapViews;

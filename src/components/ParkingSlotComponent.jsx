import React from "react";
import { Typography } from "@mui/material";
import { toggleDrawerDetail } from "../redux/feature/mapView/mapViewSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetParkigDetailMutation } from "../redux/feature/parking/parkingDetailApiSlice";
import ImageComponent from "./ImageComponent.jsx";

function ParkingSlotComponent({ slot }) {

  const dispatch = useDispatch();
  const [getParkigDetail, { isLoading }] = useGetParkigDetailMutation();

  const handleToggleDrawerDetail = () => {
    dispatch(toggleDrawerDetail(true));
    const fetchGetDetail = async () => {
      await getParkigDetail({ uuid: slot.uuid });
    };
    fetchGetDetail();
  };

  return (
    <button
      onClick={slot.isAvailable ? null : handleToggleDrawerDetail}
      className="relative border border-dashed h-[240px] flex justify-center items-center rounded-[6px] border-light-gray cursor-pointer active-scale hover-scale"
    >
      <p className="absolute left-0 top-0 w-full h-[70px] flex justify-center items-center">
        <span className="border border-dashed px-4 py-1 rounded-xl border-light-gray">
          {slot.lotName}
        </span>
      </p>
      {slot.isAvailable ? (
        <>
          <div className="h-[140px] absolute bottom-0 left-0 w-full flex justify-center items-center pb-[20px]">
            <Typography variant="body1" className="text-primary">
              Availabe
            </Typography>
          </div>
        </>
      ) : (
        <>
          <ImageComponent imageUrl={"/images/car.png"} alt={"car"} clasname={"w-[100px] h-[100px]"} />
        </>
      )}
    </button>
  );
}

export default ParkingSlotComponent;

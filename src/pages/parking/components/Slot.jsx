import { useState } from "react";
import DrawerDetailParking from "./DrawerDetailParking";
import { Button, IconButton } from "@mui/material";
import { useGetParkingSlotsByUuidMutation } from "../../../redux/feature/parking/parkingSlotApiSlice";

function Slot({ isAvailable, slotName, uuid }) {
  const [open, setOpen] = useState(false);

  const [getParkingSlotsByUuid, { isSuccess, isLoading, isError, error }] =
    useGetParkingSlotsByUuidMutation();

  const toggleDrawer = (newOpen) => async () => {
    setOpen(newOpen);
    await getParkingSlotsByUuid({ uuid });
  };

  return (
    <>
      <div className="border flex justify-center items-center h-32 w-auto">
        {isAvailable ? (
          <Button
            color="#e5e7eb"
            onClick={toggleDrawer(true)}
            className="w-full h-full flex justify-center items-center cursor-pointer"
          >
            <img
              src="/images/car_topview.png"
              alt={slotName}
              height="50px"
              width="100px"
              loading="lazy"
              style={{ transform: "rotate(270deg)" }}
              draggable="false"
            />
          </Button>
        ) : (
          <p className="text-lg text-gray-700">{slotName}</p>
        )}
      </div>
      <DrawerDetailParking
        open={open}
        toggleDrawer={toggleDrawer}
        slotName={slotName}
        uuid={uuid}
      />
    </>
  );
}

export default Slot;

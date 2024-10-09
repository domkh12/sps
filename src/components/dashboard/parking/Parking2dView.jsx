import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchParkingByUuid, updateParkingSlot } from "../../../redux/feature/parking/parkingSlice";
import NumberPlate from "./NumberPlate";
import { Popover, Spinner } from "flowbite-react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function Parking2dView() {
  const { uuid } = useParams();    
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.parking.loading);
  const parkingSlots = useSelector((state) => state.parking.parkingSlots);
  const error = useSelector((state) => state.parking.error);   
  const [updates, setUpdates] = useState([]);
  const userUuid = useSelector((state) => state.auth.userUuid);
  console.log(userUuid)
  let stompClient;
  let socket;

  const connect = async () => {
    socket = new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`);
    stompClient = Stomp.over(socket);
    stompClient.connect({ Authorization: `Bearer ${localStorage.getItem("token")}` }, 
    onConnected, 
    onError);
  };
  
  const onConnected = async () => {
    console.log("Connected successfully to WebSocket");
        stompClient.subscribe(`/user/${userUuid}/update`, (message) => {
          const update = JSON.parse(message.body);
          console.log("Received update:", update);
          setUpdates((prevUpdates) => [...prevUpdates, update]);
          
          dispatch(updateParkingSlot(update));
        });
  };
  
  const onError = async (err) => {
    console.log("Failed to connect to WebSocket:", err);
  };

  useEffect(() => {
    connect();
    if (uuid) {
      dispatch(fetchParkingByUuid(uuid));
    }
    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };   
  }, [dispatch, uuid]);

  if (loading) {
    return <Spinner aria-label="loading" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
    
  return (    
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Parking View
      </h2>
      <div className="grid grid-cols-5 gap-4">
        {parkingSlots.map((slot) =>
          slot.isAvailable ? (
            <div
              key={slot.uuid}
              className="border-[1px] h-32 text-center rounded-lg border-gray-600"
            >
              <div className="font-bold flex items-center justify-center h-full">
                {slot.slotName}
              </div>
            </div>
          ) : (
            <Popover
              key={slot.uuid}
              content={
                <div className="p-2 z-20 grid gap-2">
                  <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 rounded-md">                      
                    <h3 id="default-popover"
                        className="font-semibold text-gray-900 dark:text-white rounded-lg">
                      {slot.slotName}
                    </h3>
                  </div>
                  <div className="w-64 p-3">
                    <NumberPlate />
                  </div>                    
                </div>
              }
              trigger="click"
              placement="top"
            >
              <div
                className="border-[1px] h-32 text-center rounded-lg border-gray-600 cursor-pointer"
              >
                <h2 className="text-right mr-2">{slot.slotName}</h2>
                <img
                  src="/icons/car_topview.svg"
                  width={50}
                  className="rotate-90 mx-auto"
                  alt="Car"
                />
              </div>
            </Popover>
          )
        )}
      </div>       
    </div>
  );
}

export default Parking2dView;

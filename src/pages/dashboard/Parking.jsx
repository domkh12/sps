import React, { useEffect, useRef } from "react";
import { Button } from "flowbite-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchParkingByUuid, fetchParkingData } from "../../redux/feature/parking/parkingSlice";

function Parking() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const buttonGroupRef = useRef(null);
  const parkingData = useSelector((state) => state.parking.parkingData);
  const isActive = (uuid) => {
    return location.pathname === `admin/parking/${uuid}`;
  };

  const buttonClass = (uuid) =>
    `border-b-2 rounded-none bg-transparent hover:bg-transparent hover:border-b-gray-500 text-black focus:ring-0 ${
      isActive(uuid) ? "border-b-gray-500" : "border-b-transparent"
    }`;

    useEffect(() => {
      dispatch(fetchParkingData({ pageNo: 1, pageSize: 10 }));
    }, [dispatch]);

    const handleParkingClick = (uuid) => {
      dispatch(fetchParkingByUuid(uuid));
      navigate(`${uuid}`);
    };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 ml-5 mt-5">Parking Map</h1>
      <div className="border-b-2 w-full flex items-start overflow-x-auto" ref={buttonGroupRef}>
        {parkingData.map((parking) => (
          <Button
            key={parking.uuid}
            className={`${buttonClass(parking.uuid)} whitespace-nowrap text-xs sm:text-sm md:text-base mx-1`}
            onClick={() => handleParkingClick(parking.uuid)}>
            {parking.parkingName}
          </Button>
        ))}
      </div>      
      <Outlet />
    </div>
  );
}

export default Parking;

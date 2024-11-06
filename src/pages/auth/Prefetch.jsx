import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import store from "./../../redux/app/store";
import { userApiSlice } from "../../redux/feature/users/userApiSlice";
import { vehicleTypeTypeApiSlice } from "../../redux/feature/vehicles/vehicleTypeApiSlice";
import { vehicleApiSlice } from "../../redux/feature/vehicles/vehicleApiSlice";

function Prefetch() {
  useEffect(() => {
    console.log("subscribing...");
    const users = store.dispatch(userApiSlice.endpoints.getUsers.initiate());    
    const fullNameUsers = store.dispatch(userApiSlice.endpoints.getFullNameUsers.initiate());    
    const vehicle = store.dispatch(vehicleApiSlice.endpoints.getVehicle.initiate())
    const VehicleTypes = store.dispatch(vehicleTypeTypeApiSlice.endpoints.getVehicleType.initiate());   

    return () => {
      users.unsubscribe();      
      fullNameUsers.unsubscribe();
      vehicle.unsubscribe();
      VehicleTypes.unsubscribe();
      console.log("unsubscribing...");
    };
  }, []);

  return <Outlet />;
}

export default Prefetch;

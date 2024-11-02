import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import store from "./../../redux/app/store";
import { userApiSlice } from "../../redux/feature/users/userApiSlice";
import { vehicleTypeTypeApiSlice } from "../../redux/feature/vehicles/vehicleTypeApiSlice";

function Prefetch() {
  useEffect(() => {
    console.log("subscribing...");
    const users = store.dispatch(userApiSlice.endpoints.getUsers.initiate());    
    const fullNameUsers = store.dispatch(userApiSlice.endpoints.getFullNameUsers.initiate());    
    const VehicleTypes = store.dispatch(vehicleTypeTypeApiSlice.endpoints.getVehicleType.initiate());   

    return () => {
      users.unsubscribe();      
      fullNameUsers.unsubscribe();
      console.log("unsubscribing...");
    };
  }, []);

  return <Outlet />;
}

export default Prefetch;

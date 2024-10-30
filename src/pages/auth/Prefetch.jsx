import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import store from "./../../redux/app/store";
import { userApiSlice } from "../../redux/feature/users/userApiSlice";

function Prefetch() {
  useEffect(() => {
    console.log("subscribing...");
    const users = store.dispatch(userApiSlice.endpoints.getUsers.initiate());    

    return () => {
      users.unsubscribe();      
      console.log("unsubscribing...");
    };
  }, []);

  return <Outlet />;
}

export default Prefetch;

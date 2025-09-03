import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../../redux/feature/auth/authSlice";
import { useRefreshMutation } from "../../redux/feature/auth/authApiSlice";
import { Outlet } from "react-router-dom";
import usePersist from "../../hook/usePersist";
import Error401Component from "./../../components/Error401Component";
import {Paper} from "@mui/material";
import LoadingOneComponent from "../../components/LoadingOneComponent.jsx";

function PersistLogin() {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const [trueSuccess, setTrueSuccess] = useState(false);
  const effectRan = useRef(false);
  const [refresh, { isUninitialized, isSuccess, isLoading, isError, error }] =
    useRefreshMutation();

  console.log("isLoading", isLoading)

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        try {
          await refresh();
          setTrueSuccess(true);
        } catch (error) {
          console.log(error);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);
  }, []);

  let content;
  if (!persist) {
    // persist: no
    content = <Paper><Outlet /></Paper>;
  } else if(isLoading){
    content = <LoadingOneComponent />;
  } else if (isError) {
    localStorage.removeItem("isRemember");
    content = <Error401Component />;
  } else if (isSuccess && trueSuccess) {
    // persist: yes , token: yes
    content =  <Paper><Outlet /></Paper>;
  } else if (token && isUninitialized) {
    content = <Paper><Outlet /></Paper>;
  }

  return content;
}

export default PersistLogin;

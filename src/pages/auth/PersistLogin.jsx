import React, { useEffect, useRef, useState } from "react";
import usePersist from "../../hook/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToekn } from "../../redux/feature/auth/authSlice";
import { useRefreshMutation } from "../../redux/feature/auth/authApiSlice";
import { Outlet, useNavigate } from "react-router-dom";

function PersistLogin() {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToekn);
  const [trueSuccess, setTrueSuccess] = useState(false);
  const effectRan = useRef(false);

  const [refresh, { isUninitialized, isSuccess, isLoading, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    console.log("presistStart");
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      const verifyRefreshToken = async () => {
        console.log("verifying refresh token");
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
    content = <Outlet />;
  } else if (isLoading) {
    // persist: yes , token: no
    console.log("loading");
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p>Unauthorized</p>;
  } else if (isSuccess && trueSuccess) {
    // persist: yes , token: yes
    console.log("Success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    console.log("Token and uninit");
    console.log("isUninitialized", isUninitialized);
    content = <Outlet />;
  }

  return content;
}

export default PersistLogin;

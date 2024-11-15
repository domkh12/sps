import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentToekn } from "../../redux/feature/auth/authSlice";
import { useRefreshMutation } from "../../redux/feature/auth/authApiSlice";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { HiArrowRight } from "react-icons/hi";
import useAuth from "../../hook/useAuth";

function PersistLogin() {
  const { username, roles } = useAuth();
  const token = useSelector(selectCurrentToekn);
  const [trueSuccess, setTrueSuccess] = useState(false);
  const effectRan = useRef(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

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

      if (!token) verifyRefreshToken();
    }

    return () => (effectRan.current = true);
  }, []);

  // useEffect(() => {
  //   if (!roles.includes("ROLE_ADMIN")) {      
  //     handleLoginRedirect();
  //   }
  // }, [roles]);

  let content;
  if (isLoading) {
    // persist: yes , token: no
    console.log("loading");
    content = <p>Loading...</p>;
  } else if (isError) {
    content = (
      <>
        <div className="flex flex-col justify-center items-center gap-5 p-6 h-screen">
          <img
            src="/images/unauthorize.svg"
            alt="Unauthorized Access"
            className="w-1/3 h-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-red-600">
            Session Expired
          </h2>
          <p className="text-center text-gray-700">
            Your login session has expired due to inactivity. For your security,
            please log in again to continue accessing your account.
          </p>
          <Button
            className="bg-primary mt-4 ring-transparent hover:bg-primary-hover"
            onClick={handleLoginRedirect}
          >
            {" "}
            <span>Go to Login</span>
            <HiArrowRight className="text-lg ml-2" />
          </Button>
        </div>
      </>
    );
  } else if (isSuccess && trueSuccess) {
    // persist: yes , token: yes
    console.log("Success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    content = <Outlet />;
  }

  return content;
}

export default PersistLogin;

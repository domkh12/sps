import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useOauth2MicrosoftMutation,
  useSendLogoutMutation,
} from "../../redux/feature/auth/authApiSlice";
import {
  logOut,
  setCredentials,
  setUuid,
} from "../../redux/feature/auth/authSlice";
import { Button, Card, FloatingLabel, Flowbite, Spinner } from "flowbite-react";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { spinnerTheme } from "./../../redux/feature/utils/customReactFlowbiteTheme";
import { Helmet } from "react-helmet-async";
import { jwtDecode } from "jwt-decode";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { loginRequest } from "../../config/auth/authConfig";

export default function Login() {
  const userRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toggleEye, setToggleEye] = useState(false);
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const [
    sendLogout,
    { isSuccess, isLoading: isLoadingLogout, isError, error },
  ] = useSendLogoutMutation();

  const [
    oauth2Microsoft,
    {  },
  ] = useOauth2MicrosoftMutation();

  const handleLogout = () => sendLogout();

  const handleLoginRedirect = () => {
    instance
      .loginRedirect({
        ...loginRequest,
        prompt: "create",
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLoginPopup = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      const accessToken = response.accessToken;
      await oauth2Microsoft({accessToken : response.accessToken});
      dispatch(setCredentials({ accessToken }));  
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogoutRedirect = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "http://localhost:8080/login", // Redirect to home or login page after logout
    });
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Required"),
    password: Yup.string().required("No password provided."),
  });

  const [login, { isLoading }] = useLoginMutation();
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const { accessToken, uuid } = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      const decoded = jwtDecode(accessToken);
      const { jti: username, scope } = decoded;
      const roles = scope ? scope.split(" ") : [];

      if (!roles.includes("ROLE_ADMIN")) {
        toast.error(
          "You don't have permission to access this feature. Please contact an administrator.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
        handleLogout();
        return;
      }
      dispatch(setCredentials({ accessToken }));
      dispatch(setUuid(uuid));
      navigate("/dash");
      toast.success("Login Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      console.log(error);
      if (error.status === "FETCH_ERROR") {
        toast.error("Something went wrong!");
      } else if (error.status === 400) {
        toast.error("Email or Password is incorrect.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (error.status === 404) {
        toast.error("Email or Password is incorrect.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (error.status === 401) {
        toast.error("Email or Password is incorrect.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(error?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleEye = () => {
    setToggleEye(!toggleEye);
  };

  const content = (
    <Flowbite className="bg-white">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, touched, errors, handleChange, handleBlur }) => (
          <Form className="grid grid-cols-12 md:grid-cols-1 grid-flow-row justify-center items-center min-h-screen gap-10">
            <section className="md:hidden col-start-2 col-end-6">
              <img src="/images/login.svg" alt="login_image" />
            </section>
            <hr className="w-1 h-[30rem] bg-primary col-span-1 mx-auto md:hidden" />
            <Card className="col-start-7 col-end-12 w-[90%] mx-auto md:col-span-1">
              <div className="grid grid-cols-12 gap-x-3">
                <div className="col-span-2 row-span-2">
                  <img
                    src="/images/logo.png"
                    alt="logo"
                    width={50}
                    height={50}
                  />
                </div>
                <span className="font-semibold subpixel-antialiased tracking-wide text-nowrap text-clamp truncate col-span-10">
                  ប្រព័ន្ធចតរថយន្តឆ្លាតវៃ
                </span>
                <br />
                <span className="subpixel-antialiased text-nowrap text-clampSmall col-start-3 col-end-13 row-start-2 truncate">
                  Smart Parking System
                </span>
              </div>
              <div>
                <FloatingLabel
                  type="text"
                  id="email"
                  name="email"
                  ref={userRef}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="off"
                  color={errors.email && touched.email ? "error" : "default"}
                  variant="outlined"
                  label="Email"
                />
                {errors.email && touched.email && (
                  <small className="text-red-600">{errors.email}</small>
                )}
              </div>
              <div className="relative">
                <FloatingLabel
                  type={!toggleEye ? "password" : "text"}
                  id="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  color={
                    errors.password && touched.password ? "error" : "default"
                  }
                  variant="outlined"
                  label="Password"
                />
                {toggleEye ? (
                  <TbEye
                    className="absolute top-3 right-2 text-xl hover:cursor-pointer"
                    onClick={handleToggleEye}
                  />
                ) : (
                  <TbEyeClosed
                    className="absolute top-3 right-2 text-xl hover:cursor-pointer"
                    onClick={handleToggleEye}
                  />
                )}

                {errors.password && touched.password && (
                  <small className="text-red-600">{errors.password}</small>
                )}
              </div>
              <Button
                disabled={isLoading}
                type="submit"
                className="bg-primary w-full hover:bg-primary-hover"
              >
                {isLoading ? (
                  <Spinner
                    theme={spinnerTheme}
                    color="primary"
                    aria-label="loading"
                    size="xs"
                  />
                ) : (
                  "Login"
                )}
              </Button>
              <div>
                <AuthenticatedTemplate>
                  {activeAccount ? (
                    <>
                      <button
                        onClick={handleLogoutRedirect}
                        className="bg-primary"
                      >
                        Logout
                      </button>
                      <p>You are signed in</p>
                    </>
                  ) : null}
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                  <>
                    {/* <button onClick={handleLoginRedirect}>Login</button>                */}
                    <div className="w-full">
                      <button
                        onClick={handleLoginPopup}
                        className="flex items-center gap-4 justify-center w-full bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          id="microsoft"
                          style={{ width: "24px", height: "24px" }}
                        >
                          <path
                            fill="#4CAF50"
                            d="M8.5 7.5H16v-7a.5.5 0 0 0-.5-.5h-7v7.5z"
                          ></path>
                          <path
                            fill="#F44336"
                            d="M7.5 7.5V0h-7a.5.5 0 0 0-.5.5v7h7.5z"
                          ></path>
                          <path
                            fill="#2196F3"
                            d="M7.5 8.5H0v7a.5.5 0 0 0 .5.5h7V8.5z"
                          ></path>
                          <path
                            fill="#FFC107"
                            d="M8.5 8.5V16h7a.5.5 0 0 0 .5-.5v-7H8.5z"
                          ></path>
                        </svg>
                        <span>Continue with Microsoft</span>
                      </button>
                    </div>
                  </>
                </UnauthenticatedTemplate>
              </div>
            </Card>
          </Form>
        )}
      </Formik>
    </Flowbite>
  );

  return content;
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useLoginMutation,
  useSendLogoutMutation,
  useVerify2FALoginMutation,
} from "../../redux/feature/auth/authApiSlice";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet-async";
import { jwtDecode } from "jwt-decode";
import LoadingButton from "@mui/lab/LoadingButton";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { setUuid } from "../../redux/feature/users/userSlice";
import { useFindUserByUuidMutation } from "../../redux/feature/users/userApiSlice";
import LogoComponent from "../../components/LogoComponent";
import TranslateComponent from "../../components/TranslateComponent";
import SettingComponent from "../../components/SettingComponent";
import useTranslate from "../../hook/useTranslate";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toggleEye, setToggleEye] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [step, setStep] = useState(1);
  const { t } = useTranslate();

  const [
    findUserByUuid,
    { isSuccess: isFindUserByUuidSuccess, isLoading: isFindUserByUuidLoading },
  ] = useFindUserByUuidMutation();
  const [login, { isSuccess, isLoading }] = useLoginMutation();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
  }, [open]);
  const closeAlert = () => {
    setErrorMessage(null);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const [
    verify2FALogin,
    {
      isLoading: isVerify2FALoading,
      isSuccess: isVerify2FASuccess,
      isError: isVerify2FaError,
    },
  ] = useVerify2FALoginMutation();

  const [
    sendLogout,
    { isSuccess: isLogoutSuccess, isLoading: isLoadingLogout, isError, error },
  ] = useSendLogoutMutation();

  const handleLogout = () => sendLogout();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required(t("required")),
    password: Yup.string().required(t("noPasswordProvided")),
  });

  const validationSchemaForVerifyForm = Yup.object().shape({
    code: Yup.string()
      .matches(/^[0-9]{6}$/, "Code must be a 6 digit number")
      .required(t("required")),
  });

  useEffect(() => {
    if (isVerify2FASuccess) {
      navigate("/dash");
    }
  }, [isVerify2FASuccess]);

  useEffect(() => {
    if (isVerify2FaError) {
      toast.error("Verification failed", {
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
  }, [isVerify2FaError]);

  const handleSubmiteVerifyCode = async (values) => {
    try {
      console.log(values);
      const { code } = values;
      await verify2FALogin({ code, token });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const { accessToken } = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      const decoded = jwtDecode(accessToken);
      const { jti: email, scope, uuid, isEnabledTwoFA } = decoded;
      const roles = scope ? scope.split(" ") : [];

      if (isEnabledTwoFA) {
        setStep(2);
        setToken(accessToken);
        handleLogout();
        resetForm({ values: { code: "" } });
      } else {
        dispatch(setUuid(uuid));
        navigate("/dash");
        dispatch(setUuid(uuid));
      }

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
    } catch (error) {
      console.log(error);
      if (error.status === "FETCH_ERROR") {
        setErrorMessage("Something went wrong!");
        setOpen(true);
      } else if (error.status === 400) {
        setErrorMessage("Email or Password is incorrect.");
        setOpen(true);
      } else if (error.status === 404) {
        setErrorMessage("Email or Password is incorrect.");
        setOpen(true);
      } else if (error.status === 401) {
        setErrorMessage("Email or Password is incorrect.");
        setOpen(true);
      } else {
        setErrorMessage(error?.data?.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      {step === 1 ? (
        <Box
          component="div"
          sx={{
            bgcolor: "background.default",
            color: "text.primary",
            height: "100%",
          }}
        >
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, touched, errors, handleChange, handleBlur }) => (
              <Form>
                <nav className="fixed top-0 left-0 w-full">
                  <div className="flex justify-between items-center xxs:flex-nowrap flex-wrap">
                    <LogoComponent />
                    <div className="pr-[20px] flex gap-[16px]  items-center">
                      <TranslateComponent />
                      <SettingComponent />
                    </div>
                  </div>
                </nav>
                <section className="flex h-screen">
                  <div className="h-screen shrink-0 w-[480px] hidden lg:block bg-[#f5f5f5]">
                    <div className="px-[20px] h-full text-center flex justify-center items-center flex-col">
                      <Typography
                        variant="h1"
                        
                        sx={{ fontWeight: "500", mb: 2, fontSize: "28px" }}
                      >
                        {t("welcomeBack")}
                      </Typography>
                      <Typography variant="h2" sx={{ mb: 2, fontSize:"18px" }}>
                        {t("readyToTakeControlOfYourParkingSpaces")}
                      </Typography>
                      <img src="/images/login_image.png" alt="login_image" />
                    </div>
                  </div>
                  <Box
                    sx={{
                      width: "100%",
                      px: "20px",
                      py: 15,
                    }}
                    className="flex flex-col justify-start items-center lg:justify-center"
                  >
                    <Box className="max-w-[500px]">
                      <Typography variant="h6" sx={{ mb: "40px" }}>
                        {t("login-to-your-account")}
                      </Typography>

                      {open && (
                        <Alert
                          sx={{ mb: 2, borderRadius: "6px" }}
                          severity="error"
                        >
                          {errorMessage}
                        </Alert>
                      )}

                      <TextField
                        label={t("email")}
                        variant="outlined"
                        sx={{
                          "& .MuiInputBase-input": {
                            boxShadow: "none",
                          },
                          borderRadius: "6px",
                          mb: 2,
                        }}
                        type="email"
                        id="email"
                        name="email"
                        autoFocus
                        fullWidth
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                        error={errors.email && touched.email}
                        helperText={
                          errors.email && touched.email ? errors.email : null
                        }
                        size="medium"
                      />

                      <FormControl
                        sx={{ width: "100%", mb: 2 }}
                        variant="outlined"
                        size="medium"
                        error={errors.password && touched.password}
                      >
                        <InputLabel htmlFor="password">
                          {t("password")}
                        </InputLabel>
                        <OutlinedInput
                          sx={{
                            "& .MuiInputBase-input": {
                              boxShadow: "none",
                            },
                            borderRadius: "6px",
                          }}
                          id="password"
                          name="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          value={values.password}
                          type={showPassword ? "text" : "password"}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={
                                  showPassword
                                    ? "hide the password"
                                    : "display the password"
                                }
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                onMouseUp={handleMouseUpPassword}
                                edge="end"
                              >
                                {showPassword ? <IoEye /> : <IoEyeOff />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                        />
                        <FormHelperText>
                          {errors.password && touched.password
                            ? errors.password
                            : null}
                        </FormHelperText>
                      </FormControl>

                      <FormControlLabel
                        sx={{ mb: 2 }}
                        control={
                          <Checkbox
                            sx={{ py: 0 }}
                            onChange={(event) => {
                              localStorage.setItem(
                                "isRemember",
                                event.target.checked.toString()
                              );
                            }}
                            disableRipple
                          />
                        }
                        label={t("rememberMe")}
                      />

                      <LoadingButton
                        variant="contained"
                        size="large"
                        sx={{
                          textTransform: "none",
                          borderRadius: "6px",
                          mb: 2,
                        }}
                        loading={isLoading || isFindUserByUuidLoading}
                        type="submit"
                        loadingIndicator="Logging..."
                        className="w-full "
                      >
                        {t("login")}
                      </LoadingButton>
                      <Button
                        variant="outlined"
                        sx={{ textTransform: "none", borderRadius: "6px" }}
                        fullWidth
                        onClick={() =>
                          (window.location.href = `${
                            import.meta.env.VITE_API_BACKEND_URL
                          }/oauth2/authorization/azure`)
                        }
                      >
                        <svg
                          width="30px"
                          height="30px"
                          viewBox="0 0 16 16"
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-5"
                          fill="none"
                        >
                          <path fill="#F35325" d="M1 1h6.5v6.5H1V1z" />
                          <path fill="#81BC06" d="M8.5 1H15v6.5H8.5V1z" />
                          <path fill="#05A6F0" d="M1 8.5h6.5V15H1V8.5z" />
                          <path fill="#FFBA08" d="M8.5 8.5H15V15H8.5V8.5z" />
                        </svg>
                        <span className="text-gray-800 dark:text-gray-50">
                          {t("loginWithMicrosoft")}
                        </span>
                      </Button>
                    </Box>
                  </Box>
                </section>
              </Form>
            )}
          </Formik>
        </Box>
      ) : (
        <Formik
          initialValues={{ code: "" }}
          validationSchema={validationSchemaForVerifyForm}
          onSubmit={handleSubmiteVerifyCode}
        >
          {({ values, touched, errors, handleChange, handleBlur }) => (
            <Form className="grid grid-cols-12 md:grid-cols-1 grid-flow-row justify-center items-center min-h-screen gap-10">
              <section className="md:hidden col-start-2 col-end-6">
                <img src="/images/login.svg" alt="login_image" />
              </section>
              <hr className="w-1 h-[30rem] bg-primary col-span-1 mx-auto md:hidden" />
              <Card
                sx={{ maxWidth: "100%" }}
                className="col-start-7 col-end-12 md:col-span-12"
              >
                <CardContent>
                  <div className="flex gap-5 items-center justify-start mb-3">
                    <div className="col-span-2 row-span-2">
                      <img
                        src="/images/logo.png"
                        alt="logo"
                        width={50}
                        height={50}
                      />
                    </div>
                    <Grid2 container>
                      <Grid2
                        size={12}
                        className="font-semibold subpixel-antialiased tracking-wide text-nowrap text-clamp truncate col-span-10"
                      >
                        ប្រព័ន្ធចតរថយន្តឆ្លាតវៃ
                      </Grid2>
                      <Grid2
                        size={12}
                        className="subpixel-antialiased text-nowrap text-clampSmall col-start-3 col-end-13 row-start-2 truncate"
                      >
                        Smart Parking System
                      </Grid2>
                    </Grid2>
                  </div>

                  <div className="flex flex-col gap-5">
                    <TextField
                      label="Verificaiton Code"
                      variant="outlined"
                      sx={{
                        "& .MuiInputBase-input": {
                          boxShadow: "none",
                        },
                      }}
                      type="text"
                      id="code"
                      name="code"
                      // autoFocus
                      fullWidth
                      value={values.code}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                      error={errors.code && touched.code}
                      helperText={
                        errors.code && touched.code ? errors.code : null
                      }
                      size="medium"
                    />

                    <LoadingButton
                      variant="contained"
                      size="large"
                      sx={{
                        textTransform: "none",
                      }}
                      loading={isVerify2FALoading}
                      type="submit"
                      className="bg-primary w-full hover:bg-primary-hover"
                    >
                      Verify
                    </LoadingButton>
                  </div>
                </CardContent>
              </Card>
            </Form>
          )}
        </Formik>
      )}
    </>
  );

  return content;
}

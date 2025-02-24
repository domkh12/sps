import {
  Card,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { cardStyle } from "../../assets/style";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { IoEye, IoEyeOff } from "react-icons/io5";
import useTranslate from "../../hook/useTranslate";
import ButtonComponent from "../../components/ButtonComponent";
import {
  useChangePasswordMutation,
  useDisableTwoFaMutation,
  useSendLogoutMutation,
} from "../../redux/feature/auth/authApiSlice";
import {
  setCaptionSnackBar,
  setErrorSnackbar,
  setIsOpenSnackBar,
} from "../../redux/feature/actions/actionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectIsTwoFAEnabled,
  setIsOpenTwoFaPopOver,
} from "../../redux/feature/auth/authSlice";
import { useGet2faStatusMutation } from "../../redux/feature/users/userApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import TwoFaVerifyComponent from "../../components/TwoFaVerifyComponent";

function Security() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const [
    sendLogout,
    { isSuccess: isSuccessLogout, isError: isErrorLogout, error: errorLogout },
  ] = useSendLogoutMutation();
  const isTwoFaEnabled = useSelector(selectIsTwoFAEnabled);

  const [get2faStatus, { isLoading: isLoadingGet2faStatus }] =
    useGet2faStatusMutation();

  const [disableTwoFa, { isSuccess: isDisableTwoFaSuccess }] =
    useDisableTwoFaMutation();

  const fetch2FAStatus = async () => {
    try {
      await get2faStatus();
    } catch (error) {
      console.error("Error fetching 2FA status:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const promises = [];

        promises.push(get2faStatus());

        await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
  const [
    changePassword,
    {
      isSuccess: isSuccessChangePassword,
      isLoading: isLoadingChangePassword,
      isError: isErrorChangePassword,
      error: errorChangePassword,
    },
  ] = useChangePasswordMutation();

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current Password is Required"),
    newPassword: Yup.string().required("New Password is Required"),
    confirmNewPassword: Yup.string()
      .required("Confirm New Password is Required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const handleBtnDisable2FAClick = async () => {
    try {
      await disableTwoFa();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isSuccessLogout) {
      navigate("/login");
    }
  }, [isSuccessLogout, navigate]);

  useEffect(() => {
    if (isDisableTwoFaSuccess) {
      fetch2FAStatus();
    }
  }, [isDisableTwoFaSuccess]);

  useEffect(() => {
    if (isSuccessChangePassword) {
      dispatch(setIsOpenSnackBar(true));
      dispatch(setCaptionSnackBar(t("createSuccess")));
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);
      setTimeout(() => {
        sendLogout();
      }, 5000);
    }
  }, [isSuccessChangePassword, dispatch, sendLogout, navigate]);

  useEffect(() => {
    if (isErrorChangePassword) {
      dispatch(setIsOpenSnackBar(true));
      dispatch(setErrorSnackbar(true));
      dispatch(
        setCaptionSnackBar(`${errorChangePassword?.data?.error?.description}`)
      );
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);

      setTimeout(() => {
        dispatch(setErrorSnackbar(false));
      }, 3500);
    }
  }, [isErrorChangePassword, dispatch]);

  const handleSubmitChangePassword = async (
    values,
    { setSubmitting, setFieldError }
  ) => {
    try {
      await changePassword({
        old_password: values.currentPassword,
        new_password: values.newPassword,
      }).unwrap();
    } catch (error) {
      if (error?.status === 400) {
        // Set error for currentPassword field
        setFieldError("currentPassword", t("incorrectCurrentPassword"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  let content;

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (!isLoading) {
    content = (
      <div className="grid grid-cols-1 gap-5">
        <Card
          sx={{ ...cardStyle, padding: "24px" }}
          className="flex-auto w-full"
        >
          <Typography variant="body1" component="div" className="pb-[25px]">
            {t("changePassword")}
          </Typography>
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmitChangePassword}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              setFieldValue,
            }) => {
              return (
                <Form>
                  <div className="grid grid-cols-1 gap-5">
                    <FormControl
                      sx={{ width: "100%" }}
                      variant="outlined"
                      size="medium"
                      error={errors.currentPassword && touched.currentPassword}
                    >
                      <InputLabel htmlFor="currentPassword">
                        {t("currentPassword")}
                      </InputLabel>
                      <OutlinedInput
                        sx={{
                          "& .MuiInputBase-input": {
                            boxShadow: "none",
                          },
                          borderRadius: "6px",
                        }}
                        id="currentPassword"
                        name="currentPassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                        value={values.currentPassword}
                        type={showCurrentPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showCurrentPassword
                                  ? "hide the password"
                                  : "display the password"
                              }
                              onClick={() =>
                                setShowCurrentPassword((show) => !show)
                              }
                              onMouseDown={(event) => {
                                event.preventDefault();
                              }}
                              onMouseUp={(event) => {
                                event.preventDefault();
                              }}
                              edge="end"
                            >
                              {showCurrentPassword ? <IoEye /> : <IoEyeOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Current Password"
                      />
                      <FormHelperText>
                        {errors.currentPassword && touched.currentPassword
                          ? errors.currentPassword
                          : null}
                      </FormHelperText>
                    </FormControl>

                    <FormControl
                      sx={{ width: "100%" }}
                      variant="outlined"
                      size="medium"
                      error={errors.newPassword && touched.newPassword}
                    >
                      <InputLabel htmlFor="newPassword">
                        {t("newPassword")}
                      </InputLabel>
                      <OutlinedInput
                        sx={{
                          "& .MuiInputBase-input": {
                            boxShadow: "none",
                          },
                          borderRadius: "6px",
                        }}
                        id="newPassword"
                        name="newPassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                        value={values.newPassword}
                        type={showNewPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showNewPassword
                                  ? "hide the password"
                                  : "display the password"
                              }
                              onClick={() =>
                                setShowNewPassword((show) => !show)
                              }
                              onMouseDown={(event) => {
                                event.preventDefault();
                              }}
                              onMouseUp={(event) => {
                                event.preventDefault();
                              }}
                              edge="end"
                            >
                              {showNewPassword ? <IoEye /> : <IoEyeOff />}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="New Password"
                      />
                      <FormHelperText>
                        {errors.newPassword && touched.newPassword
                          ? errors.newPassword
                          : null}
                      </FormHelperText>
                    </FormControl>

                    <FormControl
                      sx={{ width: "100%" }}
                      variant="outlined"
                      size="medium"
                      error={
                        errors.confirmNewPassword && touched.confirmNewPassword
                      }
                    >
                      <InputLabel htmlFor="confirmNewPassword">
                        {t("confirmNewPassword")}
                      </InputLabel>
                      <OutlinedInput
                        sx={{
                          "& .MuiInputBase-input": {
                            boxShadow: "none",
                          },
                          borderRadius: "6px",
                        }}
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        autoComplete="off"
                        value={values.confirmNewPassword}
                        type={showConfirmNewPassword ? "text" : "password"}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={
                                showConfirmNewPassword
                                  ? "hide the password"
                                  : "display the password"
                              }
                              onClick={() =>
                                setShowConfirmNewPassword((show) => !show)
                              }
                              onMouseDown={(event) => {
                                event.preventDefault();
                              }}
                              onMouseUp={(event) => {
                                event.preventDefault();
                              }}
                              edge="end"
                            >
                              {showConfirmNewPassword ? (
                                <IoEye />
                              ) : (
                                <IoEyeOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Confirm New Password"
                      />
                      <FormHelperText>
                        {errors.confirmNewPassword && touched.confirmNewPassword
                          ? errors.confirmNewPassword
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <div className="col-span-2 flex justify-end mt-[20px]">
                    <ButtonComponent
                      btnTitle={t("changePassword")}
                      type={"submit"}
                      isLoading={isLoadingChangePassword}
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Card>

        <Card
          sx={{ ...cardStyle, padding: "24px" }}
          className="flex-auto w-full"
        >
          <Typography variant="body1" component="div" className="pb-[25px]">
            {t("tfa")}
          </Typography>
          <div className="border p-5 rounded-[10px] gap-5 flex flex-col">
            {isTwoFaEnabled ? (
              <div className="flex justify-start items-center text-green-500 gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <p>On</p>
              </div>
            ) : (
              <div className="flex justify-start items-center text-red-500 gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <p>Off</p>
              </div>
            )}

            <div className="flex justify-start flex-col items-start gap-2">
              <p>Authenticator app</p>
              <p>
                Use an authenticator app to generate one time security codes.
              </p>
            </div>
            {isTwoFaEnabled ? (
              <div className="flex justify-end mt-[20px]">
                <ButtonComponent
                  btnTitle={t("disable")}
                  backgroundColor="#ff0000"
                  hoverBackgroundColor="#ff0000"
                  isLoading={isLoadingChangePassword}
                  onClick={handleBtnDisable2FAClick}
                />
              </div>
            ) : (
              <div className="flex justify-end mt-[20px]">
                <ButtonComponent
                  btnTitle={t("set_up_authentication")}
                  isLoading={isLoadingChangePassword}
                  onClick={() => dispatch(setIsOpenTwoFaPopOver(true))}
                />
              </div>
            )}
          </div>
        </Card>

        <Card
          sx={{ ...cardStyle, padding: "24px" }}
          className="flex-auto w-full"
        >
          <Typography variant="body1" component="div" className="pb-[25px]">
            {t("login_history")}
          </Typography>
          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            }}
            // validationSchema={validationSchema}
            // onSubmit={handleSubmitChangePassword}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              setFieldValue,
            }) => {
              return <Form></Form>;
            }}
          </Formik>
        </Card>
        <TwoFaVerifyComponent onVerificationSuccess={fetch2FAStatus} />
      </div>
    );
  }

  return content;
}

export default Security;

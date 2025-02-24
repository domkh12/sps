import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useTranslate from "../../hook/useTranslate";
import { Form, Formik } from "formik";
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import TranslateComponent from "../../components/TranslateComponent";
import SettingComponent from "../../components/SettingComponent";
import SeoComponent from "../../components/SeoComponent";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { LoadingButton } from "@mui/lab";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useResetPassswordMutation } from "../../redux/feature/auth/authApiSlice";
import LogoComponent from "../../components/LogoComponent";
import * as Yup from "yup";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const { t } = useTranslate();
  const navigate = useNavigate();

  const [resetPasssword, { isSuccess, isLoading }] =
    useResetPassswordMutation();

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[\W_]/, "Password must contain at least one special character")
      .required("Password is required"),
  });

  useEffect(() => {
    if (isSuccess) {
      navigate("/login", { replace: true });
    }
  }, [isSuccess]);

  const handleSubmit = async (values) => {
    console.log("values", values)
    try {
      const token = searchParams.get("token");
      await resetPasssword({ token, newPassword: values.newPassword });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  let content;
  
  content = (
    <>
      <SeoComponent title="Forgot Password" />
      <nav className="fixed top-0 left-0 w-full bg-white bg-opacity-5 lg:bg-opacity-0 z-20 backdrop-blur-3xl lg:backdrop-blur-0">
        <div className="flex justify-between items-center xxs:flex-nowrap flex-wrap">
          <LogoComponent />
          <div className="pr-[20px] flex gap-[16px]  items-center">
            <TranslateComponent />
            <SettingComponent />
          </div>
        </div>
      </nav>

      <Box
        component="div"
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          height: "100%",
        }}
      >
        <Formik
          initialValues={{ newPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, touched, errors, handleChange, handleBlur }) => (
            <Form>
              <section className="flex h-screen">
                <div className="h-screen shrink-0 w-[480px] hidden lg:block bg-[#f5f5f5]">
                  <div className="px-[20px] h-full text-center flex justify-center items-center flex-col">
                    <img
                      src="/images/login_image.png"
                      alt="login_image"
                      className="w-full h-auto"
                    />
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
                  <div className="xs:min-w-[500px] max-w-[450px] flex flex-col gap-7">
                    <Typography variant="h6" className="text-center">
                      Forgot your password?
                    </Typography>
                    <Typography variant="body1" className="text-center">
                      Please enter the email address associated with your
                      account and we'll email you a link to reset your password.
                    </Typography>
                    {open && (
                      <Alert
                        sx={{ mb: 2, borderRadius: "6px" }}
                        severity="error"
                      >
                        {errorMessage}
                      </Alert>
                    )}
                    <FormControl
                      sx={{ width: "100%", mb: 2, mt: 1 }}
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
                        fullWidth                        
                        value={values.newPassword}
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
                        {errors.newPassword && touched.newPassword
                          ? errors.newPassword
                          : null}
                      </FormHelperText>
                    </FormControl>
                    <LoadingButton
                      variant="contained"
                      size="large"
                      sx={{
                        textTransform: "none",
                        borderRadius: "6px",                        
                        mb: 2,
                      }}
                      loading={isLoading}
                      type="submit"
                      className="w-full "
                    >
                      Send request
                    </LoadingButton>
                    <div className="flex justify-center items-center hover:underline">
                      <Link
                        to="/login"
                        className="flex justify-center items-center gap-2"
                      >
                        <MdKeyboardArrowLeft className="w-5 h-5" />
                        Return to login
                      </Link>
                    </div>
                  </div>
                </Box>
              </section>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
  return content;
}

export default ResetPassword;

import React, { useEffect, useState } from "react";
import SeoComponent from "../../components/SeoComponent";
import LogoComponent from "../../components/LogoComponent";
import TranslateComponent from "../../components/TranslateComponent";
import SettingComponent from "../../components/SettingComponent";
import { Alert, Box, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { LoadingButton } from "@mui/lab";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardArrowLeft } from "react-icons/md";
import useTranslate from "../../hook/useTranslate";
import { useForgotPasswordMutation } from "../../redux/feature/auth/authApiSlice";
import * as Yup from "yup";

function ForgotPassword() {
  const [message, setMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t("emailNotValid")).required(t("required")),
  });
  const [forgotPassword, { isSuccess, isLoading, isError, error }] =
    useForgotPasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      setOpen(true);
      setMessage(t("passwordResetLinkSent"));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setOpen(true);
      setMessage(error?.data?.error?.description);
    }
  }, [isError]);

  const handleSubmit = async (email) => {
    try {
      console.log("values", email);
      await forgotPassword(email);
    } catch (error) {
      console.log("error", error);
    }
  };
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
          initialValues={{ email: "" }}
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
                  <div className="xs:min-w-[500px] max-w-[450px] flex flex-col items-center gap-7">
                    <img
                      src="/images/lock.svg"
                      alt="branch_image"
                      className="w-20 h-auto"
                    />
                    <Typography variant="h6" className="text-center">
                      {t("forgotYourPassword")}
                    </Typography>
                    <Typography variant="body1" className="text-center">
                      {t("forgotPasswordDescription")}
                    </Typography>
                    <div className="w-full">
                      {open && (
                        <Alert
                          sx={{ mb: 2, borderRadius: "6px" }}
                          severity={isError ? "error" : "success"}
                        >
                          {message}
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
                    </div>
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
                      {t("sendRequest")}
                    </LoadingButton>
                    <div className="flex justify-center items-center hover:underline">
                      <Link
                        to="/login"
                        className="flex justify-center items-center gap-2"
                      >
                        <MdKeyboardArrowLeft className="w-5 h-5" />
                        {t("returnToLogin")}
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

export default ForgotPassword;

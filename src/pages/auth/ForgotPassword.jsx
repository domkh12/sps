import {useEffect} from "react";
import SeoComponent from "../../components/SeoComponent";
import LogoComponent from "../../components/LogoComponent";
import TranslateComponent from "../../components/TranslateComponent";
import SettingComponent from "../../components/SettingComponent";
import {Box, Paper, Stack, TextField, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import {LoadingButton} from "@mui/lab";
import {Link} from "react-router-dom";
import {MdKeyboardArrowLeft} from "react-icons/md";
import useTranslate from "../../hook/useTranslate";
import {useForgotPasswordMutation} from "../../redux/feature/auth/authApiSlice";
import * as Yup from "yup";
import {Slide, toast} from "react-toastify";

function ForgotPassword() {
    const {t} = useTranslate();
    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t("emailNotValid")).required(t("required")),
    });
    const [forgotPassword, {isSuccess, isLoading, isError, error}] =
        useForgotPasswordMutation();

    useEffect(() => {
        if (isError) {
            toast.error(`${error?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [error?.data?.error?.description, isError]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(t("passwordResetLinkSent"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isSuccess, t]);

    const handleSubmit = async (email) => {
        try {
            await forgotPassword(email);
        } catch (error) {
            console.log("error", error);
        }
    };
    let content;
    content = (
        <>
            <SeoComponent title="Forgot Password"/>
            <nav
                className="fixed top-0 left-0 w-full bg-white bg-opacity-5 lg:bg-opacity-0 z-20 backdrop-blur-3xl lg:backdrop-blur-0">
                <div className="flex justify-between items-center xxs:flex-nowrap flex-wrap">
                    <LogoComponent/>
                    <div className="pr-[20px] flex gap-[16px]  items-center">
                        <TranslateComponent/>
                        <SettingComponent/>
                    </div>
                </div>
            </nav>

            <Paper
                elevation={0}
                component="div"
                sx={{
                    color: "text.primary",
                    height: "100%",

                }}
            >
                <Formik
                    initialValues={{email: ""}}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({values, touched, errors, handleChange, handleBlur}) => (
                        <Form>
                            <section className="h-screen">
                                <Stack direction="row" sx={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    maxWidth: "1280px",
                                    margin: "0 auto"
                                }}>
                                    <Paper
                                        className="h-screen shrink-0 w-[480px] hidden lg:flex bg-[#f5f5f5] justify-center items-center">
                                        <Paper
                                            className="px-[20px] h-full text-center flex justify-center items-center flex-col">
                                            <img
                                                src="/images/login_image.png"
                                                alt="login_image"
                                                className="w-full h-auto"
                                            />
                                        </Paper>
                                    </Paper>
                                    <Paper
                                        sx={{
                                            width: "100%",
                                            px: "20px",
                                            py: 15,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Paper sx={{
                                            maxWidth: "500px",
                                            width: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "16px"
                                        }}>
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
                                                    <MdKeyboardArrowLeft className="w-5 h-5"/>
                                                    {t("returnToLogin")}
                                                </Link>
                                            </div>
                                        </Paper>
                                    </Paper>
                                </Stack>
                            </section>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </>
    );
    return content;
}

export default ForgotPassword;

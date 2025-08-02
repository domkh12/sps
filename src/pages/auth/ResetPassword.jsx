import {useEffect, useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import useTranslate from "../../hook/useTranslate";
import {Form, Formik} from "formik";
import {
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Paper,
    Stack,
    Typography,
    Box,
} from "@mui/material";
import TranslateComponent from "../../components/TranslateComponent";
import SettingComponent from "../../components/SettingComponent";
import SeoComponent from "../../components/SeoComponent";
import {IoEye, IoEyeOff, IoLockClosed} from "react-icons/io5";
import {LoadingButton} from "@mui/lab";
import {MdKeyboardArrowLeft} from "react-icons/md";
import {useResetPassswordMutation} from "../../redux/feature/auth/authApiSlice";
import LogoComponent from "../../components/LogoComponent";
import * as Yup from "yup";
import {Slide, toast} from "react-toastify";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {t} = useTranslate();
    const navigate = useNavigate();

    const [resetPassword, {
        isSuccess,
        isLoading,
        isError,
        error
    }] = useResetPassswordMutation();

    const validationSchema = Yup.object().shape({
        newPassword: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter")
            .matches(/[0-9]/, "Password must contain at least one number")
            .matches(/[\W_]/, "Password must contain at least one special character")
            .required(t("passwordIsRequired")),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], t("passwordsMustMatch"))
            .required(t("confirmPasswordIsRequired")),
    });

    useEffect(() => {
        if (isSuccess) {
            navigate("/login", {replace: true});
            toast.success(t("resetPasswordSuccess") || "Password reset successfully! Please login with your new password.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isSuccess, navigate, t]);

    useEffect(() => {
        if (isError) {
            toast.error(`${error?.data?.error?.description || "Something went wrong. Please try again."}`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [error?.data?.error?.description, isError]);

    const handleSubmit = async (values) => {
        try {
            const token = searchParams.get("token");
            await resetPassword({token, newPassword: values.newPassword});
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

    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpConfirmPassword = (event) => {
        event.preventDefault();
    };
    const handleClickShowConfirmPassword = () =>
        setShowConfirmPassword((show) => !show);

    let content;

    content = (
        <>
            <SeoComponent title="Reset Password - Create New Password"/>
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
                    initialValues={{newPassword: "", confirmPassword: ""}}
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
                                                alt="Password reset illustration"
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
                                            gap: "24px"
                                        }}>
                                            {/* Icon and Header Section */}
                                            <Box sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: "16px",
                                                textAlign: "center"
                                            }}>
                                                <Box sx={{
                                                    width: "64px",
                                                    height: "64px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "primary.main",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "white"
                                                }}>
                                                    <IoLockClosed size={32} />
                                                </Box>

                                                <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                                                    {t("createNewPassword")}
                                                </Typography>

                                                <Typography variant="body1" sx={{
                                                    color: "text.secondary",
                                                    lineHeight: 1.6,
                                                    maxWidth: "400px"
                                                }}>
                                                    {t('resetPasswordDescription')}
                                                </Typography>
                                            </Box>

                                            {/* Form Fields */}
                                            <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
                                                <FormControl
                                                    sx={{width: "100%"}}
                                                    variant="outlined"
                                                    size="medium"
                                                    error={errors.newPassword && touched.newPassword}
                                                >
                                                    <InputLabel htmlFor="newPassword">
                                                        {t("newPassword") || "New Password"}
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        sx={{
                                                            "& .MuiInputBase-input": {
                                                                boxShadow: "none",
                                                            },
                                                            borderRadius: "8px",
                                                        }}
                                                        id="newPassword"
                                                        name="newPassword"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        autoComplete="new-password"
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
                                                                    {showPassword ? <IoEye/> : <IoEyeOff/>}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        label="New Password"
                                                    />
                                                    <FormHelperText>
                                                        {errors.newPassword && touched.newPassword
                                                            ? errors.newPassword
                                                            : ""}
                                                    </FormHelperText>
                                                </FormControl>

                                                <FormControl
                                                    sx={{width: "100%"}}
                                                    variant="outlined"
                                                    size="medium"
                                                    error={errors.confirmPassword && touched.confirmPassword}
                                                >
                                                    <InputLabel htmlFor="confirmPassword">
                                                        {t("confirmPassword") || "Confirm New Password"}
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        sx={{
                                                            "& .MuiInputBase-input": {
                                                                boxShadow: "none",
                                                            },
                                                            borderRadius: "8px",
                                                        }}
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        autoComplete="new-password"
                                                        fullWidth
                                                        value={values.confirmPassword}
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    aria-label={
                                                                        showConfirmPassword
                                                                            ? "hide the password"
                                                                            : "display the password"
                                                                    }
                                                                    onClick={handleClickShowConfirmPassword}
                                                                    onMouseDown={handleMouseDownConfirmPassword}
                                                                    onMouseUp={handleMouseUpConfirmPassword}
                                                                    edge="end"
                                                                >
                                                                    {showConfirmPassword ? <IoEye/> : <IoEyeOff/>}
                                                                </IconButton>
                                                            </InputAdornment>
                                                        }
                                                        label="Confirm New Password"
                                                    />
                                                    <FormHelperText>
                                                        {errors.confirmPassword && touched.confirmPassword
                                                            ? errors.confirmPassword
                                                            : ""}
                                                    </FormHelperText>
                                                </FormControl>
                                            </Box>

                                            {/* Submit Button */}
                                            <LoadingButton
                                                variant="contained"
                                                size="large"
                                                sx={{
                                                    textTransform: "none",
                                                    borderRadius: "8px",
                                                    py: "12px",
                                                    fontSize: "16px",
                                                    fontWeight: 600,
                                                    width: "100%"
                                                }}
                                                loading={isLoading}
                                                type="submit"
                                                disabled={isLoading}
                                            >
                                                {t('updatePassword')}
                                            </LoadingButton>

                                            {/* Back to Login Link */}
                                            <Box sx={{ mt: 2 }}>
                                                <Link
                                                    to="/login"
                                                    className="flex justify-center items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                                                    style={{ textDecoration: "none" }}
                                                >
                                                    <MdKeyboardArrowLeft className="w-5 h-5"/>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {t('returnToLogin')}
                                                    </Typography>
                                                </Link>
                                            </Box>
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

export default ResetPassword;
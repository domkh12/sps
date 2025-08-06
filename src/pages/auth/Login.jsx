import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {
    useLoginMutation,
    useVerify2FALoginMutation,
} from "../../redux/feature/auth/authApiSlice";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {jwtDecode} from "jwt-decode";
import LoadingButton from "@mui/lab/LoadingButton";
import {MdKeyboardArrowLeft} from "react-icons/md";

import {
    Alert,
    Box,
    Divider,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput, Paper, Stack,
    TextField,
    Typography,
} from "@mui/material";
import {IoEye, IoEyeOff} from "react-icons/io5";
import LogoComponent from "../../components/LogoComponent";
import TranslateComponent from "../../components/TranslateComponent";
import SettingComponent from "../../components/SettingComponent";
import useTranslate from "../../hook/useTranslate";
import usePersist from "../../hook/usePersist";
import {ROLES} from "../../config/roles";
import SeoComponent from "../../components/SeoComponent";
import useLocalStorage from "../../hook/useLocalStorage.jsx";
import OTPInput from "react-otp-input";
import {Slide, toast} from "react-toastify";

export default function Login() {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [verifyCodeErrorMessage, setVerifyCodeErrorMessage] = useState(null);
    const [openErrorVerifyCode, setOpenErrorVerifyCode] = useState(false);
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [persist, setPersist] = usePersist();
    const {t} = useTranslate();
    const [email, setEmail] = useState("");
    const [login, {isSuccess, isLoading}] = useLoginMutation();
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [
        verify2FALogin,
        {
            isLoading: isVerify2FALoading,
            isSuccess: isSuccessVerify2Fa,
            isError: isErrorVerify2Fa,
            error: errorVerify2Fa,
        },
    ] = useVerify2FALoginMutation();

    useEffect(() => {
        if (isErrorVerify2Fa){
            toast.error(`${errorVerify2Fa?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorVerify2Fa]);

    useEffect(() => {
        if (isSuccessVerify2Fa) {
            toast.success(`${t("verifyCodeSuccess")}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isSuccessVerify2Fa]);


    const [authData, setAuthData] = useLocalStorage('authData', {
        isRemember: false,
        userRoles: "",
        uuid: null,
        siteUuid: null
    });

    const saveLoginInfo = (roles, uuid, siteUuid = null) => {
        setAuthData({
            isRemember: true,
            userRoles: roles[0],
            uuid,
            siteUuid
        });
    };

    useEffect(() => {
        const checkRememberedLogin = () => {
            if (authData.isRemember && authData.userRoles !== "") {
                if (authData.userRoles === "ROLE_ADMIN") {
                    navigate("/admin");
                } else if (authData.userRoles === "ROLE_MANAGER") {
                    navigate("/dash");
                }
            }
        };
        checkRememberedLogin();
    }, []);

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                setOpen(false);
            }, 5000);
        } else if (openErrorVerifyCode) {
            setTimeout(() => {
                setOpenErrorVerifyCode(false);
            }, 5000);
        }
    }, [open, openErrorVerifyCode]);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email(t("emailNotValid")).required(t("required")),
        password: Yup.string().required(t("noPasswordProvided")),
    });

    useEffect(() => {
        const verifyOTP = async () => {
            if (otp.length === 6) {
                try {
                    const res = await verify2FALogin({
                        code: otp,
                        email: email
                    });
                    const accessToken = res?.data?.accessToken;
                    if (!accessToken) {
                        return;
                    }
                    const decoded = jwtDecode(accessToken);
                    const {scope} = decoded;
                    if (scope === "ROLE_ADMIN") {
                        navigate("/admin");
                    }else if (scope === "ROLE_MANAGER") {
                        navigate("/dash");
                    }
                } catch (error) {
                    console.error('2FA verification failed:', error);
                }
            }
        };
        verifyOTP();
    }, [otp, email]);

    const handleSubmit = async (values, {setSubmitting, resetForm}) => {
        try {
            setEmail(values.email);
            setPersist(true);
            const {accessToken, required2FA} = await login({
                email: values.email,
                password: values.password,
            }).unwrap();

            if (required2FA) {
                setStep(2);
                setEmail(values.email);
                resetForm({values: {code: ""}});
                localStorage.setItem("isRemember", "true");
            } else {
                const decoded = jwtDecode(accessToken);
                const {jti: email, scope, uuid, siteUuid} = decoded;

                const roles = scope ? scope.split(" ") : [];
                if (roles.includes(ROLES.ROLE_MANAGER)) {
                    try {
                        saveLoginInfo(roles, uuid);
                        navigate("/dash");
                    } catch (err) {
                        console.log(err);
                    }
                } else if (roles.includes(ROLES.ROLE_ADMIN)) {
                    try {
                        navigate("/admin");
                        saveLoginInfo(roles, uuid, siteUuid);
                    } catch (err) {
                        console.log(err);
                    }
                }
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

    let content;

    if (step === 1) {
        content = (
            <>
                <SeoComponent title="Login"/>
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
                        initialValues={{email: "", password: ""}}
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
                                            <Paper sx={{maxWidth: "500px", width: "100%"}}>
                                                <Typography variant="h6"
                                                            sx={{fontWeight: 600, color: "text.primary", mb: "40px"}}>
                                                    {t("login-to-your-account")}
                                                </Typography>
                                                {open && (
                                                    <Alert
                                                        sx={{mb: 2, borderRadius: "6px"}}
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
                                                <div className="flex justify-end">
                                                    <Link
                                                        to={"/forgot-password"}
                                                        className="text-sm hover:underline text-right"
                                                    >
                                                        {t('forgotPassword')}
                                                    </Link>
                                                </div>
                                                <FormControl
                                                    sx={{width: "100%", mb: 2, mt: 1}}
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
                                                        autoComplete="new-password"
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
                                                                    {showPassword ? <IoEye/> : <IoEyeOff/>}
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
                                                    loadingIndicator="Logging..."
                                                    className="w-full "
                                                >
                                                    {t("login")}
                                                </LoadingButton>{" "}
                                                <Divider>OR</Divider>
                                                <Box sx={{display: "flex", justifyContent: "center", width: "100%"}}>
                                                    <IconButton
                                                        size="small"
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
                                                            fill="none"
                                                            className="m-1"
                                                        >
                                                            <path fill="#F35325" d="M1 1h6.5v6.5H1V1z"/>
                                                            <path fill="#81BC06" d="M8.5 1H15v6.5H8.5V1z"/>
                                                            <path fill="#05A6F0" d="M1 8.5h6.5V15H1V8.5z"/>
                                                            <path fill="#FFBA08" d="M8.5 8.5H15V15H8.5V8.5z"/>
                                                        </svg>
                                                    </IconButton>
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
    } else if (step === 2) {
        content = (
            <>
                <SeoComponent title="Login"/>
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
                        initialValues={{email: "", password: ""}}
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
                                            <Paper sx={{maxWidth: "500px", width: "100%"}}>
                                                <Box  sx={{
                                                    width: "100%",
                                                    height: 80,
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}>
                                                <img
                                                    src="/images/email.svg"
                                                    alt="branch_image"
                                                    className="w-20 h-auto"
                                                />
                                                </Box>
                                                <Typography variant="h6" sx={{
                                                    fontWeight: 600,
                                                    color: "text.primary",
                                                    mb: 1,
                                                    textAlign: "center"
                                                }}>
                                                    Two-Factor Authentication
                                                </Typography>

                                                <Typography variant="body1"
                                                   sx={{
                                                    color: "text.secondary",
                                                    mb: 4,
                                                    textAlign: "center",
                                                    lineHeight: 1.6
                                                }}>
                                                    Open your authenticator app and enter the 6-digit verification code
                                                    to complete your secure login.
                                                </Typography>
                                                <div>
                                                    <div className="flex justify-center items-center">
                                                        <OTPInput
                                                            value={otp}
                                                            onChange={setOtp}
                                                            numInputs={6}
                                                            renderSeparator={<span className="hidden sm:inline mx-1 text-gray-400">-</span>} // Hide separators on mobile
                                                            inputType="tel"
                                                            renderInput={(props) => <input {...props} />}
                                                            containerStyle={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                gap: '0.25rem',
                                                                maxWidth: '100%',
                                                                overflow: 'hidden'
                                                            }}
                                                            inputStyle={{
                                                                width: 'min(12vw, 2.5rem)', // More aggressive responsive sizing
                                                                height: 'min(12vw, 2.5rem)',
                                                                fontSize: 'min(4vw, 1.5rem)',
                                                                borderRadius: 4,
                                                                border: "1px solid #ccc",
                                                                textAlign: 'center',
                                                                margin: 0
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <LoadingButton
                                                    variant="contained"
                                                    size="large"
                                                    sx={{
                                                        my: 2,
                                                    }}
                                                    loading={isVerify2FALoading}
                                                    type="submit"
                                                    className="w-full "
                                                >
                                                    Verify
                                                </LoadingButton>
                                                <div
                                                    className="flex justify-center items-center hover:underline cursor-pointer">
                                                    <a
                                                        onClick={() => setStep(1)}
                                                        className="flex justify-center items-center gap-2"
                                                    >
                                                        <MdKeyboardArrowLeft className="w-5 h-5"/>
                                                        {t("returnToLogin")}
                                                    </a>
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
    }

    return content;
}

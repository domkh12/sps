import {
    Card,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    Typography,
} from "@mui/material";
import {useEffect, useState} from "react";
import {cardStyle} from "../../assets/style";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {IoEye, IoEyeOff} from "react-icons/io5";
import useTranslate from "../../hook/useTranslate";
import ButtonComponent from "../../components/ButtonComponent";
import {
    useChangePasswordMutation,
    useDisableTwoFaMutation, useGetUserProfileQuery,
    useSendLogoutMutation,
} from "../../redux/feature/auth/authApiSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
    selectIsTwoFAEnabled,
    setIsOpenTwoFaPopOver,
} from "../../redux/feature/auth/authSlice";
import {useGet2faStatusQuery} from "../../redux/feature/users/userApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import TwoFaVerifyComponent from "../../components/TwoFaVerifyComponent";
import {useGetClientInfoQuery} from "../../redux/feature/clientInfo/clientInfoApiSlice.js";
import DataNotFound from "../../components/DataNotFound.jsx";
import ClientInfoRowComponent from "../../components/ClientInfoRowComponent.jsx";
import {setPageNoClientInfo, setPageSizeClientInfo} from "../../redux/feature/clientInfo/clientInfoSlice.js";
import {Slide, toast} from "react-toastify";

function Security() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const pageNo = useSelector((state) => state.clientInfo.pageNo);
    const pageSize = useSelector((state) => state.clientInfo.pageSize);
    const {data: user} = useGetUserProfileQuery("userProfile");
    const {t} = useTranslate();
    const dispatch = useDispatch();

    const [
        sendLogout,
        {isSuccess: isSuccessLogout, isError: isErrorLogout, error: errorLogout},
    ] = useSendLogoutMutation();

    const {data: twoFaStatus, isSuccess: isTwoFaStatusSuccess, isLoading: isLoadingTwoFaStatus} =
        useGet2faStatusQuery();

    const [disableTwoFa, {isSuccess: isDisableTwoFaSuccess}] =
        useDisableTwoFaMutation();


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

    const {
        data: clientInfoData,
        isSuccess: isSuccessClientInfo,
        isLoading: isLoadingClientInfo,
        isError: isErrorClientInfo,
        error: errorClientInfo
    } = useGetClientInfoQuery({
        userId: user?.id,
        pageNo,
        pageSize
    });

    console.log({clientInfoData})
    const handleChangePage = (event, newPage) => {
        dispatch(setPageNoClientInfo(newPage + 1));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setPageSizeClientInfo(event.target.value));
        dispatch(setPageNoClientInfo(1));
    };

    const columns = [
        {id: "loginType", label: t("loginType"), minWidth: 230, align: "left"},
        {id: "ipAddress", label: t("ipAddress"), minWidth: 230, align: "left"},
        {id: "userAgent", label: t("userAgent"), minWidth: 230, align: "left"},
    ];

    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string().required(t("currentPasswordIsRequired")),
        newPassword: Yup.string().required(t('newPasswordIsRequired')),
        confirmNewPassword: Yup.string()
            .required(t('confirmPasswordIsRequired'))
            .oneOf([Yup.ref("newPassword"), null], t('confirmPasswordMustMatch')),
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
        if (isSuccessChangePassword) {
            toast.success(t("changePasswordSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isSuccessChangePassword, dispatch, sendLogout, navigate]);

    useEffect(() => {
        if (isErrorChangePassword) {
            toast.error(`${errorChangePassword?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorChangePassword, dispatch]);

    const handleSubmitChangePassword = async (
        values,
        {setSubmitting, setFieldError}
    ) => {
        try {
            await changePassword({
                old_password: values.currentPassword,
                new_password: values.newPassword,
            }).unwrap();
        } catch (error) {
            if (error?.status === 400) {
                setFieldError("currentPassword", t("incorrectCurrentPassword"));
            }
        } finally {
            setSubmitting(false);
        }
    };

    let content;

    if (isLoadingTwoFaStatus || isLoadingClientInfo) content = <LoadingFetchingDataComponent/>;

    if (isTwoFaStatusSuccess && isSuccessClientInfo) {

        const {ids, entities, totalElements, pageSize, pageNo} = clientInfoData;

        const tableContent =
            <>
                {ids?.length ? (
                    ids?.map((id) => (
                        <ClientInfoRowComponent key={id} clientInfo={entities[id]}/>))
                ) : (
                    <TableRow sx={{bgcolor: "#f9fafb"}}>
                        <TableCell align="center" colSpan={8}>
                            <DataNotFound/>
                        </TableCell>
                    </TableRow>
                )}
            </>

        content = (
            <div className="grid grid-cols-1 gap-5">
                <Card
                    sx={{...cardStyle, padding: "24px"}}
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
                                            sx={{width: "100%"}}
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
                                                            {showCurrentPassword ? <IoEye/> : <IoEyeOff/>}
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
                                            sx={{width: "100%"}}
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
                                                            {showNewPassword ? <IoEye/> : <IoEyeOff/>}
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
                                            sx={{width: "100%"}}
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
                                                                <IoEye/>
                                                            ) : (
                                                                <IoEyeOff/>
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
                    sx={{...cardStyle, padding: "24px"}}
                    className="flex-auto w-full"
                >
                    <Typography variant="body1" component="div" className="pb-[25px]">
                        {t("tfa")}
                    </Typography>
                    <div className="border p-5 rounded-[10px] gap-5 flex flex-col">
                        {twoFaStatus?.is2faEnabled ? (
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
                        {twoFaStatus?.is2faEnabled ? (
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
                    sx={{...cardStyle, padding: "24px"}}
                    className="flex-auto w-full"
                >
                    <Typography variant="body1" component="div" className="pb-[25px]">
                        {t("login_history")}
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead sx={{backgroundColor: "#F4F6F8"}}>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{minWidth: column.minWidth, color: "gray"}}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{border: "none"}}>
                                {tableContent}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalElements || 0}
                        rowsPerPage={pageSize}
                        labelRowsPerPage={t('rowPerPage')}
                        page={pageNo}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
                <TwoFaVerifyComponent />
            </div>
        );
    }

    return content;
}

export default Security;

import {useDispatch, useSelector} from "react-redux";
import useTranslate from "../hook/useTranslate.jsx";
import {
    useGetLicensePlateProvinceByUuidQuery, useUpdateLicensePlateProvinceMutation
} from "../redux/feature/licensePlateProvince/licensePlateProvinceApiSlice.js";
import {useEffect} from "react";
import * as Yup from "yup";
import {toast, Slide} from "react-toastify";
import {
    setIsOpenQuickEditLicensePlateProvince, setUuidForQuickEditLicensePlateProvinceForDelete,
    setUuidLicensePlateProvinceForDelete
} from "../redux/feature/licensePlateProvince/licensePlateProvinceSlice.js";
import {Backdrop, Box, Button, CircularProgress, Modal, TextField, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import {setIsOpenConfirmDelete} from "../redux/feature/actions/actionSlice.js";
import {LoadingButton} from "@mui/lab";

function QuickEditLicensePlateProvinceComponent() {
    const isQuickEditLicensePlateProvinceOpen = useSelector((state) => state.licensePlateProvince.isOpenQuickEditLicensePlateProvince);
    const uuidLicensePlateProvince = useSelector((state) => state.licensePlateProvince.uuidForQuickEditLicensePlateProvince);
    const { t } = useTranslate();
    const dispatch = useDispatch();

    const {data: licensePlateProvinceData, 
        isLoading: isLoadingLicensePlateProvince,
        isSuccess: isSuccessLicensePlateProvince,
        refetch: refetchLicensePlateProvince,
    } = useGetLicensePlateProvinceByUuidQuery({uuid: uuidLicensePlateProvince});

    useEffect(() => {
        if (!isQuickEditLicensePlateProvinceOpen) return;
        refetchLicensePlateProvince();
    },[refetchLicensePlateProvince, uuidLicensePlateProvince])
    
    const [
        updateLicensePlateProvince,
        {
            isSuccess: isSuccessUpdateLicensePlateProvince,
            isLoading: isLoadingUpdateLicensePlateProvince,
            isError: isErrorUpdateLicensePlateProvince,
            error: errorUpdateLicensePlateProvince,
        },
    ] = useUpdateLicensePlateProvinceMutation();

    const validationSchema = Yup.object().shape({
        provinceNameEn: Yup.string()
                            .required(t("licensePlateProvinceNameEnRequired"))
                            .matches(/^[A-Za-z\s]+$/, t("licensePlateProvinceNameEnEnglishOnly")),
        provinceNameKh: Yup.string()
                            .required(t("licensePlateProvinceNameKhRequired"))
                            .matches(/^[\u1780-\u17FF\s]+$/, t("licensePlateProvinceNameKhKhmerOnly")),
    });

    useEffect(() => {
        if (isSuccessUpdateLicensePlateProvince) {
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            dispatch(setIsOpenQuickEditLicensePlateProvince(false))
        }
    }, [isSuccessUpdateLicensePlateProvince]);

    useEffect(() => {
        if (isErrorUpdateLicensePlateProvince){
            toast.error(`${errorUpdateLicensePlateProvince?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorUpdateLicensePlateProvince]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await updateLicensePlateProvince({
                uuid: licensePlateProvinceData.uuid,
                provinceNameEn: values.provinceNameEn,
                provinceNameKh: values.provinceNameKh,
            });
        } catch (error) {
            console.error("Error creating company type:", error);
        } finally {
            setSubmitting(false);
        }
    };

    let content;

    if (isLoadingLicensePlateProvince) {
        content = (
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={isQuickEditLicensePlateProvinceOpen}
                onClick={() => dispatch(setIsOpenQuickEditLicensePlateProvince(false))}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        )
    }

    if (isSuccessLicensePlateProvince) {
        content = (
            <Modal
                open={isQuickEditLicensePlateProvinceOpen}
                onClose={() => dispatch(setIsOpenQuickEditLicensePlateProvince(false))}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
            >
                <Box>
                    <Box
                        sx={{
                            backgroundColor: "background.paper",
                            borderRadius: "16px",
                            width: "95%",
                            maxWidth: "720px",
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            overflow: "auto",
                            maxHeight: "90vh",
                            boxShadow: "0px 10px 15px -3px rgb(0 0 0 / 20%), 0px 4px 6px -2px rgb(0 0 0 / 15%)",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{padding: "24px"}}
                        >
                            {t('quickUpdate')}
                        </Typography>
                        <Box>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    provinceNameEn: licensePlateProvinceData?.provinceNameEn,
                                    provinceNameKh: licensePlateProvinceData?.provinceNameKh,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({
                                      values, touched, errors, handleChange, handleBlur, setFieldValue,
                                  }) => {

                                    return (<Form>

                                            <Box className="grid grid-cols-1 gap-5 px-[24px]">
                                                <TextField
                                                    label={t("licensePlateProvinceNameEn")}
                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiInputBase-input": {
                                                            boxShadow: "none",
                                                        },
                                                        borderRadius: "6px",
                                                    }}
                                                    type="text"
                                                    id="provinceNameEn"
                                                    name="provinceNameEn"
                                                    value={values.provinceNameEn}
                                                    onChange={handleChange}
                                                    error={errors.provinceNameEn && touched.provinceNameEn}
                                                    helperText={errors.provinceNameEn && touched.provinceNameEn ? errors.provinceNameEn : null}
                                                    size="medium"
                                                />

                                                <TextField
                                                    label={t("licensePlateProvinceNameKh")}
                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiInputBase-input": {
                                                            boxShadow: "none",
                                                        },
                                                        borderRadius: "6px",
                                                    }}
                                                    type="text"
                                                    id="provinceNameKh"
                                                    name="provinceNameKh"
                                                    value={values.provinceNameKh}
                                                    onChange={handleChange}
                                                    error={errors.provinceNameKh && touched.provinceNameKh}
                                                    helperText={errors.provinceNameKh && touched.provinceNameKh ? errors.provinceNameKh : null}
                                                    size="medium"
                                                />
                                        </Box>
                                        <Box
                                            sx={{
                                                padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    dispatch(setIsOpenConfirmDelete(true));
                                                    dispatch(setUuidLicensePlateProvinceForDelete(licensePlateProvinceData.uuid));
                                                }}
                                                color="error"
                                            >
                                                {t('delete')}
                                            </Button>
                                            <div>
                                                <Button
                                                    onClick={() => dispatch(setIsOpenQuickEditLicensePlateProvince(false))}
                                                    variant="outlined"
                                                >
                                                    {t('cancel')}
                                                </Button>
                                                <LoadingButton
                                                    loading={isLoadingUpdateLicensePlateProvince}
                                                    variant="contained"
                                                    sx={{ml: 1}}
                                                    type="submit"
                                                >
                                                    {t('update')}
                                                </LoadingButton>
                                            </div>                                            
                                        </Box>
                                    </Form>);
                                }}
                            </Formik>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        )
    }


    return content;
}

export default QuickEditLicensePlateProvinceComponent
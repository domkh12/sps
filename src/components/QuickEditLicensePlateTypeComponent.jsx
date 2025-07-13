import {useDispatch, useSelector} from "react-redux";
import useTranslate from "../hook/useTranslate.jsx";
import {
    useGetLicensePlateTypeByUuidQuery,
    useUpdateLicensePlateTypeMutation
} from "../redux/feature/licensePlateType/licensePlateTypeApiSlice.js";
import {useEffect} from "react";
import * as Yup from "yup";
import {toast, Slide} from "react-toastify";
import {
    setIsOpenQuickEditLicensePlateType,
    setUuidLicensePlateTypeForDelete
} from "../redux/feature/licensePlateType/licensePlateTypeSlice.js";
import {Backdrop, Box, Button, CircularProgress, Modal, TextField, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import {setIsOpenConfirmDelete} from "../redux/feature/actions/actionSlice.js";
import {LoadingButton} from "@mui/lab";

function QuickEditLicensePlateTypeComponent() {
    const isQuickEditLicensePlateTypeOpen = useSelector((state) => state.licensePlateType.isOpenQuickEditLicensePlateType);
    const uuidLicensePlateType = useSelector((state) => state.licensePlateType.uuidForQuickEditLicensePlateType);
    const { t } = useTranslate();
    const dispatch = useDispatch();

    const {data: licensePlateTypeData, 
        isLoading: isLoadingLicensePlateType,
        isSuccess: isSuccessLicensePlateType,
        refetch: refetchLicensePlateType,
    } = useGetLicensePlateTypeByUuidQuery({uuid: uuidLicensePlateType});

    useEffect(() => {
        if (!isQuickEditLicensePlateTypeOpen) return;
        refetchLicensePlateType();
    },[refetchLicensePlateType, uuidLicensePlateType])
    
    const [
        updateLicensePlateType,
        {
            isSuccess: isSuccessUpdateLicensePlateType,
            isLoading: isLoadingUpdateLicensePlateType,
            isError: isErrorUpdateLicensePlateType,
            error: errorUpdateLicensePlateType,
        },
    ] = useUpdateLicensePlateTypeMutation();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t("licensePlateTypeNameRequired"))
    });

    useEffect(() => {
        if (isSuccessUpdateLicensePlateType) {
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            dispatch(setIsOpenQuickEditLicensePlateType(false))
        }
    }, [isSuccessUpdateLicensePlateType]);

    useEffect(() => {
        if (isErrorUpdateLicensePlateType){
            toast.error(`${errorUpdateLicensePlateType?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorUpdateLicensePlateType]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await updateLicensePlateType({
                uuid: licensePlateTypeData.uuid,
                name: values.name,
            });
        } catch (error) {
            console.error("Error creating company type:", error);
        } finally {
            setSubmitting(false);
        }
    };

    let content;

    if (isLoadingLicensePlateType) {
        content = (
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={isQuickEditLicensePlateTypeOpen}
                onClick={() => dispatch(setIsOpenQuickEditLicensePlateType(false))}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        )
    }

    if (isSuccessLicensePlateType) {
        content = (
            <Modal
                open={isQuickEditLicensePlateTypeOpen}
                onClose={() => dispatch(setIsOpenQuickEditLicensePlateType(false))}
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
                                    name: licensePlateTypeData?.name,
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
                                                    label={t("licensePlateTypeName")}
                                                    variant="outlined"
                                                    sx={{
                                                        "& .MuiInputBase-input": {
                                                            boxShadow: "none",
                                                        },
                                                        borderRadius: "6px",
                                                    }}
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    error={errors.name && touched.name}
                                                    helperText={errors.name && touched.name ? errors.name : null}
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
                                                    dispatch(setUuidLicensePlateTypeForDelete(licensePlateTypeData.uuid));
                                                }}
                                                color="error"
                                            >
                                                {t('delete')}
                                            </Button>
                                            <div>
                                                <Button
                                                    onClick={() => dispatch(setIsOpenQuickEditLicensePlateType(false))}
                                                    variant="outlined"
                                                >
                                                    {t('cancel')}
                                                </Button>
                                                <LoadingButton
                                                    loading={isLoadingUpdateLicensePlateType}
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

export default QuickEditLicensePlateTypeComponent
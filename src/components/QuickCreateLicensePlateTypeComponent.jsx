import { useDispatch, useSelector } from "react-redux";
import useTranslate from "../hook/useTranslate";
import {useCreateLicensePlateTypeMutation} from "../redux/feature/licensePlateType/licensePlateTypeApiSlice.js";
import * as Yup from "yup";
import {useEffect} from "react";
import {toast, Slide} from "react-toastify";
import {setIsOpenQuickCreateLicensePlateType} from "../redux/feature/licensePlateType/licensePlateTypeSlice.js";
import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import {LoadingButton} from "@mui/lab";

function QuickCreateLicensePlateTypeComponent() {
    const isOpenCreateLicensePlateType = useSelector((state) => state.licensePlateType.isOpenQuickCreateLicensePlateType);
    const { t } = useTranslate();
    const dispatch = useDispatch();
    
    const [
        createLicensePlateType,
        {
            isSuccess: isSuccessCreateLicensePlateType,
            isLoading: isLoadingCreateLicensePlateType,
            isError: isErrorCreateLicensePlateType,
            error: errorCreateLicensePlateType,
        },
    ] = useCreateLicensePlateTypeMutation();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t("licensePlateTypeNameRequired"))
    });

    useEffect(() => {
        if (isSuccessCreateLicensePlateType) {
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            dispatch(setIsOpenQuickCreateLicensePlateType(false))
        }
    }, [isSuccessCreateLicensePlateType]);

    useEffect(() => {
        if (isErrorCreateLicensePlateType){
            toast.error(`${errorCreateLicensePlateType?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorCreateLicensePlateType]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await createLicensePlateType({            
                name: values.name,
            });
        } catch (error) {
            console.error("Error creating license plate type:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return(
            <Modal
                open={isOpenCreateLicensePlateType}
                onClose={() => dispatch(setIsOpenQuickCreateLicensePlateType(false))}
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
                            {t('quickCreate')}
                        </Typography>
                        <Box>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    name: "",
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
                                                padding: "24px", display: "flex", justifyContent: "end", alignItems: "center", width: "100%"
                                            }}
                                        >
                                            <div>
                                                <Button
                                                    onClick={() => dispatch(setIsOpenQuickCreateLicensePlateType(false))}
                                                    variant="outlined"
                                                >
                                                    {t('cancel')}
                                                </Button>
                                                <LoadingButton
                                                    loading={isLoadingCreateLicensePlateType}
                                                    variant="contained"
                                                    sx={{ml: 1}}
                                                    type="submit"
                                                >
                                                    {t('create')}
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

export default QuickCreateLicensePlateTypeComponent
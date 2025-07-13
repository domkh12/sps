import { useDispatch, useSelector } from "react-redux";
import useTranslate from "../hook/useTranslate";
import { useCreateCompanyTypeMutation } from "../redux/feature/companyType/CompanyTypeApiSlice";
import * as Yup from "yup";
import { useEffect } from "react";
import { setIsOpenQuickCreateCompanyType } from "../redux/feature/companyType/companyTypeSlice";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { LoadingButton } from "@mui/lab";
import { buttonStyleContained, buttonStyleOutlined } from "../assets/style";
import { toast, Slide } from "react-toastify";

function QuickCreateCompanyTypeComponent() {
    const isOpenCreateCompanyType = useSelector((state) => state.companyType.isOpenQuickCreateCompanyType);
    const { t } = useTranslate();
    const dispatch = useDispatch();
    
    const [
        createCompanyType,
        {
            isSuccess: isSuccessCreateCompanyType,
            isLoading: isLoadingCreateCompanyType,
            isError: isErrorCreateCompanyType,
            error: errorCreateCompanyType,
        },
    ] = useCreateCompanyTypeMutation();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t("companyTypeNameRequired")),
    });

    useEffect(() => {
        if (isSuccessCreateCompanyType) {
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            dispatch(setIsOpenQuickCreateCompanyType(false))
        }
    }, [isSuccessCreateCompanyType]);

    useEffect(() => {
        if (isErrorCreateCompanyType){
            toast.error(`${errorCreateCompanyType?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorCreateCompanyType]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await createCompanyType({            
                name: values.name,
            });
        } catch (error) {
            console.error("Error creating company type:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return(
            <Modal
                open={isOpenCreateCompanyType}
                onClose={() => dispatch(setIsOpenQuickCreateCompanyType(false))}
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
                                                label={t("companyTypeName")}
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
                                                    onClick={() => dispatch(setIsOpenQuickCreateCompanyType(false))}
                                                    sx={{
                                                        ...buttonStyleOutlined,
                                                    }}
                                                >
                                                    {t('cancel')}
                                                </Button>
                                                <LoadingButton
                                                    loading={isLoadingCreateCompanyType}
                                                    variant="contained"
                                                    sx={{...buttonStyleContained, ml: 1}}
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

export default QuickCreateCompanyTypeComponent
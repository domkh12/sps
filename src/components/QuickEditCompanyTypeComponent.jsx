import { useDispatch, useSelector } from "react-redux";
import useTranslate from "../hook/useTranslate";
import { toast, Slide } from "react-toastify";
import { useGetCompanyTypeByUuidQuery, useUpdateCompanyTypeMutation } from "../redux/feature/companyType/CompanyTypeApiSlice";
import * as Yup from "yup";
import { useEffect } from "react";
import { setIsOpenQuickEditCompanyType, setUuidForQuickEditCompanyTypeForDelete } from "../redux/feature/companyType/companyTypeSlice";
import { Backdrop, Box, Button, CircularProgress, Modal, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { LoadingButton } from "@mui/lab";
import { buttonStyleContained, buttonStyleOutlined } from "../assets/style";
import { setIsOpenConfirmDelete } from "../redux/feature/actions/actionSlice";

function QuickEditCompanyTypeComponent() {
    const isQuickEditCompanyTypeOpen = useSelector((state) => state.companyType.isOpenQuickEditCompanyType);
    const uuidCompanyType = useSelector((state) => state.companyType.uuidForQuickEditCompanyType);
    const { t } = useTranslate();
    const dispatch = useDispatch();

    const {data: companyTypeData, 
        isLoading: isLoadingCompanyType,
        isSuccess: isSuccessCompanyType,
        refetch: refetchCompanyType,
    } = useGetCompanyTypeByUuidQuery({uuid: uuidCompanyType});

    useEffect(() => {
        if (!isQuickEditCompanyTypeOpen) return;
        refetchCompanyType();
    },[refetchCompanyType, uuidCompanyType])
    
    const [
        updateCompanyType,
        {
            isSuccess: isSuccessUpdateCompanyType,
            isLoading: isLoadingUpdateCompanyType,
            isError: isErrorUpdateCompanyType,
            error: errorUpdateCompanyType,
        },
    ] = useUpdateCompanyTypeMutation();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t("companyTypeNameRequired")),
    });

    useEffect(() => {
        if (isSuccessUpdateCompanyType) {
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            dispatch(setIsOpenQuickEditCompanyType(false))
        }
    }, [isSuccessUpdateCompanyType]);

    useEffect(() => {
        if (isErrorUpdateCompanyType){
            toast.error(`${errorUpdateCompanyType?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorUpdateCompanyType]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await updateCompanyType({
                uuid: companyTypeData.uuid,
                name: values.name,
            });
        } catch (error) {
            console.error("Error creating company type:", error);
        } finally {
            setSubmitting(false);
        }
    };

    let content;

    if (isLoadingCompanyType) {
        content = (
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={isQuickEditCompanyTypeOpen}
                onClick={() => dispatch(setIsOpenQuickEditCompanyType(false))}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        )
    }

    if (isSuccessCompanyType) {
        content = (
            <Modal
                open={isQuickEditCompanyTypeOpen}
                onClose={() => dispatch(setIsOpenQuickEditCompanyType(false))}
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
                                    name: companyTypeData?.name,
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
                                                padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    dispatch(setIsOpenConfirmDelete(true));
                                                    dispatch(setUuidForQuickEditCompanyTypeForDelete(companyTypeData.uuid));
                                                }}
                                                color="error"
                                            >
                                                {t('delete')}
                                            </Button>
                                            <div>
                                                <Button
                                                    onClick={() => dispatch(setIsOpenQuickEditCompanyType(false))}
                                                    sx={{
                                                        ...buttonStyleOutlined,
                                                    }}
                                                >
                                                    {t('cancel')}
                                                </Button>
                                                <LoadingButton
                                                    loading={isLoadingUpdateCompanyType}
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


    return content;
}

export default QuickEditCompanyTypeComponent
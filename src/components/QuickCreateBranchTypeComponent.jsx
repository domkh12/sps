import {useDispatch, useSelector} from "react-redux";
import useTranslate from "../hook/useTranslate.jsx";
import {useCreateBranchTypeMutation} from "../redux/feature/siteType/siteTypeApiSlice.js";
import * as Yup from "yup";
import {useEffect} from "react";
import {toast, Slide} from "react-toastify";
import {setIsOpenQuickCreateBranchType} from "../redux/feature/siteType/siteTypeSlice.js";
import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import {buttonStyleContained, buttonStyleOutlined} from "../assets/style.js";
import {LoadingButton} from "@mui/lab";

function QuickCreateBranchTypeComponent() {
    const isOpenCreateBranchType = useSelector((state) => state.siteType.isOpenQuickCreateBranchType);
    const { t } = useTranslate();
    const dispatch = useDispatch();
    
    const [
        createBranchType,
        {
            isSuccess: isSuccessCreateBranchType,
            isLoading: isLoadingCreateBranchType,
            isError: isErrorCreateBranchType,
            error: errorCreateBranchType,
        },
    ] = useCreateBranchTypeMutation();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t("branchTypeNameRequired")),
    });

    useEffect(() => {
        if (isSuccessCreateBranchType) {
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            dispatch(setIsOpenQuickCreateBranchType(false))
        }
    }, [isSuccessCreateBranchType]);

    useEffect(() => {
        if (isErrorCreateBranchType){
            toast.error(`${errorCreateBranchType?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorCreateBranchType]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await createBranchType({            
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
                open={isOpenCreateBranchType}
                onClose={() => dispatch(setIsOpenQuickCreateBranchType(false))}
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
                                                label={t("branchTypeName")}
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
                                                    onClick={() => dispatch(setIsOpenQuickCreateBranchType(false))}
                                                    variant="outlined"
                                                >
                                                    {t('cancel')}
                                                </Button>
                                                <LoadingButton
                                                    loading={isLoadingCreateBranchType}
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

export default QuickCreateBranchTypeComponent
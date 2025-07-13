import {useDispatch, useSelector} from "react-redux";
import useTranslate from "../hook/useTranslate.jsx";
import {useCreateGenderMutation} from "../redux/feature/gender/genderApiSlice.js";
import * as Yup from "yup";
import {useEffect} from "react";
import {Slide, toast} from "react-toastify";
import {setIsOpenQuickCreateGender} from "../redux/feature/gender/genderSlice.js";
import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import {LoadingButton} from "@mui/lab";

function QuickCreateGenderComponent(){
    const isOpenCreateGender = useSelector((state) => state.gender.isOpenQuickCreateGender);
    const { t } = useTranslate();
    const dispatch = useDispatch();

    const [
        createGender,
        {
            isSuccess: isSuccessCreateGender,
            isLoading: isLoadingCreateGender,
            isError: isErrorCreateGender,
            error: errorCreateGender,
        },
    ] = useCreateGenderMutation();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t("genderNameRequired"))
    });

    useEffect(() => {
        if (isSuccessCreateGender) {
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            dispatch(setIsOpenQuickCreateGender(false))
        }
    }, [isSuccessCreateGender]);

    useEffect(() => {
        if (isErrorCreateGender){
            toast.error(`${errorCreateGender?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorCreateGender]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await createGender({
                gender: values.name,
            });
        } catch (error) {
            console.error("Error creating license plate type:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return(
        <Modal
            open={isOpenCreateGender}
            onClose={() => dispatch(setIsOpenQuickCreateGender(false))}
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
                                            label={t("genderName")}
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
                                                onClick={() => dispatch(setIsOpenQuickCreateGender(false))}
                                                variant="outlined"
                                            >
                                                {t('cancel')}
                                            </Button>
                                            <LoadingButton
                                                loading={isLoadingCreateGender}
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

export default QuickCreateGenderComponent;
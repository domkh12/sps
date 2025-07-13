import { useDispatch, useSelector } from "react-redux";
import useTranslate from "../hook/useTranslate";
import {useGetCityByUuidQuery, useUpdateCityMutation} from "../redux/feature/city/cityApiSlice.js";
import {useEffect} from "react";
import * as Yup from "yup";
import {toast, Slide} from "react-toastify";
import {setIsOpenQuickEditCity, setUuidCityForDelete} from "../redux/feature/city/citySlice.js";
import {Backdrop, Box, Button, CircularProgress, Modal, TextField, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import {setIsOpenConfirmDelete} from "../redux/feature/actions/actionSlice.js";
import {buttonStyleContained, buttonStyleOutlined} from "../assets/style.js";
import {LoadingButton} from "@mui/lab";

function QuickEditCityComponent() {
    const isQuickEditCityOpen = useSelector((state) => state.city.isOpenQuickEditCity);
    const uuidCity = useSelector((state) => state.city.uuidForQuickEditCity);
    const { t } = useTranslate();
    const dispatch = useDispatch();

    const {data: cityData, 
        isLoading: isLoadingCity,
        isSuccess: isSuccessCity,
        refetch: refetchCity,
    } = useGetCityByUuidQuery({uuid: uuidCity});

    useEffect(() => {
        if (!isQuickEditCityOpen) return;
        refetchCity();
    },[refetchCity, uuidCity])
    
    const [
        updateCity,
        {
            isSuccess: isSuccessUpdateCity,
            isLoading: isLoadingUpdateCity,
            isError: isErrorUpdateCity,
            error: errorUpdateCity,
        },
    ] = useUpdateCityMutation();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t("cityNameRequired")),
    });

    useEffect(() => {
        if (isSuccessUpdateCity) {
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            dispatch(setIsOpenQuickEditCity(false))
        }
    }, [isSuccessUpdateCity]);

    useEffect(() => {
        if (isErrorUpdateCity){
            toast.error(`${errorUpdateCity?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorUpdateCity]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await updateCity({
                uuid: cityData.uuid,
                name: values.name,
            });
        } catch (error) {
            console.error("Error creating company type:", error);
        } finally {
            setSubmitting(false);
        }
    };

    let content;

    if (isLoadingCity) {
        content = (
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={isQuickEditCityOpen}
                onClick={() => dispatch(setIsOpenQuickEditCity(false))}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        )
    }

    if (isSuccessCity) {
        content = (
            <Modal
                open={isQuickEditCityOpen}
                onClose={() => dispatch(setIsOpenQuickEditCity(false))}
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
                                    name: cityData?.name,
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
                                                label={t("cityName")}
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
                                                    dispatch(setUuidCityForDelete(cityData.uuid));
                                                }}
                                                color="error"
                                            >
                                                {t('delete')}
                                            </Button>
                                            <div>
                                                <Button
                                                    onClick={() => dispatch(setIsOpenQuickEditCity(false))}
                                                    sx={{
                                                        ...buttonStyleOutlined,
                                                    }}
                                                >
                                                    {t('cancel')}
                                                </Button>
                                                <LoadingButton
                                                    loading={isLoadingUpdateCity}
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

export default QuickEditCityComponent
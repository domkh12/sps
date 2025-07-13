import {buttonStyleContained, buttonStyleOutlined} from "../assets/style.js";
import {LoadingButton} from "@mui/lab";
import {Backdrop, Box, Button, CircularProgress, FormControl, Modal, TextField, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {useEffect} from "react";
import {toast, Slide} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import useTranslate from "../hook/useTranslate.jsx";
import {useUpdateCompanyMutation} from "../redux/feature/company/companyApiSlice.js";
import {setIsQuickEditCompanyOpen} from "../redux/feature/company/companySlice.js";
import dayjs from "dayjs";
import SelectSingleComponent from "./SelectSingleComponent.jsx";
import {DatePicker} from "@mui/x-date-pickers";
import {useGetAllCitiesQuery} from "../redux/feature/city/cityApiSlice.js";
import {useGetCompanyTypeQuery} from "../redux/feature/companyType/CompanyTypeApiSlice.js";
import QuickEditCompanyTypeComponent from "./QuickEditCompanyTypeComponent.jsx";
import QuickCreateCompanyTypeComponent from "./QuickCreateCompanyTypeComponent.jsx";
import QuickEditCityComponent from "./QuickEditCityComponent.jsx";
import QuickCreateCityComponent from "./QuickCreateCityComponent.jsx";
import {
    setIsOpenQuickCreateCity,
    setIsOpenQuickEditCity,
    setUuidForQuickEditCity
} from "../redux/feature/city/citySlice.js";
import {
    setIsOpenQuickCreateCompanyType,
    setIsOpenQuickEditCompanyType,
    setUuidForQuickEditCompanyType
} from "../redux/feature/companyType/companyTypeSlice.js";

function QuickEditCompanyComponent() {
    const isQuickEditCompanyOpen = useSelector((state) => state.companies.isQuickEditCompanyOpen);
    const company = useSelector((state) => state.companies.companyDataForQuickEdit);
    const { t } = useTranslate();
    const dispatch = useDispatch();
    const isQuickEditCompanyTypeOpen = useSelector((state) => state.companyType.isOpenQuickEditCompanyType);
    const isOpenCreateCompanyType = useSelector((state) => state.companyType.isOpenQuickCreateCompanyType);
    const isOpenCreateCity = useSelector((state) => state.city.isOpenQuickCreateCity);
    const isQuickEditCityOpen = useSelector((state) => state.city.isOpenQuickEditCity);
    const {data:cityName, isSuccess: isSuccessGetCity, isLoading: isLoadingGetCity}= useGetAllCitiesQuery("citiesList");
    const {data:companyTypeData, isSuccess: isSuccessGetCompanyType, isLoading: isLoadingGetCompanyType} = useGetCompanyTypeQuery("companyTypeList");

    const [
        updateCompany,
        {
            isSuccess: isSuccessUpdateCompany,
            isLoading: isLoadingUpdateCompany,
            isError: isErrorUpdateCompany,
            error: errorUpdateCompany,
        },
    ] = useUpdateCompanyMutation();

    const validationSchema = Yup.object().shape({
        companyName: Yup.string().required(t("companyNameIsRequired")),
        companyAddress: Yup.string().required(t("companyAddressIsRequired")),
        companyTypeUuid: Yup.string().required(t("companyTypeIsRequired")),
        cityUuid: Yup.string().required(t("cityIsRequired")),
        establishedDate: Yup.string().required(t("establishedDateIsRequired")),
    });

    useEffect(() => {
        if (isSuccessUpdateCompany) {
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            dispatch(setIsQuickEditCompanyOpen(false))
        }
    }, [isSuccessUpdateCompany]);

    useEffect(() => {
        if (isErrorUpdateCompany){
            toast.error(`${errorUpdateCompany?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorUpdateCompany]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const formattedDate = dayjs(values.establishedDate).format(
                "YYYY-MM-DD"
            );
            await updateCompany({
                uuid: company.uuid,
                companyName: values.companyName,
                companyAddress: values.companyAddress,
                companyTypeUuid: values.companyTypeUuid,
                cityUuid: values.cityUuid,
                establishedDate: formattedDate,
                image: values.image,
            });
        } catch (error) {
            console.error("Error creating company:", error);
        } finally {
            setSubmitting(false);
        }
    };

    let content;

    if (isLoadingGetCompanyType || isLoadingGetCity) {
        content = (
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={true}
                onClick={dispatch(setIsQuickEditCompanyOpen(false))}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        )
    }

    if (isSuccessGetCompanyType && isSuccessGetCity) {
        content = (
            <Modal
                open={isQuickEditCompanyOpen}
                onClose={() => dispatch(setIsQuickEditCompanyOpen(false))}
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
                                initialValues={{
                                    companyName: company?.companyName,
                                    companyAddress: company?.companyAddress,
                                    companyTypeUuid: company?.companyType?.uuid || "",
                                    cityUuid: company?.city?.uuid || "",
                                    establishedDate: dayjs(company?.establishedDate),
                                    image: company?.image
                                }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({
                                      values, touched, errors, handleChange, handleBlur, setFieldValue,
                                  }) => {

                                    const errorDateOfBirth = errors.dateOfBirth && touched.dateOfBirth;

                                    const handleCityChange = (value) => {
                                        setFieldValue("cityUuid", value);
                                    };

                                    const handleCompanyTypeChange = (value) => {
                                        setFieldValue("companyTypeUuid", value);
                                    };

                                    return (<Form>

                                        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-[24px]">
                                            <TextField
                                                label={t("companyName")}
                                                variant="outlined"
                                                sx={{
                                                    "& .MuiInputBase-input": {
                                                        boxShadow: "none",
                                                    },
                                                    borderRadius: "6px",
                                                }}
                                                type="text"
                                                id="companyName"
                                                name="companyName"
                                                value={values.companyName}
                                                onChange={handleChange}
                                                error={errors.companyName && touched.companyName}
                                                helperText={errors.companyName && touched.companyName ? errors.companyName : null}
                                                size="medium"
                                            />

                                            <TextField
                                                label={t("address")}
                                                variant="outlined"
                                                sx={{
                                                    "& .MuiInputBase-input": {
                                                        boxShadow: "none",
                                                    },
                                                    borderRadius: "6px",
                                                }}
                                                type="text"
                                                id="companyAddress"
                                                name="companyAddress"
                                                fullWidth
                                                value={values.companyAddress}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                autoComplete="off"
                                                error={
                                                    errors.companyAddress && touched.companyAddress
                                                }
                                                helperText={
                                                    errors.companyAddress && touched.companyAddress
                                                        ? errors.companyAddress
                                                        : null
                                                }
                                                size="medium"
                                            />

                                            <SelectSingleComponent
                                                label={t("companyType")}
                                                options={companyTypeData}
                                                onChange={handleCompanyTypeChange}
                                                fullWidth={true}
                                                error={errors.companyTypeUuid}
                                                touched={touched.companyTypeUuid}
                                                optionLabelKey={"name"}
                                                selectFistValue={values.companyTypeUuid}
                                                isEditable={true}
                                                onClickQuickEdit={(value) => {
                                                    dispatch(setUuidForQuickEditCompanyType(value));
                                                    dispatch(setIsOpenQuickEditCompanyType(true));
                                                }}
                                                isCreate={true}
                                                onClickCreate={() => {
                                                    dispatch(setIsOpenQuickCreateCompanyType(true));
                                                }}
                                            />

                                            <SelectSingleComponent
                                                label={t("city")}
                                                options={cityName}
                                                onChange={handleCityChange}
                                                fullWidth={true}
                                                error={errors.cityUuid}
                                                touched={touched.cityUuid}
                                                optionLabelKey="name"
                                                selectFistValue={values.citiUuid}
                                                isEditable={true}
                                                onClickQuickEdit={(value) => {
                                                    dispatch(setIsOpenQuickEditCity(true));
                                                    dispatch(setUuidForQuickEditCity(value));
                                                }}
                                                isCreate={true}
                                                onClickCreate={() => {
                                                    dispatch(setIsOpenQuickCreateCity(true));
                                                }}
                                            />

                                            <FormControl
                                                sx={{ width: "100%" }}
                                                variant="outlined"
                                                size="medium"
                                            >
                                                <DatePicker
                                                    sx={{
                                                        "& .MuiInputBase-input": {
                                                            boxShadow: "none",
                                                        },
                                                        ...(errorDateOfBirth && {
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: "#f44336",
                                                                color: "white",
                                                            },
                                                        }),
                                                        "& .MuiInputLabel-root ": {
                                                            ...(errorDateOfBirth && {color: "#f44336"}),
                                                        },
                                                    }}
                                                    label={t("establishedDate")}
                                                    value={values.establishedDate}
                                                    id="establishedDate"
                                                    name="establishedDate"
                                                    onChange={(value) => {
                                                        setFieldValue("establishedDate", value);
                                                    }}
                                                    format="DD-MM-YYYY"
                                                />
                                            </FormControl>

                                        </Box>
                                        <Box
                                            sx={{
                                                padding: "24px", display: "flex", justifyContent: "end",
                                            }}
                                        >
                                            <Button
                                                onClick={() => dispatch(setIsQuickEditCompanyOpen(false))}
                                                sx={{
                                                    ...buttonStyleOutlined,
                                                }}
                                            >
                                                {t('cancel')}
                                            </Button>
                                            <LoadingButton
                                                loading={isLoadingUpdateCompany}
                                                variant="contained"
                                                sx={{...buttonStyleContained, ml: 1}}
                                                type="submit"
                                            >
                                                {t('update')}
                                            </LoadingButton>
                                        </Box>
                                    </Form>);
                                }}
                            </Formik>
                        </Box>
                    </Box>
                    {isQuickEditCompanyTypeOpen && <QuickEditCompanyTypeComponent/>}
                    {isOpenCreateCompanyType && <QuickCreateCompanyTypeComponent/>}
                    {isQuickEditCityOpen && <QuickEditCityComponent/>}
                    {isOpenCreateCity && <QuickCreateCityComponent/>}
                </Box>
            </Modal>
        )
    }


    return content;
}

export default QuickEditCompanyComponent;
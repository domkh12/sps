import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useGetAllCitiesQuery} from "../../redux/feature/city/cityApiSlice.js";
import {useGetCompanyTypeQuery} from "../../redux/feature/companyType/CompanyTypeApiSlice.js";
import useTranslate from "../../hook/useTranslate.jsx";
import {useUploadImageMutation} from "../../redux/feature/uploadImage/uploadImageApiSlice.js";
import {useCreateCompanyMutation, useUpdateCompanyMutation} from "../../redux/feature/company/companyApiSlice.js";
import {Slide, toast} from "react-toastify";
import * as Yup from "yup";
import {Card, FormControl, Grid2, TextField, Typography} from "@mui/material";
import dayjs from "dayjs";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import SeoComponent from "../../components/SeoComponent.jsx";
import MainHeaderComponent from "../../components/MainHeaderComponent.jsx";
import {Form, Formik} from "formik";
import {cardStyle} from "../../assets/style.js";
import ProfileUploadComponent from "../../components/ProfileUploadComponent.jsx";
import SelectSingleComponent from "../../components/SelectSingleComponent.jsx";
import {DatePicker} from "@mui/x-date-pickers";
import ButtonComponent from "../../components/ButtonComponent.jsx";

function EditCompanyForm({company}){
    console.log("company",company)
    const navigate = useNavigate();
    const [profileImageFile, setProfileImageFile] = useState(null);
    const {data:cityName, isSuccess: isSuccessGetCity, isLoading: isLoadingGetCity}= useGetAllCitiesQuery("citiesList");
    const {data:companyTypeData, isSuccess: isSuccessGetCompanyType, isLoading: isLoadingGetCompanyType} = useGetCompanyTypeQuery("companyTypeList");
    const { t } = useTranslate();
    const [error, setError] = useState(null);

    const [uploadImage] = useUploadImageMutation();

    const [
        updateCompany,
        {
            isSuccess: isSuccessUpdateCompany,
            isLoading: isLoadingUpdateCompany,
            isError: isErrorUpdateCompany,
            error: errorUpdateCompany,
        },
    ] = useUpdateCompanyMutation();

    useEffect(() => {
        if (isSuccessUpdateCompany) {
            navigate("/dash/companies")
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isSuccessUpdateCompany]);

    useEffect(() => {
        if (isErrorUpdateCompany) {
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


    const validationSchema = Yup.object().shape({
        companyName: Yup.string().required(t("companyNameIsRequired")),
        companyAddress: Yup.string().required(t("companyAddressIsRequired")),
        companyTypeUuid: Yup.string().required(t("companyTypeIsRequired")),
        cityUuid: Yup.string().required(t("cityIsRequired")),
        establishedDate: Yup.string().required(t("establishedDateIsRequired")),
    });

    const breadcrumbs = [
        <button
            className="text-black hover:underline"
            onClick={() => navigate("/dash")}
            key={1}
        >
            {t("dashboard")}
        </button>,
        <Typography color="inherit" key={2}>
            {t("company")}
        </Typography>,
        <Typography color="inherit" key={3}>
            {t("newcompany")}
        </Typography>,
    ];

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const formData = new FormData();
            let profileImageUri = null;
            if (profileImageFile) {
                formData.append("file", profileImageFile);
                const uploadResponse = await uploadImage(formData).unwrap();
                profileImageUri = uploadResponse.uri;
            }
            const formattedDate = dayjs(values.dateOfBirth).format(
                "YYYY-MM-DD"
            );

            await updateCompany({
                uuid: company.uuid,
                companyName: values.companyName,
                companyAddress: values.companyAddress,
                companyTypeUuid: values.companyTypeUuid,
                cityUuid: values.cityUuid,
                establishedDate: formattedDate,
                image: profileImageUri,
            });
        } catch (error) {
            console.error("Error creating company:", error);
        } finally {
            setSubmitting(false);
        }
    };

    let content;

    if (isLoadingGetCompanyType || isLoadingGetCity) content = <LoadingFetchingDataComponent />;

    if (error) content = <p>Error : {error?.message}</p>;

    if (isSuccessGetCity && isSuccessGetCompanyType) {
        content = (
            <>
                <div data-aos="fade-left">
                    <SeoComponent title={"Create a new company"} />
                    <MainHeaderComponent
                        breadcrumbs={breadcrumbs}
                        title={t("newcompany")}
                        handleBackClick={() => navigate("/dash/companies")}
                    />
                    <Formik
                        initialValues={{
                            companyName: company.companyName,
                            companyAddress: company.companyAddress,
                            companyTypeUuid: company.companyType.uuid,
                            cityUuid: company.city.uuid,
                            establishedDate: dayjs(company.establishedDate),
                            image: company.image
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({
                              values,
                              touched,
                              errors,
                              handleChange,
                              handleBlur,
                              setFieldValue,
                          }) => {
                            const errorDateOfBirth = errors.dateOfBirth && touched.dateOfBirth;

                            const handleCityChange = (value) => {
                                setFieldValue("cityUuid", value);
                            };

                            const handleCompanyTypeChange = (value) => {
                                setFieldValue("companyTypeUuid", value);
                            };

                            return (
                                <Form className="pb-8">
                                    <Grid2 container spacing={3}>
                                        <Grid2 size={{ xs: 12, md: 4 }}>
                                            <Card
                                                sx={{
                                                    ...cardStyle,
                                                }}
                                                className=" gap-5 pt-[80px] px-[24px] pb-[40px] "
                                            >
                                                <div className="flex justify-center items-center flex-col gap-5">
                                                    <ProfileUploadComponent
                                                        setProfileImageFile={setProfileImageFile}
                                                        profileImageFile={profileImageFile || ""}
                                                        profileUrl={values?.image || ""}
                                                    />
                                                </div>
                                            </Card>
                                        </Grid2>

                                        <Grid2 size={{ xs: 12, md: 8 }}>
                                            <Card
                                                sx={{
                                                    ...cardStyle,
                                                    padding: "24px",
                                                }}
                                                className="flex-auto w-full"
                                            >
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                                                        selectFistValue={company.companyType.uuid}
                                                    />

                                                    <SelectSingleComponent
                                                        label={t("city")}
                                                        options={cityName}
                                                        onChange={handleCityChange}
                                                        fullWidth={true}
                                                        error={errors.cityUuid}
                                                        touched={touched.cityUuid}
                                                        optionLabelKey="name"
                                                        selectFistValue={company.city.uuid}
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

                                                </div>

                                                <div className="col-span-2 flex justify-end mt-[20px]">
                                                    <ButtonComponent
                                                        btnTitle={t("newcompany")}
                                                        type={"submit"}
                                                        isLoading={isLoadingUpdateCompany}
                                                    />
                                                </div>
                                            </Card>
                                        </Grid2>
                                    </Grid2>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </>
        );
    }
    return content;
}

export default EditCompanyForm;
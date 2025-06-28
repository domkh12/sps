import {useEffect, useState} from "react";
import SeoComponent from "../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import {Card, FormControl, Grid2, TextField, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useTranslate from "../../hook/useTranslate";
import { cardStyle } from "../../assets/style";
import * as Yup from "yup";
import ProfileUploadComponent from "../../components/ProfileUploadComponent";
import { Form, Formik } from "formik";
import SelectSingleComponent from "../../components/SelectSingleComponent";
import ButtonComponent from "../../components/ButtonComponent";
import LoadingFetchingDataComponent from "./../../components/LoadingFetchingDataComponent";
import { useGetAllCitiesQuery } from "../../redux/feature/city/cityApiSlice";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import {useGetCompanyTypeQuery} from "../../redux/feature/companyType/CompanyTypeApiSlice.js";
import {DatePicker} from "@mui/x-date-pickers";
import {useCreateCompanyMutation} from "../../redux/feature/company/companyApiSlice.js";
import dayjs from "dayjs";
import {toast, Slide} from "react-toastify";

function AddCompany() {
  const navigate = useNavigate();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const {data:cityName, isSuccess: isSuccessGetCity, isLoading: isLoadingGetCity}= useGetAllCitiesQuery("citiesList");
  const {data:companyTypeData, isSuccess: isSuccessGetCompanyType, isLoading: isLoadingGetCompanyType} = useGetCompanyTypeQuery("companyTypeList");
  const { t } = useTranslate();

  const [uploadImage] = useUploadImageMutation();

  const [
    createCompany,
    {
      isSuccess: isSuccessCreateCompany,
      isLoading: isLoadingCreateCompany,
      isError: isErrorCreateCompany,
      error: errorCreateCompany,
    },
  ] = useCreateCompanyMutation();

  useEffect(() => {
    if (isSuccessCreateCompany) {
      navigate("/dash/companies")
      toast.success(t("createSuccess"), {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
    }
  }, [isSuccessCreateCompany]);

  useEffect(() => {
    if (isErrorCreateCompany) {
      toast.error(`${errorCreateCompany?.data?.error?.description}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
    }
  }, [isErrorCreateCompany]);


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
      const formattedDate = dayjs(values.establishedDate).format(
          "YYYY-MM-DD"
      );

      await createCompany({
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
              companyName: "",
              companyAddress: "",
              companyTypeUuid: "",
              cityUuid: "",
              establishedDate: null
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
                            profileImageFile={profileImageFile}
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
                            onChange={handleChange}
                            value={values.companyName}
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
                          />

                          <SelectSingleComponent
                            label={t("city")}
                            options={cityName}
                            onChange={handleCityChange}
                            fullWidth={true}
                            error={errors.cityUuid}
                            touched={touched.cityUuid}
                            optionLabelKey="name"
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
                            isLoading={isLoadingCreateCompany}
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

export default AddCompany; 

import React, { useEffect, useState } from "react";
import SeoComponent from "../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import { Card, Grid2, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useTranslate from "../../hook/useTranslate";
import { cardStyle } from "../../assets/style";
import * as Yup from "yup";
import ProfileUploadComponent from "../../components/ProfileUploadComponent";
import { Form, Formik } from "formik";
import SelectSingleComponent from "../../components/SelectSingleComponent";
import ButtonComponent from "../../components/ButtonComponent";
import { useGetAllCompaniesMutation } from "../../redux/feature/company/companyApiSlice";
import LoadingFetchingDataComponent from "./../../components/LoadingFetchingDataComponent";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllCitiesMutation } from "../../redux/feature/city/cityApiSlice";
import { useGetAllSiteTypesMutation } from "../../redux/feature/siteType/siteTypeApiSlice";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import { useCreateNewSiteMutation } from "../../redux/feature/site/siteApiSlice";
import {
  setCaptionSnackBar,
  setErrorSnackbar,
  setIsOpenSnackBar,
} from "../../redux/feature/actions/actionSlice";

function AddCompany() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const companiesFetchedData = useSelector(
    (state) => state.companies.companiesData
  );
  const citiesFetchedData = useSelector((state) => state.city.cityData);
  const siteTypesFetchedData = useSelector(
    (state) => state.siteType.siteTypeData
  );
  const { t } = useTranslate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [uploadImage] = useUploadImageMutation();

  const [
    createNewSite,
    {
      isSuccess: isSuccessCreateNewSite,
      isLoading: isLoadingCreateNewSite,
      isError: isErrorCreateNewSite,
      error: errorCreateNewSite,
    },
  ] = useCreateNewSiteMutation();

  const [
    getAllSiteTypes,
    {
      isSuccess: isSuccessGetAllSiteTypes,
      isLoading: isLoadingGetAllSiteTypes,
      isError: isErrorGetAllSiteTypes,
      error: errorGetAllSiteType,
    },
  ] = useGetAllSiteTypesMutation();

  const [
    getAllCompanies,
    {
      isSuccess: isSuccessGetAllCompanies,
      isLoading: isLoadingGetAllCompanies,
      isError: isErrorGetAllCompanies,
      error: errorGetAllCompanies,
    },
  ] = useGetAllCompaniesMutation();

  const [
    getAllCities,
    {
      isSuccess: isSuccessGetAllCities,
      isLoading: isLoadingGetAllCities,
      isError: isErrorGetAllCities,
      error: errorGetAllCities,
    },
  ] = useGetAllCitiesMutation();

  useEffect(() => {
    if (isErrorGetAllCompanies) {
      setError(errorGetAllCompanies);
    } else if (isErrorGetAllCities) {
      setError(errorGetAllCities);
    } else if (isErrorGetAllSiteTypes) {
      setError(errorGetAllSiteType);
    }
  }, [
    isErrorGetAllCompanies,
    isErrorGetAllCities,
    isErrorGetAllSiteTypes,
    errorGetAllCities,
    errorGetAllCompanies,
    errorGetAllSiteType,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getAllCompanies(),
          getAllCities(),
          getAllSiteTypes(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isSuccessGetAllCompanies) {
      navigate("/dash/companys");
      dispatch(setIsOpenSnackBar(true));
      dispatch(setCaptionSnackBar(t("createSuccess")));
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);
    }
  }, [isSuccessCreateNewSite, navigate]);

  useEffect(() => {
    if (isErrorCreateNewSite) {
      dispatch(setIsOpenSnackBar(true));
      dispatch(setErrorSnackbar(true));
      dispatch(
        setCaptionSnackBar(`${errorCreateNewSite?.data?.error?.description}`)
      );
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);

      setTimeout(() => {
        dispatch(setErrorSnackbar(false));
      }, 3500);
    }
  }, [isErrorCreateNewSite]);

  const validationSchema = Yup.object().shape({
    siteName: Yup.string().required(t("branchNameIsRequired")),
    branchAddress: Yup.string().required(t("branchAddressIsRequired")),
    companyId: Yup.string().required(t("companyIsRequired")),
    cityId: Yup.string().required(t("cityIsRequired")),
    siteTypeId: Yup.string().required(t("branchTypeIsRequired")),
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
      console.log("values", values);
      const formData = new FormData();
      let profileImageUri = null;
      if (profileImageFile) {
        formData.append("file", profileImageFile);
        const uploadResponse = await uploadImage(formData).unwrap();
        profileImageUri = uploadResponse.uri;
      }

      await createNewSite({
        siteName: values.siteName,
        siteAddress: values.branchAddress,
        image: profileImageUri,
        cityUuid: values.cityId,
        siteTypeUuid: values.siteTypeId,
        companyUuid: values.companyId,
      });
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  let content;

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (error) content = <p>Error : {error?.message}</p>;

  if (!isLoading && !error && isSuccessGetAllCompanies) {
    content = (
      <>
        <div data-aos="fade-left">
          <SeoComponent title={"Create a new company"} />
          <MainHeaderComponent
            breadcrumbs={breadcrumbs}
            title={t("newcompany")}
          />
          <Formik
            initialValues={{
              siteName: "",
              branchAddress: "",
              companyId: "",
              cityId: "",
              siteTypeId: "",
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
              const handleCompanyChange = (value) => {
                console.log("value", value);
                setFieldValue("companyId", value);
              };

              const handleCityChange = (value) => {
                console.log("value", value);
                setFieldValue("cityId", value);
              };

              const handleSiteTypeChange = (value) => {
                console.log("value", value);
                setFieldValue("siteTypeId", value);
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
                            label={t("companyname")}
                           variant="outlined"
                            sx={{
                              "& .MuiInputBase-input": {
                                boxShadow: "none",
                              },
                              borderRadius: "6px",
                            }}
                            type="text"
                            id="companyName"
                            name="CompanyName"
                            onChange={handleCompanyChange}
                            onBlur={handleBlur}
                            error={errors.companyId}
                            touched={touched.companyId}
                            size="medium"
                          />
                          <SelectSingleComponent
                            label={t("CompanyType")}
                             options={siteTypesFetchedData.data}
                            onChange={handleSiteTypeChange}
                            fullWidth={true}
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
                            id="Address"
                            name="Address"
                            fullWidth
                            value={values.branchAddress}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            // error={
                            //   errors.branchAddress && touched.branchAddress
                            // }
                            // helperText={
                            //   errors.branchAddress && touched.branchAddress
                            //     ? errors.branchAddress
                            //     : null
                            // }
                            size="medium"
                          />


                          <SelectSingleComponent
                            label={t("city")}
                            options={citiesFetchedData.data}
                            onChange={handleCityChange}
                            fullWidth={true}
                            // error={errors.cityId}
                            // touched={touched.cityId}
                            optionLabelKey="name"
                          />

                         <TextField
                            label={t("createat")}
                            options={siteTypesFetchedData.data}
                            onChange={handleSiteTypeChange}
                            fullWidth={true}
                              variant="outlined"
                            sx={{
                              "& .MuiInputBase-input": {
                                boxShadow: "none",
                              },
                              borderRadius: "6px",
                            }}
                            // error={errors.siteTypeId}
                            // touched={touched.siteTypeId}
                            // optionLabelKey="name"
                          />
                        </div>

                        <div className="col-span-2 flex justify-end mt-[20px]">
                          <ButtonComponent
                            btnTitle={t("newcompany")}
                            type={"submit"}
                            loadingCaption={t("creating")}
                            isLoading={isLoadingCreateNewSite}
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

import { useEffect, useState } from "react";
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
import LoadingFetchingDataComponent from "./../../components/LoadingFetchingDataComponent";
import { useDispatch, useSelector } from "react-redux";
import {useGetAllCitiesQuery} from "../../redux/feature/city/cityApiSlice";
import {useGetAllSiteTypesQuery} from "../../redux/feature/siteType/siteTypeApiSlice";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import { useCreateNewSiteMutation } from "../../redux/feature/site/siteApiSlice";
import {useGetAllCompaniesQuery} from "../../redux/feature/company/companyApiSlice.js";
import {Slide, toast} from "react-toastify";

function AddNewBranch() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const { t } = useTranslate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [uploadImage] = useUploadImageMutation();
  const {data:companyName, isSuccess: isSuccessGetCompanyName, isLoading: isLoadingGetCompanyName}= useGetAllCompaniesQuery("companyNameList");
  const {data:cityName, isSuccess: isSuccessGetCity, isLoading: isLoadingGetCity}= useGetAllCitiesQuery("citiesList");
  const {data:getAllSiteTypes, isSuccess: isSuccessGetAllSiteTypes, isLoading: isLoadingGetAllSiteTypes} = useGetAllSiteTypesQuery("siteTypeList");

  const [
    createNewSite,
    {
      isSuccess: isSuccessCreateNewSite,
      isLoading: isLoadingCreateNewSite,
      isError: isErrorCreateNewSite,
      error: errorCreateNewSite,
    },
  ] = useCreateNewSiteMutation();

  useEffect(() => {
    if (isSuccessCreateNewSite) {
      navigate("/admin/branches");
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
  }, [isSuccessCreateNewSite]);

  useEffect(() => {
    if (isErrorCreateNewSite) {
      toast.error(`${errorCreateNewSite?.data?.error?.description}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
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
      onClick={() => navigate("/admin")}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("branch")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("newBranch")}
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

      await createNewSite({
        siteName: values.siteName,
        siteAddress: values.branchAddress,
        image: profileImageUri,
        cityUuid: values.cityId,
        siteTypeUuid: values.siteTypeId,
        companyUuid: values.companyId,
      });
    } catch (error) {
      console.log("Error creating new site:", error);
    } finally {
      setSubmitting(false);
    }
  };

  let content;

  if (isLoading || isLoadingGetCompanyName || isLoadingGetCity || isLoadingGetAllSiteTypes) content = <LoadingFetchingDataComponent />;

  if (error) content = <p>Error : {error?.message}</p>;

  if (isSuccessGetCompanyName && isSuccessGetCity && isSuccessGetAllSiteTypes) {
    content = (
      <>
        <div data-aos="fade-left">
          <SeoComponent title={"Create a new company"} />
          <MainHeaderComponent
            breadcrumbs={breadcrumbs}
            title={t("createNewBranch")}
            handleBackClick={() => navigate("/admin/branches")}
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
                setFieldValue("companyId", value);
              };

              const handleCityChange = (value) => {
                setFieldValue("cityId", value);
              };

              const handleSiteTypeChange = (value) => {
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
                            label={t("branchName")}
                            variant="outlined"
                            sx={{
                              "& .MuiInputBase-input": {
                                boxShadow: "none",
                              },
                              borderRadius: "6px",
                            }}
                            type="text"
                            id="siteName"
                            name="siteName"
                            fullWidth
                            value={values.siteName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            error={errors.siteName && touched.siteName}
                            helperText={
                              errors.siteName && touched.siteName
                                ? errors.siteName
                                : null
                            }
                            size="medium"
                          />

                          <TextField
                            label={t("branchAddress")}
                            variant="outlined"
                            sx={{
                              "& .MuiInputBase-input": {
                                boxShadow: "none",
                              },
                              borderRadius: "6px",
                            }}
                            type="text"
                            id="branchAddress"
                            name="branchAddress"
                            fullWidth
                            value={values.branchAddress}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            error={
                              errors.branchAddress && touched.branchAddress
                            }
                            helperText={
                              errors.branchAddress && touched.branchAddress
                                ? errors.branchAddress
                                : null
                            }
                            size="medium"
                          />

                          <SelectSingleComponent
                            label={t("company")}
                            options={companyName}
                            onChange={handleCompanyChange}
                            fullWidth={true}
                            error={errors.companyId}
                            touched={touched.companyId}
                            optionLabelKey="companyName"
                          />

                          <SelectSingleComponent
                            label={t("city")}
                            options={cityName}
                            onChange={handleCityChange}
                            fullWidth={true}
                            error={errors.cityId}
                            touched={touched.cityId}
                            optionLabelKey="name"
                          />

                          <SelectSingleComponent
                            label={t("branchType")}
                            options={getAllSiteTypes}
                            onChange={handleSiteTypeChange}
                            fullWidth={true}
                            error={errors.siteTypeId}
                            touched={touched.siteTypeId}
                            optionLabelKey="name"
                          />
                        </div>

                        <div className="col-span-2 flex justify-end mt-[20px]">
                          <ButtonComponent
                            btnTitle={t("createBranch")}
                            type={"submit"}
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

export default AddNewBranch;

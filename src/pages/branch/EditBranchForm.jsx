import React, { useEffect, useState } from "react";
import { useUpdateSiteMutation } from "../../redux/feature/site/siteApiSlice";
import SeoComponent from "../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import { Card, Grid2, TextField, Typography } from "@mui/material";
import useTranslate from "../../hook/useTranslate";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { cardStyle } from "../../assets/style";
import ProfileUploadComponent from "../../components/ProfileUploadComponent";
import SelectSingleComponent from "../../components/SelectSingleComponent";
import ButtonComponent from "../../components/ButtonComponent";
import * as Yup from "yup";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllSiteTypesMutation } from "../../redux/feature/siteType/siteTypeApiSlice";
import { useGetAllCompaniesMutation } from "../../redux/feature/company/companyApiSlice";
import { useGetAllCitiesMutation } from "../../redux/feature/city/cityApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import {
  setCaptionSnackBar,
  setIsOpenSnackBar,
} from "../../redux/feature/actions/actionSlice";

function EditBranchForm({ branch }) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const companiesFetchedData = useSelector(
    (state) => state.companies.companiesData
  );
  const citiesFetchedData = useSelector((state) => state.city.cityData);
  const siteTypesFetchedData = useSelector(
    (state) => state.siteType.siteTypeData
  );
  const dispatch = useDispatch();

  const [
    updateSite,
    {
      isSuccess: isSuccessUpdateSite,
      isLoading: isLoadingUpdateSite,
      isError: isErrorUpdateSite,
      error: errorUpdateSite,
    },
  ] = useUpdateSiteMutation();

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

  const [uploadImage] = useUploadImageMutation();

  const validationSchema = Yup.object().shape({
    siteName: Yup.string().required(t("branchNameIsRequired")),
    branchAddress: Yup.string().required(t("branchAddressIsRequired")),
    companyId: Yup.string().required(t("companyIsRequired")),
    cityId: Yup.string().required(t("cityIsRequired")),
    siteTypeId: Yup.string().required(t("branchTypeIsRequired")),
  });

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
    if (isSuccessUpdateSite) {
      navigate("/dash/branches");
      dispatch(setIsOpenSnackBar(true));
      dispatch(setCaptionSnackBar(t("editSuccess")));
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);
    }
  }, [isSuccessUpdateSite]);

  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navigate("/dash")}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("branch")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {branch?.siteName}
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

      await updateSite({
        uuid: branch?.uuid,
        siteName: values?.siteName,
        siteAddress: values?.branchAddress,
        image: profileImageUri,
        cityUuid: values?.cityId,
        siteTypeUuid: values?.siteTypeId,
        companyUuid: values?.companyId,
      });
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  let content;

  if (isLoading) <LoadingFetchingDataComponent />;

  if (!isLoading && branch) {
    content = (
      <>
        <SeoComponent title={t("edit")} />

        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("edit")}
          handleBackClick={() => navigate("/dash/branches")}
        />

        <Formik
          initialValues={{
            siteName: branch?.siteName,
            branchAddress: branch?.siteAddress,
            companyId: branch?.company?.uuid,
            cityId: branch?.city?.uuid,
            siteTypeId: branch?.siteType?.uuid,
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
                          error={errors.branchAddress && touched.branchAddress}
                          helperText={
                            errors.branchAddress && touched.branchAddress
                              ? errors.branchAddress
                              : null
                          }
                          size="medium"
                        />

                        <SelectSingleComponent
                          label={t("company")}
                          options={companiesFetchedData.data}
                          onChange={handleCompanyChange}
                          fullWidth={true}
                          error={errors.companyId}
                          touched={touched.companyId}
                          optionLabelKey="companyName"
                          selectFistValue={values.companyId}
                        />

                        <SelectSingleComponent
                          label={t("city")}
                          options={citiesFetchedData.data}
                          onChange={handleCityChange}
                          fullWidth={true}
                          error={errors.cityId}
                          touched={touched.cityId}
                          optionLabelKey="name"
                          selectFistValue={values.cityId}
                        />

                        <SelectSingleComponent
                          label={t("branchType")}
                          options={siteTypesFetchedData.data}
                          onChange={handleSiteTypeChange}
                          fullWidth={true}
                          error={errors.siteTypeId}
                          touched={touched.siteTypeId}
                          optionLabelKey="name"
                          selectFistValue={values.siteTypeId}
                        />
                      </div>

                      <div className="col-span-2 flex justify-end mt-[20px]">
                        <ButtonComponent
                          btnTitle={t("saveChanges")}
                          type={"submit"}
                          loadingCaption={t("creating")}
                          isLoading={isLoadingUpdateSite}
                        />
                      </div>
                    </Card>
                  </Grid2>
                </Grid2>
              </Form>
            );
          }}
        </Formik>
      </>
    );
  }

  return content;
}

export default EditBranchForm;

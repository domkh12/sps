import  { useState } from "react";
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
import { useGetAllCitiesQuery } from "../../redux/feature/city/cityApiSlice";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import { useCreateNewSiteMutation } from "../../redux/feature/site/siteApiSlice";
import {useGetCompanyTypeQuery} from "../../redux/feature/companyType/CompanyTypeApiSlice.js";

function AddCompany() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const {data:cityName, isSuccess}= useGetAllCitiesQuery("citiesList");
  const {data:companyTypeData, isSuccess: isSuccessCompanyType} = useGetCompanyTypeQuery("companyTypeList");
  console.log("companyTypeData", companyTypeData);
  const citiesFetchedData = useSelector((state) => state.city.cityData);
  const siteTypesFetchedData = useSelector(
    (state) => state.siteType.siteTypeData
  );
  const { t } = useTranslate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [uploadImage] = useUploadImageMutation();

  const [
    createCompany,
    {
      isSuccess: isSuccessCreateCompany,
      isLoading: isLoadingCreateCompany,
      isError: isErrorCreateCompany,
      error: errorCreateCompany,
    },
  ] = useCreateNewSiteMutation();

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

      await createCompany({
        siteName: values.siteName,
        siteAddress: values.branchAddress,
        image: profileImageUri,
        cityUuid: values.cityId,
        siteTypeUuid: values.siteTypeId,
        companyUuid: values.companyId,
      });
    } catch (error) {
      console.error("Error creating company:", error);
    } finally {
      setSubmitting(false);
    }
  };

  let content;

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (error) content = <p>Error : {error?.message}</p>;

  if (isSuccess) {
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
                            //value={values.branchAddress}
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
                            options={cityName}
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
                          //  isLoading={isLoadingCreateNewSite}
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

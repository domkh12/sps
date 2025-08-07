import { useEffect, useState } from "react";
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
import {useDispatch, useSelector} from "react-redux";
import { useGetAllSiteTypesQuery} from "../../redux/feature/siteType/siteTypeApiSlice";
import { useGetAllCitiesQuery } from "../../redux/feature/city/cityApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import {
  setCaptionSnackBar,
  setIsOpenSnackBar,
} from "../../redux/feature/actions/actionSlice";
import {useGetAllCompaniesQuery} from "../../redux/feature/company/companyApiSlice.js";
import {Slide, toast} from "react-toastify";
import {
  setIsOpenQuickCreateCity,
  setIsOpenQuickEditCity,
  setUuidForQuickEditCity
} from "../../redux/feature/city/citySlice.js";
import {
  setIsOpenQuickCreateBranchType,
  setIsOpenQuickEditBranchType,
  setUuidForQuickEditBranchType
} from "../../redux/feature/siteType/siteTypeSlice.js";
import QuickEditCityComponent from "../../components/QuickEditCityComponent.jsx";
import QuickCreateCityComponent from "../../components/QuickCreateCityComponent.jsx";
import QuickEditBranchTypeComponent from "../../components/QuickEditBranchTypeComponent.jsx";
import QuickCreateBranchTypeComponent from "../../components/QuickCreateBranchTypeComponent.jsx";

function EditBranchForm({ branch }) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const isOpenCreateCity = useSelector((state) => state.city.isOpenQuickCreateCity);
  const isQuickEditCityOpen = useSelector((state) => state.city.isOpenQuickEditCity);
  const isQuickEditBranchTypeOpen = useSelector((state) => state.siteType.isQuickEditBranchTypeOpen);
  const isOpenQuickCreateBranchType = useSelector((state) => state.siteType.isOpenQuickCreateBranchType);
  const {data:getAllSiteTypes, isSuccess: isSuccessGetAllSiteTypes, isLoading: isLoadingGetAllSiteTypes} = useGetAllSiteTypesQuery("siteTypeList");
  const {data:companyName, isSuccess: isSuccessGetCompanyName, isLoading: isLoadingGetCompanyName}= useGetAllCompaniesQuery("companyNameList");
  const {data:cityName, isSuccess: isSuccessGetCity, isLoading: isLoadingGetCity}= useGetAllCitiesQuery("citiesList");

  const [
    updateSite,
    {
      isSuccess: isSuccessUpdateSite,
      isLoading: isLoadingUpdateSite,
      isError: isErrorUpdateSite,
      error: errorUpdateSite,
    },
  ] = useUpdateSiteMutation();

  const [uploadImage] = useUploadImageMutation();

  const validationSchema = Yup.object().shape({
    siteName: Yup.string().required(t("branchNameIsRequired")),
    branchAddress: Yup.string().required(t("branchAddressIsRequired")),
    companyId: Yup.string().required(t("companyIsRequired")),
    cityId: Yup.string().required(t("cityIsRequired")),
    siteTypeId: Yup.string().required(t("branchTypeIsRequired")),
  });

  useEffect(() => {
    if (isSuccessUpdateSite) {
      navigate("/admin/branches");
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
  }, [isSuccessUpdateSite]);

    useEffect(() => {
      if (isErrorUpdateSite){
        toast.error(`${errorUpdateSite?.data?.error?.description}`, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          transition: Slide,
        });
      }
    },[isErrorUpdateSite])

  const breadcrumbs = [
    <button
      className=" hover:underline"
      onClick={() => navigate("/admin")}
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
      console.log("Error updating site:", error);
    } finally {
      setSubmitting(false);
    }
  };

  let content;

  if (isLoadingGetCity || isLoadingGetCompanyName || isLoadingGetAllSiteTypes) <LoadingFetchingDataComponent />;

  if (isSuccessGetCompanyName && isSuccessGetCity && isSuccessGetAllSiteTypes) {
    content = (
      <>
        <SeoComponent title={"Edit branch"} />

        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={branch?.siteName || "N/A"}
          handleBackClick={() => navigate("/admin/branches")}
        />

        <Formik
          initialValues={{
            siteName: branch?.siteName,
            branchAddress: branch?.siteAddress,
            companyId: branch?.company?.uuid,
            cityId: branch?.city?.uuid || "",
            siteTypeId: branch?.siteType?.uuid || "",
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
                          options={companyName}
                          onChange={handleCompanyChange}
                          fullWidth={true}
                          error={errors.companyId}
                          touched={touched.companyId}
                          optionLabelKey="companyName"
                          selectFistValue={values.companyId}
                        />

                        <SelectSingleComponent
                          label={t("city")}
                          options={cityName}
                          onChange={handleCityChange}
                          fullWidth={true}
                          error={errors.cityId}
                          touched={touched.cityId}
                          optionLabelKey="name"
                          selectFistValue={values.cityId}
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

                        <SelectSingleComponent
                          label={t("branchType")}
                          options={getAllSiteTypes}
                          onChange={handleSiteTypeChange}
                          fullWidth={true}
                          error={errors.siteTypeId}
                          touched={touched.siteTypeId}
                          optionLabelKey="name"
                          selectFistValue={values.siteTypeId}
                          isEditable={true}
                          onClickQuickEdit={(value) => {
                            dispatch(setIsOpenQuickEditBranchType(true));
                            dispatch(setUuidForQuickEditBranchType(value));
                          }}
                          isCreate={true}
                          onClickCreate={() => {
                            dispatch(setIsOpenQuickCreateBranchType(true));
                          }}
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
        {isQuickEditCityOpen && <QuickEditCityComponent/>}
        {isOpenCreateCity && <QuickCreateCityComponent/>}
        {isQuickEditBranchTypeOpen && <QuickEditBranchTypeComponent/>}
        {isOpenQuickCreateBranchType && <QuickCreateBranchTypeComponent/>}
      </>
    );
  }

  return content;
}

export default EditBranchForm;

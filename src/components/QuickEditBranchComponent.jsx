import {Backdrop, Box, Button, CircularProgress, Modal, TextField, Typography} from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectSingleComponent from "./SelectSingleComponent";
import * as Yup from "yup";
import useTranslate from "../hook/useTranslate";
import {useGetAllCompaniesQuery} from "../redux/feature/company/companyApiSlice";
import {useGetAllSiteTypesQuery} from "../redux/feature/siteType/siteTypeApiSlice";
import { useUpdateSiteMutation } from "../redux/feature/site/siteApiSlice";
import { buttonStyleContained, buttonStyleOutlined } from "../assets/style";
import { setIsQuickEditBranchOpen } from "../redux/feature/site/siteSlice";
import {useGetAllCitiesQuery} from "../redux/feature/city/cityApiSlice.js";
import {Slide, toast} from "react-toastify";
import {
  setIsOpenQuickCreateBranchType,
  setIsOpenQuickEditBranchType,
  setUuidForQuickEditBranchType
} from "../redux/feature/siteType/siteTypeSlice.js";
import {
  setIsOpenQuickCreateCity,
  setIsOpenQuickEditCity,
  setUuidForQuickEditCity
} from "../redux/feature/city/citySlice.js";
import QuickEditCityComponent from "./QuickEditCityComponent.jsx";
import QuickCreateCityComponent from "./QuickCreateCityComponent.jsx";
import QuickEditBranchTypeComponent from "./QuickEditBranchTypeComponent.jsx";
import QuickCreateBranchTypeComponent from "./QuickCreateBranchTypeComponent.jsx";
import { LoadingButton } from "@mui/lab";

function QuickEditBranchComponent() {
  const open = useSelector((state) => state.sites.isQuickEditBranchOpen);
  const branch = useSelector((state) => state.sites.branchForQuickEdit);
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const isOpenCreateCity = useSelector((state) => state.city.isOpenQuickCreateCity);
  const isQuickEditCityOpen = useSelector((state) => state.city.isOpenQuickEditCity);
  const isQuickEditBranchTypeOpen = useSelector((state) => state.siteType.isQuickEditBranchTypeOpen);
  const isOpenQuickCreateBranchType = useSelector((state) => state.siteType.isOpenQuickCreateBranchType);
  const {data:companyName, isSuccess: isSuccessGetCompanyName, isLoading: isLoadingGetCompanyName}= useGetAllCompaniesQuery("companyNameList");
  const {data:cityName, isSuccess: isSuccessGetCity, isLoading: isLoadingGetCity}= useGetAllCitiesQuery("citiesList");
  const {data:getAllSiteTypes, isSuccess: isSuccessGetAllSiteTypes, isLoading: isLoadingGetAllSiteTypes} = useGetAllSiteTypesQuery("siteTypeList");

  const [
    updateSite,
    {
      isSuccess: isSuccessUpdateSite,
      isLoading: isLoadingUpdateSite,
      isError: isErrorUpdateSite,
      error: errorUpdateSite,
    },
  ] = useUpdateSiteMutation();

  useEffect(() => {
    if (isSuccessUpdateSite) {
      dispatch(setIsQuickEditBranchOpen(false));
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
    if (isErrorUpdateSite) {
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
  }, [isErrorUpdateSite]);

  const validationSchema = Yup.object().shape({
    siteName: Yup.string().required(t("branchNameIsRequired")),
    branchAddress: Yup.string().required(t("branchAddressIsRequired")),
    companyId: Yup.string().required(t("companyIsRequired")),
    cityId: Yup.string().required(t("cityIsRequired")),
    siteTypeId: Yup.string().required(t("branchTypeIsRequired")),
  });

  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateSite({
        uuid: branch?.uuid,
        siteName: values?.siteName,
        siteAddress: values?.branchAddress,
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

  if (isLoadingGetCity || isLoadingGetCompanyName || isLoadingGetAllSiteTypes) content = (
      <Backdrop
          sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
          open={true}
          onClick={dispatch(setIsQuickEditBranchOpen(false))}
      >
        <CircularProgress color="inherit"/>
      </Backdrop>
  )

  if (isSuccessGetCity && isSuccessGetCompanyName && isSuccessGetAllSiteTypes) {
    content = (
      <Box>
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
              setFieldValue("companyId", value);
            };

            const handleCityChange = (value) => {
              setFieldValue("cityId", value);
            };

            const handleSiteTypeChange = (value) => {
              setFieldValue("siteTypeId", value);
            };

            return (
              <Form>
                <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-[24px]">
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
                </Box>

                <Box
                  sx={{
                    padding: "24px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    onClick={() => {
                      dispatch(setIsQuickEditBranchOpen(false));
                    }}
                    variant="outlined"
                  >
                    {t('cancel')}
                  </Button>
                  <LoadingButton
                    loading={isLoadingUpdateSite}
                    variant="contained"
                    sx={{ ml: 1 }}
                    type="submit"
                  >
                    {t('update')}
                  </LoadingButton>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    );
  }

  return (
    <Modal
      open={open}
      onClose={() => dispatch(setIsQuickEditBranchOpen(false))}
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
            sx={{ padding: "24px" }}
          >
            {t("quickUpdate")}
          </Typography>
          {content}
        </Box>
        {isQuickEditCityOpen && <QuickEditCityComponent/>}
        {isOpenCreateCity && <QuickCreateCityComponent/>}
        {isQuickEditBranchTypeOpen && <QuickEditBranchTypeComponent/>}
        {isOpenQuickCreateBranchType && <QuickCreateBranchTypeComponent/>}
      </Box>
    </Modal>
  );
}

export default QuickEditBranchComponent;

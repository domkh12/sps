import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectSingleComponent from "./SelectSingleComponent";
import * as Yup from "yup";
import useTranslate from "../hook/useTranslate";
import {useGetAllCompaniesQuery} from "../redux/feature/company/companyApiSlice";

import {useGetAllSiteTypesQuery} from "../redux/feature/siteType/siteTypeApiSlice";
import { useUpdateSiteMutation } from "../redux/feature/site/siteApiSlice";
import { buttonStyleContained, buttonStyleOutlined } from "../assets/style";
import { setIsQuickEditBranchOpen } from "../redux/feature/site/siteSlice";
import LoadingFetchingDataComponent from "./LoadingFetchingDataComponent";
import {
  setCaptionSnackBar,
  setIsOpenSnackBar,
} from "../redux/feature/actions/actionSlice";
import AlertMessageComponent from "./AlertMessageComponent";
import {useGetAllCitiesQuery} from "../redux/feature/city/cityApiSlice.js";
import {Slide, toast} from "react-toastify";

function QuickEditBranchComponent() {
  const open = useSelector((state) => state.sites.isQuickEditBranchOpen);
  const branch = useSelector((state) => state.sites.branchForQuickEdit);
  const { t } = useTranslate();
  const dispatch = useDispatch();
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

  if (isLoadingGetCity || isLoadingGetCompanyName || isLoadingGetAllSiteTypes) content = <LoadingFetchingDataComponent />;

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
                    sx={{
                      ...buttonStyleOutlined,
                    }}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ ...buttonStyleContained, ml: 1 }}
                    type="submit"
                  >
                    {t('update')}
                  </Button>
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
      </Box>
    </Modal>
  );
}

export default QuickEditBranchComponent;

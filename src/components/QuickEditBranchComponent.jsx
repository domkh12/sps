import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectSingleComponent from "./SelectSingleComponent";
import * as Yup from "yup";
import useTranslate from "../hook/useTranslate";
import {useGetAllCompaniesQuery} from "../redux/feature/company/companyApiSlice";

import { useGetAllSiteTypesMutation } from "../redux/feature/siteType/siteTypeApiSlice";
import { useUpdateSiteMutation } from "../redux/feature/site/siteApiSlice";
import { buttonStyleContained, buttonStyleOutlined } from "../assets/style";
import { setIsQuickEditBranchOpen } from "../redux/feature/site/siteSlice";
import LoadingFetchingDataComponent from "./LoadingFetchingDataComponent";
import {
  setCaptionSnackBar,
  setIsOpenSnackBar,
} from "../redux/feature/actions/actionSlice";
import AlertMessageComponent from "./AlertMessageComponent";

function QuickEditBranchComponent() {
  const open = useSelector((state) => state.sites.isQuickEditBranchOpen);
  const branch = useSelector((state) => state.sites.branchForQuickEdit);
  const [isLoading, setIsLoading] = useState(true);
  const {data:companyName, isSuccess: isSuccessGetCompanyName, isLoading: isLoadingGetCompanyName}= useGetAllCompaniesQuery("companyNameList");
  const citiesFetchedData = useSelector((state) => state.city.cityData);
  const siteTypesFetchedData = useSelector(
    (state) => state.siteType.siteTypeData
  );
  const { t } = useTranslate();
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
    getAllCities,
    {
      isSuccess: isSuccessGetAllCities,
      isLoading: isLoadingGetAllCities,
      isError: isErrorGetAllCities,
      error: errorGetAllCities,
    },
  ] = useGetAllCitiesMutation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
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
      dispatch(setIsQuickEditBranchOpen(false));
      dispatch(setIsOpenSnackBar(true));
      dispatch(setCaptionSnackBar(t("editSuccess")));
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);
    }
  }, [isSuccessUpdateSite]);

  useEffect(() => {
    if (isErrorUpdateSite) {
      dispatch(
        setCaptionSnackBar(`${errorUpdateSite?.data?.error?.description}`)
      );
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
    } finally {
      setSubmitting(false);
    }
  };
  let content;

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (!isLoading) {
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
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ ...buttonStyleContained, ml: 1 }}
                    type="submit"
                  >
                    Update
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
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
    >
      <Box sx={style}>
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: "16px",
            width: "100%",
            mx: 5,
            maxWidth: "720px",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ padding: "24px" }}
          >
            Quick update
          </Typography>
          {isErrorUpdateSite && (
            <Box sx={{ px: "24px" }}>
              <AlertMessageComponent />
            </Box>
          )}

          {content}
        </Box>
      </Box>
    </Modal>
  );
}

export default QuickEditBranchComponent;

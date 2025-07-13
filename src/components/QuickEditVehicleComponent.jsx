import {Backdrop, Box, Button, CircularProgress, Modal, TextField, Typography} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useUpdateVehicleMutation,
} from "../redux/feature/vehicles/vehicleApiSlice";
import * as Yup from "yup";
import useAuth from "../hook/useAuth";
import useTranslate from "../hook/useTranslate";
import SelectSingleComponent from "./SelectSingleComponent";
import ColorPickerComponent from "./ColorPickerComponent";
import { setIsOpenQuickEditVehicle } from "../redux/feature/vehicles/vehicleSlice";
import {useGetAllFullNameUsersQuery} from "../redux/feature/users/userApiSlice.js";
import {Slide, toast} from "react-toastify";
import {useGetAllCompaniesQuery} from "../redux/feature/company/companyApiSlice.js";
import { useGetAllLicensePlateProvincesQuery } from "../redux/feature/licensePlateProvince/licensePlateProvinceApiSlice.js";
import { useGetAllLicensePlateTypesQuery } from "../redux/feature/licensePlateType/licensePlateTypeApiSlice.js";
import { useGetAllVehicleTypesQuery } from "../redux/feature/vehicleType/vehicleTypeApiSlice.js";
import QuickEditLicensePlateProvinceComponent from "./QuickEditLicensePlateProvinceComponent.jsx";
import QuickCreateLicensePlateProvinceComponent from "./QuickCreateLicensePlateProvinceComponent.jsx";
import QuickEditLicensePlateTypeComponent from "./QuickEditLicensePlateTypeComponent.jsx";
import QuickCreateLicensePlateTypeComponent from "./QuickCreateLicensePlateTypeComponent.jsx";
import QuickEditVehicleTypeComponent from "./QuickEditVehicleTypeComponent.jsx";
import QuickCreateVehicleTypeComponent from "./QuickCreateVehicleTypeComponent.jsx";
import { setIsOpenQuickCreateVehicleType, setIsOpenQuickEditVehicleType, setUuidForQuickEditVehicleType } from "../redux/feature/vehicleType/vehicleTypeSlice.js";
import { setIsOpenQuickCreateLicensePlateType, setIsOpenQuickEditLicensePlateType, setUuidForQuickEditLicensePlateType } from "../redux/feature/licensePlateType/licensePlateTypeSlice.js";
import { setIsOpenQuickCreateLicensePlateProvince, setIsOpenQuickEditLicensePlateProvince, setUuidForQuickEditLicensePlateProvince } from "../redux/feature/licensePlateProvince/licensePlateProvinceSlice.js";
import { LoadingButton } from "@mui/lab";

function QuickEditVehicleComponent() {
  const open = useSelector((state) => state.vehicles.isOpenQuickEditVehicle);
  const handleClose = () => dispatch(setIsOpenQuickEditVehicle(false));
  const vehicle = useSelector((state) => state.vehicles.vehicleForQuickEdit);
  const [nameProvince, setNameProvince] = useState("provinceNameKh");
  const isQuickEditLicensePlateProvinceOpen = useSelector((state) => state.licensePlateProvince.isOpenQuickEditLicensePlateProvince);
  const isQuickCreateLicensePlateProvinceOpen = useSelector((state) => state.licensePlateProvince.isOpenQuickCreateLicensePlateProvince);
  const isQuickEditLicensePlateTypeOpen = useSelector((state) => state.licensePlateType.isOpenQuickEditLicensePlateType);
  const isQuickCreateLicensePlateTypeOpen = useSelector((state) => state.licensePlateType.isOpenQuickCreateLicensePlateType);
  const isQuickEditVehicleTypeOpen = useSelector((state) => state.vehicleType.isOpenQuickEditVehicleType);  
  const isQuickCreateVehicleTypeOpen = useSelector((state) => state.vehicleType.isOpenQuickCreateVehicleType);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const { isAdmin, isManager, sites } = useAuth();
  const {data:companyData, isSuccess: isSuccessGetCompanyName, isLoading: isLoadingGetCompanyName}= useGetAllCompaniesQuery("companyNameList", {skip: !isAdmin});

    const {data: licensePlateProvincesFetched,
        isSuccess:isSuccessGetAllLicensePlateProvinces,
        isLoading:isLoadingGetAllLicensePlateProvinces,
    } = useGetAllLicensePlateProvincesQuery("licensePlateProvinceList")

    const {data:vehicleTypeFetched,
        isSuccess:isSuccessGetAllVehicleType,
        isLoading:isLoadingGetAllVehicleType,
    } = useGetAllVehicleTypesQuery("vehicleTypeList");

    const {data:licensePlateTypesFetched,
        isSuccess: isSuccessGetAllLicensePlateTypes,
        isLoading: isLoadingGetAllLicensePlateTypes,
    } = useGetAllLicensePlateTypesQuery("licensePlateTypeList");

    const {data: allFullNameUsersFetched,
        isSuccess: isSuccessGetAllFullNameUsers,
        isLoading: isLoadingGetAllFullNameUsers,
    } = useGetAllFullNameUsersQuery("fullNameUsersList");

  const { t } = useTranslate();

  const validationSchema = Yup.object().shape({
      plateNumber: Yup.string()
          .matches(/^[A-Za-z0-9-]+$/, t("onlyAlphanumericAndDash"))
          .min(1, t("plateNumberMin"))
          .max(20, t("plateNumberMax"))
          .required(t("plateNumberRequired")),

      make: Yup.string()
          .max(50, t("vehicleMakeTooLong"))
          .required(t("vehicleMakeRequired")),

      model: Yup.string()
          .max(50, t("vehicleModelTooLong"))
          .required(t("vehicleModelRequired")),

      color: Yup.string()
          .required(t("colorRequired")),

      vehicleTypeId: Yup.string()
          .required(t("vehicleTypeRequired")),

      userId: Yup.string()
          .required(t("driverRequired")),

      lppId: Yup.string()
          .required(t("provinceRequired")),

      licensePlateTypeId: Yup.string()
          .required(t("licensePlateTypeRequired")),

      ...(isAdmin ? {
          branchUuid: Yup.string()
              .required(t("branchRequired")),
      }: {})
  });

  const [
    updateVehicle,
    {
      isSuccess: isSuccessUpdateVehicle,
      isLoading: isLoadingUpdateVehicle,
      isError: isErrorUpdateVehicle,
      error: errorUpdateVehicle,
    },
  ] = useUpdateVehicleMutation();

    useEffect(() => {
        if (isSuccessUpdateVehicle) {
            toast.success(t("createSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            handleClose();
        }
    }, [isSuccessUpdateVehicle]);

    useEffect(() => {
        if (isErrorUpdateVehicle) {
            toast.error(`${errorUpdateVehicle?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorUpdateVehicle]);

  const handleSubmit = async (values, { setSubmitting }) => {  
    try {
      await updateVehicle({
        uuid: vehicle.uuid,
        numberPlate: values.plateNumber,
        vehicleMake: values.make,
        vehicleModel: values.model,
        color: values.color,
        userId: values.userId,
        vehicleTypeId: values.vehicleTypeId,
        licensePlateTypeId: values.licensePlateTypeId,
        licensePlateProvinceId: values.lppId,
        branchUuid: isAdmin ? values.branchUuid : sites[0]
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  var menuActions = [
    {
      label: t('provinceNameEn'),
      onClick: () => setNameProvince("provinceNameEn"),
    },
    {
      label: t('provinceNameKh'),    
      onClick: () => setNameProvince("provinceNameKh"),
    },
  ]

  let content;

  if (isLoadingGetAllVehicleType || isLoadingGetAllLicensePlateTypes || isLoadingGetAllFullNameUsers || isLoadingGetAllLicensePlateProvinces) content = (
      <Backdrop
          sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
          open={true}
          onClick={handleClose}
      >
        <CircularProgress color="inherit"/>
      </Backdrop>
  );

  if (error) {
    content = "Error";
  }
  if (isSuccessGetAllFullNameUsers && isSuccessGetAllVehicleType && isSuccessGetAllLicensePlateTypes && isSuccessGetAllLicensePlateProvinces)
    content = (
      <Box>
        <Formik
          initialValues={{
            plateNumber: vehicle.numberPlate,
            color: vehicle.color,
            make: vehicle.vehicleMake,
            model: vehicle.vehicleModel,
            vehicleTypeId: vehicle?.vehicleType?.uuid,
            userId: vehicle?.user?.uuid,
            lppId: vehicle?.licensePlateProvince?.uuid,
            licensePlateTypeId: vehicle?.licensePlateType?.uuid,
            branchUuid: vehicle?.sites?.length > 0 ? vehicle?.sites[0]?.uuid : []
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
            const handleBranchChange = (value) => {
                setFieldValue("branchUuid", value);
            };

            const handleDriverChange = (value) => {
              setFieldValue("userId", value);
            };

            const handleVehicleTypeChange = (value) => {
              setFieldValue("vehicleTypeId", value);
            };

            const handleLicesePlateTypesChange = (value) => {
              setFieldValue("licensePlateTypeId", value);
            };

            const handleLicensePlateProvinceChange = (value) => {
              setFieldValue("lppId", value);
            };

            return (
              <Form>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-[24px]">
                  <TextField
                    label={t("plateNumber")}
                    variant="outlined"
                    sx={{
                      "& .MuiInputBase-input": {
                        boxShadow: "none",
                      },
                      borderRadius: "6px",
                    }}
                    type="text"
                    id="plateNumber"
                    name="plateNumber"
                    fullWidth
                    value={values.plateNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                    error={errors.plateNumber && touched.plateNumber}
                    helperText={
                      errors.plateNumber && touched.plateNumber
                        ? errors.plateNumber
                        : null
                    }
                    size="medium"
                  />

                  <SelectSingleComponent
                    label={`${t("province")}`}
                    options={licensePlateProvincesFetched}
                    fullWidth={true}
                    optionLabelKey={nameProvince}
                    selectFistValue={values.lppId}
                    error={errors.lppId}
                    touched={touched.lppId}
                    onChange={handleLicensePlateProvinceChange}
                    isCreate={true}
                    onClickCreate={() => {
                      dispatch(setIsOpenQuickCreateLicensePlateProvince(true));
                    }}
                    isEditable={true}
                    onClickQuickEdit={(value) => {
                      dispatch(setIsOpenQuickEditLicensePlateProvince(true));
                      dispatch(setUuidForQuickEditLicensePlateProvince(value));
                    }}
                    menuActions={menuActions}
                  />

                  <SelectSingleComponent
                    label={t("licensePlateType")}
                    options={licensePlateTypesFetched}
                    onChange={handleLicesePlateTypesChange}
                    fullWidth={true}
                    optionLabelKey="name"
                    selectFistValue={values.licensePlateTypeId}
                    error={errors.licensePlateTypeId}
                    touched={touched.licensePlateTypeId}
                    isCreate={true}
                    onClickCreate={() => {
                      dispatch(setIsOpenQuickCreateLicensePlateType(true));
                    }}
                    isEditable={true}
                    onClickQuickEdit={(value) => {
                      dispatch(setIsOpenQuickEditLicensePlateType(true));
                      dispatch(setUuidForQuickEditLicensePlateType(value));
                    }}
                  />

                  <SelectSingleComponent
                    label={t("vehicleType")}
                    options={vehicleTypeFetched}
                    onChange={handleVehicleTypeChange}
                    fullWidth={true}
                    optionLabelKey="name"
                    selectFistValue={values.vehicleTypeId}
                    error={errors.vehicleTypeId}
                    touched={touched.vehicleTypeId}
                    isCreate={true}
                    onClickCreate={() => {
                      dispatch(setIsOpenQuickCreateVehicleType(true));
                    }}
                    isEditable={true}
                    onClickQuickEdit={(value) => {
                      dispatch(setIsOpenQuickEditVehicleType(true));
                      dispatch(setUuidForQuickEditVehicleType(value));
                    }}
                  />

                  <SelectSingleComponent
                    label={t("driver")}
                    options={allFullNameUsersFetched}
                    onChange={handleDriverChange}
                    fullWidth={true}
                    optionLabelKey="fullName"
                    selectFistValue={values.userId}
                    error={errors.userId}
                    touched={touched.userId}
                  />

                  {
                      isAdmin && (
                          <SelectSingleComponent
                              label={t("branch")}
                              options={companyData}
                              onChange={handleBranchChange}
                              fullWidth={true}
                              error={errors.branchUuid}
                              touched={touched.branchUuid}
                              itemsLabelKey="sites"
                              optionLabelKey="siteName"
                              groupLabelKey="companyName"
                              selectFistValue={values.branchUuid}
                          />
                      )
                    }

                  <TextField
                    label={t("vehicleMake")}
                    variant="outlined"
                    sx={{
                      "& .MuiInputBase-input": {
                        boxShadow: "none",
                      },
                      borderRadius: "6px",
                    }}
                    type="text"
                    id="make"
                    name="make"
                    fullWidth
                    value={values.make}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                    error={errors.make && touched.make}
                    helperText={
                      errors.make && touched.make ? errors.make : null
                    }
                    size="medium"
                  />

                  <TextField
                    label={t("vehicleModel")}
                    variant="outlined"
                    sx={{
                      "& .MuiInputBase-input": {
                        boxShadow: "none",
                      },
                      borderRadius: "6px",
                    }}
                    type="text"
                    id="model"
                    name="model"
                    fullWidth
                    value={values.model}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="off"
                    error={errors.model && touched.model}
                    helperText={
                      errors.model && touched.model ? errors.model : null
                    }
                    size="medium"
                  />

                  <ColorPickerComponent
                    label="Color"
                    value={values.color}
                    onChange={(color) => setFieldValue("color", color)}
                  />
                </div>

                <Box
                  sx={{
                    padding: "24px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <Button
                    onClick={handleClose}
                    variant="outlined"
                  >
                    {t('cancel')}
                  </Button>
                  <LoadingButton
                    variant="contained"
                    sx={{ml: 1 }}
                    type="submit"
                    loading={isLoadingUpdateVehicle}
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

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      onClose={handleClose}
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
            {t('quickEdit')}
          </Typography>
          {content}
        </Box>
        {isQuickEditLicensePlateProvinceOpen && <QuickEditLicensePlateProvinceComponent/>}
          {isQuickCreateLicensePlateProvinceOpen && <QuickCreateLicensePlateProvinceComponent/>}
          {isQuickEditLicensePlateTypeOpen && <QuickEditLicensePlateTypeComponent/>}
          {isQuickCreateLicensePlateTypeOpen && <QuickCreateLicensePlateTypeComponent/>}
          {isQuickEditVehicleTypeOpen && <QuickEditVehicleTypeComponent/>}
          {isQuickCreateVehicleTypeOpen && <QuickCreateVehicleTypeComponent/>}
      </Box>
    </Modal>
  );
}

export default QuickEditVehicleComponent;

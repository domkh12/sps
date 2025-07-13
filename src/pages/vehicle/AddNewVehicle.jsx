import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  useGetAllFullNameUsersQuery,
} from "../../redux/feature/users/userApiSlice";
import { useEffect, useState } from "react";
import {
  useAddNewVehicleMutation,
} from "../../redux/feature/vehicles/vehicleApiSlice";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import SeoComponent from "../../components/SeoComponent";
import { Card, Grid2, TextField, Typography } from "@mui/material";
import useTranslate from "../../hook/useTranslate";
import { cardStyle } from "../../assets/style";
import SelectSingleComponent from "../../components/SelectSingleComponent";
import useAuth from "../../hook/useAuth";
import MainHeaderComponent from "./../../components/MainHeaderComponent";
import ColorPickerComponent from "../../components/ColorPickerComponent";
import ButtonComponent from "../../components/ButtonComponent";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import {Slide, toast} from "react-toastify";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import {useGetAllCompaniesQuery} from "../../redux/feature/company/companyApiSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpenQuickCreateLicensePlateProvince, setIsOpenQuickEditLicensePlateProvince, setUuidForQuickEditLicensePlateProvince } from "../../redux/feature/licensePlateProvince/licensePlateProvinceSlice.js";
import QuickEditLicensePlateProvinceComponent from "../../components/QuickEditLicensePlateProvinceComponent.jsx";
import QuickCreateLicensePlateProvinceComponent from "../../components/QuickCreateLicensePlateProvinceComponent.jsx";
import { useGetAllLicensePlateProvincesQuery } from "../../redux/feature/licensePlateProvince/licensePlateProvinceApiSlice.js";
import { useGetAllLicensePlateTypesQuery } from "../../redux/feature/licensePlateType/licensePlateTypeApiSlice.js";
import { setIsOpenQuickCreateLicensePlateType, setIsOpenQuickEditLicensePlateType, setUuidForQuickEditLicensePlateType } from "../../redux/feature/licensePlateType/licensePlateTypeSlice.js";
import QuickEditLicensePlateTypeComponent from "../../components/QuickEditLicensePlateTypeComponent.jsx";
import QuickCreateLicensePlateTypeComponent from "../../components/QuickCreateLicensePlateTypeComponent.jsx";
import { useGetAllVehicleTypesQuery } from "../../redux/feature/vehicleType/vehicleTypeApiSlice.js";
import { setIsOpenQuickCreateVehicleType, setIsOpenQuickEditVehicleType, setUuidForQuickEditVehicleType } from "../../redux/feature/vehicleType/vehicleTypeSlice.js";
import QuickEditVehicleTypeComponent from "../../components/QuickEditVehicleTypeComponent.jsx";
import QuickCreateVehicleTypeComponent from "../../components/QuickCreateVehicleTypeComponent.jsx";

function AddNewVehicle() {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const [profileImageFile, setProfileImageFile] = useState(null);  
  const isQuickEditLicensePlateProvinceOpen = useSelector((state) => state.licensePlateProvince.isOpenQuickEditLicensePlateProvince);
  const isQuickCreateLicensePlateProvinceOpen = useSelector((state) => state.licensePlateProvince.isOpenQuickCreateLicensePlateProvince);
  const isQuickEditLicensePlateTypeOpen = useSelector((state) => state.licensePlateType.isOpenQuickEditLicensePlateType);
  const isQuickCreateLicensePlateTypeOpen = useSelector((state) => state.licensePlateType.isOpenQuickCreateLicensePlateType);
  const isQuickEditVehicleTypeOpen = useSelector((state) => state.vehicleType.isOpenQuickEditVehicleType);  
  const isQuickCreateVehicleTypeOpen = useSelector((state) => state.vehicleType.isOpenQuickCreateVehicleType);
  const [nameProvince, setNameProvince] = useState("provinceNameKh");
  const { isAdmin, sites } = useAuth();
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

  const [addNewVehicle,
    {
      isSuccess: isSuccessAddNewVehicle,
      isLoading:isLoadingAddNewVehicle,
      isError: isErrorAddNewVehicle,
      error: errorAddNewVehicle,
    }] = useAddNewVehicleMutation();

  const [uploadImage] = useUploadImageMutation();

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

  useEffect(()=>{
       if (isSuccessAddNewVehicle) {
         navigate(`/${isAdmin ? "admin" : "dash"}/vehicles`);
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
  }, [isSuccessAddNewVehicle])

  useEffect(() => {
    if (isErrorAddNewVehicle){
      toast.error(`${errorAddNewVehicle?.data?.error?.description}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
    }
  }, [isErrorAddNewVehicle]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      let profileImageUri = null;
      if (profileImageFile) {
        formData.append("file", profileImageFile);
        const uploadResponse = await uploadImage(formData).unwrap();
        profileImageUri = uploadResponse.uri;
      }

      await addNewVehicle({
        numberPlate: values.plateNumber,
        vehicleMake: values.make,
        vehicleModel: values.model,
        color: values.color,
        userId: values.userId,
        vehicleTypeId: values.vehicleTypeId,
        image: profileImageUri,
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

  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navigate(`${isAdmin ? "admin" : "dash"}`)}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("vehicle")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("newVehicle")}
    </Typography>,
  ];

  let content;

  if (isLoadingGetAllVehicleType || isLoadingGetAllLicensePlateTypes || isLoadingGetAllFullNameUsers || isLoadingGetAllLicensePlateProvinces) content = <LoadingFetchingDataComponent/>

  if (isSuccessGetAllVehicleType && isSuccessGetAllLicensePlateTypes && isSuccessGetAllFullNameUsers && isSuccessGetAllLicensePlateProvinces) {
    content = (
        <div>
          <SeoComponent title={"Create a new vehicle"}/>
          <MainHeaderComponent
              breadcrumbs={breadcrumbs}
              title={t("createNewVehicle")}
              handleBackClick={() => navigate(`/${isAdmin ? "admin" : "dash"}/vehicles`)}
          />
          <div>
            <Formik
                initialValues={{
                  plateNumber: "",
                  color: "",
                  make: "",
                  model: "",
                  vehicleTypeId: "",
                  userId: "",
                  lppId: "",
                  licensePlateTypeId: "",
                  branchUuid: ""
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
                }

                const handlelicensePlateProvincesChange = (value) => {
                  setFieldValue("lppId", value);
                };

                const handleVehicleTypeChange = (value) => {
                  setFieldValue("vehicleTypeId", value);
                };

                const handleLicesePlateTypesChange = (value) => {
                  setFieldValue("licensePlateTypeId", value);
                };

                const selectedProvince = licensePlateProvincesFetched?.data?.find(
                    (lpp) => lpp?.uuid === values?.lppId
                );

                const plateNumberShow = values.plateNumber
                    ? values.plateNumber
                    : "XXXXXX";

                const provinceNameEn = selectedProvince
                    ? selectedProvince?.provinceNameEn
                    : "Not Selected";

                const provinceNameKh = selectedProvince
                    ? selectedProvince?.provinceNameKh
                    : "Not Selected";

                return (
                    <Form className="pb-8">
                      <Grid2 container spacing={3}>
                        <Grid2 size={{xs: 12, md: 4}}>
                          <Card
                              sx={{
                                ...cardStyle,
                              }}
                              className=" gap-5 pt-[40px] px-[24px] pb-[40px]"
                          >
                            <div
                                className="w-auto rounded-[12px] mb-[16px] border-blue-600 border-[3px] px-[24px] py-2 flex items-center justify-between">
                              <div className="flex flex-col">
                                <Typography variant="h6" className="text-blue-600">
                                  {provinceNameEn}
                                </Typography>
                                <Typography variant="h6" className="text-red-600">
                                  {provinceNameKh}
                                </Typography>
                              </div>
                              <Typography
                                  variant="h4"
                                  className="underline text-blue-600 uppercase"
                              >
                                {plateNumberShow}
                              </Typography>
                            </div>

                            <ImageUploadComponent
                                setProfileImageFile={setProfileImageFile}
                                profileImageFile={profileImageFile}
                            />

                          </Card>
                        </Grid2>

                        <Grid2 size={{xs: 12, md: 8}}>
                          <Card
                              sx={{
                                ...cardStyle,
                                padding: "24px",
                              }}
                              className="flex-auto w-full"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                                  onChange={handlelicensePlateProvincesChange}
                                  fullWidth={true}
                                  optionLabelKey={nameProvince}
                                  error={errors.lppId}
                                  touched={touched.lppId}
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
                                          error={errors.branchId}
                                          touched={touched.branchId}
                                          itemsLabelKey="sites"
                                          optionLabelKey="siteName"
                                          groupLabelKey="companyName"
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

                            <div className="col-span-2 flex justify-end mt-[20px]">
                              <ButtonComponent
                                  btnTitle={t("createVehicle")}
                                  type={"submit"}
                                  isLoading={isLoadingAddNewVehicle}
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
          {isQuickEditLicensePlateProvinceOpen && <QuickEditLicensePlateProvinceComponent/>}
          {isQuickCreateLicensePlateProvinceOpen && <QuickCreateLicensePlateProvinceComponent/>}
          {isQuickEditLicensePlateTypeOpen && <QuickEditLicensePlateTypeComponent/>}
          {isQuickCreateLicensePlateTypeOpen && <QuickCreateLicensePlateTypeComponent/>}
          {isQuickEditVehicleTypeOpen && <QuickEditVehicleTypeComponent/>}
          {isQuickCreateVehicleTypeOpen && <QuickCreateVehicleTypeComponent/>}
        </div>
    );
  }

  return content;
}

export default AddNewVehicle;

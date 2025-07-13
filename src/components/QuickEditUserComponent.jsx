import {
  Backdrop,
  Box,
  Button, CircularProgress,
  FormControl,
  FormHelperText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsOpenQuickEdit,
  setQuickEditUserReponse,
} from "../redux/feature/users/userSlice";
import { buttonStyleContained, buttonStyleOutlined } from "../assets/style";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import useTranslate from "../hook/useTranslate";
import useAuth from "../hook/useAuth";
import { DatePicker } from "@mui/x-date-pickers";
import SelectComponent from "./SelectComponent";
import SelectSingleComponent from "./SelectSingleComponent";
import dayjs from "dayjs";
import {
  useGetAllRolesQuery,
  useUpdateUserMutation,
} from "../redux/feature/users/userApiSlice";
import {useGetAllCompaniesQuery} from "../redux/feature/company/companyApiSlice";
import { useEffect, useState } from "react";
import {Slide, toast} from "react-toastify";
import { useGetAllGendersQuery } from "../redux/feature/gender/genderApiSlice";
import { LoadingButton } from "@mui/lab";

function QuickEditUserComponent() {
  const open = useSelector((state) => state.users.isOpenQuickEdit);
  const user = useSelector((state) => state.users.userForQuickEdit);
  const dispatch = useDispatch();
  const handleClose = () => dispatch(setIsOpenQuickEdit(false));
  const [error, setError] = useState(null);
  const { t } = useTranslate();
  const { isManager, isAdmin } = useAuth();
  const {data:companyName, isSuccess: isSuccessGetCompanyName, isLoading: isLoadingGetCompanyName}= useGetAllCompaniesQuery("companyNameList", {skip: !isAdmin});
  const {data: role, isSuccess: isSuccessGetRole, isLoading: isLoadingGetRole} = useGetAllRolesQuery("roleList");
  const {data: gender, isSuccess: isSuccessGetGender, isLoading: isLoadingGetGender} = useGetAllGendersQuery("genderList");

  const [
    updateUser,
    {
      isSuccess: isSuccessUpdateUser,
      isLoading: isLoadingUpdateUser,
      isError: isErrorUpdateUser,
      error: errorUpdateUser,
    },
  ] = useUpdateUserMutation();

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
        .matches(
            /^[\u1780-\u17FF\sA-Za-z]+$/,
            t("fullNameMustContainOnlyKhmerOrEnglishCharacters")
        )
        .min(2, t("fullNameMustBeAtLeast2Characters"))
        .max(100, t("fullNameMustNotExceed100Characters"))
        .required(t("fullNameRequired")),
    dateOfBirth: Yup.date()
        .required(t("dateOfBirthRequired"))
        .test(
            "is-valid-age",
            t("ageMustBeBetween10And100"),
            function (value) {
              if (!value) {
                return false;
              }
              const today = dayjs();
              const birthDate = dayjs(value);
              const age = today.diff(birthDate, "year");
              return age >= 10 && age <= 100;
            }
        ),
    email: Yup.string()
        .email(t("invalidEmail"))
        .required(t("emailRequired")),
    phoneNumber: Yup.string()
        .matches(/^\+?\d+$/, t("phoneNumberMustContainOnlyNumbers"))
        .test("len", t("lengthMustBeBetween7And15Digits"), (val) => {
          if (val) {
            const digitsOnly = val.replace(/\D/g, "");
            return digitsOnly.length >= 7 && digitsOnly.length <= 15;
          }
          return true;
        })
        .required(t("phoneNumberRequired")),
    genderId: Yup.string().required(t("genderRequired")),

    ...(isAdmin
        ? {
          roleId: Yup.string()
              .test("len", t("roleMustNotEmpty"), (val) => {
                return val ? val.length !== 0 : false;
              })
              .required(t("roleRequired")),
          branchId: Yup.array()
              .test("len", "Branch must not be empty", (val) => {
                return val ? val.length !== 0 : false;
              })
              .required(t("branchRequired")),
        }
        : {}),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {

      const formattedDateOfBirth = dayjs(values.dateOfBirth).format(
        "YYYY-MM-DD"
      );

      const data = await updateUser({
        id: user.uuid,
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        dateOfBirth: formattedDateOfBirth,
        genderId: values.genderId,
        roleId: [values.roleId],
        branchId: values.branchId,
      });
      dispatch(setQuickEditUserReponse(data));
    } catch (error) {
      console.log("Error updating user:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccessUpdateUser) {
      toast.success(t("updateSuccess"), {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
      dispatch(setIsOpenQuickEdit(false));
    }
  }, [isSuccessUpdateUser]);

  useEffect(() => {
    if (isErrorUpdateUser) {
      toast.error(`${errorUpdateUser?.data?.error?.description}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
    }
  }, [isErrorUpdateUser]);

  const initialDateOfBirth = user.dateOfBirth ? dayjs(user.dateOfBirth) : null;

  let content;

  if (isLoadingGetCompanyName || isLoadingGetGender || isLoadingGetRole) content = (
      <Backdrop
          sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
          open={open}
          onClick={() => dispatch(setIsOpenQuickEdit(false))}>
        <CircularProgress color="inherit"/>
      </Backdrop>
  );

  if (error) {
    content = "Error";
  }

  if (isSuccessGetGender && isSuccessGetRole && (isAdmin ? isSuccessGetCompanyName : true)){
      content = (
          <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              closeAfterTransition
          >
              <Box >
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
                      <Box>
                          <Formik
                              initialValues={{
                                  fullName: user.fullName ? user.fullName : "",
                                  genderId: user.gender ? user.gender.uuid : "",
                                  email: user.email ? user.email : "",
                                  address: user.address ? user.address : "",
                                  phoneNumber: user.phoneNumber ? user.phoneNumber : "",
                                  dateOfBirth: initialDateOfBirth || null,
                                  roleId: user?.roles?.length > 0 ? user?.roles[0]?.uuid : [],
                                  branchId: user.sites ? user.sites.map((site) => site.uuid) : [],
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
                                  const handleRoleChange = (value) => {
                                      console.log({value: values.roleId})
                                      setFieldValue("roleId", value);
                                  };

                                  const handleBranchChange = (value) => {
                                      setFieldValue("branchId", value);
                                  };

                                  const handleGenderChange = (value) => {
                                      setFieldValue("genderId", value);
                                  };

                                  const errorDateOfBirth = errors.dateOfBirth && touched.dateOfBirth;
                                  return (
                                      <Form>
                                          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-[24px]">
                                              <TextField
                                                  label={t("fullName")}
                                                  variant="outlined"
                                                  sx={{
                                                      "& .MuiInputBase-input": {
                                                          boxShadow: "none",
                                                      },
                                                      borderRadius: "6px",
                                                  }}
                                                  type="text"
                                                  id="fullName"
                                                  name="fullName"
                                                  fullWidth
                                                  value={values.fullName}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  autoComplete="off"
                                                  error={errors.fullName && touched.fullName}
                                                  helperText={
                                                      errors.fullName && touched.fullName
                                                          ? errors.fullName
                                                          : null
                                                  }
                                                  size="medium"
                                              />

                                              <TextField
                                                  label={t("email")}
                                                  variant="outlined"
                                                  sx={{
                                                      "& .MuiInputBase-input": {
                                                          boxShadow: "none",
                                                      },
                                                      borderRadius: "6px",
                                                  }}
                                                  type="email"
                                                  id="email"
                                                  name="email"
                                                  fullWidth
                                                  value={values.email}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  autoComplete="off"
                                                  error={errors.email && touched.email}
                                                  helperText={
                                                      errors.email && touched.email ? errors.email : null
                                                  }
                                                  size="medium"
                                              />

                                              <SelectSingleComponent
                                                  label={t("gender")}
                                                  options={gender}
                                                  onChange={handleGenderChange}
                                                  fullWidth={true}
                                                  error={errors.genderId}
                                                  touched={touched.genderId}
                                                  optionLabelKey="gender"
                                                  selectFistValue={values.genderId}
                                              />

                                              <TextField
                                                  label={`${t("address")} (${t("optional")})`}
                                                  variant="outlined"
                                                  sx={{
                                                      "& .MuiInputBase-input": {
                                                          boxShadow: "none",
                                                      },
                                                      borderRadius: "6px",
                                                  }}
                                                  type="text"
                                                  id="address"
                                                  name="address"
                                                  fullWidth
                                                  value={values.address}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  autoComplete="off"
                                                  error={errors.address && touched.address}
                                                  helperText={
                                                      errors.address && touched.address ? errors.address : null
                                                  }
                                                  size="medium"
                                              />

                                              <TextField
                                                  label={t("phoneNumber")}
                                                  variant="outlined"
                                                  sx={{
                                                      "& .MuiInputBase-input": {
                                                          boxShadow: "none",
                                                      },
                                                      borderRadius: "6px",
                                                  }}
                                                  type="text"
                                                  id="phoneNumber"
                                                  name="phoneNumber"
                                                  fullWidth
                                                  value={values.phoneNumber}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  autoComplete="off"
                                                  error={errors.phoneNumber && touched.phoneNumber}
                                                  helperText={
                                                      errors.phoneNumber && touched.phoneNumber
                                                          ? errors.phoneNumber
                                                          : null
                                                  }
                                                  size="medium"
                                              />

                                              <FormControl
                                                  sx={{ width: "100%" }}
                                                  variant="outlined"
                                                  size="medium"
                                                  error={errors.dateOfBirth && touched.dateOfBirth}
                                              >
                                                  <DatePicker
                                                      sx={{
                                                          "& .MuiInputBase-input": {
                                                              boxShadow: "none",
                                                          },
                                                          ...(errorDateOfBirth && {
                                                              "& .MuiOutlinedInput-notchedOutline": {
                                                                  borderColor: "#f44336",
                                                                  color: "white",
                                                              },
                                                          }),
                                                          "& .MuiInputLabel-root ": {
                                                              ...(errorDateOfBirth && { color: "#f44336" }),
                                                          },
                                                      }}
                                                      label={t("dateOfBirth")}
                                                      value={values.dateOfBirth}
                                                      id="dateOfBirth"
                                                      name="dateOfBirth"
                                                      onChange={(value) => {
                                                          setFieldValue("dateOfBirth", value);
                                                      }}
                                                      format="DD-MM-YYYY"
                                                  />
                                                  <FormHelperText>
                                                      {errors.dateOfBirth && touched.dateOfBirth
                                                          ? errors.dateOfBirth
                                                          : null}
                                                  </FormHelperText>
                                              </FormControl>
                                              {isAdmin && (
                                                  <SelectSingleComponent
                                                      label={t("role")}
                                                      options={role}
                                                      onChange={handleRoleChange}
                                                      fullWidth={true}
                                                      error={errors.roleId}
                                                      touched={touched.roleId}
                                                      optionLabelKey="name"
                                                      selectFistValue={values.roleId}
                                                  />
                                              )}

                                              {isAdmin && (
                                                  <SelectComponent
                                                      label={t("branch")}
                                                      options={companyName}
                                                      onChange={handleBranchChange}
                                                      fullWidth={true}
                                                      error={errors.branchId}
                                                      touched={touched.branchId}
                                                      itemsLabelKey="sites"
                                                      optionLabelKey="siteName"
                                                      groupLabelKey="companyName"
                                                      selectFistValue={values.branchId}
                                                  />
                                              )}
                                          </Box>
                                          <Box
                                              sx={{
                                                  padding: "24px",
                                                  display: "flex",
                                                  justifyContent: "end",
                                              }}
                                          >
                                              <Button
                                                  onClick={handleClose}
                                                  sx={{
                                                      ...buttonStyleOutlined,
                                                  }}
                                              >
                                                  {t("cancel")}
                                              </Button>
                                              <LoadingButton
                                                  variant="contained"
                                                  sx={{ ...buttonStyleContained, ml: 1 }}
                                                  type="submit"
                                                  loading={isLoadingUpdateUser}                                                  
                                              >
                                                  {t('update')}
                                              </LoadingButton>
                                          </Box>
                                      </Form>
                                  );
                              }}
                          </Formik>
                      </Box>
                  </Box>
              </Box>
          </Modal>
      );
  }

  return content;

}

export default QuickEditUserComponent;

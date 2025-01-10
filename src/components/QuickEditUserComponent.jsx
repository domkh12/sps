import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpenQuickEdit, setQuickEditUserReponse } from "../redux/feature/users/userSlice";
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
  useFindAllGenderMutation,
  useGetAllRolesMutation,
  useUpdateUserMutation,
} from "../redux/feature/users/userApiSlice";
import { useGetAllCompaniesMutation } from "../redux/feature/company/companyApiSlice";
import { useEffect, useState } from "react";
import LoadingFetchingDataComponent from "./LoadingFetchingDataComponent";
import {
  setCaptionSnackBar,
  setIsOpenSnackBar,
} from "../redux/feature/actions/actionSlice";

function QuickEditUserComponent() {
  const open = useSelector((state) => state.users.isOpenQuickEdit);
  const user = useSelector((state) => state.users.userForQuickEdit);
  const dispatch = useDispatch();
  const handleClose = () => dispatch(setIsOpenQuickEdit(false));
  const genderFetched = useSelector((state) => state.users.genders);
  const rolesFetched = useSelector((state) => state.users.roles);
  const [isLoading, setIsLoading] = useState(true);
  const companyData = useSelector((state) => state.companies.companiesData);
  const [error, setError] = useState(null);
  const { t } = useTranslate();
  const { isManager, isAdmin } = useAuth();

  const [
    updateUser,
    {
      isSuccess: isSuccessUpdateUser,
      isLoading: isLoadingUpdateUser,
      isError: isErrorUpdateUser,
      error: errorUpdateUser,
    },
  ] = useUpdateUserMutation();

  const [
    findAllGender,
    {
      isSuccess: isFindAllGenderSuccess,
      isLoading: isFindAllGenderLoading,
      isError: isFindAllGenderError,
      error: findAllGenderError,
    },
  ] = useFindAllGenderMutation();

  const [
    getAllCompanies,
    {
      isSuccess: isGetAllCompaniesSuccess,
      isLoading: isGetAllCompaniesLoading,
      isError: isGetAllCompaniesError,
      error: getAllCompaniesError,
    },
  ] = useGetAllCompaniesMutation();

  const [
    getAllRoles,
    {
      isSuccess: isGetAllRolesSuccess,
      isLoading: isGetAllRolesLoading,
      isError: isGetAllRolesError,
      error: getAllRolesError,
    },
  ] = useGetAllRolesMutation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const promises = [];
        if (isManager) {
          promises.push(getAllRoles());
          promises.push(getAllCompanies());
        }
        promises.push(findAllGender());

        await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isManager, getAllRoles, getAllCompanies, findAllGender]);

  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .matches(
        /^[\u1780-\u17FF\sA-Za-z]+$/,
        "Full name must contain only Khmer and English letters and spaces"
      )
      .required("Full name is required"),
    dateOfBirth: Yup.date()
      .required("Date of birth is required")
      .test(
        "is-valid-age",
        "Must be between 10 and 120 years old",
        function (value) {
          if (!value) {
            return false;
          }
          const today = dayjs();
          const birthDate = dayjs(value);
          const age = today.diff(birthDate, "year");
          return age >= 10 && age <= 120;
        }
      ),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^\+?\d+$/, "Phone number must be numbers with an optional '+'")
      .test("len", "Must be between 7 and 15 digits", (val) => {
        if (val) {
          const digitsOnly = val.replace(/\D/g, "");
          return digitsOnly.length >= 7 && digitsOnly.length <= 15;
        }
        return true;
      })
      .required("Phone number is required"),
    genderId: Yup.string().required("Gender is required"),

    ...(isManager
      ? {
          roleId: Yup.array()
            .test("len", "Role must not be empty", (val) => {
              return val ? val.length !== 0 : false;
            })
            .required("Role is required"),
          branchId: Yup.array()
            .test("len", "Branch must not be empty", (val) => {
              return val ? val.length !== 0 : false;
            })
            .required("Branch is required"),
        }
      : {}),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("values", values);
      const data = await updateUser({
        id: user.uuid,
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        dateOfBirth: values.dateOfBirth,
        genderId: values.genderId,
        roleId: values.roleId,
        branchId: values.branchId,
      });
      dispatch(setQuickEditUserReponse(data));
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccessUpdateUser) {
      dispatch(setIsOpenSnackBar(true));
      dispatch(setCaptionSnackBar(t("createSuccess")));
      handleClose();
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);
    }
  }, [isSuccessUpdateUser]);

  const initialDateOfBirth = user.dateOfBirth ? dayjs(user.dateOfBirth) : null;

  let content;

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (error) {
    content = "Error";
  }
  if (
    !isLoading &&
    !error &&
    (isManager
      ? isFindAllGenderSuccess &&
        isGetAllRolesSuccess &&
        isGetAllCompaniesSuccess
      : isFindAllGenderSuccess)
  )
    content = (
      <Box>
        <Formik
          initialValues={{
            fullName: user.fullName ? user.fullName : "",
            genderId: user.gender ? user.gender.uuid : "",
            email: user.email ? user.email : "",
            address: user.address ? user.address : "",
            phoneNumber: user.phoneNumber ? user.phoneNumber : "",
            dateOfBirth: initialDateOfBirth || null,
            roleId: user.roles ? user.roles.map((role) => role.uuid) : [],
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
              setFieldValue("roleId", value);
            };

            const handleBranchChange = (value) => {
              setFieldValue("branchId", value);
            };

            const handleGenderChange = (value) => {
              console.log("value", value);
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
                    options={genderFetched.data}
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
                  {isManager && (
                    <SelectComponent
                      label={t("role")}
                      options={rolesFetched.data}
                      onChange={handleRoleChange}
                      fullWidth={true}
                      error={errors.roleId}
                      touched={touched.roleId}
                      optionLabelKey="name"
                      selectFistValue={values.roleId}
                    />
                  )}

                  {isManager && (
                    <SelectComponent
                      label={t("branch")}
                      options={companyData.data}
                      onChange={handleBranchChange}
                      fullWidth={true}
                      error={errors.roleId}
                      touched={touched.roleId}
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
          {content}
        </Box>
      </Box>
    </Modal>
  );
}

export default QuickEditUserComponent;

import React, { useEffect, useRef, useState } from "react";
import {
  useAddNewUserMutation,
  useGetAllRolesQuery,
} from "../../redux/feature/users/userApiSlice";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import MainHeaderComponent from "./../../components/MainHeaderComponent";
import {
  Card,
  FormControl,
  FormHelperText,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  styled,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { cardStyle } from "../../assets/style";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import ButtonComponent from "../../components/ButtonComponent";
import useTranslate from "../../hook/useTranslate.jsx";
import SelectComponent from "../../components/SelectComponent.jsx";
import SelectSingleComponent from "../../components/SelectSingleComponent.jsx";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import { useDispatch, useSelector } from "react-redux";
import ProfileUploadComponent from "../../components/ProfileUploadComponent.jsx";
import SeoComponent from "../../components/SeoComponent.jsx";
import useAuth from "../../hook/useAuth.jsx";
import {useGetAllCompaniesQuery} from "../../redux/feature/company/companyApiSlice.js";
import {Slide, toast} from "react-toastify";
import { useGetAllGendersQuery } from "../../redux/feature/gender/genderApiSlice.js";
import { setIsOpenQuickCreateGender, setIsOpenQuickEditGender, setUuidForQuickEditGender } from "../../redux/feature/gender/genderSlice.js";
import QuickEditGenderComponent from "../../components/QuickEditGenderComponent.jsx";
import QuickCreateGenderComponent from "../../components/QuickCreateGenderComponent.jsx";

function AddNewUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const isQuickEditGenderOpen = useSelector((state) => state.gender.isOpenQuickEditGender);
  const isOpenQuickCreateGender = useSelector((state) => state.gender.isOpenQuickCreateGender);
  const { t } = useTranslate();
  const { isManager, isAdmin , sites} = useAuth();
  const {data:companyData, isSuccess: isSuccessGetCompanyName, isLoading: isLoadingGetCompanyName}= useGetAllCompaniesQuery("companyNameList", {skip: !isAdmin});
  const {data: role, isSuccess: isSuccessGetRole, isLoading: isLoadingGetRole} = useGetAllRolesQuery("roleList");
  const {data: gender, isSuccess: isSuccessGetGender, isLoading: isLoadingGetGender} = useGetAllGendersQuery("genderList");
  const [
    addNewUser,
    {
      isSuccess: isSuccessAddNewUser,
      isLoading: isLoadingAddNewUser,
      isError: isErrorAddNewUser,
      error: errorAddNewUser,
    },
  ] = useAddNewUserMutation();

  const [uploadImage] = useUploadImageMutation();

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
    password: Yup.string()
      .min(8, t("passwordMustBeAtLeast8Characters"))
      .matches(/[A-Z]/, t("passwordMustContainAtLeastOneUppercaseLetter"))
      .matches(/[a-z]/, t("passwordMustContainAtLeastOneLowercaseLetter"))
      .matches(/[0-9]/, t("passwordMustContainAtLeastOneNumber"))
      .matches(/[\W_]/, t("passwordMustContainAtLeastOneSpecialCharacter"))
      .required(t("passwordRequired")),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], t("passwordsMustMatch"))
      .required(t("confirmPasswordRequired")),
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
          roleId: Yup.array()
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

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpConfirmPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 36,
    height: 20,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 17,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(15px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(17px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: "#2C3092",
          ...theme.applyStyles("dark", {
            backgroundColor: "#177ddc",
          }),
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 15,
      height: 15,
      borderRadius: 10,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 32 / 2,
      opacity: 1,
      backgroundColor: "rgba(0,0,0,.25)",
      boxSizing: "border-box",
      ...theme.applyStyles("dark", {
        backgroundColor: "rgba(255,255,255,.35)",
      }),
    },
  }));

  useEffect(() => {
    if (isSuccessAddNewUser) {
      navigate(`/${isAdmin ? "admin" : "dash"}/users`);
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
  }, [isSuccessAddNewUser, navigate, dispatch]);

  useEffect(() => {
    if (isErrorAddNewUser) {
      toast.error(`${errorAddNewUser?.data?.error?.description}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
    }
  }, [isErrorAddNewUser, dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      let profileImageUri = null;
      if (profileImageFile) {
        formData.append("file", profileImageFile);
        const uploadResponse = await uploadImage(formData).unwrap();
        profileImageUri = uploadResponse.uri;
      }

      const formattedDateOfBirth = dayjs(values.dateOfBirth).format(
        "YYYY-MM-DD"
      );
      
      await addNewUser({
        fullName: values.fullName,
        dateOfBirth: formattedDateOfBirth,
        genderId: values.genderId,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phoneNumber: values.phoneNumber,
        roleId: isAdmin ? values.roleId : [role[0].uuid],
        profileImage: profileImageUri,
        isVerified: values.isVerified,
        branchId: isAdmin ? values.branchId : [sites[0]],
      });
    } catch (error) {
      console.log("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navigate(`${isAdmin ? "admin" : "dash"}`)}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("user")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("newUser")}
    </Typography>,
  ];

  let content;

  if (isLoadingGetCompanyName || isLoadingGetGender || isLoadingGetRole) content = <LoadingFetchingDataComponent />;

  if (error) {
    content = "Error";
  }
  if (isSuccessGetRole &&
      isSuccessGetGender &&
      (isAdmin ? isSuccessGetCompanyName : true) &&
      isSuccessGetGender) {
    content = (
      <div data-aos="fade-left">
        <SeoComponent title={"Create a new user"} />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("createANewUser")}
          handleBackClick={() => navigate(`/${isAdmin ? "admin" : "dash"}/users`)}
        />
        <Formik
          initialValues={{
            fullName: "",
            genderId: "",
            email: "",
            password: "",
            confirmPassword: "",
            address: "",
            phoneNumber: "",
            profileImage: "",
            dateOfBirth: null,
            roleId: [],
            branchId: [],
            isVerified: true,
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
            const errorDateOfBirth = errors.dateOfBirth && touched.dateOfBirth;

            const handleRoleChange = (value) => {
              setFieldValue("roleId", [value]);
            };

            const handleBranchChange = (value) => {
              setFieldValue("branchId", value);
            };

            const handleGenderChange = (value) => {
              
              setFieldValue("genderId", value);
            };

            const handleIsVerifiedChange = (event) => {
              setFieldValue("isVerified", event.target.checked);
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
                      <div className="flex items-center justify-between gap-7 mt-5">
                        <div className="flex flex-col gap-2">
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "500" }}
                          >
                            {t("emailVerified")}
                          </Typography>
                          <Typography variant="body2">
                            {t(
                              "disabling-this-will-automatically-send-the-user-a-verification-email"
                            )}
                          </Typography>
                        </div>
                        <AntSwitch
                          checked={values.isVerified}
                          onChange={handleIsVerifiedChange}
                          inputProps={{ "aria-label": "ant design" }}
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
                          autoComplete="emailForCreate"
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
                          isEditable={true}
                          onClickQuickEdit={(value) => {
                            dispatch(setIsOpenQuickEditGender(true));
                            dispatch(setUuidForQuickEditGender(value));
                          }}
                          isCreate={true}
                          onClickCreate={() => {
                            dispatch(setIsOpenQuickCreateGender(true));
                          }}
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
                            errors.address && touched.address
                              ? errors.address
                              : null
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
                              console.log("value", value);
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

                        <FormControl
                          sx={{ width: "100%" }}
                          variant="outlined"
                          size="medium"
                          error={errors.password && touched.password}
                        >
                          <InputLabel htmlFor="password">
                            {t("password")}
                          </InputLabel>
                          <OutlinedInput
                            sx={{
                              "& .MuiInputBase-input": {
                                boxShadow: "none",
                              },
                              borderRadius: "6px",
                            }}
                            id="password"
                            name="password"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="passWordForCreate"
                            value={values.password}
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label={
                                    showPassword
                                      ? "hide the password"
                                      : "display the password"
                                  }
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  onMouseUp={handleMouseUpPassword}
                                  edge="end"
                                >
                                  {showPassword ? <IoEye /> : <IoEyeOff />}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Password"
                          />
                          <FormHelperText>
                            {errors.password && touched.password
                              ? errors.password
                              : null}
                          </FormHelperText>
                        </FormControl>

                        <FormControl
                          sx={{ width: "100%" }}
                          variant="outlined"
                          size="medium"
                          error={
                            errors.confirmPassword && touched.confirmPassword
                          }
                        >
                          <InputLabel htmlFor="confirmPassword">
                            {t("confirmPassword")}
                          </InputLabel>
                          <OutlinedInput
                            sx={{
                              "& .MuiInputBase-input": {
                                boxShadow: "none",
                              },
                              borderRadius: "6px",
                            }}
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="confirmPasswordForCreate"
                            value={values.confirmPassword}
                            type={showConfirmPassword ? "text" : "password"}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label={
                                    showConfirmPassword
                                      ? "hide the confirmPassword"
                                      : "display the confirmPassword"
                                  }
                                  onClick={handleClickShowConfirmPassword}
                                  onMouseDown={handleMouseDownConfirmPassword}
                                  onMouseUp={handleMouseUpConfirmPassword}
                                  edge="end"
                                >
                                  {showConfirmPassword ? (
                                    <IoEye />
                                  ) : (
                                    <IoEyeOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Confirm Password"
                          />
                          <FormHelperText>
                            {errors.confirmPassword && touched.confirmPassword
                              ? errors.confirmPassword
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
                          />
                        )}

                        {isAdmin && (
                          <SelectComponent
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
                        )}
                      </div>

                      <div className="col-span-2 flex justify-end mt-[20px]">
                        <ButtonComponent
                          btnTitle={t("createUser")}
                          type={"submit"}
                          loadingCaption={t("creating")}
                          isLoading={isLoadingAddNewUser}
                        />
                      </div>
                    </Card>
                  </Grid2>
                </Grid2>
              </Form>
            );
          }}
        </Formik>
        {isQuickEditGenderOpen && <QuickEditGenderComponent />}
        {isOpenQuickCreateGender && <QuickCreateGenderComponent />}
      </div>
    );
  }

  return content;
}

export default AddNewUser;

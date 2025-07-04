import { useEffect, useState } from "react";
import {
  useFindAllGenderQuery,
  useGetAllRolesQuery,
  useUpdateUserMutation,
} from "../../redux/feature/users/userApiSlice";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import useAuth from "../../hook/useAuth";
import useTranslate from "../../hook/useTranslate";
import {
  Button,
  Card,
  Chip,
  FormControl,
  FormHelperText,
  Grid2,
  styled,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import SeoComponent from "../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import { cardStyle } from "../../assets/style";
import ProfileUploadComponent from "../../components/ProfileUploadComponent";
import SelectSingleComponent from "../../components/SelectSingleComponent";
import { DatePicker } from "@mui/x-date-pickers";
import { useDispatch } from "react-redux";
import SelectComponent from "../../components/SelectComponent";
import ButtonComponent from "../../components/ButtonComponent";
import dayjs from "dayjs";
import {
  setIsOpenConfirmDelete,
} from "../../redux/feature/actions/actionSlice";
import { setIdUserToDelete } from "../../redux/feature/users/userSlice";
import {useGetAllCompaniesQuery} from "../../redux/feature/company/companyApiSlice.js";
import {toast, Slide} from "react-toastify";

function EditUserForm({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const { isManager, isAdmin, sites } = useAuth();
  const [error, setError] = useState(null);
  const {data:companyData, isSuccess: isSuccessGetCompanyName, isLoading: isLoadingGetCompanyName}= useGetAllCompaniesQuery("companyNameList", {skip: !isAdmin});
  const {data: role, isSuccess: isSuccessGetRole, isLoading: isLoadingGetRole} = useGetAllRolesQuery("roleList");
  const {data: gender, isSuccess: isSuccessGetGender, isLoading: isLoadingGetGender} = useFindAllGenderQuery("genderList");

  const [
    updateUser,
    {
      isSuccess: isSuccessUpdateUser,
      isLoading: isLoadingUpdateUser,
      isError: isErrorUpdateUser,
      error: errorUpdateUser,
    },
  ] = useUpdateUserMutation();
  
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
          roleId: Yup.string().required(t("roleRequired")),
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

      await updateUser({
        id: user.uuid,
        dateOfBirth: formattedDateOfBirth,
        fullName: values.fullName,
        genderId: values.genderId,
        address: values.address,
        branchId: isAdmin ? values.branchId : [sites[0]],
        email: values.email,
        phoneNumber: values.phoneNumber,
        roleId: [values.roleId],
        profileImage: profileImageUri,
        isVerified: values.isVerified,
        isDeleted: values.isDeleted,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isSuccessUpdateUser) {
      navigate(`/${isAdmin ? "admin" : "dash"}/users`);
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
  }, [isErrorUpdateUser, dispatch]);

  const handleDelete = () => {
    dispatch(setIsOpenConfirmDelete(true));
    dispatch(setIdUserToDelete(user.uuid));
  };

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

  let content;

  if (isLoadingGetCompanyName || isLoadingGetGender || isLoadingGetRole) content = <LoadingFetchingDataComponent />;

  if (error) {
    content = "Error";
  }

  if (isSuccessGetGender && isSuccessGetRole && (isAdmin ? isSuccessGetCompanyName : true)) {
    const breadcrumbs = [
      <button
        className="text-black hover:underline"
        onClick={() => navigate(`/${isAdmin ? "admin" : "dash"}`)}
        key={1}
      >
        {t("dashboard")}
      </button>,
      <Typography color="inherit" key={2}>
        {t("user")}
      </Typography>,
      <Typography color="inherit" key={3}>
        {user?.fullName}
      </Typography>,
    ];
    content = (
      <div data-aos="fade-left">
        <SeoComponent title={"Create a new user"} />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={user?.fullName}
          handleBackClick={() => navigate(`/${isAdmin ? "admin" : "dash"}/users`)}
        />
        <Formik
          initialValues={{
            fullName: user?.fullName,
            genderId: user?.gender?.uuid,
            email: user?.email,
            address: user?.address || "",
            phoneNumber: user?.phoneNumber,
            profileImage: user?.profileImage,
            dateOfBirth: dayjs(user?.dateOfBirth),
            roleId: user?.roles[0]?.uuid,
            branchId: user?.sites.map((site) => site.uuid),
            isVerified: user?.isVerified,
            isDeleted: user?.isDeleted,
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
            console.log({values})
            const errorDateOfBirth = errors.dateOfBirth && touched.dateOfBirth;

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

            const handleIsVerifiedChange = (event) => {
              setFieldValue("isVerified", event.target.checked);
            };

            const handleisDeletedChange = (event) => {
              setFieldValue("isDeleted", event.target.checked);
            };

            return (
              <Form className="pb-8">
                <Grid2 container spacing={3}>
                  <Grid2 size={{ xs: 12, md: 4 }}>
                    <Card
                      sx={{
                        ...cardStyle,
                      }}
                      className=" gap-5 pt-[24px] px-[24px] pb-[40px] "
                    >
                      <div className="flex justify-end items-center mb-3">
                        {values.isDeleted ? (
                          <Chip
                            sx={{
                              backgroundColor: "#FFD6D6",
                              color: "#981212",
                              borderRadius: "6px",
                              fontWeight: "500",
                            }}
                            size="small"
                            label="Banned"
                          />
                        ) : (
                          <Chip
                            sx={{
                              backgroundColor: "#D2E3D6",
                              color: "#207234",
                              borderRadius: "6px",
                              fontWeight: "500",
                            }}
                            size="small"
                            label="Active"
                          />
                        )}
                      </div>

                      <div className="flex justify-center items-center flex-col gap-5">
                        <ProfileUploadComponent
                          setProfileImageFile={setProfileImageFile}
                          profileImageFile={profileImageFile || ""}
                          profileUrl={values?.profileImage || ""}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-7 mt-5">
                        <div className="flex flex-col gap-2">
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "500" }}
                          >
                            {t("banned")}
                          </Typography>
                          <Typography variant="body2">
                            {t("descriptionBanned")}
                          </Typography>
                        </div>
                        <AntSwitch
                          checked={values.isDeleted}
                          onChange={handleisDeletedChange}
                          inputProps={{ "aria-label": values.isDeleted }}
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
                          inputProps={{ "aria-label": values.isVerified }}
                        />
                      </div>
                      <div className="flex justify-center items-center">
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#FFD6D6",
                            color: "#981212",
                            borderRadius: "8px",
                            fontWeight: "500",
                            boxShadow: "none",
                            ":hover": {
                              boxShadow: "none",
                            },
                            textTransform: "none",
                            mt: 3,
                          }}
                          onClick={handleDelete}
                        >
                          {t("deleteUser")}
                        </Button>
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
                            options={companyData}
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
                      </div>

                      <div className="col-span-2 flex justify-end mt-[20px]">
                        <ButtonComponent
                          btnTitle={t("saveChanges")}
                          type="submit"
                          isLoading={isLoadingUpdateUser}
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
    );
  }

  return content;
}

export default EditUserForm;

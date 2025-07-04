import {
  Card,
  FormControl,
  FormHelperText,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useFindAllGenderQuery} from "../../redux/feature/users/userApiSlice";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import { useNavigate } from "react-router-dom";
import SeoComponent from "../../components/SeoComponent";
import useTranslate from "../../hook/useTranslate";
import ProfileUploadComponent from "../../components/ProfileUploadComponent";
import { cardStyle } from "../../assets/style";
import * as Yup from "yup";
import SelectSingleComponent from "../../components/SelectSingleComponent";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import ButtonComponent from "../../components/ButtonComponent";
import {useGetUserProfileQuery, useUpdateUserProfileMutation} from "../../redux/feature/auth/authApiSlice";
import {Slide, toast} from "react-toastify";
function Account() {
  const { t } = useTranslate();
  const [profileImageFile, setProfileImageFile] = useState(null);
  const {data: gender, isSuccess: isSuccessGetGender, isLoading: isLoadingGetGender} = useFindAllGenderQuery("genderList");
  const {data: userProfile, isSuccess: isSuccessGetUserProfile, isLoading: isLoadingGetUserProfile} = useGetUserProfileQuery("userProfile");

  const [uploadImage] = useUploadImageMutation();

  const [
    updateUserProfile,
    {
      isSuccess: isSuccessUpdateUser,
      isLoading: isLoadingUpdateUser,
      isError: isErrorUpdateUser,
      error: errorUpdateUser,
    },
  ] = useUpdateUserProfileMutation();

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
        "Must be between 10 and 100 years old",
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
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      let profileImageUri = null;
      if (profileImageFile) {
        formData.append("file", profileImageFile);
        const uploadResponse = await uploadImage(formData).unwrap();
        profileImageUri = uploadResponse.uri;
      } else {
        profileImageUri = values?.profileImage;
      }
      const formattedDateOfBirth = dayjs(values.dateOfBirth).format(
        "YYYY-MM-DD"
      );

      await updateUserProfile({
        dateOfBirth: formattedDateOfBirth,
        fullName: values.fullName,
        genderUuid: values.genderId,
        address: values.address,
        email: values.email,
        phoneNumber: values.phoneNumber,
        profileImage: profileImageUri,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  let content;

  if (isLoadingGetGender || isLoadingGetUserProfile) content = <LoadingFetchingDataComponent />;

  if (isSuccessGetGender && isSuccessGetUserProfile) {
    content = (
      <>
        <SeoComponent title={"Account"} />
        <Formik
          initialValues={{
            fullName: userProfile?.fullName,
            genderId: userProfile?.gender?.uuid,
            email: userProfile?.email,
            address: userProfile?.address || "",
            phoneNumber: userProfile?.phoneNumber,
            profileImage: userProfile?.profileImage,
            dateOfBirth: dayjs(userProfile?.dateOfBirth),
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
            const handleGenderChange = (value) => {
              setFieldValue("genderId", value);
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
                          profileImageFile={profileImageFile || ""}
                          profileUrl={values?.profileImage || ""}
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
      </>
    );
  }
  return content
}

export default Account

import {
  Autocomplete,
  Card,
  Chip,
  Grid2,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useAddNewParkingMutation } from "../../redux/feature/parking/parkingApiSlice";
import SeoComponent from "./../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import useTranslate from "../../hook/useTranslate";
import { useNavigate } from "react-router-dom";
import { cardStyle } from "../../assets/style";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import ButtonComponent from "../../components/ButtonComponent";
import {
  setCaptionSnackBar,
  setErrorSnackbar,
  setIsOpenSnackBar,
} from "../../redux/feature/actions/actionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import SelectSingleComponent from "./../../components/SelectSingleComponent";
import { useGetAllCompaniesMutation } from "../../redux/feature/company/companyApiSlice";
import useAuth from "../../hook/useAuth";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";

export default function AddNewParking() {
  const [profileImageFile, setProfileImageFile] = useState(null);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { isManager } = useAuth();
  const companyFetched = useSelector((state) => state.companies.companiesData);

  const [
    addNewParking,
    {
      isSuccess: isAddNewParkingSuccess,
      isError: isErrorAddNewParking,
      error: errorAddNewParking,
    },
  ] = useAddNewParkingMutation();

  const [
    getAllCompanies,
    {
      isSuccess: isGetAllCompaniesSuccess,
      isLoading: isLoadingGetAllCompanies,
      isError: isErrorGetAllCompanies,
      error: errorGetAllCompanies,
    },
  ] = useGetAllCompaniesMutation();

  const [uploadImage] = useUploadImageMutation();

  const validationSchema = Yup.object().shape({
    location: Yup.string().required(t("locationIsRequired")),
    lotName: Yup.array().min(1, t("lotNameValidate")),
    siteUuid: Yup.string().required("Branch is required!"),
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const promises = [];
        if (isManager) {
          promises.push(getAllCompanies());
        }

        await Promise.all(promises);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isAddNewParkingSuccess) {
      navigate("/dash/parkings");
      dispatch(setIsOpenSnackBar(true));
      dispatch(setCaptionSnackBar(t("createSuccess")));
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);
    }
  }, [isAddNewParkingSuccess]);

  useEffect(() => {
    if (isErrorAddNewParking) {
      dispatch(setIsOpenSnackBar(true));
      dispatch(setErrorSnackbar(true));
      dispatch(
        setCaptionSnackBar(`${errorAddNewParking?.data?.error?.description}`)
      );
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);

      setTimeout(() => {
        dispatch(setErrorSnackbar(false));
      }, 3500);
    }
  }, [isErrorAddNewParking]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      let profileImageUri = null;
     
      if (profileImageFile) {
        formData.append("file", profileImageFile);
        const uploadResponse = await uploadImage(formData).unwrap();
        profileImageUri = uploadResponse.uri;
      }

       await addNewParking({
        label: values.location,
        image: profileImageUri,
        siteUuid: values.siteUuid,
        lotName: values.lotName,
      });

    } catch (err) {
      console.log(err);
    }
  };

  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navigate("/dash")}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("parkingSpace")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("newParkingSpace")}
    </Typography>,
  ];

  let content;

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (!isLoading) {
    content = (
      <>
        <SeoComponent title={"Create a new parking space"} />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("createAParkingSpace")}
        />
        <div>
          <Formik
            initialValues={{ location: "", lotName: [], siteUuid: "" }}
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
                setFieldValue("siteUuid", value);
              };

              return (
                <Form>
                  <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                      <Card
                        sx={{ ...cardStyle }}
                        className=" gap-5 pt-[40px] px-[24px] pb-[40px]"
                      >
                        <ImageUploadComponent
                          setProfileImageFile={setProfileImageFile}
                          profileImageFile={profileImageFile}
                        />
                      </Card>
                    </Grid2>
                    <Grid2 size={{ xs: 12, md: 8 }}>
                      <Card sx={{ ...cardStyle, padding: "24px" }}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <TextField
                            label={t("location")}
                            variant="outlined"
                            sx={{
                              "& .MuiInputBase-input": {
                                boxShadow: "none",
                              },
                              borderRadius: "6px",
                            }}
                            type="text"
                            id="location"
                            name="location"
                            fullWidth
                            value={values.location}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            error={errors.location && touched.location}
                            helperText={
                              errors.location && touched.location
                                ? errors.location
                                : null
                            }
                            size="medium"
                          />

                          <SelectSingleComponent
                            label={t("branch")}
                            options={companyFetched.data}
                            onChange={handleBranchChange}
                            fullWidth={true}
                            error={errors.siteUuid}
                            touched={touched.siteUuid}
                            itemsLabelKey="sites"
                            optionLabelKey="siteName"
                            groupLabelKey="companyName"
                          />

                          <Autocomplete
                            sx={{
                              "& .MuiInputBase-input": {
                                boxShadow: "none",
                              },
                            }}
                            clearIcon={false}
                            options={values.lotName}
                            freeSolo
                            multiple
                            getOptionLabel={(option) => option}
                            onChange={(event, newValue) => {
                              setFieldValue("lotName", newValue);
                            }}
                            renderTags={(value, props) =>
                              value.map((option, index) => (
                                <Chip label={option} {...props({ index })} />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                label={t("addLots")}
                                {...params}
                                error={errors.lotName && touched.lotName}
                                helperText={
                                  errors.lotName && touched.lotName
                                    ? errors.lotName
                                    : null
                                }
                              />
                            )}
                          />
                        </div>
                        <div className="col-span-2 flex justify-end mt-[20px]">
                          <ButtonComponent
                            btnTitle={t("createParkingSpace")}
                            type={"submit"}
                            loadingCaption={t("creating")}
                            // isLoading={isLoading}
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
      </>
    );
  }

  return content;
}

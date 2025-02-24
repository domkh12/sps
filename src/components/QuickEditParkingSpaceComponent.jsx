import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { buttonStyleContained, buttonStyleOutlined } from "../assets/style";
import { Form, Formik } from "formik";
import LoadingFetchingDataComponent from "./LoadingFetchingDataComponent";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTranslate from "../hook/useTranslate";
import { useUpdateParkingMutation } from "../redux/feature/parking/parkingApiSlice";
import { useGetAllCompaniesMutation } from "../redux/feature/company/companyApiSlice";
import { useUploadImageMutation } from "../redux/feature/uploadImage/uploadImageApiSlice";
import * as Yup from "yup";
import SelectSingleComponent from "./SelectSingleComponent";
import useAuth from "../hook/useAuth";
import { setIsOpenQuickEditParkingSpace } from "../redux/feature/parking/parkingSlice";
import {
  setCaptionSnackBar,
  setErrorSnackbar,
  setIsOpenSnackBar,
} from "../redux/feature/actions/actionSlice";

function QuickEditParkingSpaceComponent() {
  const open = useSelector(
    (state) => state.parking.isOpenQuickEditParkingSpace
  );
  const parkingSpace = useSelector((state) => state.parking.parkingSpaceToEdit);
  const [isLoading, setIsLoading] = useState(true);
  const { isManager } = useAuth();
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const companyFetched = useSelector((state) => state.companies.companiesData);

  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
  };

  const [
    updateParking,
    {
      isSuccess: isSuccessUpdateParking,
      isLoading: isLoadingUpdateParking,
      isError: isErrorUpdateParking,
      error: errorUpdateParking,
    },
  ] = useUpdateParkingMutation();

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
    if (isSuccessUpdateParking) {
      dispatch(setIsOpenQuickEditParkingSpace(false));
      dispatch(setIsOpenSnackBar(true));
      dispatch(setCaptionSnackBar(t("createSuccess")));
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);
    }
  }, [isSuccessUpdateParking]);

  useEffect(() => {
    if (isErrorUpdateParking) {
      dispatch(setIsOpenSnackBar(true));
      dispatch(setErrorSnackbar(true));
      dispatch(
        setCaptionSnackBar(`${errorUpdateParking?.data?.error?.description}`)
      );
      setTimeout(() => {
        dispatch(setIsOpenSnackBar(false));
      }, 3000);

      setTimeout(() => {
        dispatch(setErrorSnackbar(false));
      }, 3500);
    }
  }, [isErrorUpdateParking]);

  const handleSubmit = async (values) => {
    try {
      await updateParking({
        uuid: parkingSpace.uuid,
        label: values.location,
        siteUuid: values.siteUuid,
        lotName: values.lotName,
      });
    } catch (err) {
      console.log(err);
    }
  };

  let content;

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (!isLoading) {
    content = (
      <Box>
        <Formik
          initialValues={{
            location: parkingSpace.label,
            lotName: parkingSpace.parkingLots.map((lot) => lot.lotName),
            siteUuid: parkingSpace.site.uuid,
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
              setFieldValue("siteUuid", value);
            };

            return (
              <Form>
                <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-[24px]">
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
                    selectFistValue={values.siteUuid}
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
                    value={values.lotName}
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
                      dispatch(setIsOpenQuickEditParkingSpace(false));
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
          {/* {isErrorUpdateSite && (
            <Box sx={{ px: "24px" }}>
              <AlertMessageComponent />
            </Box>
          )} */}

          {content}
        </Box>
      </Box>
    </Modal>
  );
}

export default QuickEditParkingSpaceComponent;

import {
  Autocomplete, Button,
  Card,
  Grid2,
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
import {useDispatch, useSelector} from "react-redux";
import { useUploadImageMutation } from "../../redux/feature/uploadImage/uploadImageApiSlice";
import SelectSingleComponent from "./../../components/SelectSingleComponent";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import {useGetAllCompaniesQuery} from "../../redux/feature/company/companyApiSlice.js";
import {FiPlus} from "react-icons/fi";
import {clearLocalSlotData, setIsOpenAddNewSlot, setNewLocalSlotData} from "../../redux/feature/slot/slotSlice.js";
import ModalAddSlotComponent from "../../components/ModalAddSlotComponent.jsx";
import {Slide, toast} from "react-toastify";
import {useAddMultipleSlotMutation} from "../../redux/feature/slot/slotApiSlice.js";

export default function AddNewParking() {
  const [profileImageFile, setProfileImageFile] = useState(null);
  const { t } = useTranslate();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const localSlotData = useSelector((state) => state.slot.localSlotData);
  const {data:companyName, isSuccess: isSuccessGetCompanyName, isLoading: isLoadingGetCompanyName}= useGetAllCompaniesQuery("companyNameList");

    // Mutation to add multiple slots
  const [addMultipleSlot,{
    isSuccess: isAddMultipleSlotSuccess,
    isLoading: isLoadingAddMultipleSlot,
    error: errorAddMultipleSlot,
    isError: isErrorAddMultipleSlot,
  }] = useAddMultipleSlotMutation();

    // Mutation to add a new parking space
  const [
    addNewParking,
    {
      isSuccess: isAddNewParkingSuccess,
      isLoading: isLoadingAddNewParking,
      isError: isErrorAddNewParking,
      error: errorAddNewParking,
    },
  ] = useAddNewParkingMutation();

  const [uploadImage] = useUploadImageMutation();

  const validationSchema = Yup.object().shape({
    parkingSpaceName: Yup.string().required(t("parkingSpaceIsRequired")),
    siteUuid: Yup.string().required("Branch is required!"),
  });

  useEffect(() => {
    if (isAddNewParkingSuccess) {
      navigate("/admin/parking-spaces");
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
  }, [isAddNewParkingSuccess]);

  useEffect(() => {
    if (isErrorAddNewParking) {
      toast.error(`${errorAddNewParking?.data?.error?.description}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
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

      const res = await addNewParking({
        label: values.parkingSpaceName,
        image: profileImageUri,
        siteUuid: values.siteUuid
        });
      const parkingSpaceUuid = res.data.uuid;
      const updatedSlotLocalData = localSlotData.map(slot => {
        return { ...slot, parkingSpaceUuid: parkingSpaceUuid };
      });
      // dispatch()
      await addMultipleSlot({slots: updatedSlotLocalData});

      dispatch(clearLocalSlotData());
    } catch (err) {
      console.log(err);
    }
  };

  const breadcrumbs = [
    <button
      className=" hover:underline"
      onClick={() => navigate("/admin")}
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

  if (isLoadingGetCompanyName) content = <LoadingFetchingDataComponent />;

  if (isSuccessGetCompanyName) {
    content = (
      <>
        <SeoComponent title={"Create a new parking space"} />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("createAParkingSpace")}
          handleBackClick={() => navigate(`/admin/parking-spaces`)}
        />
        <div>
          <Formik
            initialValues={{ parkingSpaceName: "", siteUuid: "" }}
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
              const handleSlotChange = (event, newValue) => {
                dispatch(setNewLocalSlotData(newValue));
              };
              return (
                <Form>
                  <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, md: 4 }}>
                      <Card
                        sx={{ ...cardStyle }}
                        className="gap-5 pt-[40px] px-[24px] pb-[40px]"
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
                            label={t("parkingSpaceName")}
                            variant="outlined"
                            sx={{
                              "& .MuiInputBase-input": {
                                boxShadow: "none",
                              },
                              borderRadius: "6px",
                            }}
                            type="text"
                            id="parkingSpaceName"
                            name="parkingSpaceName"
                            fullWidth
                            value={values.parkingSpaceName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="off"
                            error={errors.parkingSpaceName && touched.parkingSpaceName}
                            helperText={
                              errors.parkingSpaceName && touched.parkingSpaceName
                                ? errors.parkingSpaceName
                                : null
                            }
                            size="medium"
                          />

                          <SelectSingleComponent
                            label={t("branch")}
                            options={companyName}
                            onChange={handleBranchChange}
                            fullWidth={true}
                            error={errors.siteUuid}
                            touched={touched.siteUuid}
                            itemsLabelKey="sites"
                            optionLabelKey="siteName"
                            groupLabelKey="companyName"
                          />
                        </div>
                          <div className="flex flex-col justify-end items-end">
                            <Button
                                onClick={() => dispatch(setIsOpenAddNewSlot(true))}
                                startIcon={<FiPlus />}
                                disableRipple
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "transparent",
                                    textDecoration: "underline",
                                  },
                                }}
                            >
                              {t("addSlot")}
                            </Button>
                            <Autocomplete
                                multiple
                                id="slot_tage"
                                options={localSlotData}
                                fullWidth={true}
                                getOptionLabel={(option) => option.lotName}
                                value={localSlotData}
                                onChange={handleSlotChange}
                                renderInput={(params) => (
                                    <TextField
                                        sx={{
                                          "& .MuiInputBase-input": {
                                            boxShadow: "none",
                                          },
                                          borderRadius: "6px",
                                        }}
                                        {...params}
                                        label={t("slot")}
                                        placeholder="Add"
                                    />
                                )}
                            />
                          </div>

                        <div className="col-span-2 flex justify-end mt-[20px]">
                          <ButtonComponent
                            btnTitle={t("createParkingSpace")}
                            type={"submit"}
                            isLoading={isLoadingAddNewParking || isLoadingAddMultipleSlot}
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
        <ModalAddSlotComponent/>
      </>
    );
  }

  return content;
}

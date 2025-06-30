import {
  Autocomplete, Backdrop,
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { buttonStyleContained, buttonStyleOutlined } from "../assets/style";
import { Form, Formik } from "formik";
import {useEffect, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import useTranslate from "../hook/useTranslate";
import { useUpdateParkingMutation } from "../redux/feature/parking/parkingApiSlice";
import * as Yup from "yup";
import SelectSingleComponent from "./SelectSingleComponent";
import { setIsOpenQuickEditParkingSpace } from "../redux/feature/parking/parkingSlice";
import {useGetAllCompaniesQuery} from "../redux/feature/company/companyApiSlice.js";
import {appendSlotLocalData, clearLocalSlotData, setIsOpenAddNewSlot} from "../redux/feature/slot/slotSlice.js";
import {FiPlus} from "react-icons/fi";
import ModalAddSlotComponent from "./ModalAddSlotComponent.jsx";
import {Slide, toast} from "react-toastify";
import {useAddMultipleSlotMutation} from "../redux/feature/slot/slotApiSlice.js";

function QuickEditParkingSpaceComponent() {
  const open = useSelector((state) => state.parking.isOpenQuickEditParkingSpace);
  const parkingSpace = useSelector((state) => state.parking.parkingSpaceToEdit);
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const slotUpdateLocalData = useSelector((state) => state.slot.slotUpdateLocalData);
  const slotsLoadedRef = useRef(false);
  const {data:companyName, isSuccess: isSuccessGetCompanyName, isLoading: isLoadingGetCompanyName}= useGetAllCompaniesQuery("companyNameList");
  const handleClose = () => {dispatch(setIsOpenQuickEditParkingSpace(false));};

  useEffect(() => {
      if (open) {
          dispatch(appendSlotLocalData(parkingSpace.parkingLots));
          slotsLoadedRef.current = true;
      }
  }, [open]);

  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
  };

    const [addMultipleSlot,{
        isSuccess: isAddMultipleSlotSuccess,
        isLoading: isLoadingAddMultipleSlot,
        error: errorAddMultipleSlot,
        isError: isErrorAddMultipleSlot,
    }] = useAddMultipleSlotMutation();

  const [
    updateParking,
    {
      isSuccess: isSuccessUpdateParking,
      isLoading: isLoadingUpdateParking,
      isError: isErrorUpdateParking,
      error: errorUpdateParking,
    },
  ] = useUpdateParkingMutation();

  const validationSchema = Yup.object().shape({
      parkingSpaceName: Yup.string().required(t("parkingSpaceNameRequired")),
      siteUuid: Yup.string().required("Branch is required!"),
  });

  useEffect(() => {
    if (isSuccessUpdateParking) {
      dispatch(setIsOpenQuickEditParkingSpace(false));
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
  }, [isSuccessUpdateParking]);

  useEffect(() => {
    if (isErrorUpdateParking) {
        toast.error(`${errorUpdateParking?.data?.error?.description}`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            transition: Slide,
        });
    }
  }, [isErrorUpdateParking]);

  const handleSubmit = async (values) => {
      try {
          const res = await updateParking({
              uuid: parkingSpace.uuid,
              label: values.parkingSpaceName,
              image: parkingSpace.image,
              siteUuid: values.siteUuid
          });
          const parkingSpaceUuid = res.data.uuid;
          const updatedSlotLocalData = slotUpdateLocalData.map(slot => {
              return { ...slot, parkingSpaceUuid: parkingSpaceUuid };
          });

          await addMultipleSlot({slots: updatedSlotLocalData});

          dispatch(clearLocalSlotData());
      } catch (err) {
          console.log(err);
      }
  };

  let content;

  if (isLoadingGetCompanyName) content = (
      <Backdrop
          sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
          open={open}
          onClick={handleClose}>
        <CircularProgress color="inherit"/>
      </Backdrop>
  );

  if (isSuccessGetCompanyName) {
    content = (
      <Box>
        <Formik
          enableReinitialize
          initialValues={{
            parkingSpaceName: parkingSpace?.label,
            slots: slotUpdateLocalData,
            siteUuid: parkingSpace?.site?.uuid
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
              <Form className="px-[24px]">
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
                      selectFistValue={values.siteUuid}
                  />
                </div>
                <div className="flex flex-col justify-end items-end">
                  <Button
                      onClick={() => dispatch(setIsOpenAddNewSlot(true))}
                      startIcon={<FiPlus/>}
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
                      options={values.slots}
                      disableClearable
                      readOnly
                      fullWidth={true}
                      getOptionLabel={(option) => option.lotName}
                      value={values.slots}
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

                <Box
                  sx={{
                    paddingY: "24px",
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
                      {t('cancel')}
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ ...buttonStyleContained, ml: 1 }}
                    type="submit"
                  >
                      {t('update')}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    );
  }

  return (<>
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
              {t('quickUpdate')}
          </Typography>
          {content}
        </Box>
      </Box>
    </Modal>
    <ModalAddSlotComponent/>
    </>
  );
}

export default QuickEditParkingSpaceComponent;

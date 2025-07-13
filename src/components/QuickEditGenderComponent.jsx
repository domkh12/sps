import {useDispatch, useSelector} from "react-redux";
import useTranslate from "../hook/useTranslate.jsx";
import {
  useGetGenderByUuidQuery,
  useUpdateGenderMutation
} from "../redux/feature/gender/genderApiSlice.js";
import {useEffect} from "react";
import * as Yup from "yup";
import {Slide, toast} from "react-toastify";
import {
  setIsOpenQuickEditGender,
  setUuidGenderForDelete
} from "../redux/feature/gender/genderSlice.js";
import {Backdrop, Box, Button, CircularProgress, Modal, TextField, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import {setIsOpenConfirmDelete} from "../redux/feature/actions/actionSlice.js";
import {LoadingButton} from "@mui/lab";

function QuickEditGenderComponent() {
  const isQuickEditGenderOpen = useSelector((state) => state.gender.isOpenQuickEditGender);
  const uuidGender = useSelector((state) => state.gender.uuidForQuickEditGender);
  const { t } = useTranslate();
  const dispatch = useDispatch();

  const {data: genderData,
    isLoading: isLoadingGender,
    isSuccess: isSuccessGender,
    refetch: refetchGender,
  } = useGetGenderByUuidQuery({uuid: uuidGender});

  useEffect(() => {
    if (!isQuickEditGenderOpen) return;
    refetchGender();
  },[refetchGender, uuidGender])

  const [
    updateGender,
    {
      isSuccess: isSuccessUpdateGender,
      isLoading: isLoadingUpdateGender,
      isError: isErrorUpdateGender,
      error: errorUpdateGender,
    },
  ] = useUpdateGenderMutation();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("genderNameRequired"))
  });

  useEffect(() => {
    if (isSuccessUpdateGender) {
      toast.success(t("updateSuccess"), {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
      dispatch(setIsOpenQuickEditGender(false))
    }
  }, [isSuccessUpdateGender]);

  useEffect(() => {
    if (isErrorUpdateGender){
      toast.error(`${errorUpdateGender?.data?.error?.description}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        transition: Slide,
      });
    }
  }, [isErrorUpdateGender]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateGender({
        uuid: genderData.uuid,
        gender: values.name,
      });
    } catch (error) {
      console.error("Error creating company type:", error);
    } finally {
      setSubmitting(false);
    }
  };

  let content;

  if (isLoadingGender) {
    content = (
        <Backdrop
            sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
            open={isQuickEditGenderOpen}
            onClick={() => dispatch(setIsOpenQuickEditGender(false))}
        >
          <CircularProgress color="inherit"/>
        </Backdrop>
    )
  }

  if (isSuccessGender) {
    content = (
        <Modal
            open={isQuickEditGenderOpen}
            onClose={() => dispatch(setIsOpenQuickEditGender(false))}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
        >
          <Box>
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
                  sx={{padding: "24px"}}
              >
                {t('quickUpdate')}
              </Typography>
              <Box>
                <Formik
                    enableReinitialize
                    initialValues={{
                      name: genderData?.gender,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                  {({
                      values, touched, errors, handleChange, handleBlur, setFieldValue,
                    }) => {

                    return (<Form>

                      <Box className="grid grid-cols-1 gap-5 px-[24px]">
                        <TextField
                            label={t("genderName")}
                            variant="outlined"
                            sx={{
                              "& .MuiInputBase-input": {
                                boxShadow: "none",
                              },
                              borderRadius: "6px",
                            }}
                            type="text"
                            id="name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}
                            error={errors.name && touched.name}
                            helperText={errors.name && touched.name ? errors.name : null}
                            size="medium"
                        />
                      </Box>
                      <Box
                          sx={{
                            padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%"
                          }}
                      >
                        <Button
                            variant="contained"
                            onClick={() => {
                              dispatch(setIsOpenConfirmDelete(true));
                              dispatch(setUuidGenderForDelete(genderData.uuid));
                            }}
                            color="error"
                        >
                          {t('delete')}
                        </Button>
                        <div>
                          <Button
                              onClick={() => dispatch(setIsOpenQuickEditGender(false))}
                              variant="outlined"
                          >
                            {t('cancel')}
                          </Button>
                          <LoadingButton
                              loading={isLoadingUpdateGender}
                              variant="contained"
                              sx={{ml: 1}}
                              type="submit"
                          >
                            {t('update')}
                          </LoadingButton>
                        </div>
                      </Box>
                    </Form>);
                  }}
                </Formik>
              </Box>
            </Box>
          </Box>
        </Modal>
    )
  }


  return content;
}

export default QuickEditGenderComponent
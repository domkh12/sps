import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {setIsOpenAddNewSlot, setLocalSlotData} from "../redux/feature/slot/slotSlice.js";
import {Form, Formik} from "formik";
import {buttonStyleContained, buttonStyleOutlined} from "../assets/style.js";
import {LoadingButton} from "@mui/lab";
import useTranslate from "../hook/useTranslate.jsx";
import * as Yup from "yup";

function ModalAddSlotComponent() {
    const open = useSelector((state) => state.slot.isOpenAddNewSlot);
    const dispatch = useDispatch();
    const {t} = useTranslate();

    const validationSchema = Yup.object().shape({
        lotName: Yup.string().required(t('slotNameIsRequired'))
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            dispatch(setLocalSlotData({lotName: values.lotName}));
            dispatch(setIsOpenAddNewSlot(false));
        } catch (error) {
            console.error("Error creating company:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => dispatch(setIsOpenAddNewSlot(false))}
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
                        {t('addSlot')}
                    </Typography>
                    <Box>
                        <Formik
                            initialValues={{
                                lotName: "",
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
                                            label={t("slotName")}
                                            variant="outlined"
                                            sx={{
                                                "& .MuiInputBase-input": {
                                                    boxShadow: "none",
                                                },
                                                borderRadius: "6px",
                                            }}
                                            type="text"
                                            id="lotName"
                                            name="lotName"
                                            value={values.lotName}
                                            onChange={handleChange}
                                            error={errors.lotName && touched.lotName}
                                            helperText={errors.lotName && touched.lotName ? errors.lotName : null}
                                            size="medium"
                                        />
                                    </Box>
                                    <Box
                                        sx={{
                                            padding: "24px", display: "flex", justifyContent: "end",
                                        }}
                                    >
                                        <Button
                                            onClick={() => dispatch(setIsOpenAddNewSlot(false))}
                                            sx={{
                                                ...buttonStyleOutlined,
                                            }}
                                        >
                                            {t('cancel')}
                                        </Button>
                                        <LoadingButton
                                            variant="contained"
                                            sx={{...buttonStyleContained, ml: 1}}
                                            type="submit"
                                        >
                                            {t('create')}
                                        </LoadingButton>
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

export default ModalAddSlotComponent;
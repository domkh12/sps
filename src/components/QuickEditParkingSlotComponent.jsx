import {useDispatch, useSelector} from "react-redux";
import useTranslate from "../hook/useTranslate.jsx";
import * as Yup from "yup";
import {useEffect} from "react";
import {Slide, toast} from "react-toastify";
import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import {Form, Formik} from "formik";
import {buttonStyleContained, buttonStyleOutlined} from "../assets/style.js";
import {LoadingButton} from "@mui/lab";
import {useUpdateSlotMutation} from "../redux/feature/slot/slotApiSlice.js";
import {setIsOpenQuickEditSlot, setParkingSlotToEdit} from "../redux/feature/slot/slotSlice.js";
import SelectSingleComponent from "./SelectSingleComponent.jsx";
import {useGetListBranchQuery} from "../redux/feature/site/siteApiSlice.js";

function QuickEditParkingSlotComponent(){
    const isQuickEditParkingSlotOpen = useSelector((state) => state.slot.setIsOpenQuickEditSlot);
    const parkingSlot = useSelector((state) => state.slot.parkingSlotToEdit);
    const { data: branchList, isSuccess: isSuccessGetBranchList, isLoading: isLoadingGetBranchList } = useGetListBranchQuery("branchList");
    const { t } = useTranslate();
    const dispatch = useDispatch();

    const [
        updateParkingSlot,
        {
            isSuccess: isSuccessUpdateParkingSlot,
            isLoading: isLoadingUpdateParkingSlot,
            isError: isErrorUpdateParkingSlot,
            error: errorUpdateParkingSlot,
        },
    ] = useUpdateSlotMutation();

    const validationSchema = Yup.object().shape({
        lotName: Yup.string().required(t("slotNumberRequired")),
        parkingSpaceUuid: Yup.string().required(t('parkingSpaceRequired'))
    });

    useEffect(() => {
        if (isSuccessUpdateParkingSlot) {
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            dispatch(setParkingSlotToEdit(false))
        }
    }, [isSuccessUpdateParkingSlot]);

    useEffect(() => {
        if (isErrorUpdateParkingSlot){
            toast.error(`${errorUpdateParkingSlot?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorUpdateParkingSlot]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await updateParkingSlot({
                uuid: parkingSlot?.uuid,
                lotName: values.lotName,
                parkingSpaceUuid: values.parkingSpaceUuid,
                image: parkingSlot?.image,
            });
            dispatch(setIsOpenQuickEditSlot(false));
        } catch (error) {
            console.error("Error creating parkingSlot:", error);
        } finally {
            setSubmitting(false);
        }
    };

    let content;

    content = (
        <Modal
            open={isQuickEditParkingSlotOpen}
            onClose={() => dispatch(setIsOpenQuickEditSlot(false))}
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
                            initialValues={{
                                lotName: parkingSlot?.lotName,
                                parkingSpaceUuid: parkingSlot?.parkingSpace?.uuid
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({
                                  values, touched, errors, handleChange, handleBlur, setFieldValue,
                              }) => {

                                const handleParkingSpaceChange = (value) => {
                                    setFieldValue("parkingSpaceUuid", value);
                                };

                                return (<Form>

                                    <Box className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-[24px]">
                                        <TextField
                                            label={t("slotNumber")}
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
                                            onChange={handleChange}
                                            value={values.lotName}
                                            error={errors.lotName && touched.lotName}
                                            helperText={errors.lotName && touched.lotName ? errors.lotName : null}
                                            size="medium"
                                        />

                                        <SelectSingleComponent
                                            label={t("parkingSpace")}
                                            options={branchList}
                                            onChange={handleParkingSpaceChange}
                                            fullWidth={true}
                                            error={errors.parkingSpaceUuid}
                                            touched={touched.parkingSpaceUuid}
                                            groupLabelKey="siteName"
                                            itemsLabelKey="parkingSpaces"
                                            optionLabelKey="label"
                                            branchLabel="siteName"
                                            companyLabel="company"
                                            selectFistValue={parkingSlot?.parkingSpace?.uuid}
                                        />

                                    </Box>
                                    <Box
                                        sx={{
                                            padding: "24px", display: "flex", justifyContent: "end",
                                        }}
                                    >
                                        <Button
                                            onClick={() => dispatch(setIsOpenQuickEditSlot(false))}
                                            sx={{
                                                ...buttonStyleOutlined,
                                            }}
                                        >
                                            {t('cancel')}
                                        </Button>
                                        <LoadingButton
                                            loading={isLoadingUpdateParkingSlot}
                                            variant="contained"
                                            sx={{...buttonStyleContained, ml: 1}}
                                            type="submit"
                                        >
                                            {t('update')}
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

    return content;
}

export default QuickEditParkingSlotComponent;
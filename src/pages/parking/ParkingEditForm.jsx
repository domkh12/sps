import React, {useEffect, useRef, useState} from "react";
import {useUpdateParkingMutation} from "../../redux/feature/parking/parkingApiSlice";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import useTranslate from "../../hook/useTranslate";
import {useDispatch, useSelector} from "react-redux";
import useAuth from "../../hook/useAuth";
import {useUploadImageMutation} from "../../redux/feature/uploadImage/uploadImageApiSlice";
import {
    setCaptionSnackBar,
    setErrorSnackbar,
    setIsOpenSnackBar,
} from "../../redux/feature/actions/actionSlice";
import {
    Autocomplete, Button,
    Card,
    Grid2,
    TextField,
    Typography,
} from "@mui/material";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import SeoComponent from "../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import {Form, Formik} from "formik";
import {cardStyle} from "../../assets/style";
import ImageUploadComponent from "../../components/ImageUploadComponent";
import SelectSingleComponent from "../../components/SelectSingleComponent";
import ButtonComponent from "../../components/ButtonComponent";
import {useGetAllCompaniesQuery} from "../../redux/feature/company/companyApiSlice.js";
import {
    appendSlotLocalData,
    clearLocalSlotData,
    setIsOpenAddNewSlot,
    setNewLocalSlotData
} from "../../redux/feature/slot/slotSlice.js";
import {FiPlus} from "react-icons/fi";
import ModalAddSlotComponent from "../../components/ModalAddSlotComponent.jsx";
import {useAddMultipleSlotMutation} from "../../redux/feature/slot/slotApiSlice.js";
import {Slide, toast} from "react-toastify";

function ParkingEditForm({parkingSpace}) {
    const [profileImageFile, setProfileImageFile] = useState(null);
    const {t} = useTranslate();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const localSlotData = useSelector((state) => state.slot.localSlotData);
    const slotUpdateLocalData = useSelector((state) => state.slot.slotUpdateLocalData);
    const slotsLoadedRef = useRef(false);
    const {
        data: companyName,
        isSuccess: isSuccessGetCompanyName,
        isLoading: isLoadingGetCompanyName
    } = useGetAllCompaniesQuery("companyNameList");
    const [
        updateParking,
        {
            isSuccess: isSuccessUpdateParking,
            isLoading: isLoadingUpdateParking,
            isError: isErrorUpdateParking,
            error: errorUpdateParking,
        },
    ] = useUpdateParkingMutation();

    const [addMultipleSlot,{
        isSuccess: isAddMultipleSlotSuccess,
        isLoading: isLoadingAddMultipleSlot,
        error: errorAddMultipleSlot,
        isError: isErrorAddMultipleSlot,
    }] = useAddMultipleSlotMutation();

    const [uploadImage] = useUploadImageMutation();

    const validationSchema = Yup.object().shape({
        parkingSpaceName: Yup.string().required(t("parkingSpaceNameRequired")),
        siteUuid: Yup.string().required("Branch is required!"),
    });

    console.log("localSlotData",localSlotData)
    useEffect(() => {
        if (parkingSpace && !slotsLoadedRef.current) {
            dispatch(appendSlotLocalData(parkingSpace.parkingLots));
            slotsLoadedRef.current = true;
        }
    }, [parkingSpace, dispatch]);

    useEffect(() => {
        if (isSuccessUpdateParking) {
            navigate("/dash/parking-spaces");
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
            const formData = new FormData();
            let profileImageUri = null;

            if (profileImageFile) {
                formData.append("file", profileImageFile);
                const uploadResponse = await uploadImage(formData).unwrap();
                profileImageUri = uploadResponse.uri;
            }

            const res = await updateParking({
                uuid: parkingSpace.uuid,
                label: values.parkingSpaceName,
                image: profileImageUri,
                siteUuid: values.siteUuid
            });
            const parkingSpaceUuid = res.data.uuid;
            const updatedSlotLocalData = slotUpdateLocalData.map(slot => {
                return { ...slot, parkingSpaceUuid: parkingSpaceUuid };
            });
            console.log("updatedSlotLocalData", updatedSlotLocalData);
            await addMultipleSlot({slots: updatedSlotLocalData});

            dispatch(clearLocalSlotData());
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
            {parkingSpace.label}
        </Typography>,
    ];
    console.log("slotUpdateLocalData", slotUpdateLocalData);

    let content;

    if (isLoadingGetCompanyName) content = <LoadingFetchingDataComponent/>;

    if (isSuccessGetCompanyName) {
        content = (
            <>
                <SeoComponent title={"Create a new parking space"}/>
                <MainHeaderComponent
                    breadcrumbs={breadcrumbs}
                    title={parkingSpace.label}
                    handleBackClick={() => navigate("/dash/parking-spaces")}
                />
                <div>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            parkingSpaceName: parkingSpace.label,
                            slots: slotUpdateLocalData,
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
                                    <Grid2 container spacing={3}>
                                        <Grid2 size={{xs: 12, md: 4}}>
                                            <Card
                                                sx={{...cardStyle}}
                                                className="gap-5 pt-[40px] px-[24px] pb-[40px]"
                                            >
                                                <ImageUploadComponent
                                                    setProfileImageFile={setProfileImageFile}
                                                    profileImageFile={profileImageFile || ""}
                                                    profileUrl={values?.image || ""}
                                                />
                                            </Card>
                                        </Grid2>
                                        <Grid2 size={{xs: 12, md: 8}}>
                                            <Card sx={{...cardStyle, padding: "24px"}}>
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

                                                <div className="col-span-2 flex justify-end mt-[20px]">
                                                    <ButtonComponent
                                                        btnTitle={t("createParkingSpace")}
                                                        type={"submit"}
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
                <ModalAddSlotComponent/>
            </>
        );
    }

    return content;
}

export default ParkingEditForm;

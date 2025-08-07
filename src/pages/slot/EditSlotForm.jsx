import {useEffect, useState} from "react";
import useTranslate from "../../hook/useTranslate.jsx";
import {useNavigate} from "react-router-dom";
import {useGetListBranchQuery} from "../../redux/feature/site/siteApiSlice.js";
import {useUpdateSlotMutation} from "../../redux/feature/slot/slotApiSlice.js";
import {useUploadImageMutation} from "../../redux/feature/uploadImage/uploadImageApiSlice.js";
import * as Yup from "yup";
import {Slide, toast} from "react-toastify";
import {Card, Grid2, TextField, Typography} from "@mui/material";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import SeoComponent from "../../components/SeoComponent.jsx";
import MainHeaderComponent from "../../components/MainHeaderComponent.jsx";
import {Form, Formik} from "formik";
import {cardStyle} from "../../assets/style.js";
import ImageUploadComponent from "../../components/ImageUploadComponent.jsx";
import SelectSingleComponent from "../../components/SelectSingleComponent.jsx";
import ButtonComponent from "../../components/ButtonComponent.jsx";

function EditSlotForm({parkingSlot}){
    const [profileImageFile, setProfileImageFile] = useState(null);
    const { t } = useTranslate();
    const navigate = useNavigate();
    const { data: branchList, isSuccess: isSuccessGetBranchList, isLoading: isLoadingGetBranchList } = useGetListBranchQuery("branchList");

    const [
        updateParkingSlot,
        {
           isSuccess: isSuccessUpdateParkingSlot,
           isLoading: isLoadingUpdateParkingSlot,
           isError: isErrorUpdateParkingSlot,
           error: errorUpdateParkingSlot,
        },
    ] = useUpdateSlotMutation();

    const [uploadImage] = useUploadImageMutation();

    const validationSchema = Yup.object().shape({
        lotName: Yup.string().required(t("slotNumberRequired")),
        parkingSpaceUuid: Yup.string().required(t('parkingSpaceRequired'))
    });

    useEffect(() => {
        if (isSuccessUpdateParkingSlot) {
            navigate("/admin/parking-slots");
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
    }, [isSuccessUpdateParkingSlot]);

    useEffect(() => {
        if (isErrorUpdateParkingSlot) {
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

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            let profileImageUri = null;

            if (profileImageFile) {
                formData.append("file", profileImageFile);
                const uploadResponse = await uploadImage(formData).unwrap();
                profileImageUri = uploadResponse.uri;
            }

            await updateParkingSlot({
                uuid: parkingSlot?.uuid,
                lotName: values.lotName,
                parkingSpaceUuid: values.parkingSpaceUuid,
                image: profileImageUri,
            });

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
            {t("slot")}
        </Typography>,
        <Typography color="inherit" key={3}>
            {parkingSlot?.lotName || "N/A"}
        </Typography>,
    ];

    let content;

    if (isLoadingGetBranchList) content = <LoadingFetchingDataComponent />;

    if (isSuccessGetBranchList) {
        content = (
            <>
                <SeoComponent title={"Create Parking Slot"} />
                <MainHeaderComponent
                    breadcrumbs={breadcrumbs}
                    title={parkingSlot?.lotName || "N/A"}
                    handleBackClick={() => navigate("/admin/parking-slots")}
                />
                <div>
                    <Formik
                        initialValues={{ lotName: parkingSlot?.lotName, parkingSpaceUuid: parkingSlot?.parkingSpace?.uuid }}
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

                            const handleParkingSpaceChange = (value) => {
                                setFieldValue("parkingSpaceUuid", value);
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
                                                </div>
                                                <div className="col-span-2 flex justify-end mt-[20px]">
                                                    <ButtonComponent
                                                        btnTitle={t("addSlot")}
                                                        type={"submit"}
                                                        isLoading={isLoadingUpdateParkingSlot}
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

export default EditSlotForm
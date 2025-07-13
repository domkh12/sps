import {useDispatch, useSelector} from "react-redux";
import useTranslate from "../hook/useTranslate.jsx";
import {useEffect} from "react";
import { useGetBranchTypeByUuidQuery, useUpdateBranchTypeMutation } from "../redux/feature/siteType/siteTypeApiSlice.js";
import { setIsOpenQuickEditBranchType, setUuidForDeleteBranchType } from "../redux/feature/siteType/siteTypeSlice.js";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast, Slide } from "react-toastify";
import { Backdrop, CircularProgress, Modal, Typography, Box, TextField, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { buttonStyleContained, buttonStyleOutlined } from "../assets/style.js";
import { setIsOpenConfirmDelete } from "../redux/feature/actions/actionSlice.js";


function QuickEditBranchTypeComponent(){
    const isQuickEditBranchTypeOpen = useSelector((state) => state.siteType.isQuickEditBranchTypeOpen);
    const uuidBranchType = useSelector((state) => state.siteType.uuidForQuickEditBranchType);
    
    const { t } = useTranslate();
    const dispatch = useDispatch();

    const {data: branchTypeData, 
        isLoading: isLoadingBranchType,
        isSuccess: isSuccessBranchType,
        refetch: refetchBranchType,
    } = useGetBranchTypeByUuidQuery({uuid: uuidBranchType});

    useEffect(() => {
        if (!isQuickEditBranchTypeOpen) return;
        refetchBranchType();
    },[refetchBranchType, uuidBranchType])
    
    const [
        updateBranchType,
        {
            isSuccess: isSuccessUpdateBranchType,
            isLoading: isLoadingUpdateBranchType,
            isError: isErrorUpdateBranchType,
            error: errorUpdateBranchType,
        },
    ] = useUpdateBranchTypeMutation();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t("branchTypeNameRequired")),
    });

    useEffect(() => {
        if (isSuccessUpdateBranchType) {
            toast.success(t("updateSuccess"), {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
            dispatch(setIsOpenQuickEditBranchType(false))
        }
    }, [isSuccessUpdateBranchType]);

    useEffect(() => {
        if (isErrorUpdateBranchType){
            toast.error(`${errorUpdateBranchType?.data?.error?.description}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                transition: Slide,
            });
        }
    }, [isErrorUpdateBranchType]);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await updateBranchType({
                uuid: branchTypeData.uuid,
                name: values.name,
            });
        } catch (error) {
            console.error("Error creating company type:", error);
        } finally {
            setSubmitting(false);
        }
    };

    let content;

    if (isLoadingBranchType) {
        content = (
            <Backdrop
                sx={(theme) => ({color: '#fff', zIndex: theme.zIndex.drawer + 1})}
                open={isQuickEditBranchTypeOpen}
                onClick={() => dispatch(setIsOpenQuickEditBranchType(false))}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        )
    }

    if (isSuccessBranchType) {
        content = (
            <Modal
                open={isQuickEditBranchTypeOpen}
                onClose={() => dispatch(setIsOpenQuickEditBranchType(false))}
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
                                    name: branchTypeData?.name,
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
                                                label={t("branchTypeName")}
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
                                                    dispatch(setUuidForDeleteBranchType(branchTypeData.uuid));
                                                }}
                                                color="error"
                                            >
                                                {t('delete')}
                                            </Button>
                                            <div>
                                                <Button
                                                    onClick={() => dispatch(setIsOpenQuickEditBranchType(false))}
                                                    variant="outlined"
                                                >
                                                    {t('cancel')}
                                                </Button>
                                                <LoadingButton
                                                    loading={isLoadingUpdateBranchType}
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

export default QuickEditBranchTypeComponent;
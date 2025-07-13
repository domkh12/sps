import { Box, Button, Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { buttonStyleContained, buttonStyleOutlined } from "../assets/style";
import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import { setIsOpenConfirmDelete } from "../redux/feature/actions/actionSlice";
import { useDeleteUserMutation } from "../redux/feature/users/userApiSlice";
import { useDeleteVehicleMutation } from "../redux/feature/vehicles/vehicleApiSlice";
import { useDeleteParkingMutation } from "../redux/feature/parking/parkingApiSlice";
import { setIdVehicleToDelete } from "../redux/feature/vehicles/vehicleSlice";
import { setIdUserToDelete } from "../redux/feature/users/userSlice";
import { setIdParkingSpaceToDelete } from "../redux/feature/parking/parkingSlice";
import { useDeleteSiteMutation } from "../redux/feature/site/siteApiSlice";
import { setIdSiteToDelete } from "../redux/feature/site/siteSlice";
import {setIdCompanyToDelete} from "../redux/feature/company/companySlice.js";
import {useDeleteCompanyMutation} from "../redux/feature/company/companyApiSlice.js";
import useTranslate from "../hook/useTranslate.jsx";
import {useDeleteSlotMutation} from "../redux/feature/slot/slotApiSlice.js";
import useAuth from "../hook/useAuth.jsx";
import { useDeleteCompanyTypeMutation } from "../redux/feature/companyType/CompanyTypeApiSlice.js";
import { setIsOpenQuickEditCompanyType, setUuidForQuickEditCompanyTypeForDelete } from "../redux/feature/companyType/companyTypeSlice.js";
import {setIsOpenQuickEditCity, setUuidCityForDelete, setUuidForQuickEditCity} from "../redux/feature/city/citySlice.js";
import {useDeleteCityMutation} from "../redux/feature/city/cityApiSlice.js";
import { setIsOpenQuickEditBranchType, setUuidForDeleteBranchType, setUuidForQuickEditBranchType } from "../redux/feature/siteType/siteTypeSlice.js";
import { useDeleteBranchTypeMutation } from "../redux/feature/siteType/siteTypeApiSlice.js";
import { useDeleteLicensePlateProvinceMutation } from "../redux/feature/licensePlateProvince/licensePlateProvinceApiSlice.js";
import { setIsOpenQuickEditLicensePlateProvince, setUuidLicensePlateProvinceForDelete } from "../redux/feature/licensePlateProvince/licensePlateProvinceSlice.js";
import { useDeleteLicensePlateTypeMutation } from "../redux/feature/licensePlateType/licensePlateTypeApiSlice.js";
import { setIsOpenQuickEditLicensePlateType, setUuidLicensePlateTypeForDelete } from "../redux/feature/licensePlateType/licensePlateTypeSlice.js";
import { useDeleteVehicleTypeMutation } from "../redux/feature/vehicleType/vehicleTypeApiSlice.js";
import { setIsOpenQuickEditVehicleType, setUuidVehicleTypeForDelete } from "../redux/feature/vehicleType/vehicleTypeSlice.js";
import { useDeleteGenderMutation } from "../redux/feature/gender/genderApiSlice.js";
import { setIsOpenQuickEditGender, setUuidGenderForDelete } from "../redux/feature/gender/genderSlice.js";

function DeleteConfirmComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const { isAdmin, isManager } = useAuth();
  const open = useSelector((state) => state.action.isOpenConfirmDelete);
  const userId = useSelector((state) => state.users.idUserToDelete);
  const vehicleId = useSelector((state) => state.vehicles.idVehicleToDelete);
  const parkingSpaceId = useSelector((state) => state.parking.idParkingSpaceToDelete);
  const siteId = useSelector((state) => state.sites.isSiteToDelete);
  const companyId = useSelector((state) => state.companies.idCompanyToDelete);
  const slotId = useSelector((state) => state.slot.idParkingSlotToDelete);
  const companyTypeId = useSelector((state) => state.companyType.uuidForQuickEditCompanyTypeForDelete);
  const cityId = useSelector((state) => state.city.uuidCityForDelete);
  const branchTypeId = useSelector((state) => state.siteType.uuidForDeleteBranchType);
  const licensePlateProvinceId = useSelector((state) => state.licensePlateProvince.uuidLicensePlateProvinceForDelete);
  const licensePlateTypeId = useSelector((state) => state.licensePlateType.uuidLicensePlateTypeForDelete); 
  const vehicleTypeId = useSelector((state) => state.vehicleType.uuidVehicleTypeForDelete);
  const genderId = useSelector((state) => state.gender.uuidGenderForDelete);

  const [
    deleteGender,
    {
      isSuccess: isSuccessDeleteGender,
      isLoading: isLoadingDeleteGender,
      isError: isErrorDeleteGender,
      error: errorDeleteGender,
    },
  ] = useDeleteGenderMutation();

  const [
    deleteVehicleType,
    {
      isSuccess: isSuccessDeleteVehicleType,
      isLoading: isLoadingDeleteVehicleType,
      isError: isErrorDeleteVehicleType,
      error: errorDeleteVehicleType,
    },
  ] = useDeleteVehicleTypeMutation();

  const [
    deleteLicensePlateType,
    {
      isSuccess: isSuccessDeleteLicensePlateType,
      isLoading: isLoadingDeleteLicensePlateType,
      isError: isErrorDeleteLicensePlateType,
      error: errorDeleteLicensePlateType,
    },
  ] = useDeleteLicensePlateTypeMutation();

  const [
    deleteLicensePlateProvince,
    {
      isSuccess: isSuccessDeleteLicensePlateProvince,
      isLoading: isLoadingDeleteLicensePlateProvince,
      isError: isErrorDeleteLicensePlateProvince,
      error: errorDeleteLicensePlateProvince,
    },
  ] = useDeleteLicensePlateProvinceMutation();

  const [
    deleteBranchType,
    {
      isSuccess: isSuccessDeleteBranchType,
      isLoading: isLoadingDeleteBranchType,
      isError: isErrorDeleteBranchType,
      error: errorDeleteBranchType,
    },
  ] = useDeleteBranchTypeMutation();

  const [
      deleteCity,
      {
            isSuccess: isSuccessDeleteCity,
            isLoading: isLoadingDeleteCity,
            isError: isErrorDeleteCity,
            error: errorDeleteCity,
      }
  ] = useDeleteCityMutation();

  const [
    deleteCompanyType,
    {
        isSuccess: isSuccessDeleteCompanyType,
        isLoading: isLoadingDeleteCompanyType,
        isError: isErrorDeleteCompanyType,
        error: errorDeleteCompanyType,
    }
  ] = useDeleteCompanyTypeMutation();

  const [
    deleteParkingSlot,
    {
        isSuccess: isSuccessDeleteParkingSlot,
        isLoading: isLoadingDeleteParkingSlot,
        isError: isErrorDeleteParkingSlot,
        error: errorDeleteParkingSlot,
    }
  ] = useDeleteSlotMutation();

  const [
      deleteCompany,
    {
        isSuccess: isCompanyDeleteSuccess,
        isLoading: isCompanyDeleteLoading,
        isError: isCompanyDeleteError,
        error: companyDeleteError,
    }
  ] = useDeleteCompanyMutation();

  const [
    deleteSite,
    {
      isSuccess: isSuccessDeleteSite,
      isLoading: isLoadingDeleteSite,
      isError: isErrorDeleteSite,
      error: errorDeleteSite,
    },
  ] = useDeleteSiteMutation();

  const [
    deleteUser,
    {
      isSuccess: isUserDeleteSuccess,
      isLoading: isUserDeleteLoading,
      isError: isUserDeleteError,
      error: userDeleteError,
    },
  ] = useDeleteUserMutation();

  const [
    deleteVehicle,
    {
      isSuccess: isVehicleDeleteSuccess,
      isLoading: isVehicleDeleteLoading,
      isError: isVehicleDeleteError,
      error: vehicleDeleteError,
    },
  ] = useDeleteVehicleMutation();

  const [
    deleteParkingSpace,
    {
      isSuccess: isParkingSpaceDeleteSuccess,
      isLoading: isParkingSpaceDeleteLoading,
      isError: isParkingSpaceDeleteError,
      error: parkingSpaceDeleteError,
    },
  ] = useDeleteParkingMutation();

  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
  };

  const handleClose = () => {
    dispatch(setIsOpenConfirmDelete(false));
  };

  const handleDelete = async () => {
    if (userId) {
      await deleteUser({ id: userId });
    } else if (vehicleId) {
      await deleteVehicle({ id: vehicleId });
    } else if (parkingSpaceId) {
      await deleteParkingSpace({ uuid: parkingSpaceId });
    }else if (siteId){
      await deleteSite({ uuid: siteId });
    }else if (companyId){
        await deleteCompany({ uuid: companyId });
    }else if (slotId){
        await deleteParkingSlot({ uuid: slotId });
    }else if (companyTypeId) {
        await deleteCompanyType({ uuid: companyTypeId });
    }else if (cityId){
        await deleteCity({ uuid: cityId });
    }else if (branchTypeId){
        await deleteBranchType({ uuid: branchTypeId });
    }else if (licensePlateProvinceId){
        await deleteLicensePlateProvince({ uuid: licensePlateProvinceId });
    }else if (licensePlateTypeId){
        await deleteLicensePlateType({ uuid: licensePlateTypeId });
    }else if (vehicleTypeId){
        await deleteVehicleType({ uuid: vehicleTypeId });
    }else if (genderId){
        await deleteGender({ uuid: genderId });
    }
  };

  useEffect(() => {
    if (isUserDeleteSuccess) {
      navigate(`/${isAdmin ? "admin" : "dash"}/users`);
      dispatch(setIdUserToDelete(""));
      handleClose();
    }
    if (isVehicleDeleteSuccess) {
      navigate(`/${isAdmin ? "admin" : "dash"}/vehicles`);
      dispatch(setIdVehicleToDelete(""));
      handleClose();
    }
    if (isParkingSpaceDeleteSuccess) {
      navigate("/admin/parking-spaces");
      dispatch(setIdParkingSpaceToDelete(""));
      handleClose();
    }
    if(isSuccessDeleteSite){
      navigate("/admin/branches");
      dispatch(setIdSiteToDelete(""));
      handleClose();
    }
    if (isCompanyDeleteSuccess){
        navigate("/admin/companies");
        dispatch(setIdCompanyToDelete(""));
        handleClose();
    }
    if (isSuccessDeleteParkingSlot) {
        navigate("/admin/parking-slots");
        dispatch(setIdParkingSpaceToDelete(""));
        handleClose();
    }

    if (isSuccessDeleteCompanyType) {
        dispatch(setUuidForQuickEditCompanyTypeForDelete(""));
        dispatch(setIsOpenQuickEditCompanyType(false));
        handleClose();
    }

    if (isSuccessDeleteCity) {
        dispatch(setUuidCityForDelete(""));
        dispatch(setIsOpenQuickEditCity(false));
        handleClose();
    }

    if (isSuccessDeleteBranchType) {
        dispatch(setUuidForDeleteBranchType(""));
        dispatch(setIsOpenQuickEditBranchType(false));
        handleClose();
    }

    if (isSuccessDeleteLicensePlateProvince) {
        dispatch(setUuidLicensePlateProvinceForDelete(""));
        dispatch(setIsOpenQuickEditLicensePlateProvince(false));
        handleClose();
    }

    if (isSuccessDeleteLicensePlateType) {
        dispatch(setUuidLicensePlateTypeForDelete(""));
        dispatch(setIsOpenQuickEditLicensePlateType(false));
        handleClose();
    }

    if (isSuccessDeleteVehicleType) {
        dispatch(setUuidVehicleTypeForDelete(""));
        dispatch(setIsOpenQuickEditVehicleType(false));
        handleClose();
    }

    if (isSuccessDeleteGender) {
        dispatch(setUuidGenderForDelete(""));
        dispatch(setIsOpenQuickEditGender(false));
        handleClose();
    }

  }, [
      isUserDeleteSuccess,
      isVehicleDeleteSuccess,
      isParkingSpaceDeleteSuccess,
      isSuccessDeleteSite,
      isCompanyDeleteSuccess,
      isSuccessDeleteParkingSlot,
      isSuccessDeleteCompanyType,
      isSuccessDeleteCity,
      isSuccessDeleteBranchType,
      isSuccessDeleteLicensePlateProvince,
      isSuccessDeleteLicensePlateType,
      isSuccessDeleteVehicleType,
      isSuccessDeleteGender
  ]);

  let loading = false;

  if (
      isUserDeleteLoading || isVehicleDeleteLoading ||
      isParkingSpaceDeleteLoading || isLoadingDeleteSite ||
      isCompanyDeleteLoading || isLoadingDeleteParkingSlot ||
      isLoadingDeleteCompanyType || isLoadingDeleteCity ||
      isLoadingDeleteBranchType || isLoadingDeleteLicensePlateProvince ||
      isLoadingDeleteLicensePlateType || isLoadingDeleteVehicleType ||
      isLoadingDeleteGender
  ) {
    loading = true;
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
            maxWidth: "520px",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ padding: "24px" }}
          >
            {t('delete')}
          </Typography>

          <Typography
            id="modal-modal-title"
            variant="body1"
            sx={{ paddingX: "24px" }}
          >
            {t('deleteConfirm')}
          </Typography>

          <Box
            sx={{
              padding: "24px",
              display: "flex",
              justifyContent: "end",
            }}
          >
            <LoadingButton
              variant="contained"
              color="error"
              sx={{              
                mr: 1,
              }}
              loading={loading}
              onClick={handleDelete}
            >
              {t('delete')}
            </LoadingButton>
            <Button
              onClick={handleClose}
              variant="outlined"
            >
                {t('cancel')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteConfirmComponent;

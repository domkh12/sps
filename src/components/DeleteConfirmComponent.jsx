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
  }, [isUserDeleteSuccess, isVehicleDeleteSuccess, isParkingSpaceDeleteSuccess, isSuccessDeleteSite, isCompanyDeleteSuccess, isSuccessDeleteParkingSlot]);

  let loading = false;

  if (isUserDeleteLoading || isVehicleDeleteLoading || isParkingSpaceDeleteLoading || isLoadingDeleteSite || isCompanyDeleteLoading || isLoadingDeleteParkingSlot) {
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
              sx={{
                ...buttonStyleContained,
                mr: 1,
                backgroundColor: "red",
                ":hover": {
                  backgroundColor: "#d32f2f",
                  boxShadow: "none",
                },
              }}
              loading={loading}
              onClick={handleDelete}
            >
              {t('delete')}
            </LoadingButton>
            <Button
              onClick={handleClose}
              sx={{
                ...buttonStyleOutlined,
              }}
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

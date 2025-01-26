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

function DeleteConfirmComponent() {
  const open = useSelector((state) => state.action.isOpenConfirmDelete);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.users.idUserToDelete);
  const vehicleId = useSelector((state) => state.vehicles.idVehicleToDelete);
  const parkingId = useSelector((state) => state.parking.idParkingToDelete);
  const navigate = useNavigate();

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
    deleteParking,
    {
      isSuccess: isParkingDeleteSuccess,
      isLoading: isParkingDeleteLoading,
      isError: isParkingDeleteError,
      error: parkingDeleteError,
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
    } else if (parkingId) {
      await deleteParking({ uuid: parkingId });
    }
  };

  useEffect(() => {
    if (isUserDeleteSuccess) {
      navigate("/dash/users");
      handleClose();
    }
    if (isVehicleDeleteSuccess) {
      navigate("/dash/vehicles");
      handleClose();
    }
    if (isParkingDeleteSuccess) {
      navigate("/dash/parkings");
      handleClose();
    }

  }, [isUserDeleteSuccess, isVehicleDeleteSuccess, isParkingDeleteSuccess]);

  let loading = false;

  if (isUserDeleteLoading || isVehicleDeleteLoading || isParkingDeleteLoading) {
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
            Delete
          </Typography>

          <Typography
            id="modal-modal-title"
            variant="body1"
            sx={{ paddingX: "24px" }}
          >
            Are you sure want to delete?
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
              Delete
            </LoadingButton>
            <Button
              onClick={handleClose}
              sx={{
                ...buttonStyleOutlined,
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default DeleteConfirmComponent;

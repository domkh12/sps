import {
  Checkbox,
  List,
  ListItem,
  ListItemText,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaPen, FaTrashCan } from "react-icons/fa6";
import EditButtonComponent from "./EditButtonComponent";
import MoreActionComponent from "./MoreActionComponent";
import { memo } from "react";
import { setIsOpenConfirmDelete } from "../redux/feature/actions/actionSlice";
import { useDispatch } from "react-redux";
import {
  setIdVehicleToDelete,
  setIsOpenQuickEditVehicle,
  setVehicleForQuickEdit,
} from "../redux/feature/vehicles/vehicleSlice";
import useTranslate from "../hook/useTranslate.jsx";
import useAuth from "../hook/useAuth.jsx";

function VehicleRowComponent({ vehicleId, vehicle }) {
  const {t} = useTranslate();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(setIsOpenConfirmDelete(true));
    dispatch(setIdVehicleToDelete(vehicle.uuid));
  };

  const handleQuickEdit = () => {
    dispatch(setIsOpenQuickEditVehicle(true));
    dispatch(setVehicleForQuickEdit(vehicle));
  };

  if (vehicle) {
    var handleEdit = () => navigate(`/${isAdmin ? "admin" : "dash"}/vehicles/${vehicleId}`);
    var handleView = () => navigate(`/${isAdmin ? "admin" : "dash"}/vehicles/${vehicleId}/view`);

    var menuActions = [
      {
        label: t('edit'),
        icon: <FaPen className="w-5 h-5" />,
        onClick: handleEdit,
      },
      {
        label: t("view"),
        icon: <FaEye className="w-5 h-5" />,
        onClick: handleView,
      },
      {
        label: t('delete'),
        icon: <FaTrashCan className="w-5 h-5" />,
        onClick: handleDelete,
        textColor: "red",
        buttonColor: "red",
      },
    ];

    return (
      <TableRow hover>
        <TableCell padding="checkbox" sx={{ borderBottomStyle: "dashed" }}>
          <Checkbox color="primary" />
        </TableCell>
        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          <List sx={{ padding: "0" }}>
            <ListItem sx={{ padding: "0", gap: "10px" }}>
              <div className="w-32 h-20 rounded-[12px] overflow-hidden">
                <img
                  src={vehicle?.image || "/images/car-img-placeholder.jpg"}
                  alt="car_image"
                  className="w-full h-full object-cover"
                />
              </div>
              <ListItemText
                primary={
                  (
                    <Link
                      className="hover:underline"
                      to={`/${isAdmin ? "admin" : "dash"}/vehicles/${vehicleId}/view`}
                    >
                      {vehicle?.vehicleMake || "N/A"}
                    </Link>
                  ) || "N/A"
                }
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "gray", display: "inline" }}
                  >
                    {vehicle?.vehicleModel || "N/A"}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          <div className="w-[250px]  rounded-[12px] border-blue-600 border-[3px] px-3 py-2 flex items-center justify-between">
            <div className="flex flex-col">
              <Typography variant="body1" className="text-blue-600">
                {vehicle?.licensePlateProvince?.provinceNameKh || "N/A"}
              </Typography>
              <Typography variant="body1" className="text-red-600">
                {vehicle?.licensePlateProvince?.provinceNameEn || "N/A"}
              </Typography>
            </div>
            <Typography variant="h5" className="underline text-blue-600">
              {vehicle?.numberPlate || "N/A"}
            </Typography>
          </div>
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          <Typography variant="body1">
            {vehicle?.vehicleType?.name || "N/A"}
          </Typography>
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          <div className="flex gap-2">
            <div
              className="w-5 h-5 rounded-full border-[2px]"
              style={{ backgroundColor: vehicle?.color || "transparent" }}
            ></div>
            <Typography variant="body1">{vehicle?.color || "N/A"}</Typography>
          </div>
        </TableCell>

        <TableCell sx={{borderBottomStyle: "dashed"}}>
          <Typography variant="body1">
            {vehicle.createdAt.substring(
                0,
                vehicle.createdAt.lastIndexOf(" ")
            )}
          </Typography>
          <Typography variant="body2" color="gray">
            {vehicle.createdAt.substring(
                vehicle.createdAt.lastIndexOf(" "),
                vehicle.createdAt.length
            )}
          </Typography>
        </TableCell>

        <TableCell
          sx={{
            borderBottomStyle: "dashed",
            px: 0,
          }}
        >
          <div className="flex justify-center items-center">
             <EditButtonComponent handleQuickEdit={handleQuickEdit} />
             <MoreActionComponent menuItems={menuActions} />
          </div>
        </TableCell>
      </TableRow>
    );
  } else {
    return null;
  }
}

const memoizedVehicleRow = memo(VehicleRowComponent);
export default memoizedVehicleRow;

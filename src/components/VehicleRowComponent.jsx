import {
  Checkbox,
  Link,
  List,
  ListItem,
  ListItemText,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetVehiclesQuery } from "../redux/feature/vehicles/vehicleApiSlice";
import { FaPen, FaTrashCan } from "react-icons/fa6";
import EditButtonComponent from "./EditButtonComponent";
import MoreActionComponent from "./MoreActionComponent";
import { memo } from "react";

function VehicleRowComponent({ vehicleId }) {
  const navigate = useNavigate();

  const { vehicle } = useGetVehiclesQuery("vehiclesList", {
    selectFromResult: ({ data }) => ({
      vehicle: data?.entities[vehicleId],
    }),
  });

  const handleDelete = () => {
    console.log("Download action triggered");
  };

  if (vehicle) {
    var handleEdit = () => navigate(`/dash/vehicles/${vehicleId}`);
    // var handleView = () => navigate(`/dash/vehicles/${vehicleId}/view`);

    var menuActions = [
      {
        label: "Edit",
        icon: <FaPen className="w-5 h-5" />,
        onClick: handleEdit,
      },
      {
        label: "Delete",
        icon: <FaTrashCan className="w-5 h-5" />,
        onClick: handleDelete,
        textColor: "red",
        buttonColor: "red",
      },
    ];

    const dateObj = new Date(vehicle.createdAt);
    var formattedDate = dateObj.toLocaleDateString("en-GB");
    var formattedTime = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <TableRow hover>
        <TableCell padding="checkbox" sx={{ borderBottomStyle: "dashed" }}>
          <Checkbox color="primary" />
        </TableCell>
        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          <List sx={{ padding: "0" }}>
            <ListItem sx={{ padding: "0", gap: "10px" }}>
              <div className="h-auto w-32 rounded-[12px] overflow-hidden">
                <img
                  src={vehicle.image || "/images/car-img-placeholder.jpg"}
                  alt="car_image"
                  className="w-full h-full"
                />
              </div>
              <ListItemText
                primary={
                  (
                    <Link className="hover:underline" to={"/dash"}>
                      {vehicle.vehicleMake}
                    </Link>
                  ) || "N/A"
                }
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "gray", display: "inline" }}
                  >
                    {vehicle.vehicleModel || "N/A"}
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
                {vehicle.licensePlateKhName}
              </Typography>
              <Typography variant="body1" className="text-red-600">
                {vehicle.licensePlateEngName}
              </Typography>
            </div>
            <Typography variant="h5" className="underline text-blue-600">
              {vehicle.numberPlate}
            </Typography>
          </div>
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          <Typography variant="body1">{vehicle.vehicleType.name}</Typography>
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          <div className="flex gap-2">
            <div className="w-5 h-5 bg-black rounded-full"></div>
            <Typography variant="body1">{vehicle.color}</Typography>
          </div>
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          <Typography variant="body1">{formattedDate}</Typography>
          <Typography variant="body2" color="gray">
            {formattedTime}
          </Typography>
        </TableCell>
        <TableCell
          sx={{
            borderBottomStyle: "dashed",
            px: 0,
          }}
        >
          <div className="flex justify-center items-center">
            <EditButtonComponent />
            <MoreActionComponent menuItems={menuActions} />
          </div>
        </TableCell>
      </TableRow>
    );

  } else {
    return null;
  }  
}

const memoizedUsersRow = memo(VehicleRowComponent);
export default memoizedUsersRow;

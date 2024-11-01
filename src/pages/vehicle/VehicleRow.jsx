import { Button, Checkbox, TableCell, TableRow, Tooltip } from "flowbite-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectVehicleById } from "../../redux/feature/vehicles/vehicleApiSlice";
import { FaEdit, FaEye } from "react-icons/fa";

function VehicleRow({ vehicleId }) {
  const vehicle = useSelector((state) => selectVehicleById(state, vehicleId));

  const navigate = useNavigate();

  if (vehicle) {
    const handleEdit = () => navigate(`/admin/vehicles/${vehicleId}`);
    var createdAt = vehicle.createdAt;
    var createdAtResult = createdAt.substring(0, createdAt.indexOf("T"));
  } else {
    return null;
  }
  return (
    <TableRow >
      <TableCell className="whitespace-nowrap">
        <div className="flex gap-3 mr-32">
          <img
            src="/images/vehiclePlaceHolder.png"
            alt="car_Photo"
            className="w-32 h-20 object-cover rounded-lg"
          />
          <div className="grid grid-rows-2 col-span-3 shrink ">
            <p className="">
              {vehicle.vehicleModel ? vehicle.vehicleModel : "N/A"}
            </p>
            <div className="text-nowrap">
              This is description
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="border-2 w-36 h-auto border-blue-600 text-center p-1 rounded-md">
          <p className="text-blue-600 text-sm">ភ្នំពេញ</p>
          <span className="text-blue-600 text-lg">
            {vehicle.numberPlate ? vehicle.numberPlate : "N/A"}
          </span>
          <div className="h-[0.2px] mx-1 mb-1 bg-blue-600"></div>
          <p className="text-red-600 text-xs">Phnom Penh</p>
        </div>
      </TableCell>
      <TableCell>
        {vehicle.user.fullName ? vehicle.user.fullName : "N/A"}
      </TableCell>
      <TableCell className="text-right">
        {vehicle.user.phoneNumber ? vehicle.user.phoneNumber : "N/A"}
      </TableCell>
      <TableCell className="text-right">{createdAtResult ? createdAtResult : "N/A"}</TableCell>
      <TableCell>
        <div className="flex gap-2 items-center justify-end">
          <Tooltip content="Edit" trigger="hover">
            <Button
              // onClick={handleEdit}
              className="bg-primary hover:bg-primary-hover ring-transparent"
            >
              <FaEdit />
            </Button>
          </Tooltip>
          <Tooltip
            content="View"
            trigger={window.innerWidth <= 1024 ? "undefined" : "hover"}
          >
            <Button
              // onClick={handleView}
              className="bg-secondary hover:bg-secondary-hover ring-transparent"
            >
              <FaEye />
            </Button>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default VehicleRow;

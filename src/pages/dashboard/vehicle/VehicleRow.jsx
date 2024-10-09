import { Checkbox, TableCell, TableRow } from 'flowbite-react'
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectVehicleById } from '../../../redux/feature/vehicles/vehicleApiSlice';

function VehicleRow({vehicleId}) {
    const vehicle = useSelector((state) => selectVehicleById(state, vehicleId));

  const navigate = useNavigate();

  if (vehicle) {
    const handleEdit = () => navigate(`/admin/vehicles/${vehicleId}`);
    var createdAt = vehicle.createdAt
    var createdAtResult = createdAt.substring(0,createdAt.indexOf("T"))
  } else {
    return null;
  }
  return (
    <TableRow>
    <TableCell className="p-4">
      <Checkbox />
    </TableCell>
    <TableCell>{vehicle.numberPlate ? vehicle.numberPlate : "N/A"}</TableCell>
    <TableCell>{vehicle.vehicleModel ? vehicle.vehicleModel : "N/A"}</TableCell>
    <TableCell>{vehicle.vehicleDescription ? vehicle.vehicleDescription : "N/A"}</TableCell>
    <TableCell>{vehicle.user.fullName ? vehicle.user.fullName : "N/A"}</TableCell>
    <TableCell>{vehicle.user.phoneNumber ? vehicle.user.phoneNumber : "N/A"}</TableCell>
    <TableCell>{createdAtResult ? createdAtResult : "N/A"}</TableCell>
  </TableRow>
  )
}

export default VehicleRow

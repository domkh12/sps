import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectVehicleById } from "../../redux/feature/vehicles/vehicleApiSlice";
import EditVehicleForm from "./EditVehicleForm";

function EditVehicle() {
  const { id } = useParams();
  const vehicle = useSelector((state) => selectVehicleById(state, id));
  if (!vehicle) {
    return <p>no vehicle available</p>;
  } else {
    return <EditVehicleForm vehicle={vehicle} />;
  }
}

export default EditVehicle;

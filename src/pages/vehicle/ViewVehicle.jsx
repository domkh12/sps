import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectVehicleById } from "../../redux/feature/vehicles/vehicleApiSlice";
import ViewVehicleDetail from "./ViewVehicleDetail";

function ViewVehicle() {
  const { id } = useParams();
  const vehicle = useSelector((state) => selectVehicleById(state, id));
  if (!vehicle) {
    return <p>no vehicle available</p>;
  } else {
    return <ViewVehicleDetail vehicle={vehicle} />;
  }
}

export default ViewVehicle;

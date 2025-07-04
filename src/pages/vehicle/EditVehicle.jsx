import { useParams } from "react-router-dom";
import EditVehicleForm from "./EditVehicleForm";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import {useGetVehicleByUuidQuery} from "../../redux/feature/vehicles/vehicleApiSlice";
import {useEffect} from "react";

function EditVehicle() {

  const {id} = useParams();

  const {data: vehicle, isFetching, isSuccess, isError, error, refetch} = useGetVehicleByUuidQuery(id);
  useEffect(() => {
    refetch();
  }, [refetch]);

  let content;

  if (isFetching) content = <LoadingFetchingDataComponent/>;
  else if (isSuccess && vehicle) content = <EditVehicleForm vehicle={vehicle}/>;
  else if (isError) {
    content = <div>Error: {error?.data?.error?.description}</div>;
  } else {
    content = <div>Unexpected state: No vehicle data found.</div>;
  }
  return content;
}

export default EditVehicle;

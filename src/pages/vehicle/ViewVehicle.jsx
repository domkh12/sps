import { useParams } from "react-router-dom";
import ViewVehicleDetail from "./ViewVehicleDetail";
import {useGetVehicleByUuidQuery} from "../../redux/feature/vehicles/vehicleApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import {useEffect} from "react";

function ViewVehicle() {
  const {id} = useParams();

  const {data: vehicle, isFetching, isSuccess, isError, error, refetch} = useGetVehicleByUuidQuery(id);
  useEffect(() => {
    refetch();
  }, [refetch]);

  let content;

  if (isFetching) content = <LoadingFetchingDataComponent/>;

  else if (isSuccess && vehicle) content = <ViewVehicleDetail vehicle={vehicle} />;
  else if (isError) {
    content = <div>Error: {error?.data?.error?.description}</div>;
  } else {
    content = <div>Unexpected state: No user data found.</div>;
  }
  return content;

}

export default ViewVehicle;

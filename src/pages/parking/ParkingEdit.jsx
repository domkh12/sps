import { useParams } from "react-router-dom";
import {useFindParkingSpaceByUuidQuery} from "../../redux/feature/parking/parkingApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import ParkingEditForm from "./ParkingEditForm";
import {useEffect} from "react";

function ParkingEdit() {
  const {id} = useParams();

  const {data: parkingSpace, isFetching, isSuccess, isError, error, refetch} = useFindParkingSpaceByUuidQuery(id);
  useEffect(() => {
    refetch();
  }, [refetch]);

  let content;

  if (isFetching) content = <LoadingFetchingDataComponent/>;

  else if (isSuccess && parkingSpace) content = <ParkingEditForm parkingSpace={parkingSpace}/>;
  else if (isError) {
    content = <div>Error: {error.message}</div>;
  } else {
    content = <div>Unexpected state: No parking space data found.</div>;
  }
  return content;
}

export default ParkingEdit;

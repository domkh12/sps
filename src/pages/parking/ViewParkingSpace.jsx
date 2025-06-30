import {useEffect} from 'react'
import { useParams } from 'react-router-dom'
import LoadingFetchingDataComponent from "./../../components/LoadingFetchingDataComponent";
import ViewParkingSpaceDetail from "./ViewParkingSpaceDetail.jsx";
import {useFindParkingSpaceByUuidQuery} from "../../redux/feature/parking/parkingApiSlice.js";
function ViewParkingSpace() {

  const {id} = useParams();

  const {data: parkingSpace, isFetching, isSuccess, isError, error, refetch} = useFindParkingSpaceByUuidQuery(id);
  useEffect(() => {
    refetch();
  }, [refetch]);

  let content;

  if (isFetching) content = <LoadingFetchingDataComponent/>;

  else if (isSuccess && parkingSpace) content = <ViewParkingSpaceDetail parkingSpace={parkingSpace}/>;
  else if (isError) {
    content = <div>Error: {error.message}</div>;
  } else {
    content = <div>Unexpected state: No parking space data found.</div>;
  }
  return content;
}

export default ViewParkingSpace


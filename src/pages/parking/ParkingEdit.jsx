import { useParams } from "react-router-dom";
import { useGetParkingSpacesQuery } from "../../redux/feature/parking/parkingApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import ParkingEditForm from "./ParkingEditForm";

function ParkingEdit() {
  const { id } = useParams();

  const { parkingSpace } = useGetParkingSpacesQuery(
    "parkingparkingSpacesList",
    {
      selectFromResult: ({ data }) => ({
        parkingSpace: data?.entities[id],
      }),
    }
  );

  let content;

  if (!parkingSpace) content = <LoadingFetchingDataComponent />;

  if (parkingSpace) content = <ParkingEditForm parkingSpace={parkingSpace}/>;

  return content;
}

export default ParkingEdit;

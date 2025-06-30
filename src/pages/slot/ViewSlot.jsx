import {useParams} from "react-router-dom";
import {useGetParkingSlotByUuidQuery} from "../../redux/feature/slot/slotApiSlice.js";
import {useEffect} from "react";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import ViewSlotDetail from "./ViewSlotDetail.jsx";

function ViewSlot(){
    const {id} = useParams();

    const {data: parkingSlot, isFetching, isSuccess, isError, error, refetch} = useGetParkingSlotByUuidQuery(id);

    useEffect(() => {
        refetch();
    }, [refetch]);

    let content;

    if (isFetching) content = <LoadingFetchingDataComponent/>;

    else if (isSuccess && parkingSlot) content = <ViewSlotDetail parkingSlot={parkingSlot}/>;
    else if (isError) {
        content = <div>Error: {error.message}</div>;
    } else {
        content = <div>Unexpected state: No parkingSlot data found.</div>;
    }
    return content;
}

export default ViewSlot;
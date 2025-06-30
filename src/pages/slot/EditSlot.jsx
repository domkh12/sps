import {useParams} from "react-router-dom";
import {useEffect} from "react";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import {useGetParkingSlotByUuidQuery} from "../../redux/feature/slot/slotApiSlice.js";
import EditSlotForm from "./EditSlotForm.jsx";

function EditSlot(){
    const {id} = useParams();

    const {data: parkingSlot, isFetching, isSuccess, isError, error, refetch} = useGetParkingSlotByUuidQuery(id);

    useEffect(() => {
        refetch();
    }, [refetch]);

    let content;

    if (isFetching) content = <LoadingFetchingDataComponent/>;

    else if (isSuccess && parkingSlot) content = <EditSlotForm parkingSlot={parkingSlot}/>;
    else if (isError) {
        content = <div>Error: {error.message}</div>;
    } else {
        content = <div>Unexpected state: No parkingSlot data found.</div>;
    }
    return content;
}

export default EditSlot;
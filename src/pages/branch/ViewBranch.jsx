import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {useGetSiteByUuidQuery} from "../../redux/feature/site/siteApiSlice.js";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import ViewBranchDetail from "./ViewBranchDetail.jsx";

function ViewBranch() {
    const {id} = useParams();

    const {data: branch, isFetching, isSuccess, isError, error, refetch} = useGetSiteByUuidQuery(id);

    useEffect(() => {
        refetch();
    }, [refetch]);

    let content;

    if (isFetching) content = <LoadingFetchingDataComponent/>;

    else if (isSuccess && branch) content = <ViewBranchDetail branch={branch}/>;
    else if (isError) {
        content = <div>Error: {error.message}</div>;
    } else {
        content = <div>Unexpected state: No branch data found.</div>;
    }
    return content;
}

export default ViewBranch;
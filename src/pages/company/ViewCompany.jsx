import {useEffect} from 'react'
import {useParams} from "react-router-dom";
import {useGetCompanyByUuidQuery} from "../../redux/feature/company/companyApiSlice.js";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import ViewCompanyDetail from "./ViewCompanyDetail.jsx";

function ViewCompany() {
    const {id} = useParams();

    const {data: company, isFetching, isSuccess, isError, error, refetch} = useGetCompanyByUuidQuery(id);
    useEffect(() => {
        refetch();
    }, [refetch]);

    let content;

    if (isFetching) content = <LoadingFetchingDataComponent/>;

    else if (isSuccess && company) content = <ViewCompanyDetail company={company}/>;
    else if (isError) {
        content = <div>Error: {error?.data?.error?.description}</div>;
    } else {
        content = <div>Unexpected state: No company data found.</div>;
    }
    return content;
}

export default ViewCompany

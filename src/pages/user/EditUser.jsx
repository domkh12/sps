import { useParams } from "react-router-dom";
import {useFindUserByUuidQuery} from "../../redux/feature/users/userApiSlice";
import EditUserForm from "./EditUserForm";
import LoadingFetchingDataComponent from "./../../components/LoadingFetchingDataComponent";
import {useEffect} from "react";

function EditUser() {
  const {id} = useParams();

  const {data: user, isFetching, isSuccess, isError, error, refetch} = useFindUserByUuidQuery(id);
  useEffect(() => {
    refetch();
  }, [refetch]);

  let content;

  if (isFetching) content = <LoadingFetchingDataComponent/>;

  else if (isSuccess && user) content = <EditUserForm user={user} />;
  else if (isError) {
    content = <div>Error: {error.message}</div>;
  } else {
    content = <div>Unexpected state: No user data found.</div>;
  }
  return content;
}

export default EditUser;

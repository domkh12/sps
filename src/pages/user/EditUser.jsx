import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "../../redux/feature/users/userApiSlice";
import EditUserForm from "./EditUserForm";
import LoadingFetchingDataComponent from "./../../components/LoadingFetchingDataComponent";

function EditUser() {
  const { id } = useParams();

  const { user } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  if (!user) return <LoadingFetchingDataComponent />;

  const content = <EditUserForm user={user} />;
  
  return content;
}

export default EditUser;

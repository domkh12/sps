import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUserById } from "../../redux/feature/users/userApiSlice";

import ViewDetailUser from "./ViewDetailUser";

function ViewUser() {
  const { id } = useParams();
  const user = useSelector((state) => selectUserById(state, id));
  console.log("user", user);
  if (!user) {
    return <p>Not Available</p>;
  } else if (user) {
    return <ViewDetailUser user={user} />;
  }
}

export default ViewUser;

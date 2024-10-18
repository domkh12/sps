import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUserById } from "../../../redux/feature/users/userApiSlice";
import EditUserForm from "./EditUserForm";

function EditUser() {
  const { id } = useParams();

  const user = useSelector((state) => selectUserById(state, id));
  console.log("user", user);
  if (!user) {
    return <p>Not Available</p>;
  } else if (user) {
    return <EditUserForm user={user} />;
  }
}

export default EditUser;

import React from "react";
import { useParams } from "react-router-dom";
import { useGetSitesQuery } from "../../redux/feature/site/siteApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import EditBranchForm from "./EditBranchForm";

function EditBranch() {
  const { id } = useParams();

  const { branch } = useGetSitesQuery("sitesList", {
    selectFromResult: ({ data }) => ({
      branch: data?.entities[id],
    }),
  });

  let content;

  if (!branch) content = <LoadingFetchingDataComponent />;

  content = <EditBranchForm branch={branch} />;
  
  return content;
}

export default EditBranch;

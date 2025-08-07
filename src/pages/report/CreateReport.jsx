import React from 'react';
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import SeoComponent from "./../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import useTranslate from "../../hook/useTranslate";
import FilterChipsComponent from "../../components/FilterChipsComponent";


function CreateReport() {
  const { t } = useTranslate();
  const navigate = useNavigate();

  // Replace this with your actual loading logic
  const isLoading = false;

  const breadcrumbs = [
    <button
      className=" hover:underline"
      onClick={() => navigate("/dash")}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("report")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("create")}
    </Typography>,
  ];

  let content;

  if (isLoading) {
    content = <LoadingFetchingDataComponent />;
  } else {
    content = (
      <>
        <SeoComponent title={"create"} />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("create")}
        />
        {/* Add your report list UI here */}
        
      </>
    );
        

       

      

  }

  return content;
}

export default CreateReport;

import React from 'react';
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import SeoComponent from "./../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
 import useTranslate from "../../hook/useTranslate";
function ReportList() {
  const { t } = useTranslate();
  const navigate = useNavigate();

  // Replace this with your actual loading logic
  const isLoading = false;

  const breadcrumbs = [
    <button
      className="hover:underline"
      onClick={() => navigate("/dash")}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("report")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("list")}
    </Typography>,
  ];

  let content;

  if (isLoading) {
    content = <LoadingFetchingDataComponent />;
  } else {
    content = (
      <>
        <SeoComponent title={"list"} />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("list")}
        />
        
      </>
    );
  }

  return content;
}

export default ReportList;

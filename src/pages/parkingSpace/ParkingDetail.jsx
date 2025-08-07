import React from "react";
import { Card } from "flowbite-react";
import { Typography, Box, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

import SeoComponent from "../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import useTranslate from "../../hook/useTranslate";

const ParkingDetail = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();

  
  const avatarUrl = "https://cms.parkin.ae/sites/default/files/2024-08/news_0.webp";

  const breadcrumbs = [
    <button
      className=" hover:underline"
      onClick={() => navigate("/dash")}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("parkingSpace")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("ParkingDetail")}
    </Typography>,
  ];

  return (
    <>
      <SeoComponent title={t("createAParkingSpace")} />
      <MainHeaderComponent
        breadcrumbs={breadcrumbs}
        title={t("ParkingDetail")}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column */}
          <Card className="w-full md:w-2/5">
            <h5 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
              IT Department
            </h5>
            <div className="flex justify-center py-4">
            <Avatar
                src="https://cms.parkin.ae/sites/default/files/2024-08/news_0.webp"
                sx={{ width: 350, height: 150, borderRadius: 2 }}
                alt="Department Avatar"
              />
            </div>
          </Card>

          {/* Right Column */}
          <Card className="w-full md:w-3/5">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Typography variant="body1">
                <strong>Location:</strong> &nbsp; IT Department
              </Typography>
              <Typography variant="body1">
                <strong>Campuse:</strong> &nbsp; NPIC-002
              </Typography>
              <Typography variant="body1">
                <strong>Quantity lots:</strong> &nbsp; 10
              </Typography>
              <Typography variant="body1">
                <strong>Created At:</strong> &nbsp; 10/12/2020
              </Typography>
            </Box>
          </Card>
        </div>
      </div>
      
    </>
  );
};

export default ParkingDetail;

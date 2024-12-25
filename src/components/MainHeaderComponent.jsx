import { Breadcrumbs, Button, Typography } from "@mui/material";
import React from "react";
import { FiPlus } from "react-icons/fi";

function MainHeaderComponent({ breadcrumbs, title, btnTitle, onClick }) {
  return (
    <div className="pb-10 pt-1 flex flex-wrap justify-between items-center gap-5">
      <div className="flex flex-col gap-5">
        <Typography variant="h5" sx={{ fontSize: "24px", fontWeight: "500" }}>
          {title}
        </Typography>
        <Breadcrumbs
          separator={
            <div className="w-[5px] h-[5px] mx-2 rounded-full bg-light-gray"></div>
          }
          aria-label="breadcrumb"
        >
          {breadcrumbs}
        </Breadcrumbs>
      </div>
      {btnTitle && (
        <Button
          variant="contained"
          startIcon={<FiPlus />}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            boxShadow: "none",
            ":hover": { boxShadow: "none", backgroundColor: "#333333" },
          }}
          onClick={onClick}
        >
          {btnTitle}
        </Button>
      )}
    </div>
  );
}

export default MainHeaderComponent;

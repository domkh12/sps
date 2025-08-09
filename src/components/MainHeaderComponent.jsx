import {Breadcrumbs, Button, IconButton, Typography, useColorScheme} from "@mui/material";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";

function MainHeaderComponent({
  breadcrumbs,
  title,
  btnTitle,
  onClick,
  handleBackClick,
}) {
  const {mode} = useColorScheme();
  return (
    <div className="pb-10 pt-1 flex flex-wrap justify-between items-center gap-5">
      <div className="flex flex-col gap-5">
        <div>
          {handleBackClick && (<IconButton
              aria-label="back"
              onClick={handleBackClick}
              size="small"
              disableRipple
              sx={{
                color: mode === "dark" ? "#fff" : "#000",
              }}
          >
            <IoIosArrowBack/>
            <Typography variant="h5" sx={{fontSize: "24px"}}>
              {title}
            </Typography>
          </IconButton>)}
          {!handleBackClick && (<Typography variant="h5" sx={{fontSize: "24px", fontWeight: "500"}}>
            {title}
          </Typography>)}

        </div>
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

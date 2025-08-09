import React from "react";
import {Paper} from "@mui/material";

function LoadingOneComponent() {
  return (
    <Paper component="div" className="w-screen h-screen flex justify-center items-center">
      <div className="loader2"></div>
    </Paper>
  );
}

export default LoadingOneComponent;

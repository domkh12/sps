import { IconButton } from "@mui/material";
import React from "react";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";

function SettingComponent() {
  return (
    <>
      <IconButton
        aria-label="settings"
        size="large"
        className="active-scale hover-scale"
      >
        <SettingsTwoToneIcon className="w-6 h-6 animate-spin-slow" />
      </IconButton>
    </>
  );
}

export default SettingComponent;

import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { FaPen } from "react-icons/fa6";

function EditButtonComponent({ handleQuickEdit }) {
  
  return (
    <Tooltip
      sx={{
        color: "",
      }}
      title="Quick Edit"
      placement="top"
      arrow
    >
      <IconButton size="large" onClick={handleQuickEdit}>
        <FaPen className="w-5 h-5" />
      </IconButton>
    </Tooltip>
  );
}

export default EditButtonComponent;

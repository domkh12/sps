import { LoadingButton } from "@mui/lab";
import React from "react";

function ButtonComponent({
  onClick,
  btnTitle,
  icon,
  type,
  isLoading,
  loadingCaption,
  backgroundColor,
  hoverBackgroundColor,
}) {
  return (
    <LoadingButton
      variant="contained"
      startIcon={icon ? <FiPlus /> : null}
      sx={{
        backgroundColor: backgroundColor ? backgroundColor : "#333333",
        textTransform: "none",
        borderRadius: "10px",
        boxShadow: "none",
        ":hover": {
          boxShadow: "none",
          backgroundColor: hoverBackgroundColor
            ? hoverBackgroundColor
            : "#333333",
        },
      }}
      onClick={onClick}
      type={type}
      loading={isLoading}
      {...(loadingCaption && { loadingIndicator: loadingCaption })}
    >
      {btnTitle}
    </LoadingButton>
  );
}

export default ButtonComponent;

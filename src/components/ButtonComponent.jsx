import { LoadingButton } from "@mui/lab";
import React from "react";

function ButtonComponent({ onClick, btnTitle, icon, type, isLoading, loadingCaption }) {
  return (
    <LoadingButton
      variant="contained"
      startIcon={icon ? <FiPlus /> : null}
      sx={{
        textTransform: "none",
        borderRadius: "10px",
        boxShadow: "none",
        ":hover": { boxShadow: "none", backgroundColor: "#333333" },
      }}
      onClick={onClick}
      type={type}
      loading={isLoading}
      loadingIndicator={loadingCaption}
    >
      {btnTitle}
    </LoadingButton>
  );
}

export default ButtonComponent;

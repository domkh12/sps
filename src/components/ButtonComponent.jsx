import { LoadingButton } from "@mui/lab";
import {FiPlus} from "react-icons/fi";

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
        textTransform: "none",
        borderRadius: "10px",
        boxShadow: "none",
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

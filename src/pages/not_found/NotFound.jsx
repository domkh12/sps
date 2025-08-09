import {Button, Paper} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useTranslate from "../../hook/useTranslate.jsx";

function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslate();
  return (
    <Paper className="flex justify-center items-center flex-col gap-5 h-screen">
      <img
        src="/images/error404.svg"
        alt="error404"
        className="max-w-[600px]"
      />
      <Button
        sx={{ textTransform: "none", borderRadius: "6px", boxShadow: "none" }}
        variant="contained"
        onClick={() => navigate("/dash")}
      >
          {t("back")}
      </Button>
    </Paper>
  );
}

export default NotFound;

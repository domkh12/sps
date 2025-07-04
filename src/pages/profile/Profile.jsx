import { Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useTranslate from "../../hook/useTranslate";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import { FaAddressCard } from "react-icons/fa6";
import { IoMdKey } from "react-icons/io";
import useAuth from "../../hook/useAuth.jsx";

export default function Profile() {
  const [value, setValue] = useState(0);
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const { isManager, isAdmin } = useAuth();

  const handleBackClick = () => {
    if (isManager) {
      navigate("/dash");
    } else if (isAdmin) {
      navigate("/admin");
    }
  }

  useEffect(() => {
    // Determine the initial tab based on the current URL
    if (location.pathname.includes("security")) {
      setValue(1);
    } else {
      setValue(0);
    }
  }, [location]);
  
  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navigate("/dash")}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={3}>
      {t("account")}
    </Typography>,
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) {
      navigate("/dash/accounts");
    } else if (newValue === 1) {
      navigate("/dash/accounts/security");
    }
  };

  return (
    <>
      <MainHeaderComponent breadcrumbs={breadcrumbs}
                           title={t("account")}
                           handleBackClick={handleBackClick}
      />
      <Tabs value={value} onChange={handleChange} aria-label="tabs">
        <Tab
          icon={<FaAddressCard className="w-5 h-5" />}
          iconPosition="start"
          label="General"
          sx={{ p: 0, minWidth: 0, mr: 5, textTransform: "none" }}
          disableRipple
        />
        <Tab
          icon={<IoMdKey className="w-7 h-7" />}
          iconPosition="start"
          label="Security"
          sx={{ p: 0, minWidth: 0, mr: 5, textTransform: "none" }}
          disableRipple
        />
      </Tabs>
      <div className="mt-10">
        <Outlet />
      </div>
    </>
  );
}

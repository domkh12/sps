import { Box, Tab, Tabs } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function User() {
  const [activeTab, setActiveTab] = useState("custom");
  const [value, setValue] = useState(0);
  const navigator = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const tabMapping = ["custom", "azure"];
    setActiveTab(tabMapping[newValue]);
  };

  useEffect(() => {
    navigator(activeTab);
  }, [activeTab]);

  return (
    <>
      <h1 className="text-2xl font-medium dark:text-gray-100 py-4 px-8">
        Users List
      </h1>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", paddingX: "2rem" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="tabs"
            TabIndicatorProps={{
              sx: {
                display: "flex",
                justifyContent: "center",
                width: "100%",
                backgroundColor: "#111827",
                padding: "0px",
              },
            }}
          >
            <Tab
              label="Custom"
              sx={{
                textTransform: "none",
                color: "#4b5563",
                "&.Mui-selected": {
                  color: "#111827",
                },
                padding: "0px",
                minWidth: 0,
                marginRight: "2rem",
              }}
              disableRipple
            />
            <Tab
              label="Azure"
              sx={{
                textTransform: "none",
                color: "#4b5563",
                "&.Mui-selected": {
                  color: "#111827",
                },
                padding: "0px",
                minWidth: 0,
                marginRight: "2rem",
              }}
              disableRipple
            />
          </Tabs>
        </Box>
      </Box>
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default User;

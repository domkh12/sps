import { Box, Button, Drawer, IconButton, List } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

function ProfileDrawerComponent({ open: initialOpen, onClose }) {
  const [open, setOpen] = useState(initialOpen);

  const handleDrawerClose = () => {
    onClose();
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    setOpen(initialOpen);
  }, [initialOpen]);

  return (
    <div>
      <Drawer open={open} onClose={handleDrawerClose} anchor={"right"}>
        <Box
          sx={{ width: 300 }}
          role="presentation"
          onClick={toggleDrawer(true)}
        >
          <div className="overflow-auto px-[10px] pb-[20px]">
            <Box sx={{ mt: "10px" }}>
              <IconButton onClick={handleDrawerClose}>
                <IoClose />
              </IconButton>
            </Box>
            <List
              component="div"
              aria-labelledby="nested-list-subheader"
            ></List>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#E9B6B3",
                color: "#B60A00",
                width: "100%",
                height: "50px",
                borderRadius: "6px",
                boxShadow:"none",
                "&:hover":{
                  boxShadow:"none"
                }
              }}
            >
              Logout
            </Button>
          </div>
        </Box>
      </Drawer>
    </div>
  );
}

export default ProfileDrawerComponent;

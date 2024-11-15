import {
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { PiXThin } from "react-icons/pi";

function DrawerDetailParking({ open, toggleDrawer, slotName }) {

  const DrawerList = (
    <Box
      sx={{ width: "100%" }}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <Container maxWidth="sm" className="flex justify-between items-center">
        <Typography sx={{ p: 2, color: "text.primary", whiteSpace: "nowrap" }}>
          Parking Space - #{slotName}
        </Typography>
        <IconButton aria-label="close">
          <PiXThin />
        </IconButton>
      </Container>
      <Container className="bg-gray-200 h-40 flex justify-center items-center">
        <img
          src="/images/car_topview.png"
          alt={slotName}
          height="auto"
          width="200px"
          loading="lazy"
          style={{ transform: "rotate(270deg)" }}
          draggable="false"
        />
      </Container>
      <Divider />
    </Box>
  );
  return (
    <div>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor="right"
        PaperProps={{
          sx: { width: "20%" },
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}

export default DrawerDetailParking;

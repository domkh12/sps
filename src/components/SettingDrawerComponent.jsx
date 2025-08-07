import {Box, Button, Drawer, IconButton, Typography, useColorScheme} from "@mui/material";
import {useDispatch} from "react-redux";
import {setIsSettingDrawerOpen} from "../redux/feature/actions/actionSlice.js";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import IconButtonWithToolTipComponent from "./IconButtonWithToolTipComponent.jsx";
import FilterDramaTwoToneIcon from '@mui/icons-material/FilterDramaTwoTone';
import ToggleSettingButtonComponent from "./ToggleSettingButtonComponent.jsx";

function SettingDrawerComponent({open}) {
    const dispatch = useDispatch();
    const {mode, setMode} = useColorScheme();

    const toggleDrawer = (newOpen) => () => {
        dispatch(setIsSettingDrawerOpen(newOpen));
    };

    const toggleMode = () => {
        setMode(mode === "dark" ? "light" : "dark");
    }

    return (
        <Drawer
            open={open}
            onClose={toggleDrawer(false)}
            anchor={"right"}
        >
            <Box sx={{width: 360}} role="presentation">
                {/* Title */}
                <Box sx={{
                    userSelect: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1.5
                }}>
                    <Typography variant="h6">Settings</Typography>

                    <div>
                        <IconButtonWithToolTipComponent icon={<FullscreenIcon/>}
                                                        tooltipTitle={"Fullscreen"}
                                                        />
                        <IconButtonWithToolTipComponent icon={<RefreshRoundedIcon/>}
                                                        tooltipTitle={"Reset all"}/>
                        <IconButtonWithToolTipComponent icon={<CloseRoundedIcon/>}
                                                        tooltipTitle={"Close"}
                                                        onClick={toggleDrawer(false)}/>
                    </div>
                </Box>

                {/* Toggle */}
                <div className="grid grid-cols-2 p-4 gap-3">
                    <ToggleSettingButtonComponent icon={<FilterDramaTwoToneIcon/>} label={"Mode"}
                                                    onClick={toggleMode} isChecked={mode === "dark"}/>
                </div>
            </Box>
        </Drawer>
    )
}

export default SettingDrawerComponent;
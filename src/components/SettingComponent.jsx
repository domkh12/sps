import {IconButton} from "@mui/material";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import {useDispatch, useSelector} from "react-redux";
import {setIsSettingDrawerOpen} from "../redux/feature/actions/actionSlice.js";
import SettingDrawerComponent from "./SettingDrawerComponent.jsx";

function SettingComponent() {
    const dispatch = useDispatch();
    const isSettingDrawerOpen = useSelector((state) => state.action.isSettingDrawerOpen);

    return (
        <>
            <IconButton
                aria-label="settings"
                size="large"
                className="active-scale hover-scale"
                onClick={() => dispatch(setIsSettingDrawerOpen(true))}
            >
                <SettingsTwoToneIcon className="w-6 h-6 animate-spin-slow"/>
            </IconButton>
            {isSettingDrawerOpen && (
                <SettingDrawerComponent
                    open={isSettingDrawerOpen}
                />
            )}
        </>
    );
}

export default SettingComponent;

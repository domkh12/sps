import {IconButton, Tooltip} from "@mui/material";

function IconButtonWithToolTipComponent({icon, tooltipTitle, onClick}) {
    return (
        <Tooltip title={tooltipTitle} placement="bottom">
            <IconButton onClick={onClick}>
                {icon}
            </IconButton>
        </Tooltip>
    )
}

export default IconButtonWithToolTipComponent;
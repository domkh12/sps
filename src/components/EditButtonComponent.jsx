import {IconButton, Tooltip} from "@mui/material";
import {FaPen} from "react-icons/fa6";
import useTranslate from "../hook/useTranslate.jsx";

function EditButtonComponent({handleQuickEdit, tooltipTitle}) {
    const { t } = useTranslate();
    return (
        <Tooltip
            sx={{
                color: "",
            }}
            title={tooltipTitle ? tooltipTitle : t('quickEdit')}
            placement="top"
            arrow
        >
            <IconButton size="large" onClick={handleQuickEdit}>
                <FaPen className="w-5 h-5"/>
            </IconButton>
        </Tooltip>
    );
}

export default EditButtonComponent;

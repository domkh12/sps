import {useNavigate} from "react-router-dom";
import useTranslate from "../../hook/useTranslate.jsx";
import {Card, Chip, Paper, Typography} from "@mui/material";
import MainHeaderComponent from "../../components/MainHeaderComponent.jsx";
import {cardStyle} from "../../assets/style.js";
import ImageDetailComponent from "../../components/ImageDetailComponent.jsx";

function ViewSlotDetail({parkingSlot}){
    const navigate = useNavigate();
    console.log({parkingSlot});
    const { t } = useTranslate();
    const breadcrumbs = [
        <Paper
            elevation={0}
            component="button"
            className="text-black hover:underline"
            onClick={() => navigate("/dash")}
            key={1}
        >
            {t("dashboard")}
        </Paper>,
        <Typography color="inherit" key={2}>
            {t("slot")}
        </Typography>,
        <Typography color="inherit" key={3}>
            {parkingSlot?.lotName || "N/A"}
        </Typography>,
    ];
    return (
        <>
            <MainHeaderComponent
                breadcrumbs={breadcrumbs}
                title={parkingSlot.lotName || "N/A"}
                handleBackClick={() => navigate("/dash/parking-slots")}
            />
            <Card sx={{...cardStyle, p: "16px"}}>
                <Typography variant="h6" sx={{pb: 1}}>{t('parkingSlotInfo')}</Typography>
                <ImageDetailComponent image={parkingSlot?.image}/>
                <div className="flex flex-col gap-3 mt-5">
                    <Typography variant="body1">
                        <span >{t('parkingSlotName')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${parkingSlot?.lotName || "N/A"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('parkingSpaceName')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${parkingSlot?.parkingSpace?.label || "N/A"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('status')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${parkingSlot?.isAvailable ? "Available" : "Occupied"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('createdAt')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${parkingSlot?.createdAt || "N/A"}`}
                    </Typography>
                </div>
            </Card>
        </>
    );
}

export default ViewSlotDetail;
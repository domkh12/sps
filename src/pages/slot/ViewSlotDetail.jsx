import {Link, useNavigate} from "react-router-dom";
import useTranslate from "../../hook/useTranslate.jsx";
import {Card, Chip, Paper, Typography} from "@mui/material";
import MainHeaderComponent from "../../components/MainHeaderComponent.jsx";
import {cardStyle} from "../../assets/style.js";
import ImageDetailComponent from "../../components/ImageDetailComponent.jsx";
import useAuth from "../../hook/useAuth.jsx";

function ViewSlotDetail({parkingSlot}){
    const navigate = useNavigate();
    const {isAdmin} = useAuth();
    const { t } = useTranslate();
    const breadcrumbs = [
        <Paper
            elevation={0}
            component="button"
            className="text-black hover:underline"
            onClick={() => navigate(`/${isAdmin ? "admin" : "dash"}`)}
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
                handleBackClick={() => navigate(`/${isAdmin ? "admin" : "dash"}/parking-slots`)}
            />
            <Card sx={{...cardStyle, p: "16px"}}>
                <Typography variant="h6" sx={{pb: 1}}>{t('parkingSlotInfo')}</Typography>
                <ImageDetailComponent image={parkingSlot?.image}/>
                <div className="flex flex-col gap-3 mt-5">
                    <Typography variant="body1">
                        <span >{t('parkingSlotName')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${parkingSlot?.lotName || "N/A"}`}
                    </Typography>
                    {
                        isAdmin ? (
                            <Link to={`/admin/parking-spaces/${parkingSlot?.parkingSpace?.uuid}/view`}>
                                <Typography variant="body1">
                                    <span>{t('parkingSpaceName')} </span>
                                    <span>{`${"\u00a0"}:${"\u00a0"}`}</span>
                                    <span
                                        className="text-blue-700 hover:underline">{parkingSlot?.parkingSpace?.label || "N/A"}</span>
                                </Typography>
                            </Link>
                        ): (
                            <Typography variant="body1">
                                <span>{t('parkingSpaceName')} </span>
                                <span>{`${"\u00a0"}:${"\u00a0"}`}</span>
                                <span>{parkingSlot?.parkingSpace?.label || "N/A"}</span>
                            </Typography>
                        )
                    }

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
import {Link, useNavigate} from "react-router-dom";
import useTranslate from "../../hook/useTranslate.jsx";
import {Card, Paper, Typography} from "@mui/material";
import MainHeaderComponent from "../../components/MainHeaderComponent.jsx";
import {cardStyle} from "../../assets/style.js";
import ImageDetailComponent from "../../components/ImageDetailComponent.jsx";

function ViewParkingSpaceDetail({parkingSpace}){
    const navigate = useNavigate();
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
            {t("parkingSpace")}
        </Typography>,
        <Typography color="inherit" key={3}>
            {parkingSpace?.label || "N/A"}
        </Typography>,
    ];
    return (
        <>
            <MainHeaderComponent
                breadcrumbs={breadcrumbs}
                title={parkingSpace.label || "N/A"}
                handleBackClick={() => navigate("/dash/parking-spaces")}
            />
            <Card sx={{...cardStyle, p: "16px"}}>
                <Typography variant="h6" sx={{pb: 1}}>{t('parkingSpaceInfo')}</Typography>
                <ImageDetailComponent image={parkingSpace?.image}/>
                <div className="flex flex-col gap-3 mt-5">
                    <Typography variant="body1">
                        <span >{t('parkingSpaceName')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${parkingSpace?.label || "N/A"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('slotQty')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${parkingSpace?.lotQty}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('occupied')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${parkingSpace?.filled}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('createdAt')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${parkingSpace?.createdAt}`}
                    </Typography>
                    <Link to={`/dash/companies/${parkingSpace?.site?.company?.uuid}/view`}>
                        <Typography variant="body1">
                            <span>{t('company')} </span>
                            <span>{`${"\u00a0"}:${"\u00a0"}`}</span>
                            <span
                                className="text-blue-700 hover:underline">{parkingSpace?.site?.company?.companyName || "N/A"}</span>
                        </Typography>
                    </Link>
                    <Link to={`/dash/branches/${parkingSpace?.site?.uuid}/view`}>
                        <Typography variant="body1">
                            <span >{t('branch')} </span>
                            <span>{`${"\u00a0"}:${"\u00a0"}`}</span>
                            <span className="text-blue-700 hover:underline">{parkingSpace?.site?.siteName || "N/A"}</span>
                        </Typography>
                    </Link>
                </div>
            </Card>
        </>
    );
}

export default ViewParkingSpaceDetail;
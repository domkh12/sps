import {useNavigate} from "react-router-dom";
import useTranslate from "../../hook/useTranslate.jsx";
import {Card, Paper, Typography} from "@mui/material";
import MainHeaderComponent from "../../components/MainHeaderComponent.jsx";
import {cardStyle} from "../../assets/style.js";
import ImageDetailComponent from "../../components/ImageDetailComponent.jsx";

function ViewBranchDetail({branch}){
    const navigate = useNavigate();
    console.log("branch", branch);
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
            {t("branchType")}
        </Typography>,
        <Typography color="inherit" key={3}>
            {branch?.siteName}
        </Typography>,
    ];
    return (
        <>
            <MainHeaderComponent
                breadcrumbs={breadcrumbs}
                title={branch.siteName}
                handleBackClick={() => navigate("/dash/branches")}
            />
            <Card sx={{...cardStyle, p: "16px"}}>
                <Typography variant="h6" sx={{pb: 1}}>{t('branchInfo')}</Typography>
                <ImageDetailComponent image={branch?.image}/>
                <div className="flex flex-col gap-3 mt-5">
                    <Typography variant="body1">
                        <span >{t('branchName')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${branch?.siteName || "N/A"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('branchType')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${branch?.siteType.name || "N/A"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('parkingSpaceQty')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${branch?.parkingSpacesQty}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('branchAddress')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${branch?.siteAddress || "N/A"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('city')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${branch?.city.name || "N/A"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('company')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${branch?.company.companyName || "N/A"}`}
                    </Typography>
                </div>
            </Card>
        </>
    );
}

export default ViewBranchDetail;
import {useNavigate} from "react-router-dom";
import useTranslate from "../../hook/useTranslate.jsx";
import {Card, Paper, Typography} from "@mui/material";
import MainHeaderComponent from "../../components/MainHeaderComponent.jsx";
import {cardStyle} from "../../assets/style.js";
import ImageDetailComponent from "../../components/ImageDetailComponent.jsx";

function ViewCompanyDetail({company}) {
    const navigate = useNavigate();
    const { t } = useTranslate();
    const breadcrumbs = [
        <Paper
            elevation={0}
            component="button"
            className="text-black hover:underline"
            onClick={() => navigate("/admin")}
            key={1}
        >
            {t("dashboard")}
        </Paper>,
        <Typography color="inherit" key={2}>
            {t("companyType")}
        </Typography>,
        <Typography color="inherit" key={3}>
            {company?.companyName || "N/A"}
        </Typography>,
    ];
    return (
        <>
            <MainHeaderComponent
                breadcrumbs={breadcrumbs}
                title={company.companyName || "N/A"}
                handleBackClick={() => navigate("/admin/companies")}
            />
            <Card sx={{...cardStyle, p: "16px"}}>
                <Typography variant="h6" sx={{pb: 1}}>{t('companyInfo')}</Typography>
                <ImageDetailComponent image={company?.image}/>
                <div className="flex flex-col gap-3 mt-5">
                    <Typography variant="body1">
                        <span >{t('companyName')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${company?.companyName || "N/A"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('branchQty')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${company?.siteQty}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('companyAddress')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${company?.companyAddress || "N/A"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('city')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${company?.city.name || "N/A"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('companyType')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${company?.companyType.name || "N/A"}`}
                    </Typography>
                    <Typography variant="body1">
                        <span >{t('establishedDate')} </span>
                        {`${"\u00a0"}:${"\u00a0"}${company?.establishedDate || "N/A"}`}
                    </Typography>
                </div>
            </Card>
        </>
    );
}

export default ViewCompanyDetail;
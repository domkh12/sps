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
            onClick={() => navigate("/dash")}
            key={1}
        >
            {t("dashboard")}
        </Paper>,
        <Typography color="inherit" key={2}>
            {t("companyType")}
        </Typography>,
        <Typography color="inherit" key={3}>
            {company?.companyName}
        </Typography>,
    ];
    return (
        <>
            <MainHeaderComponent
                breadcrumbs={breadcrumbs}
                title={company.companyName}
                handleBackClick={() => navigate("/dash/companies")}
            />
            <Card sx={{...cardStyle, p: "16px"}}>
                <Typography variant="h6" sx={{pb: 1}}>Building Info</Typography>
                <ImageDetailComponent image={company?.image}/>
                {/*<div className="flex flex-col gap-3 mt-5">*/}
                {/*    <Typography variant="body1">*/}
                {/*        <span >Building id </span>*/}
                {/*        {`${"\u00a0"}:${"\u00a0"}${building?.id}`}*/}
                {/*    </Typography>*/}
                {/*    <Typography variant="body1">*/}
                {/*        <span >Building name </span>*/}
                {/*        {`${"\u00a0"}:${"\u00a0"}${building?.name}`}*/}
                {/*    </Typography>*/}
                {/*    <Typography variant="body1">*/}
                {/*        <span >Floor quantity </span>*/}
                {/*        {`${"\u00a0"}:${"\u00a0"}${building?.floorQty}`}*/}
                {/*    </Typography>*/}
                {/*    <Typography variant="body1">*/}
                {/*        <span >Created at </span>*/}
                {/*        {`${"\u00a0"}:${"\u00a0"}${building?.createdAt}`}*/}
                {/*    </Typography>*/}
                {/*</div>*/}
            </Card>
        </>
    );
}

export default ViewCompanyDetail;
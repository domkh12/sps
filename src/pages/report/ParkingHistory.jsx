import SeoComponent from "../../components/SeoComponent.jsx";
import MainHeaderComponent from "../../components/MainHeaderComponent.jsx";
import useTranslate from "../../hook/useTranslate.jsx";
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useAuth from "../../hook/useAuth.jsx";
import DateFilterComponent from "../../components/DateFilterComponent.jsx";
import SkeletonTableRowComponent from "../../components/SkeletonTableRowComponent.jsx";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import dayjs from "dayjs";
import {
    useGetReportParkingExcelMutation,
    useGetReportParkingPdfMutation,
    useGetReportParkingQuery
} from "../../redux/feature/parkingSlotDetail/parkingSlotDetailApiSlice.js";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import ParkingReportRowComponent from "../../components/ParkingReportRowComponent.jsx";
import DataNotFound from "../../components/DataNotFound.jsx";
import {
    setPageNoParkingReport,
    setPageSizeParkingReport
} from "../../redux/feature/parkingSlotDetail/parkingSlotSlice.js";
import FilterChipsComponent from "../../components/FilterChipsComponent.jsx";
import {setIsOpenPdfModal} from "../../redux/feature/actions/actionSlice.js";
import PdfModalPreviewComponent from "../../components/PdfModalPreviewComponent.jsx";

function ParkingHistory() {
    const { t } = useTranslate();
    const navigate = useNavigate();
    const {isAdmin} = useAuth();
    const pageNo = useSelector((state) => state.parkingSlotDetail.pageNoParkingReport);
    const pageSize = useSelector((state) => state.parkingSlotDetail.pageSizeParkingReport);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [pdfUrl, setPdfUrl] = useState("");
    const dispatch = useDispatch();

    const {
        data: parkingData,
        isLoading: isLoadingGetParking,
        isSuccess : isSuccessGetParking,
        isFetching: isFetchingGetParking,
    } = useGetReportParkingQuery(
        {
            pageNo, pageSize,
            dateFrom: fromDate !== "" ? dayjs(fromDate).format("YYYY-MM-DDTHH:mm:ss") : "",
            dateTo: toDate !== "" ? dayjs(toDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss") : "",
        }
    );

    const [getParkingPdf,{
        isSuccess: isSuccessGetParkingPdf,
        isLoading: isLoadingGetParkingPdf,
        isError: isErrorGetParkingPdf,
        error: errorGetParkingPdf
    }] = useGetReportParkingPdfMutation();

    const [getParkingExcel,{
        isSuccess: isSuccessGetParkingExcel,
        isLoading: isLoadingGetParkingExcel,
        isError: isErrorGetParkingExcel,
        error: errorGetParkingExcel
    }] = useGetReportParkingExcelMutation();

    const handleBtnPdfClick = async () => {
        dispatch(setIsOpenPdfModal(true));
        const blob = await getParkingPdf({
            dateFrom: fromDate !== "" ? dayjs(fromDate).format("YYYY-MM-DDTHH:mm:ss") : "",
            dateTo: toDate !== "" ? dayjs(toDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss") : "",
        }).unwrap();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
    }

    const handleBtnExcelClick = async () => {
        const blob = await getParkingExcel({
            dateFrom: fromDate !== "" ? dayjs(fromDate).format("YYYY-MM-DDTHH:mm:ss") : "",
            dateTo: toDate !== "" ? dayjs(toDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss") : "",
        }).unwrap();
        const url = URL.createObjectURL(blob);
        window.open(url);
    }

    const breadcrumbs = [
        <button
            className="hover:underline"
            onClick={() => navigate(`${isAdmin ? "/admin" : "/dash"}`)}
            key={1}
        >
            {t("dashboard")}
        </button>,
        <Typography color="inherit" key={2}>
            {t("report")}
        </Typography>,
        <Typography color="inherit" key={3}>
            {t("parkingHistory")}
        </Typography>,
    ];

    const columns = [
        {
            id: "licensePlateNumber",
            label: t("licensePlate"),
            minWidth: 120,
            align: "left",
        },
        { id: "licensePlateProvinceKh", label: t('licensePlateProvinceNameKh'), minWidth: 170, align: "left" },
        { id: "owner", label: t('owner'), minWidth: 170, align: "left" },
        { id: "duration", label: t('duration'), minWidth: 170, align: "left" },
        { id: "parkingSpace", label: t('parkingSpace'), minWidth: 170, align: "left" },
    ];

    const handleChangePage = (event, newPage) => {
        dispatch(setPageNoParkingReport(newPage + 1));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setPageSizeParkingReport(event.target.value));
        dispatch(setPageNoParkingReport(1));
    };

    let content;

    if (isLoadingGetParking) content = <LoadingFetchingDataComponent />;

    if (isSuccessGetParking) {
        const { ids, entities, totalElements, pageSize, pageNo } = parkingData;

        const tableContent = (
            ids.length ? (
                ids.map((parkingId) => (
                    <ParkingReportRowComponent parking={entities[parkingId]} key={parkingId} />
                ))
            ) : (
                <TableRow >
                    <TableCell align="center" colSpan={12}>
                        <DataNotFound />
                    </TableCell>
                </TableRow>
            )
        )

        content = <>
            <div data-aos="fade-left">
                <SeoComponent title="Parking History" />
                <MainHeaderComponent
                    breadcrumbs={breadcrumbs}
                    title={t("parkingHistory")}
                />

                <Card>

                    <DateFilterComponent
                        setFromDate={setFromDate}
                        setToDate={setToDate}
                        fromDate={fromDate == "" ? null : fromDate}
                        toDate={toDate == "" ? null : toDate}
                        onClickPdf={handleBtnPdfClick}
                        onClickExcel={handleBtnExcelClick}
                        isLoadingExcel={isLoadingGetParkingExcel}
                    />

                    <FilterChipsComponent
                        searchQuery={""}
                        dateFrom={fromDate}
                        dateTo={toDate}
                        onDateChange={(dateFrom, dateTo) => {
                            setFromDate(dateFrom);
                            setToDate(dateTo);
                        }}
                        isFiltered={(fromDate && toDate)}
                        clearFilter={() => {
                            setFromDate("");
                            setToDate("");
                        }}
                        resultFound={totalElements}
                    />

                    <TableContainer>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#F4F6F8" }}>
                                <TableRow>
                                    <TableCell padding="checkbox"></TableCell>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth, color: "gray" }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ border: "none" }}>
                                {isFetchingGetParking && ids.length === 0 ? (Array.from({length: pageSize}).map((_, index) => (
                                    <SkeletonTableRowComponent key={index} cellCount={4}/>
                                ))) : (<>{tableContent}</>)}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalElements || 0}
                        rowsPerPage={pageSize}
                        labelRowsPerPage={t('rowPerPage')}
                        page={ pageNo}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                </Card>
            </div>
            <PdfModalPreviewComponent pdfUrl={pdfUrl} isLoading={isLoadingGetParkingPdf} isSuccess={isSuccessGetParkingPdf}/>
        </>
    }

    return content;
}

export default ParkingHistory;
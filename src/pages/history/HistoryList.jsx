import {useEffect} from "react";
import SeoComponent from "../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import {useNavigate} from "react-router-dom";
import {
    Card,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import useTranslate from "../../hook/useTranslate";
import {cardStyle} from "../../assets/style";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import HistoryRowComponent from "../../components/HistoryRowComponent";
import DataNotFound from "../../components/DataNotFound";
import {useFindAllLabelsMutation} from "../../redux/feature/parking/parkingApiSlice";
import {useDispatch, useSelector} from "react-redux";
import {
    useFilterParkingSlotDetailQuery,
    useGetParkingSlotDetailQuery
} from "../../redux/feature/parkingSlotDetail/parkingSlotDetailApiSlice";
import useWebSocket from "../../hook/useWebSocket.jsx";
import dayjs from "dayjs";
import {useDebounce} from "use-debounce";
import FilterChipsComponent from "../../components/FilterChipsComponent.jsx";
import {
    setDateFromCheckIn, setDateToCheckIn, setIsRefetchCheckIn,
} from "../../redux/feature/checkIn/checkInSlice.js";
import {
    setDateFromParkingDetail, setDateToParkingDetail,
    setKeywordsParkingDetail,
    setPageNoParkingDetail, setPageSizeParkingDetail
} from "../../redux/feature/parkingSlotDetail/parkingSlotSlice.js";
import {DatePicker} from "@mui/x-date-pickers";
import SearchComponent from "../../components/SearchComponent.jsx";
import TableActionMenuComponent from "../../components/TableActionMenuComponent.jsx";
import SkeletonTableRowComponent from "../../components/SkeletonTableRowComponent.jsx";
import {setIsRefetchCheckOut} from "../../redux/feature/checkOut/checkOutSlice.js";

function HistoryList() {
    const navigate = useNavigate();
    const {t} = useTranslate();
    const dispatch = useDispatch();
    const pageNo = useSelector((state) => state.parkingSlotDetail.pageNoParkingDetail);
    const pageSize = useSelector((state) => state.parkingSlotDetail.pageSizeParkingDetail);
    const dateFrom = useSelector((state) => state.parkingSlotDetail.dateFrom);
    const dateTo = useSelector((state) => state.parkingSlotDetail.dateTo);
    const searchKeywords = useSelector((state) => state.parkingSlotDetail.keywords);
    const [debounceInputSearch] = useDebounce(searchKeywords, 1000);
    const dateFromValue = dateFrom ? dayjs(dateFrom) : null;
    const dateToValue = dateTo ? dayjs(dateTo) : null;
    const isRefetchCheckIn = useSelector((state) => state.checkIn.isRefetchCheckIn);
    const isRefetchCheckOut = useSelector((state) => state.checkOut.isRefetchCheckOut);

    const {
        data: parkingDetailData,
        isSuccess: isSuccessGetParkingDetail,
        isLoading: isLoadingGetParkingDetail,
        isError: isErrorGetParkingDetail,
        error: errorGetParkingDetail,
        refetch: refetchParkingDetail,
    } = useGetParkingSlotDetailQuery("parkingSlotDetailList");

    const {
        data: filterData,
        isFetching: isFetchingParkingDetail,
        refetch: refetchParkingDetailFilter,
    } =
        useFilterParkingSlotDetailQuery({
            pageNo,
            pageSize,
            keywords: debounceInputSearch,
            dateFrom: dateFrom ? dayjs(dateFrom).format("YYYY-MM-DDTHH:mm:ss") : "",
            dateTo: dateTo ? dayjs(dateTo).format("YYYY-MM-DDTHH:mm:ss") : "",
        });

    useEffect(() => {
        if (isRefetchCheckIn || isRefetchCheckOut) {
            refetchParkingDetail();
            refetchParkingDetailFilter();
        }
    }, [isRefetchCheckIn, isRefetchCheckOut]);

    const columns = [
        {id: "model", label: t("vehicleModel"), minWidth: 170, align: "left"},
        {
            id: "plateNumber",
            label: t("plateNumber"),
            minWidth: 120,
            align: "left",
        },
        {
            id: "location",
            label: t("location"),
            minWidth: 120,
            align: "left",
        },
        {
            id: "time",
            label: t("timeInOut"),
            minWidth: 120,
            align: "left",
        },
        {
            id: "duration",
            label: t("duration"),
            minWidth: 120,
            align: "left",
        },
        {
            id: "status",
            label: t("status"),
            minWidth: 120,
            align: "left",
        },
        {
            id: "action",
            label: "",
            minWidth: 30,
            align: "left",
        },
    ];
    const breadcrumbs = [
        <button
            className="text-black hover:underline"
            onClick={() => navigate("/dash")}
            key={1}
        >
            {t("dashboard")}
        </button>,
        <Typography color="inherit" key={2}>
            {t("parkingDetail")}
        </Typography>,
        <Typography color="inherit" key={3}>
            {t("list")}
        </Typography>,
    ];

    const handleSearchChange = (value) => {
        dispatch(setKeywordsParkingDetail(value));
    }

    const handleChangePage = (event, newPage) => {
        dispatch(setPageNoParkingDetail(newPage + 1));
    };

    const handleChangeRowsPerPage = (event, newValue) => {
        dispatch(setPageSizeParkingDetail(event.target.value));
        dispatch(setPageNoParkingDetail(1));
    };

    let content;

    if (isLoadingGetParkingDetail) content = <LoadingFetchingDataComponent/>;

    if (isSuccessGetParkingDetail) {
        const {ids, entities, totalElements, pageSize, pageNo} = parkingDetailData;

        const {
            ids: idsFilterData,
            entities: searchEntities,
            totalElements: totalElementsSearch,
            pageSize: pageSizeFilter,
            pageNo: pageNoFilter,
        } = filterData || {};

        const displayTotalElements = debounceInputSearch !== "" || dateFrom || dateTo ? totalElementsSearch : totalElements;

        const tableContent =
            debounceInputSearch !== "" || dateFrom || dateTo || pageSizeFilter || pageNoFilter ? (
                <>
                    {idsFilterData?.length ? (
                        idsFilterData?.map((id) => (
                            <HistoryRowComponent
                                key={id}
                                parkingDetail={searchEntities[id]}
                            />
                        ))
                    ) : (
                        <TableRow sx={{bgcolor: "#f9fafb"}}>
                            <TableCell align="center" colSpan={20}>
                                <DataNotFound/>
                            </TableCell>
                        </TableRow>
                    )}
                </>
            ) : (
                <>
                    {ids?.length ? (
                        ids?.map((id) => (
                            <HistoryRowComponent
                                key={id}
                                parkingDetail={entities[id]}
                            />
                        ))
                    ) : (
                        <TableRow sx={{bgcolor: "#f9fafb"}}>
                            <TableCell align="center" colSpan={20}>
                                <DataNotFound/>
                            </TableCell>
                        </TableRow>
                    )}
                </>
            );

        content = (
            <div data-aos="fade-left">
                <SeoComponent title="Parking Detail List"/>
                <MainHeaderComponent breadcrumbs={breadcrumbs} title={t("list")}/>

                <Card sx={{...cardStyle}}>
                    <div className="flex p-[20px] justify-between items-center gap-5 flex-col lg:flex-row">
                        {/* Left side: Date pickers */}
                        <div className="flex gap-5 flex-col w-full lg:w-[800px] lg:flex-row">
                            <DatePicker
                                label={t("fromDate")}
                                value={dateFromValue}
                                onChange={(newValue) => {
                                    // newValue is a dayjs object or null
                                    dispatch(
                                        setDateFromParkingDetail(newValue ? newValue.toISOString() : "")
                                    );
                                }}
                                slotProps={{
                                    textField: {fullWidth: true},
                                }}
                            />
                            <DatePicker
                                label={t("toDate")}
                                value={dateToValue}
                                onChange={(newValue) => {
                                    dispatch(
                                        setDateToParkingDetail(newValue ? newValue.toISOString() : "")
                                    );
                                }}
                                slotProps={{
                                    textField: {fullWidth: true},
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full">
                            <SearchComponent
                                onSearchChange={handleSearchChange}
                                value={searchKeywords}
                            />
                            <TableActionMenuComponent/>
                        </div>
                    </div>

                    <FilterChipsComponent
                        dateFrom={dateFrom}
                        dateTo={dateTo}
                        onDateChange={(dateFrom, dateTo) => {
                            dispatch(setDateFromParkingDetail(dateFrom));
                            dispatch(setDateToParkingDetail(dateTo));
                        }}
                        searchQuery={searchKeywords}
                        clearSearch={() => dispatch(setKeywordsParkingDetail(""))}
                        handleSearchChange={handleSearchChange}
                        isFiltered={searchKeywords !== "" || (dateFrom && dateTo)}
                        resultFound={displayTotalElements}
                        clearFilter={() => {
                            dispatch(setDateFromParkingDetail(""));
                            dispatch(setDateToParkingDetail(""));
                            dispatch(setKeywordsParkingDetail(""));
                        }}
                    />
                    <TableContainer>
                        <Table>
                            <TableHead sx={{backgroundColor: "#F4F6F8"}}>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            sx={{
                                                "&.Mui-checked": {
                                                    color: "#2C3092",
                                                },
                                                "&:hover": {
                                                    color: "#2C3092",
                                                },
                                            }}
                                            color="primary"
                                        />
                                    </TableCell>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{minWidth: column.minWidth, color: "gray"}}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{border: "none"}}>
                                {isFetchingParkingDetail && idsFilterData?.length === 0 ? (
                                    Array.from({length: pageSize}).map((_, index) => (
                                        <SkeletonTableRowComponent key={index} cellCount={4}/>
                                    ))
                                ) : (
                                    <>{tableContent}</>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={displayTotalElements || 0}
                        rowsPerPage={pageSizeFilter != null && pageSizeFilter !== 0 ? pageSizeFilter : pageSize}
                        labelRowsPerPage={t('rowPerPage')}
                        page={pageNoFilter != null && pageNoFilter !== 0 ? pageNoFilter : pageNo}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </div>
        );
    }

    return content;
}

export default HistoryList;

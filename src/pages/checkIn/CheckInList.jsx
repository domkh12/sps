import SeoComponent from "../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import { useNavigate } from "react-router-dom";
import useTranslate from "../../hook/useTranslate";
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
import {
  useFilterCheckInQuery,
  useGetCheckInQuery,
} from "../../redux/feature/checkIn/checkInApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import SkeletonTableRowComponent from "../../components/SkeletonTableRowComponent";
import { cardStyle } from "../../assets/style";
import DataNotFound from "../../components/DataNotFound";
import CheckInRowComponent from "../../components/CheckInRowComponent.jsx";
import { useDebounce } from "use-debounce";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "@mui/x-date-pickers";
import {
  setDateFromCheckIn,
  setDateToCheckIn, setIsRefetchCheckIn,
  setKeywordsCheckIn, setPageNoCheckIn, setPageSizeCheckIn,
} from "../../redux/feature/checkIn/checkInSlice.js";
import dayjs from "dayjs";
import SearchComponent from "../../components/SearchComponent.jsx";
import TableActionMenuComponent from "../../components/TableActionMenuComponent.jsx";
import useWebSocket from "../../hook/useWebSocket.jsx";
import {useEffect} from "react";
import FilterChipsComponent from "../../components/FilterChipsComponent.jsx";
import {setIsRefetchCheckOut} from "../../redux/feature/checkOut/checkOutSlice.js";
import useAuth from "../../hook/useAuth.jsx";

function CheckInList() {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const searchKeywords = useSelector((state) => state.checkIn.keywords);
  const pageNo = useSelector((state) => state.checkIn.pageNoCheckIn);
  const dispatch = useDispatch();
  const pageSize = useSelector((state) => state.checkIn.pageSizeCheckIn);
  const [debounceInputSearch] = useDebounce(searchKeywords, 1000);
  const dateFrom = useSelector((state) => state.checkIn.dateFrom);
  const dateTo = useSelector((state) => state.checkIn.dateTo);
  const dateFromValue = dateFrom ? dayjs(dateFrom) : null;
  const dateToValue = dateTo ? dayjs(dateTo) : null;
  const isRefetchCheckIn = useSelector((state) => state.checkIn.isRefetchCheckIn);
  const isRefetchCheckOut = useSelector((state) => state.checkOut.isRefetchCheckOut);
  const {isAdmin} = useAuth();

  const {
    data: checkInData,
    isSuccess: isSuccessCheckIn,
    isLoading: isLoadingCheckIn,
    isError: isErrorCheckIn,
    error: errorCheckIn,
    refetch: refetchCheckIn,
  } = useGetCheckInQuery("checkInList");

  const {
    data: filterData,
    isFetching: isFetchingCheckIn,
    refetch: refetchCheckInFilter
  } =
    useFilterCheckInQuery({
      pageNo,
      pageSize,
      keywords: debounceInputSearch,
      dateFrom: dateFrom ? dayjs(dateFrom).format("YYYY-MM-DDTHH:mm:ss") : "",
      dateTo: dateTo ? dayjs(dateTo).format("YYYY-MM-DDTHH:mm:ss") : "",
    });


  useEffect(() => {
    if (isRefetchCheckIn || isRefetchCheckOut) {
      refetchCheckIn();
      refetchCheckInFilter();
    }
  }, [isRefetchCheckIn, isRefetchCheckOut]);

  const breadcrumbs = [
    <button
      className="hover:underline"
      onClick={() => navigate(`${isAdmin ? "/admin" : "/dash"}`)}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("vehicleEntry")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("list")}
    </Typography>,
  ];

  const columns = [
    { id: "image", label: t("image"), minWidth: 170, align: "left" },
    {
      id: "plateNumber",
      label: t("plateNumber"),
      minWidth: 120,
      align: "left",
    },
    {
      id: "timeIn",
      label: t("timeIn"),
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

  const handleSearchChange = (value) => {
    dispatch(setKeywordsCheckIn(value));
  }

  const handleChangePage = (event, newPage) => {
    dispatch(setPageNoCheckIn(newPage + 1));
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    dispatch(setPageSizeCheckIn(event.target.value));
    dispatch(setPageNoCheckIn(1));
  };

  let content;

  if (isLoadingCheckIn) content = <LoadingFetchingDataComponent />;

  if (isSuccessCheckIn) {
    const { ids, entities, totalElements, pageSize, pageNo } = checkInData;

    const {
      ids: idsFilterData,
      entities: searchEntities,
      totalElements: totalElementsSearch,
      pageSize: pageSizeFilter,
      pageNo: pageNoFilter,
    } = filterData || {};

    const displayTotalElements =  debounceInputSearch !== "" || dateFrom || dateTo ? totalElementsSearch : totalElements;

    const tableContent =
      debounceInputSearch !== "" || dateFrom || dateTo || pageSizeFilter || pageNoFilter ? (
        <>
          {idsFilterData?.length ? (
            idsFilterData?.map((id) => (
              <CheckInRowComponent
                key={id}
                parkingDetail={searchEntities[id]}
              />
            ))
          ) : (
            <TableRow >
              <TableCell align="center" colSpan={20}>
                <DataNotFound />
              </TableCell>
            </TableRow>
          )}
        </>
      ) : (
        <>
          {ids?.length ? (
            ids?.map((id) => (
              <CheckInRowComponent
                key={id}
                parkingDetail={entities[id]}
              />
            ))
          ) : (
            <TableRow >
              <TableCell align="center" colSpan={20}>
                <DataNotFound />
              </TableCell>
            </TableRow>
          )}
        </>
      );

    content = (
      <div data-aos="fade-left">
        <SeoComponent title="Vehicle Entry List" />
        <MainHeaderComponent breadcrumbs={breadcrumbs} title={t("list")} />

        <div>
          <Card sx={{ ...cardStyle }}>
            <div className="flex p-[20px] justify-between items-center gap-5 flex-col lg:flex-row">
              {/* Left side: Date pickers */}
              <div className="flex gap-5 flex-col w-full lg:w-[800px] lg:flex-row">
                <DatePicker
                  label={t("fromDate")}
                  value={dateFromValue}
                  onChange={(newValue) => {
                    // newValue is a dayjs object or null
                    dispatch(
                      setDateFromCheckIn(newValue ? newValue.toISOString() : "")
                    );
                  }}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
                <DatePicker
                  label={t("toDate")}
                  value={dateToValue}
                  onChange={(newValue) => {
                    dispatch(
                      setDateToCheckIn(newValue ? newValue.toISOString() : "")
                    );
                  }}
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              </div>

              <div className="flex items-center gap-3 w-full">
                <SearchComponent
                  onSearchChange={handleSearchChange}
                  value={searchKeywords}
                />
                <TableActionMenuComponent />
              </div>
            </div>

            <FilterChipsComponent
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateChange={(dateFrom, dateTo) => {
                  dispatch(setDateFromCheckIn(dateFrom));
                  dispatch(setDateToCheckIn(dateTo));
                }}
                searchQuery={searchKeywords}
                clearSearch={() => dispatch(setKeywordsCheckIn(""))}
                isFiltered={searchKeywords !== "" || (dateFrom && dateTo)}
                clearFilter={() => {
                  dispatch(setDateFromCheckIn(""));
                  dispatch(setDateToCheckIn(""));
                  dispatch(setKeywordsCheckIn(""));
                }}
                resultFound={displayTotalElements}
            />
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: "#F4F6F8" }}>
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
                        style={{
                          minWidth: column.minWidth,
                          color: "gray",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ border: "none" }}>
                  {isFetchingCheckIn && idsFilterData?.length === 0 ? (
                    Array.from({ length: pageSize }).map((_, index) => (
                      <SkeletonTableRowComponent key={index} cellCount={4} />
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
      </div>
    );
  }

  return content;
}

export default CheckInList;

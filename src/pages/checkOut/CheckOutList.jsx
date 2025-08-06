import SeoComponent from "../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
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
import { useNavigate } from "react-router-dom";
import { cardStyle } from "../../assets/style";
import {
  useFilterCheckOutQuery,
  useGetCheckOutQuery,
} from "../../redux/feature/checkOut/checkOutApiSlice";
import {useDispatch, useSelector} from "react-redux";
import { useDebounce } from "use-debounce";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import SkeletonTableRowComponent from "../../components/SkeletonTableRowComponent";
import CheckOutRowComponent from "../../components/CheckOutRowComponent.jsx";
import DataNotFound from "../../components/DataNotFound.jsx";
import {DatePicker} from "@mui/x-date-pickers";
import SearchComponent from "../../components/SearchComponent.jsx";
import TableActionMenuComponent from "../../components/TableActionMenuComponent.jsx";
import dayjs from "dayjs";
import {
  setDateFromCheckOut, setDateToCheckOut, setIsRefetchCheckOut,
  setKeywordsCheckOut,
  setPageNoCheckOut,
  setPageSizeCheckOut
} from "../../redux/feature/checkOut/checkOutSlice.js";
import {useEffect} from "react";
import FilterChipsComponent from "../../components/FilterChipsComponent.jsx";

function CheckOutList() {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const pageNo = useSelector((state) => state.checkOut.pageNoCheckOut);
  const pageSize = useSelector((state) => state.checkOut.pageSizeCheckOut);
  const dateFrom = useSelector((state) => state.checkOut.dateFrom);
  const dateTo = useSelector((state) => state.checkOut.dateTo);
  const searchKeywords = useSelector((state) => state.checkOut.keywords);
  const [debounceInputSearch] = useDebounce(searchKeywords, 1000);
  const dispatch = useDispatch();
  const dateFromValue = dateFrom ? dayjs(dateFrom) : null;
  const dateToValue = dateTo ? dayjs(dateTo) : null;
  const isRefetchCheckOut = useSelector((state) => state.checkOut.isRefetchCheckOut);

  const {
    data: checkOutData,
    isSuccess: isSuccessCheckOut,
    isLoading: isLoadingCheckOut,
    isError: isErrorCheckOut,
    error: errorCheckOut,
    refetch: refetchCheckOut,
  } = useGetCheckOutQuery("checkOutList");

  const {
    data: filterData,
    isFetching: isFetchingCheckOut,
    refetch: refetchCheckOutFilter,
  } =
    useFilterCheckOutQuery({
      pageNo,
      pageSize,
      keywords: debounceInputSearch,
      dateFrom: dateFrom ? dayjs(dateFrom).format("YYYY-MM-DDTHH:mm:ss") : "",
      dateTo: dateTo ? dayjs(dateTo).format("YYYY-MM-DDTHH:mm:ss") : "",
    });

  useEffect(() => {
    if (isRefetchCheckOut) {
      refetchCheckOut();
      refetchCheckOutFilter();
    }
  }, [isRefetchCheckOut, dispatch, refetchCheckOut, refetchCheckOutFilter])

  const columns = [
    { id: "image", label: t("image"), minWidth: 170, align: "left" },
    {
      id: "plateNumber",
      label: t("plateNumber"),
      minWidth: 120,
      align: "left",
    },
    {
      id: "timeOut",
      label: t("timeOut"),
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
      {t("vehicleEntry")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("list")}
    </Typography>,
  ];

  const handleSearchChange = (value) => {
    dispatch(setKeywordsCheckOut(value));
  }

  const handleChangePage = (event, newPage) => {
    dispatch(setPageNoCheckOut(newPage + 1));
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    dispatch(setPageSizeCheckOut(event.target.value));
    dispatch(setPageNoCheckOut(1));
  };

  let content;

  if (isLoadingCheckOut) content = <LoadingFetchingDataComponent />;

  if (isSuccessCheckOut) {
    const { ids, entities, totalElements, pageSize, pageNo } = checkOutData;

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
                      <CheckOutRowComponent
                          key={id}
                          parkingDetail={searchEntities[id]}
                      />
                  ))
              ) : (
                  <TableRow sx={{ bgcolor: "#f9fafb" }}>
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
                      <CheckOutRowComponent
                          key={id}
                          parkingDetail={entities[id]}
                      />
                  ))
              ) : (
                  <TableRow sx={{ bgcolor: "#f9fafb" }}>
                    <TableCell align="center" colSpan={20}>
                      <DataNotFound />
                    </TableCell>
                  </TableRow>
              )}
            </>
        );

    content = (
      <div data-aos="fade-left">
        <SeoComponent title="Vehicle Exit List" />
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
                          setDateFromCheckOut(newValue ? newValue.toISOString() : "")
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
                          setDateToCheckOut(newValue ? newValue.toISOString() : "")
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
              searchQuery={searchKeywords}
              clearSearch={() => dispatch(setKeywordsCheckOut(""))}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateChange={(dateFrom, dateTo) => {
                dispatch(setDateFromCheckOut(dateFrom));
                dispatch(setDateToCheckOut(dateTo));
              }}
              isFiltered={searchKeywords !== "" || (dateFrom && dateTo)}
              clearFilter={() => {
                dispatch(setDateFromCheckOut(""));
                dispatch(setDateToCheckOut(""));
                dispatch(setKeywordsCheckOut(""));
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
                  {isFetchingCheckOut && idsFilterData?.length === 0 ? (
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

export default CheckOutList;

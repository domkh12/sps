import React from "react";
import SeoComponent from "../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import useTranslate from "../../hook/useTranslate";
import { cardStyle } from "../../assets/style";
import { useGetAllParkingDetailQuery } from "../../redux/feature/parking/parkingDetailApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import HistoryRowComponent from "../../components/HistoryRowComponent";

function HistoryList() {
  const navigate = useNavigate();
  const { t } = useTranslate();

  const {
    data: parkingDetailData,
    isSuccess: isSuccessGetParkingDetail,
    isLoading: isLoadingGetParkingDetail,
    isError: isErrorGetParkingDetail,
    error: errorGetParkingDetail,
  } = useGetAllParkingDetailQuery("parkingDetailList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const columns = [
    { id: "model", label: t("vehicleModel"), minWidth: 170, align: "left" },
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
      {t("history")}
    </Typography>,
  ];

  let content;
  if (isLoadingGetParkingDetail) content = <LoadingFetchingDataComponent />;

  if (isSuccessGetParkingDetail) {
    const { ids } = parkingDetailData;
    console.log("ids", ids);

    const tableContent = ids.length
      ? ids.map((historyId) => (
          <HistoryRowComponent key={historyId} historyId={historyId} />
        ))
      : null;

    content = (
      <div data-aos="fade-left">
        <SeoComponent title="History List" />
        <MainHeaderComponent breadcrumbs={breadcrumbs} title={t("list")} />

        <Card sx={{ ...cardStyle }}>
          {/* <FilterBarComponent
          showTabs={false}
          branchFetched={branchFetched}
          branchFilter={branchFilter}
          searchQuery={searchKeywords}
          handleBranchChange={handleBranchChange}
          handleSearchChange={handleSearchChange}
        /> */}

          {/* <FilterChipsComponent
          branchFilter={branchFilter}
          branchFetched={branchFetched}
          searchQuery={searchKeywords}
          handleSearchChange={handleSearchChange}
          handleBranchChange={handleBranchChange}
          clearFilter={() => dispatch(setClearParkingFilter())}
          clearSearch={() => dispatch(setSearchParkingSpace(""))}
          isFiltered={searchKeywords !== "" || branchFilter.length > 0}
          resultFound={resultFound}
        /> */}
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
                      style={{ minWidth: column.minWidth, color: "gray" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ border: "none" }}>{tableContent}</TableBody>
            </Table>
          </TableContainer>
          {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={displayTotalElements || 0}
          rowsPerPage={pageSize || pageSizeSearch}
          page={pageNoSearch || pageNo}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
        </Card>
      </div>
    );
  }

  return content;
}

export default HistoryList;

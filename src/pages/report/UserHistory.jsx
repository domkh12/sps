import { useNavigate } from "react-router-dom";
import useTranslate from "../../hook/useTranslate";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {useFilterReportUsersQuery, useGetUsersQuery} from "../../redux/feature/users/userApiSlice.js";
import dayjs from "dayjs";
import {
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead, TablePagination,
  TableRow,
  Typography
} from "@mui/material";
import {setPageNoReportUser, setPageSizeReportUser} from "../../redux/feature/users/userSlice.js";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import UserRowReportComponent from "../../components/UserRowReportComponent.jsx";
import DataNotFound from "../../components/DataNotFound.jsx";
import SeoComponent from "../../components/SeoComponent.jsx";
import MainHeaderComponent from "../../components/MainHeaderComponent.jsx";
import DateFilterComponent from "../../components/DateFilterComponent.jsx";
import SkeletonTableRowComponent from "../../components/SkeletonTableRowComponent.jsx";

function UserHistory() {
  const navigate = useNavigate();
  const {t} = useTranslate();
  const dispatch = useDispatch();
  const pageNo = useSelector((state) => state.users.pageNo);
  const pageSize = useSelector((state) => state.users.pageSize);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const {
    data: users,
    isLoading: isLoadingGetUsers,
    isSuccess : isSuccessGetUsers,
    isError: isErrorGetUsers,
    error,
  } = useGetUsersQuery(
    { pageNo, pageSize },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: userFilterData,
    isFetching: isFetchingGetParkingSpaceFilter,
  } = useFilterReportUsersQuery(
    {
      pageNo, pageSize,
      dateFrom: dayjs(fromDate).format("YYYY-MM-DDTHH:mm:ss"),
      dateTo: dayjs(toDate).format("YYYY-MM-DDTHH:mm:ss"),
    },
    {
      skip: !fromDate || !toDate,
    }
  );

  const breadcrumbs = [
    <button
      className="hover:underline"
      onClick={() => navigate("/admin")}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("report")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("userHistory")}
    </Typography>,
  ];

  const columns = [
    {
      id: "fullName",
      label: t("fullName"),
      minWidth: 120,
      align: "left",
    },
    { id: "gender", label: t('gender'), minWidth: 170, align: "left" },   
    { id: "dateOfBirth", label: t('dateOfBirth'), minWidth: 170, align: "left" },   
    { id: "phoneNumber", label: t('phoneNumber'), minWidth: 170, align: "left" },   
    { id: "email", label: t('email'), minWidth: 170, align: "left" },  
    { id: "signUpMethod", label: t('signUpMethod'), minWidth: 170, align: "left" }, 
    {
      id: "status",
      label: t("status"),
      minWidth: 120,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "branch",
      label: t('branch'),
      minWidth: 120,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "createdAt",
      label: t("createdAt"),
      minWidth: 120,
      align: "left",
      format: (value) => value.toFixed(2),
    }
  ];

  const handleChangePage = (event, newPage) => {
    dispatch(setPageNoReportUser(newPage + 1));
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    dispatch(setPageSizeReportUser(event.target.value));
    dispatch(setPageNoReportUser(1));
  };

  let content;

  if (isLoadingGetUsers) content = <LoadingFetchingDataComponent />;

  if (isErrorGetUsers) {
    content = <p>Error: {error?.message}</p>;
  }

  if (isSuccessGetUsers) {
    const { ids, entities, totalElements, pageSize, pageNo } = users;

    const {
      entities: searchEntities,
      ids: idsFilteredUsers,
      totalElements: totalElementsSearch,
      pageSize: pageSizeFilter,
      pageNo: pageNoFilter,
    } = userFilterData || {};

    const displayTotalElements =
      fromDate && toDate
        ? totalElementsSearch
        : totalElements;

    const tableContent =
      fromDate && toDate ? (
        <>
          {idsFilteredUsers?.length ? (
            idsFilteredUsers.map((userId) => (
              <UserRowReportComponent
                key={userId}
                userId={userId}
                user={searchEntities[userId]}
              />
            ))
          ) : (
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell align="center" colSpan={12}>
                <DataNotFound />
              </TableCell>
            </TableRow>
          )}
        </>
      ) : (
        <>
          {ids.length ? (
            ids.map((userId) => (
              <UserRowReportComponent
                key={userId}
                userId={userId}
                user={entities[userId]}
              />
            ))
          ) : (
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell align="center" colSpan={12}>
                <DataNotFound />
              </TableCell>
            </TableRow>
          )}
        </>
      );

      content = (
      <div data-aos="fade-left">
        <SeoComponent title="Report User History" />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("userHistory")}
        />

        <Card>
          <DateFilterComponent setFromDate={setFromDate} setToDate={setToDate} fromDate={fromDate == "" ? null : fromDate} toDate={toDate == "" ? null : toDate}/>

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
                <TableBody sx={{ border: "none" }}>
                  {isFetchingGetParkingSpaceFilter && idsFilteredUsers?.length === 0 ? (Array.from({length: pageSize}).map((_, index) => (
                      <SkeletonTableRowComponent key={index} cellCount={4}/>
                  ))) : (<>{tableContent}</>)}
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
      )
  }

  return content;
}

export default UserHistory;

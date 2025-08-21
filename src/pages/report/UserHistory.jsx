import { useNavigate } from "react-router-dom";
import useTranslate from "../../hook/useTranslate";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  useGetAllReportUserQuery, useGetReportUserExcelMutation,
  useGetReportUserPdfMutation,
} from "../../redux/feature/users/userApiSlice.js";
import dayjs from "dayjs";
import {
  Card,
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
import PdfModalPreviewComponent from "../../components/PdfModalPreviewComponent.jsx";
import {setIsOpenPdfModal} from "../../redux/feature/actions/actionSlice.js";

function UserHistory() {
  const navigate = useNavigate();
  const {t} = useTranslate();
  const dispatch = useDispatch();
  const pageNo = useSelector((state) => state.users.pageNo);
  const pageSize = useSelector((state) => state.users.pageSize);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const {
    data: users,
    isLoading: isLoadingGetUsers,
    isSuccess : isSuccessGetUsers,
    isError: isErrorGetUsers,
    error,
  } = useGetAllReportUserQuery(
    { pageNo, pageSize }
  );

  const [getReportUserPdf,{
      isSuccess: isSuccessGetReportUserPdf,
      isLoading: isLoadingGetReportUserPdf,
    }] = useGetReportUserPdfMutation();


  const [getReportUserExcel,
    {
      isSuccess: isSuccessGetReportUserExcel,
      isLoading: isLoadingGetReportUserExcel,
    }
  ] = useGetReportUserExcelMutation();

  const {
    data: userFilterData,
    isFetching: isFetchingGetParkingSpaceFilter,
  } = useGetAllReportUserQuery(
    {
      pageNo, pageSize,
      dateFrom: dayjs(fromDate).format("YYYY-MM-DDTHH:mm:ss"),
      dateTo: dayjs(toDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss"),
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
    { id: "email", label: t('email'), minWidth: 170, align: "left" },
    { id: "phoneNumber", label: t('phoneNumber'), minWidth: 170, align: "left" },
  ];

  const handleChangePage = (event, newPage) => {
    dispatch(setPageNoReportUser(newPage + 1));
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    dispatch(setPageSizeReportUser(event.target.value));
    dispatch(setPageNoReportUser(1));
  };

  const handleBtnPdfClick = async () => {
    dispatch(setIsOpenPdfModal(true));
    const blob = await getReportUserPdf({
      dateFrom: fromDate !== "" ? dayjs(fromDate).format("YYYY-MM-DDTHH:mm:ss") : "",
      dateTo: toDate !== "" ? dayjs(toDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss") : "",
    }).unwrap();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  }

  const handleBtnExcelClick = async () => {
    const blob = await getReportUserExcel({
      dateFrom: fromDate !== "" ? dayjs(fromDate).format("YYYY-MM-DDTHH:mm:ss") : "",
      dateTo: toDate !== "" ? dayjs(toDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss") : "",
    }).unwrap();
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

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
            <TableRow >
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
            <TableRow >
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
          <DateFilterComponent
              setFromDate={setFromDate}
              setToDate={setToDate}
              fromDate={fromDate == "" ? null : fromDate}
              toDate={toDate == "" ? null : toDate}
              onClickPdf={handleBtnPdfClick}
              onClickExcel={handleBtnExcelClick}
              isLoadingExcel={isLoadingGetReportUserExcel}
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
        <PdfModalPreviewComponent pdfUrl={pdfUrl} isLoading={isLoadingGetReportUserPdf} isSuccess={isSuccessGetReportUserPdf}/>
      </div>
      )
  }

  return content;
}

export default UserHistory;

import { useState } from 'react'
import SeoComponent from '../../components/SeoComponent'
import MainHeaderComponent from '../../components/MainHeaderComponent'
import { Card, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import useTranslate from '../../hook/useTranslate';
import { useNavigate } from 'react-router-dom';
import DateFilterComponent from '../../components/DateFilterComponent';
import {
  useFilterReportVehiclesQuery, useGetReportVehicleExcelMutation, useGetReportVehiclePdfMutation,
  useGetVehiclesQuery
} from '../../redux/feature/vehicles/vehicleApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import LoadingFetchingDataComponent from '../../components/LoadingFetchingDataComponent';
import SkeletonTableRowComponent from '../../components/SkeletonTableRowComponent';
import VehicleRowReportComponent from '../../components/VehicleRowReportComponent';
import { setPageNo, setPageSize } from '../../redux/feature/vehicles/vehicleSlice';
import DataNotFound from '../../components/DataNotFound';
import dayjs from 'dayjs';
import PdfModalPreviewComponent from "../../components/PdfModalPreviewComponent.jsx";
import {setIsOpenPdfModal} from "../../redux/feature/actions/actionSlice.js";

function VehicleHistory() {
  const navigate = useNavigate();
  const {t} = useTranslate();
  const dispatch = useDispatch();
  const pageNo = useSelector((state) => state.vehicles.pageNo);
  const pageSize = useSelector((state) => state.vehicles.pageSize);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");

  const [getReportVehicleExcel,
    {
      isSuccess: isSuccessGetReportVehicleExcel,
      isLoading: isLoadingGetReportVehicleExcel,
      isError: isErrorGetReportVehicleExcel,
      error: errorGetReportVehicleExcel,
    }
  ] = useGetReportVehicleExcelMutation();

  const [getReportVehiclePdf,
    {
      isSuccess: isSuccessGetReportVehiclePdf,
      isLoading: isLoadingGetReportVehiclePdf,
      isError: isErrorGetReportVehiclePdf,
      error: errorGetReportVehiclePdf,
    }
  ] = useGetReportVehiclePdfMutation();

  const handleBtnPdfClick = async () => {
    dispatch(setIsOpenPdfModal(true));
    const blob = await getReportVehiclePdf().unwrap();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  }

  const handleBtnExcelClick = async () => {
    const blob = await getReportVehicleExcel().unwrap();
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  const {
    data: vehicles,
    isLoading: isLoadingGetVehicles,
    isSuccess : isSuccessGetVehicles,
    isError: isErrorGetVehicles,
    error,
  } = useGetVehiclesQuery(
    { pageNo, pageSize },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: vehicleFilterData,
    isFetching: isFetchingGetParkingSpaceFilter,
  } = useFilterReportVehiclesQuery(
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
      {t("vehicleHistory")}
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
    { id: "model", label: t('model'), minWidth: 170, align: "left" },  
    { id: "make", label: t('make'), minWidth: 170, align: "left" }, 
    {
      id: "type",
      label: t("vehicleType"),
      minWidth: 120,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "color",
      label: t('color'),
      minWidth: 120,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    }
  ];

  const handleChangePage = (event, newPage) => {
    dispatch(setPageNo(newPage + 1));
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    dispatch(setPageSize(event.target.value));
    dispatch(setPageNo(1));
  };

  let content;

  if (isLoadingGetVehicles) content = <LoadingFetchingDataComponent />;

  if (isErrorGetVehicles) {
    content = <p>Error: {error?.message}</p>;
  }

  if (isSuccessGetVehicles) {
    const { ids, entities, totalElements, pageSize, pageNo } = vehicles;

    const {
      entities: searchEntities,
      ids: idsFilteredVehicles,
      totalElements: totalElementsSearch,
      pageSize: pageSizeFilter,
      pageNo: pageNoFilter,
    } = vehicleFilterData || {};

    const displayTotalElements =
      fromDate && toDate
        ? totalElementsSearch
        : totalElements;

    const tableContent =
      fromDate && toDate ? (
        <>
          {idsFilteredVehicles?.length ? (
            idsFilteredVehicles.map((vehicleId) => (
              <VehicleRowReportComponent
                key={vehicleId}
                vehicleId={vehicleId}
                vehicle={searchEntities[vehicleId]}
              />
            ))
          ) : (
            <TableRow >
              <TableCell align="center" colSpan={8}>
                <DataNotFound />
              </TableCell>
            </TableRow>
          )}
        </>
      ) : (
        <>
          {ids.length ? (
            ids.map((vehicleId) => (
              <VehicleRowReportComponent
                key={vehicleId}
                vehicleId={vehicleId}
                vehicle={entities[vehicleId]}
              />
            ))
          ) : (
            <TableRow >
              <TableCell align="center" colSpan={8}>
                <DataNotFound />
              </TableCell>
            </TableRow>
          )}
        </>
      );

      content = (
      <div data-aos="fade-left">
        <SeoComponent title="Report Vehicle History" />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("vehicleHistory")}
        />

        <Card>
          <DateFilterComponent
              setFromDate={setFromDate}
              setToDate={setToDate}
              fromDate={fromDate == "" ? null : fromDate}
              toDate={toDate == "" ? null : toDate}
              onClickPdf={handleBtnPdfClick}
              onClickExcel={handleBtnExcelClick}
              isLoadingExcel={isLoadingGetReportVehicleExcel}
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
                        style={{ minWidth: column.minWidth, color: "gray" }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ border: "none" }}>
                  {isFetchingGetParkingSpaceFilter && idsFilteredVehicles?.length === 0 ? (Array.from({length: pageSize}).map((_, index) => (
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
        <PdfModalPreviewComponent pdfUrl={pdfUrl} isLoading={isLoadingGetReportVehiclePdf} isSuccess={isSuccessGetReportVehiclePdf}/>
      </div>
      )
  }

  return content;
}

export default VehicleHistory
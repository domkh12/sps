import {
  useFilterVehiclesQuery,
  useGetAllVehicleTypesQuery,
  useGetVehiclesQuery,
} from "../../redux/feature/vehicles/vehicleApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setBranchFilter,
  setVehicleTypeFilter,
  setSearchKeywords,
  setPageSize,
  setPageNo,
} from "../../redux/feature/vehicles/vehicleSlice";
import SeoComponent from "../../components/SeoComponent";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import {
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { cardStyle } from "../../assets/style";
import useTranslate from "../../hook/useTranslate";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import VehicleRowComponent from "../../components/VehicleRowComponent";
import QuickEditVehicleComponent from "../../components/QuickEditVehicleComponent";
import {useGetBranchListQuery, useGetListBranchQuery} from "../../redux/feature/site/siteApiSlice";
import DataNotFound from "../../components/DataNotFound";
import FilterChipsComponent from "../../components/FilterChipsComponent";
import FilterBarComponent from "../../components/FilterBarComponent";
import SkeletonTableRowComponent from "../../components/SkeletonTableRowComponent.jsx";
import {useDebounce} from "use-debounce";
import useAuth from "../../hook/useAuth.jsx";

function VehicleList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isManager, isAdmin} = useAuth();
  const { t } = useTranslate();
  const pageNo = useSelector((state) => state.vehicles.pageNo);
  const pageSize = useSelector((state) => state.vehicles.pageSize);
  const branchFilter = useSelector((state) => state.vehicles.branchFilter);
  const vehicleTypeFilter = useSelector((state) => state.vehicles.vehicleTypeFilter);
  const searchKeywords = useSelector((state) => state.vehicles.searchKeywords);
  const [debounceInputSearch] = useDebounce(searchKeywords, 1000);

  const {data:vehicleTypeFetched, isSuccess: isSuccessGetAllVehicleType, isLoading: isLoadingGetAllVehicleType,} = useGetAllVehicleTypesQuery("vehicleTypeList");
  const {data: branchFetched, isSuccess: isSuccessGetBranchData, isLoading: isLoadingGetBranchData} = useGetListBranchQuery("branchNameList");

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
  } = useFilterVehiclesQuery(
    {
      pageNo, pageSize,
      keywords: debounceInputSearch,
      vehicleTypeId: vehicleTypeFilter,
      branchId: branchFilter,
    },
  );

  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navigate(`${isAdmin ? "/admin" : "/dash"}`)}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("vehicle")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("list")}
    </Typography>,
  ];

  const columns = [
    { id: "model", label: t('model'), minWidth: 170, align: "left" },
    {
      id: "licensePlateNumber",
      label: t("licensePlate"),
      minWidth: 120,
      align: "left",
    },
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
    },
    {
      id: "createdAt",
      label: t("createdAt"),
      minWidth: 120,
      align: "left",
      format: (value) => value.toFixed(2),
    },
    {
      id: "action",
      label: "",
      minWidth: 30,
      align: "left",
      format: (value) => value.toFixed(2),
    },
  ];

  const handleBranchChange = (branch) => {
    dispatch(setBranchFilter(branch));
  };

  const handleVehicleTypeChange = (vehicleType) => {
    dispatch(setVehicleTypeFilter(vehicleType));
  };

  const handleSearchChange = (keyword) => {
    dispatch(setSearchKeywords(keyword));
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setPageNo(newPage + 1));
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    dispatch(setPageSize(event.target.value));
    dispatch(setPageNo(1));
  };

  let content;

  if (isLoadingGetAllVehicleType || isLoadingGetBranchData || isLoadingGetVehicles) content = <LoadingFetchingDataComponent />;

  if (isErrorGetVehicles) {
    content = <p>Error: {error?.message}</p>;
  }

  if (isSuccessGetVehicles && isSuccessGetAllVehicleType && isSuccessGetBranchData) {
    const { ids, entities, totalElements, pageSize, pageNo } = vehicles;

    const {
      entities: searchEntities,
      ids: idsFilteredVehicles,
      totalElements: totalElementsSearch,
      pageSize: pageSizeFilter,
      pageNo: pageNoFilter,
    } = vehicleFilterData || {};

    const displayTotalElements =
      debounceInputSearch !== "" ||
      vehicleTypeFilter.length > 0 ||
      branchFilter.length > 0
        ? totalElementsSearch
        : totalElements;

    const tableContent =
      debounceInputSearch !== "" ||
      vehicleTypeFilter.length > 0 ||
      branchFilter.length > 0 ? (
        <>
          {idsFilteredVehicles?.length ? (
            idsFilteredVehicles.map((vehicleId) => (
              <VehicleRowComponent
                key={vehicleId}
                vehicleId={vehicleId}
                vehicle={searchEntities[vehicleId]}
              />
            ))
          ) : (
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
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
              <VehicleRowComponent
                key={vehicleId}
                vehicleId={vehicleId}
                vehicle={entities[vehicleId]}
              />
            ))
          ) : (
            <TableRow sx={{ bgcolor: "#f9fafb" }}>
              <TableCell align="center" colSpan={8}>
                <DataNotFound />
              </TableCell>
            </TableRow>
          )}
        </>
      );

    content = (
      <div data-aos="fade-left">
        <SeoComponent title={"Vehicles List"} />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t('list')}
          btnTitle={t("newVehicle")}
          onClick={() => navigate(`/${isAdmin ? "admin" : "dash"}/vehicles/new`)}
        />
        <div>
          <Card sx={{ ...cardStyle }}>
            <FilterBarComponent
              showTabs={false}
              searchQuery={searchKeywords}
              branchFilter={branchFilter}
              vehicleTypeFilter={vehicleTypeFilter}
              branchFetched={isAdmin ? branchFetched : undefined}
              vehicleTypeFetched={vehicleTypeFetched}
              handleVehicleTypeChange={handleVehicleTypeChange}
              handleBranchChange={handleBranchChange}
              handleSearchChange={handleSearchChange}
            />

            <FilterChipsComponent
              searchQuery={searchKeywords}
              branchFilter={branchFilter}
              branchFetched={branchFetched}
              vehicleTypeFilter={vehicleTypeFilter}
              vehicleTypeFetched={vehicleTypeFetched}
              handleVehicleTypeChange={handleVehicleTypeChange}
              handleSearchChange={handleSearchChange}
              handleBranchChange={handleBranchChange}
              clearFilter={() => {
                dispatch(setSearchKeywords(""));
                dispatch(setBranchFilter([]));
                dispatch(setVehicleTypeFilter([]));
              }}
              clearSearch={() => dispatch(setSearchKeywords(""))}
              resultFound={
                vehicleFilterData ? totalElementsSearch : totalElements
              }
              isFiltered={
                searchKeywords !== "" ||
                branchFilter?.length > 0 ||
                vehicleTypeFilter?.length > 0
              }
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
        </div>
        <QuickEditVehicleComponent />
      </div>
    );
  }

  return content;
}

export default VehicleList;

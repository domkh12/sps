import React, { useEffect, useRef, useState } from "react";
import {
  useFilterVehiclesQuery,
  useGetAllVehicleTypesMutation,
  useGetVehiclesQuery,
} from "../../redux/feature/vehicles/vehicleApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsFiltered,
  setIsLoadingBar,
  setIsPaginationSuccess,
} from "../../redux/feature/actions/actionSlice";
import {
  setTotalPages,
  setBranchFilter,
  setVehicleTypeFilter,
  setSearchKeywords,
  setClearVehicleFilter,
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
import { cardStyle, listStyle } from "../../assets/style";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { BsFillPrinterFill, BsThreeDotsVertical } from "react-icons/bs";
import useTranslate from "../../hook/useTranslate";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import VehicleRowComponent from "../../components/VehicleRowComponent";
import useAuth from "../../hook/useAuth";
import QuickEditVehicleComponent from "../../components/QuickEditVehicleComponent";
import { useGetSitesListMutation } from "../../redux/feature/site/siteApiSlice";
import DataNotFound from "../../components/DataNotFound";
import FilterChipsComponent from "../../components/FilterChipsComponent";
import FilterBarComponent from "../../components/FilterBarComponent";

function VehicleList() {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const pageNo = useSelector((state) => state.vehicles.pageNo);
  const pageSize = useSelector((state) => state.vehicles.pageSize);
  const totalPages = useSelector((state) => state.vehicles.totalPages);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const pageSizeRef = useRef(null);
  const { t } = useTranslate();
  const [isLoading, setIsLoading] = useState(true);
  const branchFetched = useSelector((state) => state.sites.sites);
  const branchFilter = useSelector((state) => state.vehicles.branchFilter);
  const vehicleTypeFetched = useSelector(
    (state) => state.vehicles.vehicleTypeFetched
  );
  const vehicleTypeFilter = useSelector(
    (state) => state.vehicles.vehicleTypeFilter
  );
  const searchKeywords = useSelector((state) => state.vehicles.searchKeywords);

  const {
    data: vehicles,
    isLoading: isLoadingGetVehicles,
    isSuccess,
    isError,
    refetch,
    isFetching,
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
    isLoading: isLoadingGetVehicleFilter,
    isSuccess: isSuccessGetVehicleFilter,
    isError: isErrorGetVehicleFilter,
    error: errorGetVehicleFilter,
  } = useFilterVehiclesQuery(
    {
      keywords: searchKeywords,
      vehiceTypeId: vehicleTypeFilter,
      branchId: branchFilter,
    },
    {
      skip:
        searchKeywords === "" &&
        vehicleTypeFilter.length === 0 &&
        branchFilter.length === 0,
    }
  );

  const [
    getSitesList,
    {
      isSuccess: isGetSitesListSuccess,
      isLoading: isGetSitesListLoading,
      isError: isGetSitesListError,
      error: errorGetSitesList,
    },
  ] = useGetSitesListMutation();

  const [
    getAllVehicleTypes,
    {
      isSuccess: isGetAllVehicleTypesSuccess,
      isLoading: isGetAllVehicleTypesLoading,
      isError: isGetAllVehicleTypesError,
      error: errorGetAllVehicleTypes,
    },
  ] = useGetAllVehicleTypesMutation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getSitesList(), getAllVehicleTypes()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isFetching) {
      dispatch(setIsLoadingBar(true));
    } else {
      dispatch(setIsLoadingBar(false));
    }
  }, [isFetching]);

  useEffect(() => {
    refetch();
    setIsPageSizeOpen(false);
    dispatch(setIsPaginationSuccess(true));
  }, [pageNo, pageSize, refetch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pageSizeRef.current && !pageSizeRef.current.contains(event.target)) {
        setIsPageSizeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setTotalPages(vehicles.totalPages));
    }
  }, [vehicles, totalPages, pageNo]);

  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navitage("/dash")}
      key={1}
    >
      Dashboard
    </button>,
    <Typography color="inherit" key={2}>
      Vehicle
    </Typography>,
    <Typography color="inherit" key={3}>
      List
    </Typography>,
  ];

  const columns = [
    { id: "model", label: "Model", minWidth: 170, align: "left" },
    {
      id: "licensePlateNumber",
      label: "License\u00a0Plate\u00a0Number",
      minWidth: 120,
      align: "left",
    },
    {
      id: "type",
      label: "Type",
      minWidth: 120,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "color",
      label: "Color",
      minWidth: 120,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "createdAt",
      label: "Created\u00a0At",
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

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (isError) {
    content = <p>Error: {error?.message}</p>;
  }

  if (!isLoading && isSuccess) {
    const { ids, entities, totalElements, pageSize, pageNo } = vehicles;

    const {
      entities: searchEntities,
      ids: idsFilteredVehicles,
      totalElements: totalElementsSearch,
      pageSize: pageSizeSearch,
      pageNo: pageNoSearch,
    } = vehicleFilterData || {};

    const displayTotalElements =
      searchKeywords !== "" ||
      vehicleTypeFilter.length > 0 ||
      branchFilter.length > 0
        ? totalElementsSearch
        : totalElements;

    const tableContent =
      searchKeywords !== "" ||
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
          title={"List"}
          btnTitle={t("newVehicle")}
          onClick={() => navigator("/dash/vehicles/new")}
        />
        <div>
          <Card sx={{ ...cardStyle }}>
            <FilterBarComponent
              showTabs={false}
              searchQuery={searchKeywords}
              branchFilter={branchFilter}
              vehicleTypeFilter={vehicleTypeFilter}
              branchFetched={branchFetched}
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
              vehicleTypeFetched={vehicleTypeFetched.data}
              handleVehicleTypeChange={handleVehicleTypeChange}
              handleSearchChange={handleSearchChange}
              handleBranchChange={handleBranchChange}
              clearFilter={() => dispatch(setClearVehicleFilter())}
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
                <TableBody sx={{ border: "none" }}>{tableContent}</TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={displayTotalElements || 0}
              rowsPerPage={pageSize || pageSizeSearch}
              page={pageNoSearch || pageNo}
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

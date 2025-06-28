import React, { useEffect, useState } from "react";
import {
  useFilterParkingSpacesQuery,
  useGetParkingSpacesQuery,
} from "../../redux/feature/parking/parkingApiSlice";
import LoadingFetchingDataComponent from "./../../components/LoadingFetchingDataComponent";
import SeoComponent from "../../components/SeoComponent";
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
import MainHeaderComponent from "../../components/MainHeaderComponent";
import useTranslate from "../../hook/useTranslate";
import { useNavigate } from "react-router-dom";
import { cardStyle } from "../../assets/style";
import FilterBarComponent from "../../components/FilterBarComponent";
import ParkingSpaceRowComponent from "../../components/ParkingSpaceRowComponent";
import useAuth from "./../../hook/useAuth";
import QuickEditParkingSpaceComponent from "../../components/QuickEditParkingSpaceComponent";
import { useDispatch, useSelector } from "react-redux";
import { useGetSitesListMutation } from "../../redux/feature/site/siteApiSlice";
import { setBranchFilter } from "../../redux/feature/users/userSlice";
import {
  setBranchFilterParking,
  setClearParkingFilter,
  setPageNoParking,
  setPageSizeParking,
  setSearchParkingSpace,
} from "../../redux/feature/parking/parkingSlice";
import DataNotFound from "../../components/DataNotFound";
import FilterChipsComponent from "../../components/FilterChipsComponent";

function ParkingList() {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { isManager } = useAuth();
  const isOpenQuickEditParkingSpace = useSelector(
    (state) => state.parking.isOpenQuickEditParkingSpace
  );
  const branchFetched = useSelector((state) => state.sites.sites);
  const [isLoading, setIsLoading] = useState(true);
  const branchFilter = useSelector((state) => state.parking.branchFilter);
  const searchKeywords = useSelector(
    (state) => state.parking.searchParkingSpace
  );
  const dispatch = useDispatch();
  const pageNo = useSelector((state) => state.parking.pageNo);
  const pageSize = useSelector((state) => state.parking.pageSize);

  const {
    data: getParkingSpacesData,
    isSuccess: isSuccessGetParkingSpaces,
    isLoading: isLoadingGetParkingSpaces,
    isError: isErrorGetParkingSpaces,
    error: errorGetParkingSpaces,
  } = useGetParkingSpacesQuery(
    {
      pageNo,
      pageSize,
    },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: filterParkingSpacesData,
    isSuccess: isSuccessFilterParkingSpaces,
    isLoading: isLoadingFilterParkingSpaces,
    isError: isErrorFilterParkingSpaces,
    error: errorFilterParkingSpaces,
  } = useFilterParkingSpacesQuery(
    {
      pageNo,
      pageSize,
      keywords: searchKeywords,
      branchUuid: branchFilter,
    },
    {
      skip: branchFilter.length === 0 && searchKeywords === "",
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([getSitesList()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navigate("/dash")}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("parkingSpace")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("list")}
    </Typography>,
  ];

  const columns = [
    { id: "parkingSpaceName", label: t('parkingSpaceName'), minWidth: 170, align: "left" },
    {
      id: "branch",
      label: t("branch"),
      minWidth: 120,
      align: "left",
    },
    {
      id: "quantity",
      label: t('lotQty'),
      minWidth: 120,
      align: "left",
    },
    {
      id: "occupied",
      label: t('occupied'),
      minWidth: 120,
      align: "left",
    },
    {
      id: "created_at",
      label: t('createdAt'),
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

  const handleBranchChange = (branch) => {
    dispatch(setBranchFilterParking(branch));
  };

  const handleSearchChange = (keywords) => {
    dispatch(setSearchParkingSpace(keywords));
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setPageNoParking(newPage + 1));
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    dispatch(setPageSizeParking(event.target.value));
    dispatch(setPageNoParking(1));
  };

  let content;

  if (isLoadingGetParkingSpaces) {
    content = <LoadingFetchingDataComponent />;
  }

  if (isErrorGetParkingSpaces) {
    content = <p>Error: {errorGetParkingSpaces?.message}</p>;
  }

  if (isSuccessGetParkingSpaces) {
    const { ids, entities, totalElements, pageSize, pageNo } =
      getParkingSpacesData;

    const {
      ids: idsFilter,
      entities: searchEntities,
      totalElements: totalElementsSearch,
      pageSize: pageSizeSearch,
      pageNo: pageNoSearch,
    } = filterParkingSpacesData || {};

    const resultFound = filterParkingSpacesData
      ? totalElementsSearch
      : totalElements;

    const displayTotalElements =
      searchKeywords !== "" || branchFilter.length > 0
        ? totalElementsSearch
        : totalElements;

    const tableContent =
      searchKeywords !== "" || branchFilter.length > 0 ? (
        <>
          {idsFilter?.length ? (
            idsFilter.map((parkingId) => (
              <ParkingSpaceRowComponent
                parkingId={parkingId}
                key={parkingId}
                parkingSpace={searchEntities[parkingId]}
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
            ids.map((parkingId) => (
              <ParkingSpaceRowComponent
                parkingId={parkingId}
                key={parkingId}
                parkingSpace={entities[parkingId]}
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
        <SeoComponent title="Parking List" />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("list")}
          {...(isManager && { btnTitle: t("newParkingSpace") })}
          {...(isManager && { onClick: () => navigate("new") })}
        />

        <Card sx={{ ...cardStyle }}>
          <FilterBarComponent
            showTabs={false}
            branchFetched={branchFetched}
            branchFilter={branchFilter}
            searchQuery={searchKeywords}
            handleBranchChange={handleBranchChange}
            handleSearchChange={handleSearchChange}
          />

          <FilterChipsComponent
            branchFilter={branchFilter}
            branchFetched={branchFetched}
            searchQuery={searchKeywords}
            handleSearchChange={handleSearchChange}
            handleBranchChange={handleBranchChange}
            clearFilter={() => dispatch(setClearParkingFilter())}
            clearSearch={() => dispatch(setSearchParkingSpace(""))}
            isFiltered={searchKeywords !== "" || branchFilter.length > 0}
            resultFound={resultFound}
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
        {isOpenQuickEditParkingSpace && <QuickEditParkingSpaceComponent />}
      </div>
    );
  }
  return content;
}

export default ParkingList;

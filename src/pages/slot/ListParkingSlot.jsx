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
import useAuth from "./../../hook/useAuth";
import QuickEditParkingSpaceComponent from "../../components/QuickEditParkingSpaceComponent";
import { useDispatch, useSelector } from "react-redux";
import {useGetBranchListQuery, useGetListBranchQuery} from "../../redux/feature/site/siteApiSlice";
import {
  setPageNoParking,
  setPageSizeParking,
} from "../../redux/feature/parking/parkingSlice";
import DataNotFound from "../../components/DataNotFound";
import FilterChipsComponent from "../../components/FilterChipsComponent";
import {useFilterSlotsQuery, useGetSlotsQuery} from "../../redux/feature/slot/slotApiSlice.js";
import ParkingSlotRowComponent from "../../components/ParkingSlotRowComponent.jsx";
import SkeletonTableRowComponent from "../../components/SkeletonTableRowComponent.jsx";
import {useDebounce} from "use-debounce";
import {setBranchFilterForSlot, setSearchParkingSlot} from "../../redux/feature/slot/slotSlice.js";
import QuickEditParkingSlotComponent from "../../components/QuickEditParkingSlotComponent.jsx";

function ListParkingSlot() {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const { isAdmin } = useAuth();
  const {data: branchData, isSuccess: isSuccessGetBranchData, isLoading: isLoadingGetBranchData} = useGetListBranchQuery("branchNameList");
  const branchFilter = useSelector((state) => state.slot.branchFilter);
  const searchKeywords = useSelector((state) => state.slot.searchParkingSlot);
  const dispatch = useDispatch();
  const pageNo = useSelector((state) => state.parking.pageNo);
  const pageSize = useSelector((state) => state.parking.pageSize);
  const [debounceInputSearch] = useDebounce(searchKeywords, 1000);

  const {
    data: getParkingSpacesData,
    isSuccess: isSuccessGetParkingSpaces,
    isLoading: isLoadingGetParkingSpaces,
    isError: isErrorGetParkingSpaces,
    error: errorGetParkingSpaces,
  } = useGetSlotsQuery(
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
    isFetching: isFetchingGetParkingSpaceFilter
  } = useFilterSlotsQuery(
    {
      pageNo,
      pageSize,
      keywords: debounceInputSearch,
      branchUuid: branchFilter,
    }
  );

  const breadcrumbs = [
    <button
      className="hover:underline"
      onClick={() => navigate(`/${isAdmin ? "admin" : "dash"}`)}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("slotName")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("list")}
    </Typography>,
  ];

  const columns = [
    { id: "slotNumber", label: t("slotNumber"), minWidth: 120, align: "left" },
    {
      id: "parkingSpaceName",
      label: t("parkingSpaceName"),
      minWidth: 120,
      align: "left",
    },
    {
      id: "status",
      label:t("status"),
      minWidth: 120,
      align: "left",
    },
    {
      id: "createdAt",
      label:t("createdAt"),
      minWidth: 120,
      align: "left",
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
    dispatch(setBranchFilterForSlot(branch));
  };

  const handleSearchChange = (keywords) => {
    dispatch(setSearchParkingSlot(keywords));
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setPageNoParking(newPage + 1));
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    dispatch(setPageSizeParking(event.target.value));
    dispatch(setPageNoParking(1));
  };

  let content;

  if (isLoadingGetParkingSpaces || isLoadingGetBranchData) {
    content = <LoadingFetchingDataComponent />;
  }

  if (isErrorGetParkingSpaces) {
    content = <p>Error: {errorGetParkingSpaces?.message}</p>;
  }

  if (isSuccessGetParkingSpaces && isSuccessGetBranchData) {
    const { ids, entities, totalElements, pageSize, pageNo } =
      getParkingSpacesData;

    const {
      ids: idsFilter,
      entities: searchEntities,
      totalElements: totalElementsSearch,
      pageSize: pageSizeFilter,
      pageNo: pageNoFilter,
    } = filterParkingSpacesData || {};

    const resultFound = filterParkingSpacesData
      ? totalElementsSearch
      : totalElements;

    const displayTotalElements =
        debounceInputSearch !== "" || branchFilter.length > 0
        ? totalElementsSearch
        : totalElements;

    const tableContent =
        debounceInputSearch !== "" || branchFilter.length > 0 ? (
        <>
          {idsFilter?.length ? (
            idsFilter.map((parkingSlotId) => (
              <ParkingSlotRowComponent
                parkingSlotId={parkingSlotId}
                key={parkingSlotId}
                parkingSlot={searchEntities[parkingSlotId]}
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
            ids.map((parkingSlotId) => (
              <ParkingSlotRowComponent
                  parkingSlotId={parkingSlotId}
                key={parkingSlotId}
                  parkingSlot={entities[parkingSlotId]}
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
        <SeoComponent title="Slot List" />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("list")}
          {...(isAdmin && { btnTitle: t("newslot") })}
          {...(isAdmin && { onClick: () => navigate("new") })}
        />

        <Card sx={{ ...cardStyle }}>
          <FilterBarComponent
            showTabs={false}
            branchFetched={isAdmin ? branchData : undefined}
            branchFilter={branchFilter}
            searchQuery={searchKeywords}
            handleBranchChange={handleBranchChange}
            handleSearchChange={handleSearchChange}
          />

          <FilterChipsComponent
            branchFilter={branchFilter}
            branchFetched={branchData}
            searchQuery={searchKeywords}
            handleSearchChange={handleSearchChange}
            handleBranchChange={handleBranchChange}
            clearFilter={() => {
              dispatch(setBranchFilterForSlot([]));
                dispatch(setSearchParkingSlot(""));
            }}
            clearSearch={() => dispatch(setSearchParkingSlot(""))}
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
              <TableBody sx={{ border: "none" }}>
                {isFetchingGetParkingSpaceFilter && idsFilter?.length === 0 ? (Array.from({length: pageSize}).map((_, index) => (
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
        <QuickEditParkingSlotComponent/>
      </div>
    );
  }
  return content;
}

export default ListParkingSlot;
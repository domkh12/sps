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
import SeoComponent from "../../components/SeoComponent";
import { useNavigate } from "react-router-dom";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import { cardStyle } from "../../assets/style";
import useTranslate from "../../hook/useTranslate";
import { useDispatch, useSelector } from "react-redux";
import {
  useFilterSitesQuery,
  useGetSitesQuery,
} from "../../redux/feature/site/siteApiSlice";
import BranchRowComponent from "../../components/BranchRowComponent";
import QuickEditBranchComponent from "../../components/QuickEditBranchComponent";
import FilterBarComponent from "../../components/FilterBarComponent";
import { useGetAllCitiesQuery } from "../../redux/feature/city/cityApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import {useGetAllCompaniesQuery} from "../../redux/feature/company/companyApiSlice";
import { setCityFilter } from "../../redux/feature/city/citySlice";
import {
  setBranchTypeFilter,
  setClearBranchFilter,
  setPageNoBranch,
  setPageSizeBranch,
  setSearchKeywords,
} from "../../redux/feature/site/siteSlice";
import {
  setClearCompanyFilter,
  setCompanyFilter,
} from "../../redux/feature/company/companySlice";
import {useGetAllSiteTypesQuery} from "../../redux/feature/siteType/siteTypeApiSlice";
import DataNotFound from "../../components/DataNotFound";
import FilterChipsComponent from "../../components/FilterChipsComponent";
import SkeletonTableRowComponent from "../../components/SkeletonTableRowComponent.jsx";
import {useDebounce} from "use-debounce";

function BranchList() {
  const navigate = useNavigate();
  const openQuickEdit = useSelector((state) => state.sites.isQuickEditBranchOpen);
  const { t } = useTranslate();
  const pageNo = useSelector((state) => state.sites.pageNo);
  const pageSize = useSelector((state) => state.sites.pageSize);
  const cityFilter = useSelector((state) => state.city.cityFilter);
  const companyFilter = useSelector((state) => state.companies.companyFilter);
  const branchTypeFilter = useSelector((state) => state.sites.branchTypeFilter);
  const searchKeywords = useSelector((state) => state.sites.searchKeywords);
  const dispatch = useDispatch();
  const {data:cityName, isSuccess: isSuccessGetCity, isLoading: isLoadingGetCity}= useGetAllCitiesQuery("citiesList");
  const {data:companyName, isSuccess: isSuccessGetCompanyName, isLoading: isLoadingGetCompanyName}= useGetAllCompaniesQuery("companyNameList");
  const {data:getAllSiteTypes, isSuccess: isSuccessGetAllSiteTypes, isLoading: isLoadingGetAllSiteTypes} = useGetAllSiteTypesQuery("siteTypeList");
  const [debounceInputSearch] = useDebounce(searchKeywords, 1000);

  const {
    data: sites,
    isSuccess,
    isLoading: isLoadingGetAllSite,
    isError,
    error,
  } = useGetSitesQuery(
    { pageNo, pageSize },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: filterData,
    isFetching: isFetchingGetCompanyFilter
  } = useFilterSitesQuery(
    {
      pageNo,
      pageSize,
      keywords: debounceInputSearch,
      cityId: cityFilter,
      siteTypeId: branchTypeFilter,
      companyId: companyFilter,
    },
    {
      skip:
        debounceInputSearch === "" &&
        cityFilter === "" &&
        branchTypeFilter.length === 0 &&
        companyFilter.length === 0,
    }
  );

  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navigate("/dash")}
      key={1}
    >
      {t("dashboard")}
    </button>,
    <Typography color="inherit" key={2}>
      {t("branch")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("list")}
    </Typography>,
  ];

  const columns = [
    { id: "branchName", label: t("branchName"), minWidth: 230, align: "left" },
    {
      id: "company",
      label: t("company"),
      minWidth: 250,
      align: "left",
    },
    {
      id: "parkingSpaceQty",
      label: t("parkingSpaceQty"),
      minWidth: 140,
      align: "left",
    },
    {
      id: "branchType",
      label: t("branchType"),
      minWidth: 120,
      align: "left",
    },
    {
      id: "city",
      label: t("city"),
      minWidth: 120,
      align: "left",
    },
    {
      id: "address",
      label: t("address"),
      minWidth: 180,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "createdAt",
      label: t("createdAt"),
      minWidth: 160,
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

  const handleCityChange = (value) => {
    dispatch(setCityFilter(value));
  };

  const handleBranchTypeChange = (value) => {
    dispatch(setBranchTypeFilter(value));
  };

  const handleSearchChange = (keyword) => {
    dispatch(setSearchKeywords(keyword));
  };

  const handleCompanyFilter = (value) => {
    dispatch(setCompanyFilter(value));
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setPageNoBranch(newPage + 1));
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    dispatch(setPageSizeBranch(event.target.value));
    dispatch(setPageNoBranch(1));
  };

  let content;

  if (isLoadingGetCity || isLoadingGetAllSite || isLoadingGetCompanyName || isLoadingGetAllSiteTypes) content = <LoadingFetchingDataComponent />;

  if (isError) {
    content = <p>Error: {error?.message}</p>;
  }

  if (isSuccessGetCity && isSuccess && isSuccessGetCompanyName && isSuccessGetAllSiteTypes) {
    const { ids, entities, totalElements, pageSize, pageNo } = sites;

    const {
      ids: idsFilterData,
      entities: searchEntities,
      totalElements: totalElementsSearch,
      pageSize: pageSizeFilter,
      pageNo: pageNoFilter,
    } = filterData || {};

    const displayTotalElements = debounceInputSearch !== "" || cityFilter.length > 0 || branchTypeFilter.length > 0 || companyFilter.length > 0 ? totalElementsSearch : totalElements;

    const tableContent =
      debounceInputSearch !== "" ||
      cityFilter.length > 0 ||
      branchTypeFilter.length > 0 ||
      companyFilter.length > 0 ? (
        <>
          {idsFilterData?.length ? (
            idsFilterData?.map((siteId) => (
              <BranchRowComponent
                key={siteId}
                siteId={siteId}
                site={searchEntities[siteId]}
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
            ids?.map((siteId) => (
              <BranchRowComponent
                key={siteId}
                siteId={siteId}
                site={entities[siteId]}
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
        <SeoComponent title="Company List" />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("list")}
          btnTitle={t("newBranch")}
          onClick={() => navigate("/dash/branches/new")}
        />

        <div>
          <Card sx={{ ...cardStyle }}>
            <FilterBarComponent
              showTabs={false}
              searchQuery={searchKeywords}
              cityFetched={cityName}
              branchTypeFetched={getAllSiteTypes}
              companyFetched={companyName}
              cityFilter={cityFilter}
              branchTypeFilter={branchTypeFilter}
              companyFilter={companyFilter}
              clearCompanyFilter={() => dispatch(setClearCompanyFilter())}
              handleCityChange={handleCityChange}
              handleBranchTypeChange={handleBranchTypeChange}
              handleSearchChange={handleSearchChange}
              handleCompanyChange={handleCompanyFilter}
            />

            <FilterChipsComponent
              resultFound={displayTotalElements}
              branchTypeFetched={getAllSiteTypes}
              branchTypeFilter={branchTypeFilter}
              cityFilter={cityFilter}
              cityFetched={cityName}
              companyFetched={companyName}
              companyFilter={companyFilter}
              handleCompanyChange={handleCompanyFilter}
              searchQuery={searchKeywords}
              clearSearch={() => dispatch(setSearchKeywords(""))}
              handleSearchChange={handleSearchChange}
              handleCityChange={handleCityChange}
              handleBranchTypeChange={handleBranchTypeChange}
              clearFilter={() => dispatch(setClearBranchFilter())}
              isFiltered={
                searchKeywords !== "" ||
                cityFilter.length > 0 ||
                branchTypeFilter.length > 0 ||
                companyFilter.length > 0
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
                        style={{ minWidth: column.minWidth, color: "gray", whiteSpace: "nowrap" }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ border: "none" }}>
                  {isFetchingGetCompanyFilter && idsFilterData?.length === 0 ? (Array.from({length: pageSize}).map((_, index) => (
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
        {openQuickEdit && <QuickEditBranchComponent />}
      </div>
    );
  }

  return content;
}

export default BranchList;

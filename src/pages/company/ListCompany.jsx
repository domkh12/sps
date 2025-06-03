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
import useAuth from "../../hook/useAuth";
import useTranslate from "../../hook/useTranslate";
import { useDispatch, useSelector } from "react-redux";
import {
  useFilterSitesQuery,
  useGetSitesQuery,
} from "../../redux/feature/site/siteApiSlice";
import BranchRowComponent from "../../components/BranchRowComponent";
import { useEffect, useState } from "react";
import QuickEditBranchComponent from "../../components/QuickEditBranchComponent";
import FilterBarComponent from "../../components/FilterBarComponent";
import { useGetAllCitiesMutation } from "../../redux/feature/city/cityApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import { useGetAllCompaniesMutation } from "../../redux/feature/company/companyApiSlice";
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
import { useGetAllSiteTypesMutation } from "../../redux/feature/siteType/siteTypeApiSlice";
import DataNotFound from "../../components/DataNotFound";
import FilterChipsComponent from "../../components/FilterChipsComponent";

function ListCompany() {
  const navigate = useNavigate();
  const { isManager } = useAuth();
  const openQuickEdit = useSelector(
    (state) => state.sites.isQuickEditBranchOpen
  );
  const { t } = useTranslate();
  const pageNo = useSelector((state) => state.sites.pageNo);
  const pageSize = useSelector((state) => state.sites.pageSize);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const cityFilter = useSelector((state) => state.city.cityFilter);
  const citiesFetchedData = useSelector((state) => state.city.cityData);
  const siteTypesFetchedData = useSelector(
    (state) => state.siteType.siteTypeData
  );
  const companiesFetchedData = useSelector(
    (state) => state.companies.companiesData
  );
  const companyFilter = useSelector((state) => state.companies.companyFilter);
  const branchTypeFilter = useSelector((state) => state.sites.branchTypeFilter);
  const searchKeywords = useSelector((state) => state.sites.searchKeywords);
  const dispatch = useDispatch();

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
    isSuccess: isSuccessFilter,
    isLoading: isLoadingFilter,
    isError: isErrorFilter,
    error: errorFilter,
  } = useFilterSitesQuery(
    {
      pageNo,
      pageSize,
      keywords: searchKeywords,
      cityId: cityFilter,
      siteTypeId: branchTypeFilter,
      companyId: companyFilter,
    },
    {
      skip:
        searchKeywords === "" &&
        cityFilter === "" &&
        branchTypeFilter.length === 0 &&
        companyFilter.length === 0,
    }
  );

  const [
    getAllCities,
    {
      isSuccess: isSuccessGetAllCities,
      isLoading: isLoadingGetAllCities,
      isError: isErrorGetAllCities,
      error: errorGetAllCities,
    },
  ] = useGetAllCitiesMutation();

  const [
    getAllSiteTypes,
    {
      isSuccess: isSuccessGetAllSiteTypes,
      isLoading: isLoadingGetAllSiteTypes,
      isError: isErrorGetAllSiteTypes,
      error: errorGetAllSiteType,
    },
  ] = useGetAllSiteTypesMutation();

  const [
    getAllCompanies,
    {
      isSuccess: isSuccessGetAllCompanies,
      isLoading: isLoadingGetAllCompanies,
      isError: isErrorGetAllCompanies,
      error: errorGetAllCompanies,
    },
  ] = useGetAllCompaniesMutation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getAllCompanies(),
          getAllCities(),
          getAllSiteTypes(),
        ]);
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
      {t("company")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("list")}
    </Typography>,
  ];

  const columns = [
    { id: "companyName", label: t("companyname"), minWidth: 230, align: "left" },
     {
      id: "companytype",
      label: t("CompanyType"),
      minWidth: 230,
      align: "left",
    },
    
      {
      id: "branch",
      label: t("branch"),
      minWidth: 150,
      align: "left",
    },
    {
      id: "city",
      label: t("city"),
      minWidth: 150,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
     {
      id: "address",
      label: t("address"),
      minWidth: 150,
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

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (isError) {
    content = <p>Error: {error?.message}</p>;
  }

  if (isSuccess && !isLoading) {
    const { ids, entities, totalElements, pageSize, pageNo } = sites;

    const {
      ids: idsFilterData,
      entities: searchEntities,
      totalElements: totalElementsSearch,
      pageSize: pageSizeSearch,
      pageNo: pageNoSearch,
    } = filterData || {};

    const displayTotalElements = filterData
      ? totalElementsSearch
      : totalElements;

    const tableContent =
      searchKeywords !== "" ||
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
              <TableCell align="center" colSpan={8}>
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
              <TableCell align="center" colSpan={6}>
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
          btnTitle={t("newCompany")}
          onClick={() => navigate("/dash/companies/new")}
        />

        <div>
          <Card sx={{ ...cardStyle }}>
            <FilterBarComponent
              showTabs={false}
              searchQuery={searchKeywords}
              cityFetched={citiesFetchedData}
              branchTypeFetched={siteTypesFetchedData}
              // companyFetched={companiesFetchedData}
              cityFilter={cityFilter}
              branchTypeFilter={branchTypeFilter}
              // companyFilter={companyFilter}
              // clearCompanyFilter={() => dispatch(setClearCompanyFilter())}
              handleCityChange={handleCityChange}
              handleBranchTypeChange={handleBranchTypeChange}
              handleSearchChange={handleSearchChange}
              handleCompanyChange={handleCompanyFilter}
            />

            <FilterChipsComponent
              branchTypeFetched={siteTypesFetchedData.data}
              branchTypeFilter={branchTypeFilter}
              cityFilter={cityFilter}
              cityFetched={citiesFetchedData.data}
              // companyFetched={companiesFetchedData.data}
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
        {openQuickEdit && <QuickEditBranchComponent />}
      </div>
    );
  }

  return content;
}

export default ListCompany;

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
import FilterBarComponent from "../../components/FilterBarComponent";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import {useFilterCompanyQuery, useGetCompanyQuery} from "../../redux/feature/company/companyApiSlice";
import {
  setSearchKeywords,
} from "../../redux/feature/site/siteSlice";
import DataNotFound from "../../components/DataNotFound";
import FilterChipsComponent from "../../components/FilterChipsComponent";
import CompanyRowComponent from "../../components/CompanyRowComponent";
import {useGetCompanyTypeQuery} from "../../redux/feature/companyType/CompanyTypeApiSlice.js";
import {setCompanyTypeFilter} from "../../redux/feature/companyType/companyTypeSlice.js";
import {useGetAllCitiesQuery} from "../../redux/feature/city/cityApiSlice.js";
import {setCityFilter} from "../../redux/feature/city/citySlice.js";
import QuickEditCompanyComponent from "../../components/QuickEditCompanyComponent.jsx";
import {useDebounce} from "use-debounce";
import {
  setCompanySearchKeywords,
  setPageNoCompany,
  setPageSizeCompany
} from "../../redux/feature/company/companySlice.js";
import SkeletonTableRowComponent from "../../components/SkeletonTableRowComponent.jsx";

function ListCompany() {
  const navigate = useNavigate();
  const openQuickEdit = useSelector((state) => state.companies.isQuickEditCompanyOpen);
  const pageSize = useSelector((state) => state.companies.pageSize);
  const pageNo = useSelector((state) => state.companies.pageNo);
  const { t } = useTranslate();
  const cityFilter = useSelector((state) => state.city.cityFilter);
  const companyTypeFilter = useSelector((state) => state.companyType.companyTypeFilter);
  const {data:companyTypeData, isSuccess: isSuccessGetCompanyType, isLoading: isLoadingGetCompanyType} = useGetCompanyTypeQuery("companyTypeList");
  const {data:cityName, isSuccess: isSuccessGetCity, isLoading: isLoadingGetCity}= useGetAllCitiesQuery("citiesList");
  const searchKeywords = useSelector((state) => state.companies.companySearchKeywords);
  const [debounceInputSearch] = useDebounce(searchKeywords, 1000);
  const dispatch = useDispatch();
  const {
    data: companies,
    isSuccess,
    isError,
    error,
  } = useGetCompanyQuery(
    { pageNo, pageSize },
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: companyDataFilter,
    isFetching: isFetchingGetCompanyFilter
  } = useFilterCompanyQuery({
    pageNo, pageSize,
    keywords: debounceInputSearch,
    companyTypeUuid: companyTypeFilter,
    cityUuid: cityFilter,
  }, {skip: debounceInputSearch === "" &&
        companyTypeFilter.length === 0 &&
        cityFilter.length === 0
  });

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
    { id: "companyName", label: t("companyName"), minWidth: 230, align: "left" },
    { id: "companyType", label: t("companyType"), minWidth: 150, align: "left" },
    { id: "branchQty", label: t("branchQty"), minWidth: 150, align: "left" },
    { id: "establishedDate", label: t("establishedDate"), minWidth: 170, align: "left" },
    { id: "city", label: t("city"), minWidth: 150, align: "left" },
    { id: "address", label: t("address"), minWidth: 150, align: "left" },
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

  const handleSearchChange = (keyword) => {
    dispatch(setCompanySearchKeywords(keyword));
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setPageNoCompany(newPage + 1));
  };

  const handleChangeRowsPerPage = (event, newValue) => {
    dispatch(setPageSizeCompany(event.target.value));
    dispatch(setPageNoCompany(1));
  };

  const handleCompanyTypeChange = (companyType) => {
    dispatch(setCompanyTypeFilter(companyType));
  };

  const handleCityChange = (value) => {
    dispatch(setCityFilter(value));
  }

  let content;

  if (isLoadingGetCompanyType || isLoadingGetCity) content = <LoadingFetchingDataComponent />;

  if (isError) {
    content = <p>Error: {error?.message}</p>;
  }

  if (isSuccess && isSuccessGetCompanyType && isSuccessGetCity) {
    const { ids, entities, totalElements, pageSize, pageNo } = companies;

    const {
      ids: idsDataFilter,
      entities: entitiesFilter,
      totalElementsFilter,
      pageSizeFilter,
      pageNoFilter
    } = companyDataFilter || {};

    const displayTotalElements = debounceInputSearch !== "" || companyTypeFilter.length > 0 || cityFilter.length > 0 ? totalElementsFilter : totalElements;

    const tableContent = debounceInputSearch !== "" || companyTypeFilter.length > 0 || cityFilter.length > 0 ? (
        <>
          {idsDataFilter?.length ? (
              idsDataFilter?.map((companyId) => (
              <CompanyRowComponent key={companyId} companyId={companyId} company={entitiesFilter[companyId]}/>))
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
            ids?.map((companyId) => (<CompanyRowComponent key={companyId} companyId={companyId} company={entities[companyId]}/>))
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
              handleSearchChange={handleSearchChange}
              companyTypeFetched={companyTypeData}
              companyTypeFilter={companyTypeFilter}
              handleCompanyTypeChange={handleCompanyTypeChange}
              cityFetched={cityName}
              cityFilter={cityFilter}
              handleCityChange={handleCityChange}
            />

            <FilterChipsComponent
              resultFound={displayTotalElements}
              searchQuery={searchKeywords}
              clearSearch={() => dispatch(setSearchKeywords(""))}
              handleSearchChange={handleSearchChange}
              cityFetched={cityName}
              cityFilter={cityFilter}
              handleCityChange={handleCityChange}
              companyTypeFetched={companyTypeData}
              companyTypeFilter={companyTypeFilter}
              handleCompanyTypeChange={handleCompanyTypeChange}
              clearFilter={() => {
                dispatch(setCompanySearchKeywords(""))
                dispatch(setCompanyTypeFilter([]));
                dispatch(setCityFilter([]));
              }}
              isFiltered={
                searchKeywords !== "" || companyTypeFilter.length > 0 || cityFilter.length > 0
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
                  {isFetchingGetCompanyFilter && idsDataFilter?.length === 0 ? (Array.from({length: pageSize}).map((_, index) => (
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
        {openQuickEdit && <QuickEditCompanyComponent />}
      </div>
    );
  }

  return content;
}

export default ListCompany;

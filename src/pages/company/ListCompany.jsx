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
import { useEffect, useState } from "react";
import QuickEditBranchComponent from "../../components/QuickEditBranchComponent";
import FilterBarComponent from "../../components/FilterBarComponent";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
<<<<<<< HEAD
import {useGetAllCompaniesMutation, useGetCompanyQuery} from "../../redux/feature/company/companyApiSlice";
import { setCityFilter } from "../../redux/feature/city/citySlice";
=======
import { useGetCompanyQuery } from "../../redux/feature/company/companyApiSlice";
>>>>>>> 1850411fe91dbd7aa638d410c9ea6d3ecd53b085
import {
 
  setClearBranchFilter,
  setPageNoBranch,
  setPageSizeBranch,
  setSearchKeywords,
} from "../../redux/feature/site/siteSlice";
import DataNotFound from "../../components/DataNotFound";
import FilterChipsComponent from "../../components/FilterChipsComponent";
<<<<<<< HEAD
import CompanyRowComponent from "../../components/CompanyRowComponent.jsx";
=======
import CompanyRowComponent from "../../components/CompanyRowComponent";
>>>>>>> 1850411fe91dbd7aa638d410c9ea6d3ecd53b085

function ListCompany() {
  const navigate = useNavigate();
  const openQuickEdit = useSelector(
    (state) => state.sites.isQuickEditBranchOpen
  );
  const { t } = useTranslate();
  const pageNo = useSelector((state) => state.sites.pageNo);
  const pageSize = useSelector((state) => state.sites.pageSize);
  const [searchTerm, setSearchTerm] = useState("");
  const cityFilter = useSelector((state) => state.city.cityFilter);
<<<<<<< HEAD
=======
 
>>>>>>> 1850411fe91dbd7aa638d410c9ea6d3ecd53b085
  const companyFilter = useSelector((state) => state.companies.companyFilter);
  const branchTypeFilter = useSelector((state) => state.sites.branchTypeFilter);
  const searchKeywords = useSelector((state) => state.sites.searchKeywords);
  const dispatch = useDispatch();

  const {
    data: companies,
    isSuccess,
    isLoading,
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
    },
    {
      skip:
        searchKeywords === ""
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
      {t("company")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("list")}
    </Typography>,
  ];

  const columns = [
    { id: "companyName", label: t("companyname"), minWidth: 230, align: "left" },
<<<<<<< HEAD
=======
    { id: "companyType", label: t("companyType"), minWidth: 230, align: "left" },
    { id: "branchQty", label: t("branchQty"), minWidth: 150, align: "left" },
    { id: "city", label: t("city"), minWidth: 150, align: "left" },
    { id: "address", label: t("address"), minWidth: 150, align: "left" },
>>>>>>> 1850411fe91dbd7aa638d410c9ea6d3ecd53b085
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
    dispatch(setSearchKeywords(keyword));
  };

<<<<<<< HEAD
=======
 

>>>>>>> 1850411fe91dbd7aa638d410c9ea6d3ecd53b085
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

<<<<<<< HEAD
  if (isSuccess) {
=======
  if (isSuccess ) {
>>>>>>> 1850411fe91dbd7aa638d410c9ea6d3ecd53b085
    const { ids, entities, totalElements, pageSize, pageNo } = companies;

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
      searchKeywords !== "" ? (
        <>
          {idsFilterData?.length ? (
            idsFilterData?.map((companyId) => (
              <CompanyRowComponent
                key={companyId}
                companyId={companyId}
                company={searchEntities[companyId]}
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
            ids?.map((companyId) => (
<<<<<<< HEAD
                <CompanyRowComponent
                    key={companyId}
                    companyId={companyId}
                    company={entities[companyId]}
                />
=======
              <CompanyRowComponent
                key={companyId}
                companyId={companyId}
                company={entities[companyId]}
              />
>>>>>>> 1850411fe91dbd7aa638d410c9ea6d3ecd53b085
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
              handleSearchChange={handleSearchChange}
<<<<<<< HEAD
            />

            <FilterChipsComponent
=======
              
            />

            <FilterChipsComponent
             
>>>>>>> 1850411fe91dbd7aa638d410c9ea6d3ecd53b085
              searchQuery={searchKeywords}
              clearSearch={() => dispatch(setSearchKeywords(""))}
              handleSearchChange={handleSearchChange}
              clearFilter={() => dispatch(setClearBranchFilter())}
              isFiltered={
<<<<<<< HEAD
                searchKeywords !== ""
=======
                searchKeywords !== "" 
>>>>>>> 1850411fe91dbd7aa638d410c9ea6d3ecd53b085
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

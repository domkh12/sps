import { Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MainHeaderComponent from "../../components/MainHeaderComponent";

import { cardStyle } from "../../assets/style";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllRolesMutation,
  useGetAllSignUpMethodsMutation,
  useGetUsersQuery,
  useSearchUserQuery,
} from "../../redux/feature/users/userApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import SeoComponent from "../../components/SeoComponent";
import { useEffect, useState } from "react";
import useTranslate from "../../hook/useTranslate";
import useAuth from "../../hook/useAuth";
import {
  clearFilter,
  setBranchFilter,
  setClearSearchQuery,
  setPageNo,
  setPageSize,
  setRoleFilter,
  setSearchQuery,
  setSignUpMethodFilter,
  setStatusFilter,
} from "../../redux/feature/users/userSlice";
import { useGetSitesListMutation } from "../../redux/feature/site/siteApiSlice";
import FilterBarComponent from "../../components/FilterBarComponent";
import FilterChipsComponent from "../../components/FilterChipsComponent";
import UserTableComponent from "../../components/UserTableComponent";
import QuickEditUserComponent from "../../components/QuickEditUserComponent";
import { setIsFiltered } from "../../redux/feature/actions/actionSlice";

function UserList() {
  const statusFilter = useSelector((state) => state.users.statusFilter);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pageNo = useSelector((state) => state.users.pageNo);
  const pageSize = useSelector((state) => state.users.pageSize);
  const { t } = useTranslate();
  const roleFetched = useSelector((state) => state.users.roles);
  const searchQuery = useSelector((state) => state.users.searchQuery);
  const signUpMethodsFetched = useSelector(
    (state) => state.users.signUpMethods
  );
  const roleFilter = useSelector((state) => state.users.roleFilter);
  const signUpMethodFilter = useSelector(
    (state) => state.users.signUpMethodFilter
  );
  const branchFetched = useSelector((state) => state.sites.sites);
  const branchFilter = useSelector((state) => state.users.branchFilter);
  const { isAdmin, isManager } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const {
    data: users,
    isLoading: isLoadingGetAllUsers,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery({
    query: "usersList",
    pageNo,
    pageSize,
  });

  const {
    data: searchData,
    isSuccess: isSuccessSearch,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    error: errorSearch,
  } = useSearchUserQuery(
    {
      pageNo,
      pageSize,
      searchQuery,
      roleFilter,
      signUpMethodFilter,
      statusFilter,
      branchFilter,
    },
    {
      skip:
        searchQuery === "" &&
        statusFilter === "" &&
        roleFilter.length === 0 &&
        signUpMethodFilter.length === 0 &&
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
    getAllSignUpMethods,
    {
      isSuccess: isGetAllSignUpMethodsSuccess,
      isLoading: isGetAllSignUpMethodsLoading,
      isError: isGetAllSignUpMethodsError,
      error: errorGetAllSignUpMethod,
    },
  ] = useGetAllSignUpMethodsMutation();

  const [
    getAllRoles,
    {
      isSuccess: isGetAllRolesSuccess,
      isLoading: isGetAllRolesLoading,
      isError: isGetAllRolesError,
      error: getAllRolesError,
    },
  ] = useGetAllRolesMutation();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getAllRoles(),
          getAllSignUpMethods(),
          getSitesList(),
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
      {t("user")}
    </Typography>,
    <Typography color="inherit" key={3}>
      {t("list")}
    </Typography>,
  ];

  const columns = [
    { id: "name", label: "Name", minWidth: 170, align: "left" },
    {
      id: "phoneNumber",
      label: "Phone\u00a0Number",
      minWidth: 120,
      align: "left",
    },
    {
      id: "role",
      label: "Role",
      minWidth: 120,
      align: "left",
    },
    isManager ? 
    {
      id: "branch",
      label: "Branch",
      minWidth: 120,
      align: "left",
    }: null,
    {
      id: "status",
      label: "Status",
      minWidth: 120,
      align: "left",
    },
    {
      id: "createdAt",
      label: "Created\u00a0At",
      minWidth: 120,
      align: "left",
    },
    {
      id: "action",
      label: "",
      minWidth: 30,
      align: "left",
    },
  ].filter(Boolean);

  const handleChange = (event, newValue) => {
    dispatch(setStatusFilter(newValue));
  };

  const handleAddNewClick = () => {
    navigate("/dash/users/new");
  };

  const handleRoleChange = (role) => {
    dispatch(setRoleFilter(role));
  };

  const handleMethodChange = (method) => {
    dispatch(setSignUpMethodFilter(method));
  };

  const handleBranchChange = (branch) => {
    dispatch(setBranchFilter(branch));
  };
  const handleSearchChange = (statusFilter) => {
    dispatch(setSearchQuery(statusFilter));
  };

  const handleChangePage = (event, newPage) => {
    dispatch(setPageNo(newPage + 1));
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(setPageSize(event.target.value));
    dispatch(setPageNo(1));
  };

  const isFiltered =
    searchQuery !== "" ||
    roleFilter.length > 0 ||
    signUpMethodFilter.length > 0 ||
    statusFilter !== "" ||
    branchFilter.length > 0;

  useEffect(() => {
    dispatch(setIsFiltered(isFiltered));
  }, [isFiltered, dispatch]);

  let content;

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (isError) {
    content = <p>Error: {error?.message}</p>;
  }

  if (isSuccess) {
    const {
      ids,
      totalElements,
      pageSize,
      pageNo,
      entities,
      activeCount,
      pendingCount,
      bannedCount,
    } = users;
    const {
      ids: idsSearch,
      totalElements: totalElementsSearch,
      pageSize: pageSizeSearch,
      pageNo: pageNoSearch,
      entities: searchEntities,
    } = searchData || {};

    // const displayTotalElements =
    //   searchQuery !== "" ||
    //   roleFilter.length > 0 ||
    //   signUpMethodFilter.length > 0 ||
    //   statusFilter !== "" ||
    //   branchFilter.length > 0
    //     ? totalElementsSearch
    //     : totalElements;

    // useEffect(() => {
    //   if (displayTotalElements) {
    //     dispatch(setResultFound(displayTotalElements));
    //   }
    // }, [displayTotalElements]);

    content = (
      <div data-aos="fade-left">
        <SeoComponent title="User List" />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("list")}
          btnTitle={"New user"}
          onClick={handleAddNewClick}
        />
        <Card sx={{ ...cardStyle }}>
          <FilterBarComponent
            statusFilter={statusFilter}
            roleFetched={roleFetched}
            signUpMethodsFetched={signUpMethodsFetched}
            branchFetched={branchFetched}
            branchFilter={branchFilter}
            handleRoleChange={handleRoleChange}
            handleMethodChange={handleMethodChange}
            handleBranchChange={handleBranchChange}
            handleSearchChange={handleSearchChange}
            searchQuery={searchQuery}
            dispatch={dispatch}
            activeCount={activeCount}
            pendingCount={pendingCount}
            bannedCount={bannedCount}
            totalElements={totalElements}
            handleChange={handleChange}
          />
          <FilterChipsComponent
            statusFilter={statusFilter}
            searchQuery={searchQuery}
            roleFilter={roleFilter}
            branchFilter={branchFilter}
            signUpMethodFilter={signUpMethodFilter}
            roleFetched={roleFetched}
            branchFetched={branchFetched}
            signUpMethodsFetched={signUpMethodsFetched}
            dispatch={dispatch}
            handleRoleChange={handleRoleChange}
            handleBranchChange={handleBranchChange}
            handleMethodChange={handleMethodChange}
            clearFilter={() => dispatch(clearFilter())}
            clearSearch={() => dispatch(setClearSearchQuery())}
            t={t}
          />
          <UserTableComponent
            columns={columns}
            users={users}
            searchData={searchData}
            searchQuery={searchQuery}
            roleFilter={roleFilter}
            signUpMethodFilter={signUpMethodFilter}
            statusFilter={statusFilter}
            branchFilter={branchFilter}
            pageSize={pageSize}
            pageNo={pageNo}
            totalElements={totalElements}
            pageSizeSearch={pageSizeSearch}
            pageNoSearch={pageNoSearch}
            totalElementsSearch={totalElementsSearch}
            dispatch={dispatch}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            entities={entities}
            searchEntities={searchEntities}
            
          />
        </Card>
        <QuickEditUserComponent />
      </div>
    );
  }
  return content;
}

export default UserList;

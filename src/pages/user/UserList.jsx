import { Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import { cardStyle } from "../../assets/style";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetAllRolesQuery,
  useGetAllSignUpMethodsQuery,
  useGetUsersQuery,
  useSearchUserQuery,
} from "../../redux/feature/users/userApiSlice";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import SeoComponent from "../../components/SeoComponent";
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
import FilterBarComponent from "../../components/FilterBarComponent";
import FilterChipsComponent from "../../components/FilterChipsComponent";
import UserTableComponent from "../../components/UserTableComponent";
import QuickEditUserComponent from "../../components/QuickEditUserComponent";
import {useGetAllCompaniesQuery} from "../../redux/feature/company/companyApiSlice.js";
import {useDebounce} from "use-debounce";
import {useGetListBranchQuery} from "../../redux/feature/site/siteApiSlice.js";

function UserList() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAdmin } = useAuth();
  const statusFilter = useSelector((state) => state.users.statusFilter);
  const pageNo = useSelector((state) => state.users.pageNo);
  const pageSize = useSelector((state) => state.users.pageSize);
  const searchQuery = useSelector((state) => state.users.searchQuery);
  const roleFilter = useSelector((state) => state.users.roleFilter);
  const signUpMethodFilter = useSelector((state) => state.users.signUpMethodFilter);
  const branchFilter = useSelector((state) => state.users.branchFilter);
  const {data:branchList, isSuccess: isSuccessGetBranchList, isLoading: isLoadingGetBranchList}= useGetListBranchQuery("branchList", {skip: !isAdmin});
  const {data: role, isSuccess: isSuccessGetRole, isLoading: isLoadingGetRole} = useGetAllRolesQuery("roleList");
  const {data: signUpMethods, isSuccess: isSuccessGetSignUpMethods, isLoading: isLoadingGetSignUpMethods} = useGetAllSignUpMethodsQuery("signUpMethodList");
  const [debounceInputSearch] = useDebounce(searchQuery, 1000);

  const {
    data: users,
    isLoading: isLoadingGetAllUsers,
    isSuccess: isSuccessGetAllUsers,
    isError,
    error,
  } = useGetUsersQuery(
    {pageNo, pageSize},
    {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: searchData,
    isFetching: isFetchingGetUserFilter
  } = useSearchUserQuery(
    {
      pageNo,
      pageSize,
      searchQuery: debounceInputSearch,
      roleFilter,
      signUpMethodFilter,
      statusFilter,
      branchFilter,
    }
  );

  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navigate(`/${isAdmin ? "admin" : "dash"}`)}
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
    { id: "name", label: t('name'), minWidth: 170, align: "left" },
    {
      id: "phoneNumber",
      label: t('phoneNumber'),
      minWidth: 120,
      align: "left",
    },
    {
      id: "role",
      label: t('role'),
      minWidth: 120,
      align: "left",
    },
    {
      id: "branch",
      label: t('branch'),
      minWidth: 120,
      align: "left",
    },
    {
      id: "status",
      label: t('status'),
      minWidth: 120,
      align: "left",
    },
    {
      id: "createdAt",
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
  ].filter(Boolean);

  const handleChange = (event, newValue) => {
    dispatch(setStatusFilter(newValue));
  };

  const handleAddNewClick = () => {
    navigate(`/${isAdmin ? "admin" : "dash"}/users/new`);
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
  
  const handleChangeRowsPerPage = (event, newValue) => {
    dispatch(setPageSize(event.target.value));
    dispatch(setPageNo(1));
  };

  let content;

  if (isLoadingGetAllUsers || isLoadingGetBranchList) content = <LoadingFetchingDataComponent />;

  if (isError) {
    content = <p>Error: {error?.message}</p>;
  }

  if (isSuccessGetAllUsers &&
     (isAdmin ? isSuccessGetBranchList : true)
  ) {
    const {
      totalElements,
      pageSize,
      pageNo,
      entities,
      activeCount,
      pendingCount,
      bannedCount,
    } = users;
    const {
      ids: idsDataFilter,
      totalElements: totalElementsSearch,
      pageSize: pageSizeSearch,
      pageNo: pageNoSearch,
      entities: searchEntities,
    } = searchData || {};

    const resultFound =searchData? totalElementsSearch : totalElements;

    content = (
      <div data-aos="fade-left">
        <SeoComponent title="User List" />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("list")}
          btnTitle={t("newUser")}
          onClick={handleAddNewClick}
        />
        <Card sx={{ ...cardStyle }}>
          <FilterBarComponent
            statusFilter={statusFilter}
            roleFetched={role}
            signUpMethodsFetched={signUpMethods}
            branchFetched={branchList}
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
            roleFetched={role}
            branchFetched={branchList}
            signUpMethodsFetched={signUpMethods}
            dispatch={dispatch}
            handleRoleChange={handleRoleChange}
            handleBranchChange={handleBranchChange}
            handleMethodChange={handleMethodChange}
            clearFilter={() => dispatch(clearFilter())}
            clearSearch={() => dispatch(setClearSearchQuery())}
            resultFound={resultFound}
            isFiltered={
              searchQuery !== "" ||
              roleFilter.length > 0 ||
              signUpMethodFilter.length > 0 ||
              statusFilter !== "" ||
              branchFilter.length > 0
            }
          />
          <UserTableComponent
            idsDataFilter={idsDataFilter}
            isFetchingGetUserFilter={isFetchingGetUserFilter}
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
            pageSizeFilter={pageSizeSearch}
            pageNoFilter={pageNoSearch}
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

import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import DataNotFound from "./DataNotFound";
import UserRowComponent from "./UserRowComponent";
import SkeletonTableRowComponent from "./SkeletonTableRowComponent.jsx";
import useTranslate from "../hook/useTranslate.jsx";

function UserTableComponent({
  idsDataFilter,
  isFetchingGetUserFilter,
  columns,
  users,
  searchData,
  searchQuery,
  roleFilter,
  signUpMethodFilter,
  statusFilter,
  branchFilter,
  pageSize,
  pageNo,
  totalElements,
  pageSizeFilter,
  pageNoFilter,
  totalElementsSearch,
  handleChangePage,
  handleChangeRowsPerPage,
  entities,
  searchEntities,
}) {
  const {t} = useTranslate();
  const tableContent =
    searchQuery !== "" ||
    roleFilter.length > 0 ||
    signUpMethodFilter.length > 0 ||
    branchFilter.length > 0 ||
    statusFilter !== "" ? (
      <>
        {searchData?.ids?.length ? (
          searchData.ids.map((userId) => (
            <UserRowComponent
              key={userId}
              userId={userId}
              user={searchEntities[userId]}
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
        {users?.ids?.length ? (
          users.ids.map((userId) => (
            <UserRowComponent
              key={userId}
              userId={userId}
              user={entities[userId]}
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
  const displayTotalElements =
    searchQuery !== "" ||
    roleFilter.length > 0 ||
    signUpMethodFilter.length > 0 ||
    statusFilter !== "" ||
    branchFilter.length > 0
      ? totalElementsSearch
      : totalElements;
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{ borderBottomStyle: "hidden", backgroundColor: "#F4F6F8" }}
                padding="checkbox"
              >
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
              {columns?.map((column) => (
                <TableCell
                  sx={{
                    borderBottomStyle: "hidden",
                    backgroundColor: "#F4F6F8",
                  }}
                  key={column?.id}
                  align={column?.align}
                  style={{ minWidth: column?.minWidth, color: "gray" }}
                >
                  {column?.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ border: "none" }}>
            {isFetchingGetUserFilter && idsDataFilter?.length === 0 ? (Array.from({length: pageSize}).map((_, index) => (
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
    </>
  );
}

export default UserTableComponent;

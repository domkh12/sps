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
import useTranslate from "../hook/useTranslate";

function UserTableComponent({
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
  pageSizeSearch,
  pageNoSearch,
  totalElementsSearch,
  dispatch,
  handleChangePage,
  handleChangeRowsPerPage,
  entities,
  searchEntities,
}) {
  const { t } = useTranslate();
  
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
              {columns?.map((column) => (
                <TableCell
                  key={column?.id}
                  align={column?.align}
                  style={{ minWidth: column?.minWidth, color: "gray" }}
                >
                  {column?.label}
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
        rowsPerPage={
          pageSizeSearch != null && pageSizeSearch !== 0
            ? pageSizeSearch
            : pageSize
        }
        page={
          pageNoSearch != null && pageNoSearch !== 0 ? pageNoSearch : pageNo
        }
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default UserTableComponent;

import {
  Box,
  Card,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MainHeaderComponent from "../../components/MainHeaderComponent";

import {
  cardStyle,
  listStyle,
} from "../../assets/style";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSignUpMethod } from "../../redux/feature/signUpMethod/signUpMethodApiSlice";
import SearchComponent from "../../components/SearchComponent";
import { BsFillPrinterFill, BsThreeDotsVertical } from "react-icons/bs";
import { selectAllRole } from "../../redux/feature/role/roleApiSlice";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { useGetUsersQuery } from "../../redux/feature/users/userApiSlice";
import UserRowComponent from "../../components/UserRowComponent";
import SelectComponent from "../../components/SelectComponent";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent";
import SeoComponent from "../../components/SeoComponent";

function UserList() {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const pageNo = useSelector((state) => state.users.pageNo);
  const uuid = useSelector((state) => state.users.uuid);
  const pageSize = useSelector((state) => state.users.pageSize);
  const status = useSelector((state) => state.users.status);

  const roleFetched = useSelector((state) => selectAllRole(state));
  const signUpMethodFetched = useSelector((state) =>
    selectAllSignUpMethod(state)
  );
  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetUsersQuery({ pageNo, pageSize });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const tabMapping = ["custom", "azure"];
    setActiveTab(tabMapping[newValue]);
  };

  const breadcrumbs = [
    <button
      className="text-black hover:underline"
      onClick={() => navitage("/dash")}
      key={1}
    >
      Dashboard
    </button>,
    <Typography color="inherit" key={2}>
      User
    </Typography>,
    <Typography color="inherit" key={3}>
      List
    </Typography>,
  ];

  const handleAddNewClick = () => {
    navigator("/dash/users/new");
  };

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
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 120,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "createdAt",
      label: "Created\u00a0At",
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

  const handleRoleChange = (role) => {
    console.log("selected dep", role);
  };

  console.log("before onchange method");
  const handleMethodChange = (method) => {
    console.log("selected method", method);
  };
  console.log("after onchange method");

  let content;

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (isError) {
    content = <p>Error: {error?.message}</p>;
  }

  if (isSuccess) {
    const { ids, totalElements, pageSize, pageNo } = users;
    console.log("pageNumber", pageNo);
    const tableContent = ids?.length
      ? ids.map((userId) => (
          <UserRowComponent
            key={userId}
            userId={userId}
            uuid={uuid}
            status={status}
            isActionButton={true}
          />
        ))
      : null;

    content = (
      <>
        <SeoComponent title="SPS - User Lists" />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={"List"}
          btnTitle={"New user"}
          onClick={handleAddNewClick}
        />
        <div>
          <Card sx={{ ...cardStyle }}>
            <div className="p-[20px] flex gap-[16px] flex-col xl:flex-row">
              <SelectComponent
                label="Role"
                labelId="role_label"
                id="role"
                options={roleFetched}
                onChange={handleRoleChange}
                nameKey={"name"}
                idKey={"id"}
              />
              <SelectComponent
                label="Sign Up Method"
                labelId="signUpMehod_label"
                id="sighUpMethod"
                options={signUpMethodFetched}
                onChange={handleMethodChange}
                nameKey={"name"}
                idKey={"id"}
              />
              <div className="flex items-center gap-3 w-full">
                <SearchComponent />
                <PopupState variant="popover" popupId="demo-popup-popover">
                  {(popupState) => (
                    <div>
                      <IconButton
                        aria-label="more_menu"
                        {...bindTrigger(popupState)}
                        size="small"
                        sx={{ width: "36px", height: "36px" }}
                      >
                        <BsThreeDotsVertical className="w-5 h-5" />
                      </IconButton>
                      <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "center",
                        }}
                        slotProps={{
                          paper: {
                            style: {
                              padding: 10,
                              backgroundColor: "transparent",
                              boxShadow: "none",
                            },
                          },
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "center",
                        }}
                      >
                        <List
                          component="div"
                          disablePadding
                          dense={true}
                          sx={{
                            ...listStyle,
                          }}
                        >
                          <ListItemButton
                            sx={{
                              borderRadius: "6px",
                              color: "#424242",
                            }}
                          >
                            <ListItemText
                              primary={
                                <div className="flex items-center gap-3">
                                  <BsFillPrinterFill className="w-5 h-5" />
                                  <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{
                                      color: "#424242",
                                      display: "inline",
                                    }}
                                  >
                                    Print
                                  </Typography>
                                </div>
                              }
                            />
                          </ListItemButton>
                        </List>
                      </Popover>
                    </div>
                  )}
                </PopupState>
              </div>
            </div>

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
              count={totalElements}
              rowsPerPage={pageSize}
              page={pageNo}
              // onPageChange={handleChangePage}
              // onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </div>
        {/* <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", paddingX: "2rem" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="tabs"
              TabIndicatorProps={{
                sx: {
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  backgroundColor: "#111827",
                  padding: "0px",
                },
              }}
            >
              <Tab
                label="Custom"
                sx={{
                  textTransform: "none",
                  color: "#4b5563",
                  "&.Mui-selected": {
                    color: "#111827",
                  },
                  padding: "0px",
                  minWidth: 0,
                  marginRight: "2rem",
                }}
                disableRipple
              />
              <Tab
                label="Azure"
                sx={{
                  textTransform: "none",
                  color: "#4b5563",
                  "&.Mui-selected": {
                    color: "#111827",
                  },
                  padding: "0px",
                  minWidth: 0,
                  marginRight: "2rem",
                }}
                disableRipple
              />
            </Tabs>
          </Box>
        </Box>
        <div>
          <Outlet />
        </div> */}
      </>
    );
  }
  return content;
}

export default UserList;

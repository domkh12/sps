import {
  Card,
  Checkbox,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import SeoComponent from "../../components/SeoComponent";
import { useNavigate } from "react-router-dom";
import MainHeaderComponent from "../../components/MainHeaderComponent";
import SelectComponent from "../../components/SelectComponent";
import SearchComponent from "../../components/SearchComponent";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";
import { BsFillPrinterFill, BsThreeDotsVertical } from "react-icons/bs";
import { cardStyle, listStyle } from "../../assets/style";
import useAuth from "../../hook/useAuth";
import useTranslate from "../../hook/useTranslate";
import { useSelector } from "react-redux";
import { useGetSitesQuery } from "../../redux/feature/site/siteApiSlice";
import BranchRowComponent from "../../components/BranchRowComponent";
import { useCallback, useRef, useState } from "react";

function BranchList() {
  const navigate = useNavigate();
  const { isManager } = useAuth();
  const { t } = useTranslate();
  const pageNo = useSelector((state) => state.companies.pageNo);
  const pageSize = useSelector((state) => state.companies.pageSize);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeout = useRef(null);
  console.log("searchTerm", searchTerm);

  const {
    data: sites,
    isSuccess,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetSitesQuery("sitesList", {
    pageNo,
    pageSize,
    searchTerm,
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
      minWidth: 120,
      align: "left",
    },
    {
      id: "branchType",
      label: t("branchType"),
      minWidth: 100,
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
      minWidth: 230,
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

  const handleAddNewClick = () => {
    navigate("/dash/branch/new");
  };

  const handleSearchChange = useCallback((value) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setSearchTerm(value);
      // refetch();
    }, 500);
  }, []);

  let content;

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (isError) {
    content = <p>Error: {error?.message}</p>;
  }

  if (isSuccess) {
    const { ids, totalElements, pageSize, pageNo } = sites;
    cardStyle;
    const tableContent = ids?.length
      ? ids.map((siteId) => <BranchRowComponent key={siteId} siteId={siteId} />)
      : null;
    content = (
      <div data-aos="fade-left">
        <SeoComponent title="Company List" />
        <MainHeaderComponent
          breadcrumbs={breadcrumbs}
          title={t("list")}
          btnTitle={t("newBranch")}
          onClick={handleAddNewClick}
        />

        <div>
          <Card sx={{ ...cardStyle }}>
            <div className="p-[20px] flex gap-[16px] flex-col xl:flex-row">
              <SelectComponent
                label={t("company")}
                labelId="company_label"
                id="company"
                // options={companyNames.data}
                // onChange={handleRoleChange}
                optionLabelKey="companyName"
              />

              <SelectComponent
                label={t("city")}
                labelId="city_label"
                id="city"
                // options={companyNames.data}
                // onChange={handleRoleChange}
                optionLabelKey="companyName"
              />

              <div className="flex items-center gap-3 w-full">
                <SearchComponent onSearchChange={handleSearchChange} />
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
            {/* <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalElements}
              rowsPerPage={pageSize}
              page={pageNo}
              // onPageChange={handleChangePage}
              // onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
          </Card>
        </div>
      </div>
    );
  }

  return content;
}

export default BranchList;

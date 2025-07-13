import {
  Avatar,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import EditButtonComponent from "./EditButtonComponent";
import MoreActionComponent from "./MoreActionComponent";
import { FaEye, FaPen, FaTrashCan } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { memo } from "react";
import { useGetSitesQuery } from "../redux/feature/site/siteApiSlice";
import { useDispatch } from "react-redux";
import {
  setBranchForQuickEdit,
  setIdSiteToDelete,
  setIsQuickEditBranchOpen,
} from "../redux/feature/site/siteSlice";
import useDateFormatter from "../hook/useDateFormatter";
import { setIsOpenConfirmDelete } from "../redux/feature/actions/actionSlice";
import {
  setCompanyDataForQuickEdit,
  setIdCompanyToDelete,
  setIsQuickEditCompanyOpen
} from "../redux/feature/company/companySlice.js";
import useTranslate from "../hook/useTranslate.jsx";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  if (!name || typeof name !== "string" || name.trim() === "") {
    return {
      sx: {
        bgcolor: "#9E9E9E",
      },
      children: "?",
    };
  }
  const parts = name.trim().split(" ");
  let initials = "";

  if (parts.length >= 2) {
    initials = `${parts[0][0]}${parts[1][0]}`;
  } else if (parts.length === 1) {
    initials = parts[0].slice(0, 2);
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials,
  };
}

function CompanyRowComponent({companyId, company }) {
  const { t } = useTranslate();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (company) {

    const handleDelete = () => {
      dispatch(setIsOpenConfirmDelete(true));
      dispatch(setIdCompanyToDelete(companyId));
    };
    var handleEdit = () => navigate(`/admin/companies/${companyId}`);
    var handleView = () => navigate(`/admin/companies/${companyId}/view`);

    var menuActions = [
      {
        label: t('edit'),
        icon: <FaPen className="w-5 h-5" />,
        onClick: handleEdit,
      },
      {
        label: t('view'),
        icon: <FaEye className="w-5 h-5" />,
        onClick: handleView,
      },
      {
        label: t('delete'),
        icon: <FaTrashCan className="w-5 h-5" />,
        onClick: handleDelete,
        textColor: "red",
        buttonColor: "red",
      },
    ];

    return (
      <TableRow hover>
        <TableCell padding="checkbox" sx={{ borderBottomStyle: "dashed" }}>
          <Checkbox color="primary" />
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          <List sx={{ padding: "0" }}>
            <ListItem sx={{ padding: "0", gap: "10px" }}>
              <Avatar
                alt={company?.companyName}
                src={company?.image}
                {...stringAvatar(company?.companyName)}
                sx={{
                  "& .MuiAvatar-img": {
                    objectFit: "contain",
                  },
                }}
              />
              <ListItemText
                primary={
                  (
                    <Link className="hover:underline" to={`/admin/companies/${companyId}/view`}>
                      {company?.companyName}
                    </Link>
                  ) || "N/A"
                }
              />
            </ListItem>
          </List>
        </TableCell>

          <TableCell sx={{ borderBottomStyle: "dashed" }}>
          {company?.companyType?.name || "N/A"}
          </TableCell>

          <TableCell sx={{ borderBottomStyle: "dashed" }}>
          {company?.siteQty}
          </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          {company?.establishedDate || "N/A"}
        </TableCell>

          <TableCell sx={{ borderBottomStyle: "dashed" }}>
          {company?.city?.name || "N/A"}
          </TableCell>

          <TableCell sx={{ borderBottomStyle: "dashed" }}>
          {company?.companyAddress || "N/A"}
          </TableCell>

        <TableCell sx={{borderBottomStyle: "dashed"}}>
          <Typography variant="body1">
            {company?.createdAt.substring(
                0,
                company?.createdAt.lastIndexOf(" ")
            )}
          </Typography>
          <Typography variant="body2" color="gray">
            {company?.createdAt.substring(
                company?.createdAt.lastIndexOf(" "),
                company?.createdAt.length
            )}
          </Typography>
        </TableCell>

        <TableCell
          sx={{
            borderBottomStyle: "dashed",
            pr: 3,
          }}
        >
          <div className="flex justify-center items-center">
            <EditButtonComponent
              handleQuickEdit={() => {
                dispatch(setIsQuickEditCompanyOpen(true));
                dispatch(setCompanyDataForQuickEdit(company));
              }}
            />
            <MoreActionComponent menuItems={menuActions} />
          </div>
        </TableCell>
      </TableRow>
    );
  } else {
    return null;
  }
}

const memoizedCompanyRow = memo(CompanyRowComponent);

export default memoizedCompanyRow;

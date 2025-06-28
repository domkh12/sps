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

function BranchRowComponent({ siteId, site }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (site) {
    const dateObj = new Date(site.createdAt);
    var { formattedDateDDMMYYYYNoZeros } = useDateFormatter(
      new Date(site.createdAt)
    );
    var formattedTime = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const handleDelete = () => {
      dispatch(setIsOpenConfirmDelete(true));
      dispatch(setIdSiteToDelete(site.uuid));
    };
    var handleEdit = () => navigate(`/dash/branches/${siteId}`);
    var handleView = () => navigate(`/dash/branches/${siteId}/view`);

    var menuActions = [
      {
        label: "Edit",
        icon: <FaPen className="w-5 h-5" />,
        onClick: handleEdit,
      },
      {
        label: "View",
        icon: <FaEye className="w-5 h-5" />,
        onClick: handleView,
      },
      {
        label: "Delete",
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
                alt={site?.siteName || "N/A"}
                src={site?.image}
                {...stringAvatar(site?.siteName || "N/A")}
                sx={{
                  "& .MuiAvatar-img": {
                    objectFit: "contain",
                  },
                }}
              />
              <ListItemText
                primary={
                  (
                    <Link className="hover:underline" to={`/dash/branches/${siteId}/view`}>
                      {site?.siteName || "N/A"}
                    </Link>
                  ) || "N/A"
                }
              />
            </ListItem>
          </List>
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          {site.company?.companyName || "N/A"}
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          {site.parkingSpacesQty}
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          {site.siteType?.name || "N/A"}
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          {site.city?.name || "N/A"}
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          {site?.siteAddress || "N/A"}
        </TableCell>

        <TableCell sx={{ borderBottomStyle: "dashed" }}>
          <Typography variant="body1">
            {formattedDateDDMMYYYYNoZeros}
          </Typography>
          <Typography variant="body2" color="gray">
            {formattedTime}
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
                dispatch(setIsQuickEditBranchOpen(true));
                dispatch(setBranchForQuickEdit(site));
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

const memoizedBranchRow = memo(BranchRowComponent);

export default memoizedBranchRow;

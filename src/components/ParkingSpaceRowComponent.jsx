import React, {memo} from "react";
import {useGetParkingSpacesQuery} from "../redux/feature/parking/parkingApiSlice";
import {FaEye, FaPen, FaTrashCan} from "react-icons/fa6";
import {
    Checkbox,
    List,
    ListItem,
    ListItemText,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import EditButtonComponent from "./EditButtonComponent";
import MoreActionComponent from "./MoreActionComponent";
import CustomizedProgressBarsComponent from "./CustomizedProgressBarsComponent";
import {setIsOpenConfirmDelete} from "../redux/feature/actions/actionSlice";
import {useDispatch} from "react-redux";
import {
    setIdParkingToDelete,
    setIsOpenQuickEditParkingSpace,
    setParkingSpaceToEdit,
} from "../redux/feature/parking/parkingSlice";
import useAuth from "../hook/useAuth";
import useDateFormatter from "../hook/useDateFormatter";

function ParkingSpaceRowComponent({parkingId, parkingSpace}) {
    const dispatch = useDispatch();
    const {isManager} = useAuth();
    const navigate = useNavigate();

    const handleQuickEdit = () => {
        dispatch(setIsOpenQuickEditParkingSpace(true));
        dispatch(setParkingSpaceToEdit(parkingSpace));
    };

    if (parkingSpace) {
        var handleEdit = () => navigate(`/dash/parking-spaces/${parkingId}`);
        var handleView = () => navigate(`/dash/parking-spaces/${parkingId}/view`);
        const handleDelete = () => {
            dispatch(setIsOpenConfirmDelete(true));
            dispatch(setIdParkingToDelete(parkingSpace.uuid));
        };

        var menuActions = [
             {
                    label: "Edit",
                    icon: <FaPen className="w-5 h-5"/>,
                    onClick: handleEdit,
             },
            {
                label: "View",
                icon: <FaEye className="w-5 h-5"/>,
                onClick: handleView,
            },
            {
                    label: "Delete",
                    icon: <FaTrashCan className="w-5 h-5"/>,
                    onClick: handleDelete,
                    textColor: "red",
                    buttonColor: "red",
            },
        ].filter(Boolean);

        return (
            <TableRow hover>
                <TableCell padding="checkbox" sx={{borderBottomStyle: "dashed"}}>
                    <Checkbox color="primary"/>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <List sx={{padding: "0"}}>
                        <ListItem sx={{padding: "0", gap: "10px"}}>
                            <div className="w-32 h-20 rounded-[12px] overflow-hidden">
                                <img
                                    src={parkingSpace?.image || "/images/imagePlaceholder.jpg"}
                                    alt="car_image"
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                            <ListItemText
                                primary={
                                    (
                                        <Link
                                            className="hover:underline"
                                            to={`/dash/vehicles/${parkingId}/view`}
                                        >
                                            {parkingSpace.label}
                                        </Link>
                                    ) || "N/A"
                                }
                            />
                        </ListItem>
                    </List>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">{parkingSpace.site.siteName}</Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">{parkingSpace.lotQty}</Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <div>
                        <CustomizedProgressBarsComponent value={parkingSpace.filled}/>
                        <Typography variant="body1" className="text-center" color="gray">
                            {`${parkingSpace.filled} Free`}
                        </Typography>
                    </div>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {parkingSpace.createdAt.substring(
                            0,
                            parkingSpace.createdAt.lastIndexOf(" ")
                        )}
                    </Typography>
                    <Typography variant="body2" color="gray">
                        {parkingSpace.createdAt.substring(
                            parkingSpace.createdAt.lastIndexOf(" "),
                            parkingSpace.createdAt.length
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
                        <EditButtonComponent handleQuickEdit={handleQuickEdit}/>
                        <MoreActionComponent menuItems={menuActions}/>
                    </div>
                </TableCell>
            </TableRow>
        );
    } else {
        return null;
    }
}

const memoizedParkingSpaceRow = memo(ParkingSpaceRowComponent);

export default memoizedParkingSpaceRow;

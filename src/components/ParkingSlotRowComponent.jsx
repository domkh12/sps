import {memo} from "react";
import {FaEye, FaPen, FaTrashCan} from "react-icons/fa6";
import {
    Checkbox, Chip, IconButton,
    List,
    ListItem,
    ListItemText,
    TableCell,
    TableRow, Tooltip,
    Typography,
} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import EditButtonComponent from "./EditButtonComponent";
import MoreActionComponent from "./MoreActionComponent";
import {setIsOpenConfirmDelete} from "../redux/feature/actions/actionSlice";
import {useDispatch} from "react-redux";
import useTranslate from "../hook/useTranslate.jsx";
import {
    setIdParkingSlotToDelete,
    setIsOpenQuickEditSlot,
    setParkingSlotToEdit
} from "../redux/feature/slot/slotSlice.js";
import useAuth from "../hook/useAuth.jsx";

function ParkingSlotRowComponent({parkingSlotId, parkingSlot}) {
    const {isAdmin} = useAuth();
    const dispatch = useDispatch();
    const {t} = useTranslate();
    const navigate = useNavigate();

    const handleQuickEdit = () => {
        dispatch(setIsOpenQuickEditSlot(true));
        dispatch(setParkingSlotToEdit(parkingSlot));
    };

    if (parkingSlot) {
        var handleEdit = () => navigate(`/${isAdmin ? "admin" : "dash"}/parking-slots/${parkingSlotId}`);
        var handleView = () => navigate(`/${isAdmin ? "admin" : "dash"}/parking-slots/${parkingSlotId}/view`);
        const handleDelete = () => {
            dispatch(setIsOpenConfirmDelete(true));
            dispatch(setIdParkingSlotToDelete(parkingSlot?.uuid));
        };

        var menuActions = [
            {
                label: t('edit'),
                icon: <FaPen className="w-5 h-5"/>,
                onClick: handleEdit,
            },
            {
                label: t('view'),
                icon: <FaEye className="w-5 h-5"/>,
                onClick: handleView,
            },
            {
                label: t('delete'),
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
                                    src={parkingSlot?.image || "/images/imagePlaceholder.jpg"}
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
                                            to={`/${isAdmin ? "admin" : "dash"}/parking-slots/${parkingSlotId}/view`}
                                        >
                                            {parkingSlot?.lotName || "N/A"}
                                        </Link>
                                    ) || "N/A"
                                }
                            />
                        </ListItem>
                    </List>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">{parkingSlot?.parkingSpace?.label || "N/A"}</Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Chip
                        color={parkingSlot?.isAvailable ? "success" : "error"}
                        label={`${parkingSlot?.isAvailable ? "Available" : "Occupied"}`}
                    />
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {parkingSlot?.createdAt?.substring(
                            0,
                            parkingSlot.createdAt?.lastIndexOf(" ")
                        )}
                    </Typography>
                    <Typography variant="body2" color="gray">
                        {parkingSlot?.createdAt?.substring(
                            parkingSlot?.createdAt.lastIndexOf(" "),
                            parkingSlot?.createdAt.length
                        )}
                    </Typography>
                </TableCell>

                <TableCell
                    sx={{
                        borderBottomStyle: "dashed",
                        pr: 3,
                    }}
                >

                    {
                        isAdmin ?
                            <div className="flex justify-center items-center">
                                <EditButtonComponent handleQuickEdit={handleQuickEdit}/>
                                <MoreActionComponent menuItems={menuActions}/>
                            </div>
                            :
                            <Tooltip
                                sx={{
                                    color: "",
                                }}
                                title={t('view')}
                                placement="top"
                                arrow
                            >
                                <IconButton size="large" onClick={handleView} sx={{
                                    backgroundColor: "transparent",
                                    "&:hover": {backgroundColor: "transparent"}
                                }}>
                                    <FaEye className="w-6 h-6"/>
                                </IconButton>
                            </Tooltip>
                    }
                </TableCell>
            </TableRow>
        );
    } else {
        return null;
    }
}

const memoizedParkingSlotRow = memo(ParkingSlotRowComponent);

export default memoizedParkingSlotRow;

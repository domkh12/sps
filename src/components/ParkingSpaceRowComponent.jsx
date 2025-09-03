import {memo} from "react";
import {FaEye, FaPen, FaTrashCan} from "react-icons/fa6";
import {
    Checkbox, IconButton,
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
import CustomizedProgressBarsComponent from "./CustomizedProgressBarsComponent";
import {setIsOpenConfirmDelete} from "../redux/feature/actions/actionSlice";
import {useDispatch} from "react-redux";
import {
    setIdParkingSpaceToDelete,
    setIsOpenQuickEditParkingSpace,
    setParkingSpaceToEdit,
} from "../redux/feature/parking/parkingSlice";
import useTranslate from "../hook/useTranslate.jsx";
import useAuth from "../hook/useAuth.jsx";

function ParkingSpaceRowComponent({parkingId, parkingSpace}) {
    const dispatch = useDispatch();
    const {t} = useTranslate();
    const navigate = useNavigate();
    const {isAdmin} = useAuth();

    const handleQuickEdit = () => {
        dispatch(setIsOpenQuickEditParkingSpace(true));
        dispatch(setParkingSpaceToEdit(parkingSpace));
    };

    if (parkingSpace) {
        var handleEdit = () => navigate(`/${isAdmin ? "admin" : "dash"}/parking-spaces/${parkingId}`);
        var handleView = () => navigate(`/${isAdmin ? "admin" : "dash"}/parking-spaces/${parkingId}/view`);
        const handleDelete = () => {
            dispatch(setIsOpenConfirmDelete(true));
            dispatch(setIdParkingSpaceToDelete(parkingSpace.uuid));
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
                                            to={`/${isAdmin ? "admin" : "dash"}/parking-spaces/${parkingId}/view`}
                                        >
                                            {parkingSpace?.label || "N/A"}
                                        </Link>
                                    ) || "N/A"
                                }
                            />
                        </ListItem>
                    </List>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">{parkingSpace?.site?.siteName || "N/A"}</Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">{parkingSpace?.lotQty}</Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <div>
                        <CustomizedProgressBarsComponent value={(parkingSpace?.filled * 100)/parkingSpace.lotQty}/>
                        <Typography variant="body1" className="text-center" color="gray">
                            {`${parkingSpace?.empty} Free`}
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

const memoizedParkingSpaceRow = memo(ParkingSpaceRowComponent);

export default memoizedParkingSpaceRow;

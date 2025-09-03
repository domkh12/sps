import {TableCell, TableRow, Typography} from "@mui/material";

function ParkingReportRowComponent({parking}){
    if (parking) {
        return (
            <TableRow hover>
                <TableCell padding="checkbox" sx={{borderBottomStyle: "dashed"}}>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {parking?.numberPlate || "N/A"}
                    </Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {parking?.llpName || "N/A"}
                    </Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {parking?.owner || "N/A"}
                    </Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {parking?.duration || "N/A"}
                    </Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {parking?.spaceName || "N/A"}
                    </Typography>
                </TableCell>

            </TableRow>
        )
    } else {
        return null;
    }

}

export default ParkingReportRowComponent;
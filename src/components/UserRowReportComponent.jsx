import React, {memo} from 'react'
import {TableCell, TableRow, Typography} from '@mui/material';
import {Checkbox} from '@mui/material';

function UserRowReportComponent({user}) {

    if (user) {
        return (
            <TableRow hover>
                <TableCell padding="checkbox" sx={{borderBottomStyle: "dashed"}}>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {user?.fullName || "N/A"}
                    </Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {user?.gender?.gender || "N/A"}
                    </Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {user?.dateOfBirth || "N/A"}
                    </Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {user?.email || "N/A"}
                    </Typography>
                </TableCell>

                <TableCell sx={{borderBottomStyle: "dashed"}}>
                    <Typography variant="body1">
                        {user?.phoneNumber || "N/A"}
                    </Typography>
                </TableCell>


            </TableRow>
        )
    } else {
        return null;
    }

}


const memoizedUserReportRow = memo(UserRowReportComponent);
export default memoizedUserReportRow;
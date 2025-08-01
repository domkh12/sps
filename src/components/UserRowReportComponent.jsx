import React, { memo } from 'react'
import { TableCell, TableRow, Typography } from '@mui/material';
import { Checkbox } from '@mui/material';

function UserRowReportComponent({user}) {
    console.log({user})
    if(user){
        return (
            <TableRow hover>
              <TableCell padding="checkbox" sx={{ borderBottomStyle: "dashed" }}>
                <Checkbox color="primary" />
              </TableCell>                   
        
              <TableCell sx={{ borderBottomStyle: "dashed" }}>
                <Typography variant="body1">
                  {user?.fullName || "N/A"}
                </Typography>                
              </TableCell>

            <TableCell sx={{ borderBottomStyle: "dashed" }}>
                <Typography variant="body1">
                  {user?.gender?.gender || "N/A"}
                </Typography>
            </TableCell>

            <TableCell sx={{ borderBottomStyle: "dashed" }}>
                <Typography variant="body1">
                    {user?.dateOfBirth || "N/A"}
                </Typography>
            </TableCell>

            <TableCell sx={{ borderBottomStyle: "dashed" }}>
                <Typography variant="body1">
                    {user?.phoneNumber || "N/A"}
                </Typography>
            </TableCell>

            <TableCell sx={{ borderBottomStyle: "dashed" }}>
                <Typography variant="body1">
                    {user?.email || "N/A"}
                </Typography>
            </TableCell>

            <TableCell sx={{ borderBottomStyle: "dashed" }}>
                <Typography variant="body1">
                    {user?.signUpMethod?.name || "N/A"}
                </Typography>
            </TableCell>

            <TableCell sx={{ borderBottomStyle: "dashed" }}>
                <Typography variant="body1">
                    {user?.status || "N/A"}
                </Typography>
            </TableCell>

            <TableCell sx={{ borderBottomStyle: "dashed" }}>
                <Typography variant="body1">
                    {user?.sites?.length > 0 ? user?.sites?.map((site) => site?.siteName).join(", ") : "N/A"}
                </Typography>
            </TableCell>

            <TableCell sx={{ borderBottomStyle: "dashed" }}>
                <Typography variant="body1">
                    {user?.createdAt || "N/A"}
                </Typography>
            </TableCell>

            </TableRow>
          )
    }else{
        return null;
    }
  
}

  
const memoizedUserReportRow = memo(UserRowReportComponent);
export default memoizedUserReportRow;
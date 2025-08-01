import React, { memo } from 'react'
import useTranslate from '../hook/useTranslate';
import useAuth from '../hook/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Checkbox, List, ListItem, ListItemText, TableCell, TableRow, Typography } from '@mui/material';

function VehicleRowReportComponent({vehicleId, vehicle}) {
  
    if (vehicle) {

      return (
        <TableRow hover>
          <TableCell padding="checkbox" sx={{ borderBottomStyle: "dashed" }}>
            <Checkbox color="primary" />
          </TableCell>                   
  
          <TableCell sx={{ borderBottomStyle: "dashed" }}>
            <Typography variant="body1">
              {vehicle?.numberPlate || "N/A"}
            </Typography>
          </TableCell>

          <TableCell sx={{ borderBottomStyle: "dashed" }}>
            <Typography variant="body1">
              {vehicle?.licensePlateProvince?.provinceNameKh || "N/A"}
            </Typography>
          </TableCell>

          <TableCell sx={{ borderBottomStyle: "dashed" }}>
            <Typography variant="body1">
              {vehicle?.licensePlateProvince?.provinceNameEn || "N/A"}
            </Typography>
          </TableCell>

          <TableCell sx={{ borderBottomStyle: "dashed" }}>
            <Typography variant="body1">
              {vehicle?.user?.fullName || "N/A"}
            </Typography>
          </TableCell>

          <TableCell sx={{ borderBottomStyle: "dashed" }}>
            <Typography variant="body1">
              {vehicle?.vehicleModel || "N/A"}
            </Typography>
          </TableCell>

          <TableCell sx={{ borderBottomStyle: "dashed" }}>
            <Typography variant="body1">
              {vehicle?.vehicleMake || "N/A"}
            </Typography>
          </TableCell>
  
          <TableCell sx={{ borderBottomStyle: "dashed" }}>
            <Typography variant="body1">
              {vehicle?.vehicleType?.name || "N/A"}
            </Typography>
          </TableCell>
  
          <TableCell sx={{ borderBottomStyle: "dashed" }}>                        
              <Typography variant="body1">{vehicle?.color || "N/A"}</Typography>            
          </TableCell>
  
          <TableCell sx={{borderBottomStyle: "dashed"}}>
            <Typography variant="body1">
              {vehicle.createdAt.substring(
                  0,
                  vehicle.createdAt.lastIndexOf(" ")
              )}
            </Typography>
            <Typography variant="body2" color="gray">
              {vehicle.createdAt.substring(
                  vehicle.createdAt.lastIndexOf(" "),
                  vehicle.createdAt.length
              )}
            </Typography>
          </TableCell>
        
        </TableRow>
      );
    } else {
      return null;
    }
  }
  
  const memoizedVehicleReportRow = memo(VehicleRowReportComponent);
  export default memoizedVehicleReportRow;
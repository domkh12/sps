import {
    TableCell,
    TableRow,
} from "@mui/material";
import { memo } from "react";

function ClientInfoRowComponent({ clientInfo }) {

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";

        try {
            const date = new Date(dateString);

            // Check if date is valid
            if (isNaN(date.getTime())) return "N/A";

            // Format time (02:20 PM)
            const timeOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            const timeString = date.toLocaleTimeString('en-US', timeOptions);

            // Format date (Feb 6, 2025)
            const dateOptions = {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            };
            const dateStringFormatted = date.toLocaleDateString('en-US', dateOptions);

            return `${timeString} ${dateStringFormatted}`;
        } catch (error) {
            return "N/A";
        }
    };

    if (clientInfo) {

        return (
            <TableRow hover>

                <TableCell sx={{ borderBottomStyle: "dashed" }}>
                    {clientInfo?.loginType || "N/A"} <br/>
                    {formatDate(clientInfo?.createdAt) || "N/A"}
                </TableCell>

                <TableCell sx={{ borderBottomStyle: "dashed" }}>
                    {clientInfo?.ipAddress}
                </TableCell>

                <TableCell sx={{ borderBottomStyle: "dashed" }}>
                    {clientInfo?.browser || "N/A"}, {clientInfo?.operatingSystem || "N/A"}
                </TableCell>
            </TableRow>
        );
    } else {
        return null;
    }
}

const memoizedClientInfoRow = memo(ClientInfoRowComponent);

export default memoizedClientInfoRow;

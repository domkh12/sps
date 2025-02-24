// hooks/useFormatDate.js
import { useMemo } from "react";

const useFormatDate = () => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle cases where dateString is undefined or null

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A"; // Handle invalid date strings

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return formatDate;
};

export default useFormatDate;

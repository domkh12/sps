import React, { useCallback, useEffect, useState } from "react";

function useDateFormatter(initialDate) {
  const [date, setDate] = useState(
    initialDate ? new Date(initialDate) : new Date()
  );
  const [formattedDateDDMMYYYY, setFormattedDateDDMMYYYY] = useState("");
  const [formattedDateDDMMYYYYNoZeros, setFormattedDateDDMMYYYYNoZeros] =
    useState("");
  const [formattedDateUK, setFormattedDateUK] = useState("");
  const [formattedTime12Hour, setFormattedTime12Hour] = useState("");
  const [dateFnsFormatted, setDateFnsFormatted] = useState(""); // For date-fns
  const [dateFnsError, setDateFnsError] = useState(null); // For date-fns errors

  // Helper functions (made useCallback for performance - prevents unnecessary re-renders)
  const formatDateToDDMMYYYY = useCallback((d) => {
    if (!(d instanceof Date) || isNaN(d)) {
      return "Invalid Date";
    }
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }, []);

  const formatDateToDDMMYYYYNoLeadingZeros = useCallback((d) => {
    if (!(d instanceof Date) || isNaN(d)) {
      return "Invalid Date";
    }
    const day = d.getDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames[d.getMonth()]; // Get month name
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }, []);

  const formatDateToUKFormat = useCallback((d) => {
    if (!(d instanceof Date) || isNaN(d)) {
      return "Invalid Date";
    }
    return d.toLocaleDateString("en-GB");
  }, []);

  const formatTimeTo12HourFunc = useCallback((d) => {
    // Renamed for clarity
    if (!(d instanceof Date) || isNaN(d)) {
      return "Invalid Date";
    }
    return d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }, []);

  const formatDateWithDateFns = useCallback((d, formatString) => {
    if (!(d instanceof Date) || isNaN(d)) {
      return "Invalid Date";
    }
    try {
      const { format } = require("date-fns"); // or import { format } from 'date-fns'; at the top, if using modules.
      return format(d, formatString);
    } catch (error) {
      if (error.code === "MODULE_NOT_FOUND") {
        setDateFnsError(
          "date-fns is not installed.  Run 'npm install date-fns'."
        );
      } else {
        setDateFnsError(`Error formatting with date-fns: ${error.message}`);
      }
      return ""; // Or some default value on error
    }
  }, []);

  // useEffect to update formatted dates whenever the 'date' state changes
  useEffect(() => {
    if (date && date instanceof Date && !isNaN(date)) {
      // Input validation
      setFormattedDateDDMMYYYY(formatDateToDDMMYYYY(date));
      setFormattedDateDDMMYYYYNoZeros(formatDateToDDMMYYYYNoLeadingZeros(date));
      setFormattedDateUK(formatDateToUKFormat(date));
      setFormattedTime12Hour(formatTimeTo12HourFunc(date)); // Use the renamed function
    } else {
      // Handle invalid date case (e.g., set all formatted strings to "Invalid Date")
      setFormattedDateDDMMYYYY("Invalid Date");
      setFormattedDateDDMMYYYYNoZeros("Invalid Date");
      setFormattedDateUK("Invalid Date");
      setFormattedTime12Hour("Invalid Date");
    }
  }, [
    date,
    formatDateToDDMMYYYY,
    formatDateToDDMMYYYYNoLeadingZeros,
    formatDateToUKFormat,
    formatTimeTo12HourFunc,
  ]);

  // Function to update the date (optional, but useful)
  const updateDate = (newDate) => {
    setDate(new Date(newDate)); // Ensure it's a Date object
  };

  const formatDateWithFns = (formatString) => {
    setDateFnsError(null); // Clear previous errors
    setDateFnsFormatted(formatDateWithDateFns(date, formatString));
  };

  return {
    formattedDateDDMMYYYY,
    formattedDateDDMMYYYYNoZeros,
    formattedDateUK,
    formattedTime12Hour,
    dateFnsFormatted, // date-fns formatted date
    dateFnsError, // date-fns error
    formatDateWithFns, // Function *to* format with date-fns
    updateDate,
    date, //exposing the raw date
  };
}

export default useDateFormatter;

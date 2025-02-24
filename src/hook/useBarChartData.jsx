import { useState, useEffect } from "react";

function useBarChartData() {
  const [lastSixHours, setLastSixHours] = useState([]);
  const last6Hours = () => {
    const now = new Date();
    const hours = [];

    for (let i = 5; i >= 0; i--) {
      const pastHour = new Date(now.getTime() - i * 60 * 60 * 1000);
      hours.push(pastHour.toLocaleTimeString("en-us", { hour: "2-digit" }));
    }
    return hours;
  };

  useEffect(() => {
    setLastSixHours(last6Hours());
  }, []);

  const seriesData = [
    { label: "IN", data: [1, 6, 3, 4, 5, 1], color: "#2C3092" },
    { label: "OUT", data: [2, 5, 6, 4, 6, 18], color: "#ff8a4c" },
  ];

  return { lastSixHours, seriesData };
}

export default useBarChartData;

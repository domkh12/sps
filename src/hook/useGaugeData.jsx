// useGaugeData.js
import { useState, useEffect } from "react";

function useGaugeData(parkingData) {
  const [valueGauge, setValueGauge] = useState(0);
  const [valueColor, setValueColor] = useState("#2C3092");

  const calculateColor = (percentage) => {
    if (percentage >= 90) {
      return "#FF0000";
    } else if (percentage >= 70) {
      return "#FFC107";
    } else {
      return "#2C3092";
    }
  };

  useEffect(() => {
    if (parkingData) {
      const totalSlots = parkingData.filled + parkingData.empty;
      let filledPercentage =
        totalSlots > 0 ? (parkingData.filled / totalSlots) * 100 : 0;

      filledPercentage = Math.round(filledPercentage);
      setValueGauge(filledPercentage);
      setValueColor(calculateColor(filledPercentage));
    }
  }, [parkingData]);

  return { valueGauge, valueColor };
}

export default useGaugeData;

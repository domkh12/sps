import React, { useEffect } from "react";
import ColumnChart from "../../components/dashboard/ColumnChart";
import PieChart from "../../components/dashboard/PieChart";
import AreaChartProfits from "../../components/dashboard/AreaChartProfits";
import AreaVehicles from "../../components/dashboard/AreaVehicles";
import HeatMap from "../../components/dashboard/HeatMap";
import ParkingMap from "../../components/dashboard/ParkingMap";
import { useDispatch, useSelector } from "react-redux";

function Dashboard() {

  const uuid = useSelector(state => state.users.uuid)
  const token = useSelector((state) => state.auth.token);
  return (
    <div className="grid grid-cols-1 gap-4">
      <AreaChartProfits />
      <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
        <ColumnChart />
        <AreaVehicles />
        <PieChart />
      </div>
      <HeatMap />
      <ParkingMap />
    </div>
  );
}

export default Dashboard;

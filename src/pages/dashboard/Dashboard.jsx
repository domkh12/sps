import React, { useEffect } from "react";
import ColumnChart from "../../components/dashboard/ColumnChart";
import PieChart from "../../components/dashboard/PieChart";
import AreaChartProfits from "../../components/dashboard/AreaChartProfits";
import AreaVehicles from "../../components/dashboard/AreaVehicles";
import HeatMap from "../../components/dashboard/HeatMap";
import ParkingMap from "../../components/dashboard/ParkingMap";
import { useDispatch, useSelector } from "react-redux";
import { useConnectedUserMutation, useFindByUuidMutation } from "../../redux/feature/users/userApiSlice";

function Dashboard() {

  const uuid = useSelector(state => state.users.uuid)
  const token = useSelector((state) => state.auth.token);

  const [findByUuid, {
    data: user,
    isLoading,
    isSuccess,
    isError,
    error
  }]= useFindByUuidMutation()

  useEffect(() => {
    const fetchUser = async () => {
      await findByUuid( uuid );      
    };
    fetchUser();
  }, []) 

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


import { useDispatch, useSelector } from "react-redux";
import AreaChartProfits from "../../components/dashboard/AreaChartProfits.jsx";
import ColumnChart from "../../components/dashboard/ColumnChart.jsx";
import AreaVehicles from "../../components/dashboard/AreaVehicles.jsx";
import HeatMap from "../../components/dashboard/HeatMap.jsx";
import ParkingMap from "../../components/dashboard/ParkingMap.jsx";
import PieChart from "../../components/dashboard/PieChart.jsx";

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

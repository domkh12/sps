import { useSelector } from "react-redux";
import CardDashboardTotal from "../../components/CardDashboardTotal.jsx";
import SeoComponent from "../../components/SeoComponent.jsx";
import { useEffect, useRef, useState } from "react";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import { useGetTotalCountAnalysisMutation } from "../../redux/feature/analysis/analysisApiSlice.js";
import useTranslate from "./../../hook/useTranslate";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const totalCount = useSelector((state) => state.analysis.totalCountAnalysis);
  const { t } = useTranslate();
  const [getTotalCountAnalysis] = useGetTotalCountAnalysisMutation();

  useEffect(() => {
    const getTotalCountAnalysisFetched = async () => {
      await getTotalCountAnalysis();
      setIsLoading(false);
    };

    getTotalCountAnalysisFetched();
  }, []);

  let content;

  if (isLoading) content = <LoadingFetchingDataComponent />;

  if (!isLoading) {
    content = (
      <div className="grid lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-5">
        <SeoComponent title={"Dashboard"} />
        <CardDashboardTotal
          img={"/images/userImg.png"}
          title={t("user")}
          quantity={totalCount?.data.totalUserCount}
          percentage={"+2.6%"}
          gradient1={"#BFDAF3"}
          gradient2={"#9DC0E0"}
          textColor={"#0C4C88"}
          dateData={totalCount?.data.chartData.date}
          values={totalCount.data.chartData.value}
        />
        <CardDashboardTotal
          img={"/images/carImg.png"}
          title={"Vehicle"}
          quantity={totalCount?.data.totalVehicleCount}
          percentage={"+2.6%"}
          gradient1={"#F3C8F7"}
          gradient2={"#DC9DE2"}
          textColor={"#6F0E78"}
          dateData={totalCount?.data.chartData.date}
          values={totalCount.data.chartData.value}
        />
        <CardDashboardTotal
          img={"/images/parkingImg.png"}
          title={"Parking Space"}
          quantity={totalCount.data.totalParkingSpaceCount}
          percentage={"+2.6%"}
          gradient1={"#F6EACF"}
          gradient2={"#F9E3B0"}
          textColor={"#73550E"}
          dateData={totalCount.data.chartData.date}
          values={totalCount.data.chartData.value}
        />
        <CardDashboardTotal
          img={"/images/lotImg.png"}
          title={"Lot"}
          quantity={totalCount?.data.totalParkingLotCount}
          percentage={"+2.6%"}
          gradient1={"#F7E0C5"}
          gradient2={"#E1C29E"}
          textColor={"#734005"}
          dateData={totalCount.data.chartData.date}
          values={totalCount.data.chartData.value}
        />
      </div>
    );
  }

  return content;
}

export default Dashboard;

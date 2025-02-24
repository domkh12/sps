import { Typography } from "@mui/material";
import {
  axisClasses,
  ChartContainer,
  LineChart,
  lineElementClasses,
  LinePlot,
  markElementClasses,
  MarkPlot,
} from "@mui/x-charts";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";

function CardDashboardTotal({
  img,
  title,
  quantity,
  percentage,
  gradient1,
  gradient2,
  textColor,
  dateData = [],
  values = [],
}) {
  // Function to format date to "13/2/2024" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format the dateData array
  const formattedDateData = dateData.map((date) => formatDate(date));

  return (
    <div
      className={`h-52 rounded-xl flex justify-between p-3`}
      style={{
        background: `linear-gradient(to bottom right, ${gradient1}, ${gradient2})`,
      }}
    >
      <div className="flex flex-col justify-between">
        <img
          src={img}
          alt={title}
          className="h-16 w-16 object-cover ml-2 mt-2"
        />
        <div className="ml-2 mb-2">
          <Typography variant="body1" sx={{ color: textColor }}>
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: textColor }}
          >
            {quantity}
          </Typography>
        </div>
      </div>

      <div className="flex flex-col justify-between items-end">
        <div className="flex items-center gap-3 text-2xl">
          <HiMiniArrowTrendingUp className="w-5 h-auto" style={{ color: textColor }} />
          <Typography variant="body1" sx={{ color: textColor }}>
            {percentage}
          </Typography>
        </div>

        <LineChart
          sx={(theme) => ({
            [`.${lineElementClasses.root}`]: {
              strokeWidth: 3,
            },
            [`.${axisClasses.root}`]: {
              [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                display: "none",
              },
              [`.${axisClasses.tickLabel}`]: {
                display: "none",
              },
            },
            [`.${markElementClasses.root}`]: {
              display: "none",
            },
          })}
          xAxis={[
            {
              data: formattedDateData,
              id: "bottomAxis",
              scaleType: "point",
            },
          ]}
          slotProps={{ legend: { hidden: true } }}
          series={[
            {
              color: textColor,
              type: "line",
              data: values,
            },
          ]}
          margin={{ top: 80, bottom: 20, left: 10, right: 10 }}
          grid={{ horizontal: false }}
          tooltip={{ trigger: "axis" }}
          width={140}
          height={200}
        />
      </div>
    </div>
  );
}

export default CardDashboardTotal;

import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { Dropdown } from "flowbite-react";
import { FaAngleDown } from "react-icons/fa6";

function HeatMap() {
  const chartRef = useRef(null);

  useEffect(() => {
    const options = {
      series: [
        {
          name: "Sunday",
          data: [
            { x: 0, y: 30 },
            { x: 1, y: 40 },
            { x: 2, y: 25 },
            { x: 3, y: 50 },
            { x: 4, y: 35 },
            { x: 5, y: 60 },
            { x: 6, y: 70 },
            { x: 7, y: 45 },
            { x: 8, y: 55 },
            { x: 9, y: 65 },
            { x: 10, y: 75 },
            { x: 11, y: 80 },
            { x: 12, y: 85 },
            { x: 13, y: 70 },
            { x: 14, y: 60 },
            { x: 15, y: 50 },
            { x: 16, y: 40 },
            { x: 17, y: 30 },
            { x: 18, y: 35 },
            { x: 19, y: 45 },
            { x: 20, y: 55 },
            { x: 21, y: 65 },
            { x: 22, y: 75 },
            { x: 23, y: 70 },
          ],
        },
        {
          name: "Monday",
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 25 },
            { x: 2, y: 30 },
            { x: 3, y: 35 },
            { x: 4, y: 40 },
            { x: 5, y: 45 },
            { x: 6, y: 50 },
            { x: 7, y: 55 },
            { x: 8, y: 60 },
            { x: 9, y: 65 },
            { x: 10, y: 70 },
            { x: 11, y: 75 },
            { x: 12, y: 80 },
            { x: 13, y: 75 },
            { x: 14, y: 70 },
            { x: 15, y: 65 },
            { x: 16, y: 60 },
            { x: 17, y: 55 },
            { x: 18, y: 50 },
            { x: 19, y: 45 },
            { x: 20, y: 40 },
            { x: 21, y: 35 },
            { x: 22, y: 30 },
            { x: 23, y: 25 },
          ],
        },
        {
          name: "Tuesday",
          data: [
            { x: 0, y: 15 },
            { x: 1, y: 20 },
            { x: 2, y: 25 },
            { x: 3, y: 30 },
            { x: 4, y: 35 },
            { x: 5, y: 40 },
            { x: 6, y: 45 },
            { x: 7, y: 50 },
            { x: 8, y: 55 },
            { x: 9, y: 60 },
            { x: 10, y: 65 },
            { x: 11, y: 70 },
            { x: 12, y: 75 },
            { x: 13, y: 70 },
            { x: 14, y: 65 },
            { x: 15, y: 60 },
            { x: 16, y: 55 },
            { x: 17, y: 50 },
            { x: 18, y: 45 },
            { x: 19, y: 40 },
            { x: 20, y: 35 },
            { x: 21, y: 30 },
            { x: 22, y: 25 },
            { x: 23, y: 20 },
          ],
        },
        {
          name: "Wednesday",
          data: [
            { x: 0, y: 25 },
            { x: 1, y: 30 },
            { x: 2, y: 35 },
            { x: 3, y: 40 },
            { x: 4, y: 45 },
            { x: 5, y: 50 },
            { x: 6, y: 55 },
            { x: 7, y: 60 },
            { x: 8, y: 65 },
            { x: 9, y: 70 },
            { x: 10, y: 75 },
            { x: 11, y: 80 },
            { x: 12, y: 85 },
            { x: 13, y: 80 },
            { x: 14, y: 75 },
            { x: 15, y: 70 },
            { x: 16, y: 65 },
            { x: 17, y: 60 },
            { x: 18, y: 55 },
            { x: 19, y: 50 },
            { x: 20, y: 45 },
            { x: 21, y: 40 },
            { x: 22, y: 35 },
            { x: 23, y: 30 },
          ],
        },
        {
          name: "Thursday",
          data: [
            { x: 0, y: 20 },
            { x: 1, y: 25 },
            { x: 2, y: 30 },
            { x: 3, y: 35 },
            { x: 4, y: 40 },
            { x: 5, y: 45 },
            { x: 6, y: 50 },
            { x: 7, y: 55 },
            { x: 8, y: 60 },
            { x: 9, y: 65 },
            { x: 10, y: 70 },
            { x: 11, y: 75 },
            { x: 12, y: 80 },
            { x: 13, y: 75 },
            { x: 14, y: 70 },
            { x: 15, y: 65 },
            { x: 16, y: 60 },
            { x: 17, y: 55 },
            { x: 18, y: 50 },
            { x: 19, y: 45 },
            { x: 20, y: 40 },
            { x: 21, y: 35 },
            { x: 22, y: 30 },
            { x: 23, y: 25 },
          ],
        },
        {
          name: "Friday",
          data: [
            { x: 0, y: 30 },
            { x: 1, y: 35 },
            { x: 2, y: 40 },
            { x: 3, y: 45 },
            { x: 4, y: 50 },
            { x: 5, y: 55 },
            { x: 6, y: 60 },
            { x: 7, y: 65 },
            { x: 8, y: 70 },
            { x: 9, y: 75 },
            { x: 10, y: 80 },
            { x: 11, y: 85 },
            { x: 12, y: 90 },
            { x: 13, y: 85 },
            { x: 14, y: 80 },
            { x: 15, y: 75 },
            { x: 16, y: 70 },
            { x: 17, y: 65 },
            { x: 18, y: 60 },
            { x: 19, y: 55 },
            { x: 20, y: 50 },
            { x: 21, y: 45 },
            { x: 22, y: 40 },
            { x: 23, y: 35 },
          ],
        },
        {
          name: "Saturday",
          data: [
            { x: 0, y: 35 },
            { x: 1, y: 40 },
            { x: 2, y: 45 },
            { x: 3, y: 50 },
            { x: 4, y: 55 },
            { x: 5, y: 60 },
            { x: 6, y: 65 },
            { x: 7, y: 70 },
            { x: 8, y: 75 },
            { x: 9, y: 80 },
            { x: 10, y: 85 },
            { x: 11, y: 90 },
            { x: 12, y: 85 },
            { x: 13, y: 80 },
            { x: 14, y: 75 },
            { x: 15, y: 70 },
            { x: 16, y: 65 },
            { x: 17, y: 60 },
            { x: 18, y: 55 },
            { x: 19, y: 50 },
            { x: 20, y: 45 },
            { x: 21, y: 40 },
            { x: 22, y: 35 },
            { x: 23, y: 30 },
          ],
        },
      ],
      chart: {
        height: 350,
        type: "heatmap",
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 0,
          useFillColorAsStroke: true,
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 20,
                name: "Low occupancy",
                color: "#00A100",
              },
              {
                from: 21,
                to: 50,
                name: "Moderate occupancy",
                color: "#128FD9",
              },
              {
                from: 51,
                to: 80,
                name: "High occupancy",
                color: "#FFB200",
              },
              {
                from: 81,
                to: 100,
                name: "Full occupancy",
                color: "#FF0000",
              },
            ],
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 1,
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
        position: "top",
      },
      yaxis: {
        reversed: false,
      },
    };

    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, []);

  return (
    <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <div className="flex justify-between mb-5">
        <div>
          <h5 className="leading-none text-xl font-bold text-gray-900 dark:text-white pb-2">
            Parking Occupancy Heatmap
          </h5>
          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
          Your local time (GMT +0700) · Last 28 days
          </p>
        </div>
      </div>
      <div ref={chartRef}></div>
      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-5">
        <div className="flex justify-between items-center pt-5">
          

          <div className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
            Vehicles Report
            <svg
              className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeatMap;

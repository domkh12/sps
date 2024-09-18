import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { Dropdown } from "flowbite-react";
import { FaAngleDown } from "react-icons/fa6";

function AreaVehicles() {
    const chartRef = useRef(null);

    const options = {
      grid: {
        show: false,
        strokeDashArray: 2,
        padding: {
          left: 0,
          right: 0,
          top: -26,
        },
      },
      series: [
        {
          name: "Vehicles",
          data: [30, 35, 40, 25, 45, 25],
          color: "#1A56DB",
        },
      ],
      chart: {
        height: "320px",
        maxWidth: "100%",
        type: "area",
        fontFamily: "Suwannaphum, serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          show: true,
        },
      },
      legend: {
        show: false,
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.45,
          opacityTo: 0,
          shade: "#1C64F2",
          gradientToColors: ["#1C64F2"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 4,
      },
      xaxis: {
        categories: [
          "01 Feb",
          "02 Feb",
          "03 Feb",
          "04 Feb",
          "05 Feb",
          "06 Feb",
          "07 Feb",
        ],
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
        labels: {
          formatter: function (value) {
            return value;
          },
        },
      },
    };
  
    useEffect(() => {
      if (chartRef.current && typeof ApexCharts !== "undefined") {
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
            <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
              200
            </h5>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Vehicles this week
            </p>
          </div>
          <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
            23%
            <svg
              className="w-3 h-3 ms-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13V1m0 0L1 5m4-4 4 4"
              />
            </svg>
          </div>
        </div>
        <div ref={chartRef}></div>
        <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-5">
          <div className="flex justify-between items-center pt-5">
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <span className="flex justify-center items-center gap-2 dark:text-gray-300 cursor-pointer">
                  Last 7 days <FaAngleDown />
                </span>
              )}
            >
              <Dropdown.Header>
                <span className="block text-sm">Sep 16, 2021 - Sep 22, 2021</span>
              </Dropdown.Header>
              <Dropdown.Item>Yesterday</Dropdown.Item>
              <Dropdown.Item>Today</Dropdown.Item>
              <Dropdown.Item>Last 7 days</Dropdown.Item>
              <Dropdown.Item>Last 28 days</Dropdown.Item>
              <Dropdown.Item>Last 90 days</Dropdown.Item>
              <Dropdown.Item>Last 365 days</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>Custom...</Dropdown.Item>
            </Dropdown>
  
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

export default AreaVehicles

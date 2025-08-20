import {useState, useEffect} from "react";
import Chart from "react-apexcharts";
import {
    TrendingUp,
    TrendingDown,
    MapPin,
    Building,
    Car,
    Users,
    Clock,
    Activity,
    Navigation,
    BarChart3,
    Square,
} from "lucide-react";
import {useGetAnalysisQuery} from "../../redux/feature/analysis/analysisApiSlice.js";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import SeoComponent from "../../components/SeoComponent.jsx";
import {formatMinutesToHoursMinutes} from "../../redux/feature/utils/util.js";
import {useSelector} from "react-redux";
import {Box, Card, useTheme} from "@mui/material";
import useAuth from "../../hook/useAuth.jsx";
import DataNotFound from "../../components/DataNotFound.jsx";
import useTranslate from "../../hook/useTranslate.jsx";

const VEHICLE_EXIT_MOCK = [
    { hour: "2 PM", occupied: 0, total: 6 },
    { hour: "3 PM", occupied: 1, total: 6 },
    { hour: "4 PM", occupied: 2, total: 6 },
    { hour: "5 PM", occupied: 3, total: 6 },
    { hour: "6 PM", occupied: 4, total: 6 },
    { hour: "7 PM", occupied: 3, total: 6 },
    { hour: "8 PM", occupied: 2, total: 6 },
    { hour: "9 PM", occupied: 3, total: 6 },
    { hour: "10 PM", occupied: 4, total: 6 },
    { hour: "11 PM", occupied: 3, total: 6 },
    { hour: "12 AM", occupied: 1, total: 6 },
    { hour: "1 AM", occupied: 0, total: 6 },
];

const StatCard = ({
                      icon: Icon,
                      title,
                      value,
                      percentage,
                      trend,
                      delay,
                      gradient,
                      textColor,
                  }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`relative overflow-hidden rounded-xl p-6 transition-all duration-700 transform ${
                isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95"
            }`}
            style={{
                background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="p-2 rounded-lg"
                        style={{backgroundColor: `${textColor}20`}}
                    >
                        <Icon size={24} style={{color: textColor}}/>
                    </div>
                    <h3 className="font-medium text-gray-700">{title}</h3>
                </div>
                <div className="flex items-center space-x-1">
                    {trend === "up" ? (
                        <TrendingUp size={16} className="text-green-500"/>
                    ) : (
                        <TrendingDown size={16} className="text-red-500"/>
                    )}
                    <span
                        className={`text-sm font-medium ${
                            trend === "up" ? "text-green-500" : "text-red-500"
                        }`}
                    >
            {percentage}
          </span>
                </div>
            </div>
            <div className="mb-2">
        <span className="text-3xl font-bold" style={{color: textColor}}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
            </div>
            <div className="absolute bottom-0 right-0 opacity-10">
                <Icon size={80} style={{color: textColor}}/>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const {t} = useTranslate();
    const {isAdmin, isManager} = useAuth();
    const [isLoaded, setIsLoaded] = useState(false);
    const {data: analysisData, isLoading, isSuccess} = useGetAnalysisQuery("analysisList");

    // Get the current theme from Material-UI
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

    // Safe fallbacks for Parking Areas Utilization chart
    const parkingAreasUtilization = analysisData?.parkingAreasUtilization ?? [];
    const hasParkingAreasUtilization = Array.isArray(parkingAreasUtilization) && parkingAreasUtilization.length > 0;
    const parkingAreasDetails = analysisData?.parkingAreasDetails ?? [];
    const hasParkingAreasDetails = Array.isArray(parkingAreasDetails) && parkingAreasDetails.length > 0;

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Common chart options for dark mode support
    const getBaseChartOptions = () => ({
        tooltip: {
            theme: isDarkMode ? "dark" : "light",
            style: {
                fontSize: "12px",
            },
        },
        xaxis: {
            labels: {
                style: {
                    colors: isDarkMode ? "#e5e7eb" : "#666",
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: isDarkMode ? "#e5e7eb" : "#666",
                },
            },
        },
        grid: {
            borderColor: isDarkMode ? "#374151" : "#f0f0f0",
        },
        legend: {
            labels: {
                colors: isDarkMode ? "#e5e7eb" : "#374151",
            },
        },
    });

    

    let content;

    if (isLoading) content = <LoadingFetchingDataComponent/>;

    if (isSuccess) content = (
        <>
            <SeoComponent title={"Dashboard"}/>
            <Box className="min-h-screen">
                <div className="space-y-6">
                    {/* Header */}
                    <div
                        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                {isManager ? "Branch Parking Dashboard" : "Smart Parking Dashboard"}
                            </h1>
                            <p>{isManager ? "Your branch parking analytics and monitoring" : "Real-time analytics and monitoring"}</p>
                        </div>
                    </div>

                    {/* Main Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={Users}
                            title={t('user')}
                            value={analysisData?.totalStats?.totalUserCount}
                            percentage="+12.5%"
                            trend="up"
                            delay={100}
                            gradient={["#BFDAF3", "#9DC0E0"]}
                            textColor="#0C4C88"
                        />
                        <StatCard
                            icon={Car}
                            title={t('vehicle')}
                            value={analysisData.totalStats.totalVehicleCount}
                            percentage="+8.2%"
                            trend="up"
                            delay={200}
                            gradient={["#F3C8F7", "#DC9DE2"]}
                            textColor="#6F0E78"
                        />
                        <StatCard
                            icon={MapPin}
                            title={t('parkingSpace')}
                            value={analysisData.totalStats.totalParkingAreasCount}
                            percentage="+5.1%"
                            trend="up"
                            delay={300}
                            gradient={["#F6EACF", "#F9E3B0"]}
                            textColor="#73550E"
                        />
                        <StatCard
                            icon={Square}
                            title={t('parkingSlot')}
                            value={analysisData.totalStats.totalParkingSlotsCount}
                            percentage="+3.4%"
                            trend="up"
                            delay={400}
                            gradient={["#F7E0C5", "#E1C29E"]}
                            textColor="#734005"
                        />
                    </div>

                    {/* Additional Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {isAdmin && (
                            <StatCard
                                icon={Building}
                                title={t('company')}
                                value={analysisData?.totalStats?.totalCompanies}
                                percentage="+0%"
                                trend="up"
                                delay={500}
                                gradient={["#DBEAFE", "#BFDBFE"]}
                                textColor="#1E40AF"
                            />
                        )}
                        {isAdmin && (
                            <StatCard
                                icon={MapPin}
                                title={t('branch')}
                                value={analysisData.totalStats.totalBranches}
                                percentage="+0%"
                                trend="up"
                                delay={600}
                                gradient={["#D1FAE5", "#A7F3D0"]}
                                textColor="#047857"
                            />
                        )}
                        {isManager && (
                            <StatCard
                                icon={Navigation}
                                title={t('occupiedParking')}
                                value={analysisData.totalStats.activeSessionCount}
                                percentage="+0%"
                                trend="up"
                                delay={600}
                                gradient={["#D1FAE5", "#A7F3D0"]}
                                textColor="#047857"
                            />
                        )}
                        {isManager && (
                            <StatCard
                                icon={BarChart3}
                                title={t('vehicleEntry')}
                                value={`${analysisData.totalStats.checkInCount}`}
                                percentage="+2.1%"
                                trend="up"
                                delay={700}
                                gradient={["#FEF3C7", "#FDE68A"]}
                                textColor="#92400E"
                            />
                        )}
                        <StatCard
                            icon={Activity}
                            title={t('occupancyRate')}
                            value={`${analysisData.totalStats.occupancyRate}%`}
                            percentage="+2.1%"
                            trend="up"
                            delay={700}
                            gradient={["#FEF3C7", "#FDE68A"]}
                            textColor="#92400E"
                        />
                        <StatCard
                            icon={Clock}
                            title={t('avgStayTime')}
                            value={` ${formatMinutesToHoursMinutes(analysisData.totalStats.averageStayTime)}`}
                            percentage="+0.3h"
                            trend="up"
                            delay={800}
                            gradient={["#FECACA", "#FCA5A5"]}
                            textColor="#B91C1C"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Hourly Occupancy Chart */}
                        <Card
                            className={`rounded-xl p-6 shadow-lg transition-all duration-1000 transform ${
                                isManager ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-6 xl:col-span-4'
                            } ${
                                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        >
                            <h3 className="text-xl font-semibold mb-4 flex items-center">
                                <Clock className="mr-2" size={20}/>
                                Hourly Vehicle Entry
                            </h3>
                            <Chart
                                options={{
                                    chart: {
                                        type: "area",
                                        height: 300,
                                        toolbar: {show: false},
                                        animations: {
                                            enabled: true,
                                            easing: "easeinout",
                                            speed: 800,
                                            animateGradually: {
                                                enabled: true,
                                                delay: 150,
                                            },
                                        },
                                    },
                                    markers: {
                                        size: 0,
                                        hover: { size: 6 },
                                    },
                                    dataLabels: {enabled: false},
                                    stroke: {
                                        curve: "smooth",
                                        width: 3,
                                    },
                                    fill: {
                                        type: "gradient",
                                        gradient: {
                                            shadeIntensity: 1,
                                            opacityFrom: 0.7,
                                            opacityTo: 0.1,
                                            stops: [0, 90, 100],
                                        },
                                    },
                                    colors: ["#3B82F6"],
                                    ...getBaseChartOptions(),
                                    tooltip: {
                                        ...getBaseChartOptions().tooltip,
                                        enabled: true,
                                        shared: true,
                                        intersect: false,
                                        y: {
                                            formatter: (value) => `${value} vehicles`,
                                        },
                                    },
                                    xaxis: {
                                        ...getBaseChartOptions().xaxis,
                                        categories: analysisData.hourlyData.map((item) => item.hour),
                                    },
                                }}
                                series={[
                                    {
                                        name: "Vehicle Entry",
                                        data: analysisData.hourlyData.map((item) => item.occupied),
                                    },
                                ]}
                                type="area"
                                height={300}
                            />
                        </Card>

                         {/* Hourly Vehicle Exit (Static Mock Data) */}
                         <Card
                             className={`rounded-xl p-6 shadow-lg transition-all duration-1000 transform ${
                                 isManager ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-6 xl:col-span-4'
                             } ${
                                 isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                             }`}
                         >
                             <h3 className="text-xl font-semibold mb-4 flex items-center">
                                 <Clock className="mr-2" size={20}/>
                                 Hourly Vehicle Exit
                             </h3>
                             <Chart
                                 options={{
                                     chart: {
                                         type: "area",
                                         height: 300,
                                         toolbar: {show: false},
                                         animations: {
                                             enabled: true,
                                             easing: "easeinout",
                                             speed: 800,
                                             animateGradually: {
                                                 enabled: true,
                                                 delay: 150,
                                             },
                                         },
                                     },
                                     markers: {
                                         size: 0,
                                         hover: { size: 6 },
                                     },
                                     dataLabels: {enabled: false},
                                     stroke: {
                                         curve: "smooth",
                                         width: 3,
                                     },
                                     fill: {
                                         type: "gradient",
                                         gradient: {
                                             shadeIntensity: 1,
                                             opacityFrom: 0.7,
                                             opacityTo: 0.1,
                                             stops: [0, 90, 100],
                                         },
                                     },
                                      colors: ["#EF4444"],
                                      ...getBaseChartOptions(),
                                      tooltip: {
                                          ...getBaseChartOptions().tooltip,
                                          enabled: true,
                                          shared: true,
                                          intersect: false,
                                          y: {
                                              formatter: (value) => `${value} vehicles`,
                                          },
                                      },
                                     xaxis: {
                                         ...getBaseChartOptions().xaxis,
                                         categories: analysisData.hourlyVehicleExitResponse.map((item) => item.hour),
                                     },
                                 }}
                                 series={[
                                      {
                                          name: "Vehicle Exit",
                                          data: analysisData.hourlyVehicleExitResponse.map((item) => item.occupied),
                                      },
                                 ]}
                                 type="area"
                                 height={300}
                             />
                         </Card>

                        {/* Weekly Stay Time Chart */}
                        {!isManager && (
                            <Card
                                className={`rounded-xl p-6 shadow-lg transition-all duration-1000 delay-200 transform lg:col-span-6 xl:col-span-4 ${
                                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                            >
                                <h3 className="text-xl font-semibold mb-4 flex items-center">
                                    <Clock className="mr-2" size={20}/>
                                    Weekly Average Stay Time
                                </h3>
                                <Chart
                                    options={{
                                        chart: {
                                            type: "bar",
                                            height: 300,
                                            toolbar: {show: false},
                                            animations: {
                                                enabled: true,
                                                easing: "easeinout",
                                                speed: 800,
                                                animateGradually: {
                                                    enabled: true,
                                                    delay: 150,
                                                },
                                            },
                                        },
                                        plotOptions: {
                                            bar: {
                                                borderRadius: 8,
                                                columnWidth: "60%",
                                            },
                                        },
                                        dataLabels: {enabled: false},
                                        colors: ["#10B981"],
                                        ...getBaseChartOptions(),
                                        xaxis: {
                                            ...getBaseChartOptions().xaxis,
                                            categories: analysisData.weeklyData.map((item) => item.day),
                                        },
                                        yaxis: {
                                            ...getBaseChartOptions().yaxis,
                                            labels: {
                                                ...getBaseChartOptions().yaxis.labels,
                                                formatter: (value) => `${value}h`,
                                            },
                                        },
                                        tooltip: {
                                            ...getBaseChartOptions().tooltip,
                                            y: {
                                                formatter: (value) => `${value}h`,
                                            },
                                        },
                                        fill: {
                                            type: "gradient",
                                            gradient: {
                                                shade: "light",
                                                type: "vertical",
                                                shadeIntensity: 0.25,
                                                gradientToColors: ["#34D399"],
                                                inverseColors: false,
                                                opacityFrom: 0.85,
                                                opacityTo: 0.85,
                                                stops: [50, 0, 100],
                                            },
                                        },
                                    }}
                                    series={[
                                        {
                                            name: "Average Stay Time",
                                            data: analysisData.weeklyData.map((item) => item.avgStayTime),
                                        },
                                    ]}
                                    type="bar"
                                    height={300}
                                />
                            </Card>
                        )}
                    </div>

                    {/* Manager-specific charts or Admin-specific charts */}
                    {isManager ? (
                        // Manager View: Focus on branch parking areas performance with mapped data
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Parking Areas Utilization */}
                            <Card
                                className={`rounded-xl p-6 shadow-lg transition-all duration-1000 delay-400 transform lg:col-span-5 xl:col-span-5 ${
                                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                            >
                                <h3 className="text-xl font-semibold mb-4">
                                    Parking Areas Utilization
                                </h3>
                                <Chart
                                    options={{
                                        chart: {
                                            type: "donut",
                                            height: 300,
                                            animations: {
                                                enabled: true,
                                                easing: "easeinout",
                                                speed: 800,
                                                animateGradually: {
                                                    enabled: true,
                                                    delay: 150,
                                                },
                                            },
                                        },
                                        colors: hasParkingAreasUtilization
                                            ? parkingAreasUtilization.map(area => area.color)
                                            : ["#9CA3AF"],
                                        labels: hasParkingAreasUtilization
                                            ? parkingAreasUtilization.map(area => area.name)
                                            : ["No data"],
                                        legend: {
                                            position: "bottom",
                                            horizontalAlign: "center",
                                            fontSize: "12px",
                                            labels: {
                                                colors: isDarkMode ? "#e5e7eb" : "#374151",
                                            },
                                        },
                                        plotOptions: {
                                            pie: {
                                                donut: {
                                                    size: "60%",
                                                    labels: {
                                                        show: true,
                                                        name: {
                                                            show: true,
                                                            color: isDarkMode ? "#ffffff" : "#374151",
                                                        },
                                                        value: {
                                                            show: true,
                                                            color: isDarkMode ? "#ffffff" : "#111827",
                                                        },
                                                        total: {
                                                            show: true,
                                                            label: "Total Occupied",
                                                            fontSize: "14px",
                                                            fontWeight: 600,
                                                            color: isDarkMode ? "#ffffff" : "#374151",
                                                            formatter: () => {
                                                                return parkingAreasUtilization
                                                                    .reduce((sum, area) => sum + area.value, 0)
                                                                    .toString();
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            formatter: (val) => `${val.toFixed(1)}%`,
                                            style: {
                                                colors: [isDarkMode ? "#ffffff" : "#1f2937"],
                                            },
                                        },
                                        tooltip: {
                                            theme: isDarkMode ? "dark" : "light",
                                            y: {
                                                formatter: (value) => `${value} occupied slots`,
                                            },
                                        },
                                    }}
                                    series={hasParkingAreasUtilization
                                        ? parkingAreasUtilization.map(area => area.value)
                                        : [0]}
                                    type="donut"
                                    height={300}
                                />
                            </Card>
                            {/* Weekly Average Stay Time (Manager Right Side) */}
                            <Card
                                className={`rounded-xl p-6 shadow-lg transition-all duration-1000 delay-400 transform lg:col-span-7 xl:col-span-7 ${
                                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                            >
                                <h3 className="text-xl font-semibold mb-4 flex items-center">
                                    <Clock className="mr-2" size={20}/>
                                    Weekly Average Stay Time
                                </h3>
                                <Chart
                                    options={{
                                        chart: {
                                            type: "bar",
                                            height: 300,
                                            toolbar: {show: false},
                                            animations: {
                                                enabled: true,
                                                easing: "easeinout",
                                                speed: 800,
                                                animateGradually: {
                                                    enabled: true,
                                                    delay: 150,
                                                },
                                            },
                                        },
                                        plotOptions: {
                                            bar: {
                                                borderRadius: 8,
                                                columnWidth: "60%",
                                            },
                                        },
                                        dataLabels: {enabled: false},
                                        colors: ["#10B981"],
                                        ...getBaseChartOptions(),
                                        xaxis: {
                                            ...getBaseChartOptions().xaxis,
                                            categories: analysisData.weeklyData.map((item) => item.day),
                                        },
                                        yaxis: {
                                            ...getBaseChartOptions().yaxis,
                                            labels: {
                                                ...getBaseChartOptions().yaxis.labels,
                                                formatter: (value) => `${value}h`,
                                            },
                                        },
                                        tooltip: {
                                            ...getBaseChartOptions().tooltip,
                                            y: {
                                                formatter: (value) => `${value}h`,
                                            },
                                        },
                                        fill: {
                                            type: "gradient",
                                            gradient: {
                                                shade: "light",
                                                type: "vertical",
                                                shadeIntensity: 0.25,
                                                gradientToColors: ["#34D399"],
                                                inverseColors: false,
                                                opacityFrom: 0.85,
                                                opacityTo: 0.85,
                                                stops: [50, 0, 100],
                                            },
                                        },
                                    }}
                                    series={[
                                        {
                                            name: "Average Stay Time",
                                            data: analysisData.weeklyData.map((item) => item.avgStayTime),
                                        },
                                    ]}
                                    type="bar"
                                    height={300}
                                />
                            </Card>
                        </div>
                    ) : (
                        // Admin View: Company and Branch Distribution
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Company Distribution */}
                            <Card
                                className={`rounded-xl p-6 shadow-lg transition-all duration-1000 delay-400 transform lg:col-span-4 ${
                                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                            >
                                <h3 className="text-xl font-semibold mb-4">
                                    Company Slot Distribution
                                </h3>
                                <Chart
                                    options={{
                                        chart: {
                                            type: "donut",
                                            height: 250,
                                            animations: {
                                                enabled: true,
                                                easing: "easeinout",
                                                speed: 800,
                                                animateGradually: {
                                                    enabled: true,
                                                    delay: 150,
                                                },
                                            },
                                        },
                                        colors: ["#3B82F6", "#10B981", "#F59E0B"],
                                        labels: analysisData.companies.map((company) => company.name),
                                        legend: {
                                            position: "bottom",
                                            horizontalAlign: "center",
                                            fontSize: "12px",
                                            labels: {
                                                colors: isDarkMode ? "#e5e7eb" : "#374151",
                                            },
                                        },
                                        plotOptions: {
                                            pie: {
                                                donut: {
                                                    size: "70%",
                                                    labels: {
                                                        show: true,
                                                        name: {
                                                            show: true,
                                                            color: isDarkMode ? "#ffffff" : "#374151",
                                                        },
                                                        value: {
                                                            show: true,
                                                            color: isDarkMode ? "#ffffff" : "#111827",
                                                        },
                                                        total: {
                                                            show: true,
                                                            label: "Total Slots",
                                                            fontSize: "14px",
                                                            fontWeight: 600,
                                                            color: isDarkMode ? "#ffffff" : "#374151",
                                                            formatter: () => {
                                                                return analysisData.companies
                                                                    .reduce(
                                                                        (sum, company) => sum + company.totalSlots,
                                                                        0
                                                                    )
                                                                    .toLocaleString();
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            formatter: (val) => `${val.toFixed(1)}%`,
                                            style: {
                                                colors: [isDarkMode ? "#ffffff" : "#1f2937"],
                                            },
                                        },
                                        tooltip: {
                                            theme: isDarkMode ? "dark" : "light",
                                            y: {
                                                formatter: (value) => `${value} slots`,
                                            },
                                        },
                                    }}
                                    series={analysisData.companies.map((company) => company.totalSlots)}
                                    type="donut"
                                    height={250}
                                />
                            </Card>

                            {/* Branch Performance */}
                            <Card
                                className={`lg:col-span-8 rounded-xl p-6 shadow-lg transition-all duration-1000 delay-600 transform ${
                                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                            >
                                <h3 className="text-xl font-semibold mb-4">
                                    Branch Performance
                                </h3>
                                <div className="space-y-4 max-h-64 overflow-y-auto">
                                    {analysisData.branchData.map((branch, index) => (
                                        <div
                                            key={branch.name}
                                            className="flex items-center justify-between p-3 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="font-medium">{branch.name}</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm">
                                                    {branch.occupied}/{branch.slots} slots
                                                </span>
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                                        style={{
                                                            width: `${(branch.occupied / branch.slots) * 100}%`,
                                                            transitionDelay: `${index * 100}ms`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-medium text-green-600">
                                                    {branch.efficiency}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Company Details Cards - Only for Admin */}
                    {isAdmin && (
                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {analysisData.companies.map((company, index) => (
                                <Card
                                    key={company.id}
                                    className={`rounded-xl p-6 shadow-lg transition-all duration-700 delay-${
                                        (index + 1) * 200
                                    } transform ${
                                        isLoaded
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-8"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold">
                                            {company.name}
                                        </h4>
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{backgroundColor: company.color}}
                                        ></div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span>Branches</span>
                                            <span className="font-medium">{company.branches}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Parking Areas</span>
                                            <span className="font-medium">{company.totalAreas}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Slots</span>
                                            <span className="font-medium">{company.totalSlots}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Occupied Slots</span>
                                            <span className="font-medium text-blue-600">
                                                {company.occupiedSlots}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Avg Stay Time</span>
                                            <span className="font-medium text-green-600">
                                                {formatMinutesToHoursMinutes(company.avgStayTime)}
                                            </span>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>Occupancy Rate</span>
                                                <span>
                                                    {(company.totalSlots && company.totalSlots > 0)
                                                        ? (((company.occupiedSlots || 0) / company.totalSlots) * 100).toFixed(1)
                                                        : '0.0'
                                                    }%
                                                </span>
                                            </div>
                                            <div className="w-full rounded-full h-2">
                                                <div
                                                    className="h-2 rounded-full transition-all duration-1000"
                                                    style={{
                                                        width: `${
                                                            (company.occupiedSlots / company.totalSlots) * 100
                                                        }%`,
                                                        backgroundColor: company.color,
                                                        transitionDelay: `${index * 300}ms`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Manager-specific detailed parking areas breakdown */}
                    {isManager && (
                        <div className="grid grid-cols-1 gap-6">
                            {/* Parking Areas Performance Details */}
                            <Card
                                className={`rounded-xl p-6 shadow-lg transition-all duration-1000 delay-800 transform ${
                                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                            >
                                <h3 className="text-xl font-semibold mb-6">
                                    Parking Areas Performance
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Map through parkingAreasDetails or show not found */}
                                    {hasParkingAreasDetails ? (
                                        parkingAreasDetails.map((area) => (
                                            <div
                                                key={area.id}
                                                className={`rounded-lg p-4 border transition-all duration-500`}
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="text-lg font-semibold">
                                                        {area.name}
                                                    </h4>
                                                    <div className="flex items-center space-x-1">
                                                        <Activity size={16} />
                                                        <span className={`text-sm font-medium `}>
                                                            {area.occupancyRate}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span >Total Slots</span>
                                                        <span className="font-medium">{area.totalSlots}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span >Occupied</span>
                                                        <span className="font-medium text-blue-600">{area.occupied}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span >Available</span>
                                                        <span className="font-medium text-green-600">{area.available}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-3">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span>Occupancy</span>
                                                        <span>{area.occupancyRate}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className={`bg-[${area.barColor}] h-2 rounded-full transition-all duration-1000`}
                                                            style={{
                                                                width: `${area.occupancyRate}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center py-6">
                                            <DataNotFound />
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </Box>
        </>
    );

    return content;
};

export default Dashboard;
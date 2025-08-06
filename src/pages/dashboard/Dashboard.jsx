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
    Square,
} from "lucide-react";
import {useGetAnalysisQuery} from "../../redux/feature/analysis/analysisApiSlice.js";
import LoadingFetchingDataComponent from "../../components/LoadingFetchingDataComponent.jsx";
import SeoComponent from "../../components/SeoComponent.jsx";
import {formatMinutesToHoursMinutes} from "../../redux/feature/utils/util.js";
import {useSelector} from "react-redux";

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

const FilterButton = ({active, children, onClick}) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            active
                ? "bg-blue-500 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-600 hover:bg-gray-50 hover:shadow-md"
        }`}
    >
        {children}
    </button>
);

const Dashboard = () => {
    const [timeFilter, setTimeFilter] = useState("today");
    const [selectedCompany, setSelectedCompany] = useState("all");
    const [isLoaded, setIsLoaded] = useState(false);
    const {data: analysisData, isLoading, isSuccess, refetch} = useGetAnalysisQuery("analysisList");
    const isRefetchCheckIn = useSelector((state) => state.checkIn.isRefetchCheckIn);
    const isRefetchCheckOut = useSelector((state) => state.checkOut.isRefetchCheckOut);

    useEffect(() => {
        if (isRefetchCheckIn || isRefetchCheckOut) {
            refetch();
        }
    }, [isRefetchCheckOut, isRefetchCheckIn]);
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 300);
        return () => clearTimeout(timer);
    }, []);

    let content;

    if (isLoading) content = <LoadingFetchingDataComponent/>;

    if (isSuccess) content = (
        <>
            <SeoComponent title={"Dashboard"}/>
            <div className="min-h-screen">
                <div className="mx-auto space-y-6">
                    {/* Header */}
                    <div
                        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Smart Parking Dashboard
                            </h1>
                            <p className="text-gray-600">Real-time analytics and monitoring</p>
                        </div>

                        {/* Filters */}

                    </div>

                    {/* Main Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            icon={Users}
                            title="Total Users"
                            value={analysisData?.totalStats?.totalUserCount}
                            percentage="+12.5%"
                            trend="up"
                            delay={100}
                            gradient={["#BFDAF3", "#9DC0E0"]}
                            textColor="#0C4C88"
                        />
                        <StatCard
                            icon={Car}
                            title="Vehicles"
                            value={analysisData.totalStats.totalVehicleCount}
                            percentage="+8.2%"
                            trend="up"
                            delay={200}
                            gradient={["#F3C8F7", "#DC9DE2"]}
                            textColor="#6F0E78"
                        />
                        <StatCard
                            icon={MapPin}
                            title="Parking Areas"
                            value={analysisData.totalStats.totalParkingAreasCount}
                            percentage="+5.1%"
                            trend="up"
                            delay={300}
                            gradient={["#F6EACF", "#F9E3B0"]}
                            textColor="#73550E"
                        />
                        <StatCard
                            icon={Square}
                            title="Parking Slots"
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
                        <StatCard
                            icon={Building}
                            title="Companies"
                            value={analysisData?.totalStats?.totalCompanies}
                            percentage="+0%"
                            trend="up"
                            delay={500}
                            gradient={["#DBEAFE", "#BFDBFE"]}
                            textColor="#1E40AF"
                        />
                        <StatCard
                            icon={MapPin}
                            title="Branches"
                            value={analysisData.totalStats.totalBranches}
                            percentage="+0%"
                            trend="up"
                            delay={600}
                            gradient={["#D1FAE5", "#A7F3D0"]}
                            textColor="#047857"
                        />
                        <StatCard
                            icon={Activity}
                            title="Occupancy Rate"
                            value={`${analysisData.totalStats.occupancyRate}%`}
                            percentage="+2.1%"
                            trend="up"
                            delay={700}
                            gradient={["#FEF3C7", "#FDE68A"]}
                            textColor="#92400E"
                        />
                        <StatCard
                            icon={Clock}
                            title="Avg Stay Time"
                            value={` ${formatMinutesToHoursMinutes(analysisData.totalStats.averageStayTime)}`}
                            percentage="+0.3h"
                            trend="up"
                            delay={800}
                            gradient={["#FECACA", "#FCA5A5"]}
                            textColor="#B91C1C"
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Hourly Occupancy Chart */}
                        <div
                            className={`bg-white rounded-xl p-6 shadow-lg transition-all duration-1000 transform ${
                                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <Clock className="mr-2" size={20}/>
                                Hourly Slot Occupancy
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
                                    xaxis: {
                                        categories: analysisData.hourlyData.map((item) => item.hour),
                                        labels: {
                                            style: {colors: "#666"},
                                        },
                                    },
                                    yaxis: {
                                        labels: {
                                            style: {colors: "#666"},
                                        },
                                    },
                                    grid: {
                                        borderColor: "#f0f0f0",
                                    },
                                    tooltip: {
                                        theme: "light",
                                        style: {
                                            fontSize: "12px",
                                        },
                                    },
                                }}
                                series={[
                                    {
                                        name: "Occupied Slots",
                                        data: analysisData.hourlyData.map((item) => item.occupied),
                                    },
                                ]}
                                type="area"
                                height={300}
                            />
                        </div>

                        {/* Weekly Stay Time Chart */}
                        <div
                            className={`bg-white rounded-xl p-6 shadow-lg transition-all duration-1000 delay-200 transform ${
                                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
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
                                    xaxis: {
                                        categories: analysisData.weeklyData.map((item) => item.day),
                                        labels: {
                                            style: {colors: "#666"},
                                        },
                                    },
                                    yaxis: {
                                        labels: {
                                            style: {colors: "#666"},
                                            formatter: (value) => `${value}h`,
                                        },
                                    },
                                    grid: {
                                        borderColor: "#f0f0f0",
                                    },
                                    tooltip: {
                                        theme: "light",
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
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Company Distribution */}
                        <div
                            className={`bg-white rounded-xl p-6 shadow-lg transition-all duration-1000 delay-400 transform ${
                                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
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
                                    },
                                    plotOptions: {
                                        pie: {
                                            donut: {
                                                size: "70%",
                                                labels: {
                                                    show: true,
                                                    total: {
                                                        show: true,
                                                        label: "Total Slots",
                                                        fontSize: "14px",
                                                        fontWeight: 600,
                                                        color: "#374151",
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
                                    },
                                    tooltip: {
                                        y: {
                                            formatter: (value) => `${value} slots`,
                                        },
                                    },
                                }}
                                series={analysisData.companies.map((company) => company.totalSlots)}
                                type="donut"
                                height={250}
                            />
                        </div>

                        {/* Branch Performance */}
                        <div
                            className={`lg:col-span-2 bg-white rounded-xl p-6 shadow-lg transition-all duration-1000 delay-600 transform ${
                                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Branch Performance
                            </h3>
                            <div className="space-y-4 max-h-64 overflow-y-auto">
                                {analysisData.branchData.map((branch, index) => (
                                    <div
                                        key={branch.name}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <span className="font-medium">{branch.name}</span>
                                        </div>
                                        <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
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
                        </div>
                    </div>

                    {/* Company Details Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {analysisData.companies.map((company, index) => (
                            <div
                                key={company.id}
                                className={`bg-white rounded-xl p-6 shadow-lg transition-all duration-700 delay-${
                                    (index + 1) * 200
                                } transform ${
                                    isLoaded
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        {company.name}
                                    </h4>
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{backgroundColor: company.color}}
                                    ></div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Branches</span>
                                        <span className="font-medium">{company.branches}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Parking Areas</span>
                                        <span className="font-medium">{company.totalAreas}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Slots</span>
                                        <span className="font-medium">{company.totalSlots}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Occupied Slots</span>
                                        <span className="font-medium text-blue-600">
                    {company.occupiedSlots}
                  </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Avg Stay Time</span>
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
                                        <div className="w-full bg-gray-200 rounded-full h-2">
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
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )

    return content;
};

export default Dashboard;

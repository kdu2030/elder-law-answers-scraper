"use strict";
var DashboardId;
(function (DashboardId) {
    DashboardId["dashboardChartData"] = "dashboard-chart-data";
    DashboardId["statusChart"] = "dashboard-blog-post-status-chart";
})(DashboardId || (DashboardId = {}));
const loadStatusChart = () => {
    const dashboardChartDataElement = document.getElementById(DashboardId.dashboardChartData);
    const dashboardChartDataStr = dashboardChartDataElement === null || dashboardChartDataElement === void 0 ? void 0 : dashboardChartDataElement.innerText;
    if (!dashboardChartDataStr) {
        return;
    }
    const dashboardChartData = JSON.parse(dashboardChartDataStr);
    const chartData = {
        labels: dashboardChartData.month_labels,
        datasets: [
            {
                label: "Successes",
                backgroundColor: "rgb(25,135,84)",
                borderColor: "rgb(25,135,84)",
                data: dashboardChartData.success_count,
            },
            {
                label: "Failures",
                backgroundColor: "rgb(220,53,69)",
                borderColor: "rgb(220,53,69)",
                data: dashboardChartData.failure_count,
            },
            {
                label: "Warnings",
                backgroundColor: "rgb(255,193,7)",
                borderColor: "rgb(255,193,7)",
                data: dashboardChartData.warning_count,
            },
        ],
    };
    const chartConfig = {
        type: "bar",
        data: chartData,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Months",
                        font: {
                            weight: "bold",
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Attempts",
                        font: {
                            weight: "bold",
                        },
                    },
                },
            },
        },
    };
    const canvas = document.getElementById(DashboardId.statusChart);
    if (!canvas) {
        return;
    }
    // @ts-ignore
    new Chart(canvas, chartConfig);
};
window.addEventListener("load", loadStatusChart);

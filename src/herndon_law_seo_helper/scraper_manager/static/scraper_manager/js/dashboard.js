"use strict";
var DashboardId;
(function (DashboardId) {
    DashboardId["statusChart"] = "dashboard-blog-post-status-chart";
})(DashboardId || (DashboardId = {}));
const loadStatusChart = () => {
    const chartData = {
        labels: ["January", "Februrary", "March", "April", "June"],
        datasets: [
            {
                label: "Successes",
                backgroundColor: "rgb(25,135,84)",
                borderColor: "rgb(25,135,84)",
                data: [5, 6, 2, 3, 1],
            },
            {
                label: "Failures",
                backgroundColor: "rgb(220,53,69)",
                borderColor: "rgb(220,53,69)",
                data: [1, 0, 0, 0, 2],
            },
            {
                label: "Warnings",
                backgroundColor: "rgb(255,193,7)",
                borderColor: "rgb(255,193,7)",
                data: [1, 0, 1, 0, 0],
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
    console.log(canvas);
    if (!canvas) {
        return;
    }
    // @ts-ignore
    new Chart(canvas, chartConfig);
};
window.addEventListener("load", loadStatusChart);

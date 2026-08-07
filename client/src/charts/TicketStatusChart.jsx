import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function TicketStatusChart({ stats }) {

    const data = {
        labels: [
            "Open",
            "In Progress",
            "Resolved",
            "Closed"
        ],
        datasets: [
            {
                label: "Tickets",
                data: [
                    stats.open,
                    stats.inProgress,
                    stats.resolved,
                    stats.closed
                ],
                backgroundColor: [
                    "#f59e0b",
                    "#8b5cf6",
                    "#22c55e",
                    "#ef4444"
                ]
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Ticket Status Overview"
            }
        },

        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    return (
        <Bar
            data={data}
            options={options}
        />
    );
}

export default TicketStatusChart;
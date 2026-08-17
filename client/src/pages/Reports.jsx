import { useEffect, useMemo, useState } from "react";
import { FaDownload, FaTicketAlt, FaExclamationCircle, FaClock, FaCheckCircle } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/ticketApi";
import "./Reports.css";

function Reports() {

    const [tickets, setTickets] = useState([]);
    const [period, setPeriod] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            setLoading(true);

            const response = await API.get("/tickets");

            setTickets(response.data.tickets || []);

        } catch (err) {
            console.error("Reports error:", err);
        } finally {
            setLoading(false);
        }
    };


    /* =========================
       DATE FILTER
    ========================= */

    const filteredTickets = useMemo(() => {

        if (period === "all") {
            return tickets;
        }

        const days = Number(period);

        const cutoff = new Date();

        cutoff.setDate(cutoff.getDate() - days);

        return tickets.filter(ticket => {

            if (!ticket.created_at) return false;

            return new Date(ticket.created_at) >= cutoff;

        });

    }, [tickets, period]);


    /* =========================
       STATUS COUNTS
    ========================= */

    const totalTickets = filteredTickets.length;

    const openTickets =
        filteredTickets.filter(t => t.status === "Open").length;

    const inProgressTickets =
        filteredTickets.filter(t => t.status === "In Progress").length;

    const resolvedTickets =
        filteredTickets.filter(t => t.status === "Resolved").length;

    const closedTickets =
        filteredTickets.filter(t => t.status === "Closed").length;


    /* =========================
       RESOLUTION RATE
    ========================= */

    const resolutionRate = totalTickets
        ? Math.round(
            ((resolvedTickets + closedTickets) / totalTickets) * 100
        )
        : 0;


    /* =========================       PRIORITY
    ========================= */

    const priorities = [
        "Low",
        "Medium",
        "High",
        "Critical"
    ];

    const priorityCounts = priorities.map(priority => ({
        name: priority,
        count: filteredTickets.filter(
            ticket => ticket.priority === priority
        ).length
    }));


    /* =========================
       CATEGORY
    ========================= */

    const categoryMap = {};

    filteredTickets.forEach(ticket => {

        const category = ticket.category || "General";

        categoryMap[category] =
            (categoryMap[category] || 0) + 1;

    });

    const categoryCounts = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);


    /* =========================
       STATUS
    ========================= */

    const statusData = [
        {
            name: "Open",
            count: openTickets
        },
        {
            name: "In Progress",
            count: inProgressTickets
        },
        {
            name: "Resolved",
            count: resolvedTickets
        },
        {
            name: "Closed",
            count: closedTickets
        }
    ];


    /* =========================
       EXPORT CSV
    ========================= */

    const exportCSV = () => {

        if (!filteredTickets.length) {
            alert("There are no tickets to export.");
            return;
        }

        const headers = [
            "Ticket ID",
            "Subject",
            "Category",
            "Priority",
            "Status",
            "Requester",
            "Created"
        ];

        const rows = filteredTickets.map(ticket => [
            ticket.id,
            ticket.ticket_title || "",
            ticket.category || "General",
            ticket.priority || "Medium",
            ticket.status || "Open",
            ticket.requester_name || ticket.requester_name || ticket.full_name || "N/A",
            ticket.created_at
                ? new Date(ticket.created_at).toLocaleString()
                : ""
        ]);

        const csvContent = [
            headers,
            ...rows
        ]
            .map(row =>
                row.map(value =>
                    `"${String(value).replace(/"/g, '""')}"`
                ).join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "issue-tracker-report.csv";

        link.click();

        URL.revokeObjectURL(url);
    };


    /* =========================
       RECENT TICKETS
    ========================= */

    const recentTickets = [...filteredTickets]
        .sort(
            (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
        )
        .slice(0, 5);


    if (loading) {

        return (
            <>
                <Sidebar />

                <div className="dashboard-content">

                    <Navbar />

                    <div className="reports-page">

                        <div className="reports-loading">
                            Loading analytics...
                        </div>

                    </div>

                </div>
            </>
        );

    }


    return (

        <>

            <Sidebar />

            <div className="dashboard-content">

                <Navbar />

                <main className="reports-page">


                    {/* HEADER */}

                    <div className="reports-header">

                        <div>

                            <div className="reports-eyebrow">
                                SUPPORT INTELLIGENCE
                            </div>

                            <h1>
                                Reports & Analytics
                            </h1>

                            <p>
                                Monitor ticket volume, workload,
                                priorities and resolution progress.
                            </p>

                        </div>


                        <div className="reports-actions">

                            <select
                                value={period}
                                onChange={(e) =>
                                    setPeriod(e.target.value)
                                }
                                className="period-select"
                            >

                                <option value="all">
                                    All Time
                                </option>

                                <option value="7">
                                    Last 7 Days
                                </option>

                                <option value="30">
                                    Last 30 Days
                                </option>

                                <option value="90">
                                    Last 90 Days
                                </option>

                            </select>


                            <button
                                className="export-button"
                                onClick={exportCSV}
                            >

                                <FaDownload />

                                Export CSV

                            </button>

                        </div>

                    </div>


                    {/* KPI CARDS */}

                    <section className="reports-kpi-grid">

                        <div className="report-kpi-card">

                            <div className="kpi-icon blue">
                                <FaTicketAlt />
                            </div>

                            <div>

                                <span>Total Tickets</span>

                                <strong>
                                    {totalTickets}
                                </strong>

                            </div>

                        </div>


                        <div className="report-kpi-card">

                            <div className="kpi-icon orange">
                                <FaExclamationCircle />
                            </div>

                            <div>

                                <span>Open</span>

                                <strong>
                                    {openTickets}
                                </strong>

                            </div>

                        </div>


                        <div className="report-kpi-card">

                            <div className="kpi-icon purple">
                                <FaClock />
                            </div>

                            <div>

                                <span>In Progress</span>

                                <strong>
                                    {inProgressTickets}
                                </strong>

                            </div>

                        </div>


                        <div className="report-kpi-card">

                            <div className="kpi-icon green">
                                <FaCheckCircle />
                            </div>

                            <div>

                                <span>Resolved / Closed</span>

                                <strong>
                                    {resolvedTickets + closedTickets}
                                </strong>

                            </div>

                        </div>

                    </section>


                    {/* RESOLUTION SUMMARY */}

                    <section className="resolution-card">

                        <div>

                            <span className="analytics-label">
                                RESOLUTION RATE
                            </span>

                            <h2>
                                {resolutionRate}%
                            </h2>

                            <p>
                                Tickets resolved or closed
                                during the selected period.
                            </p>

                        </div>


                        <div className="resolution-bar">

                            <div
                                style={{
                                    width: `${resolutionRate}%`
                                }}
                            />

                        </div>

                    </section>


                    {/* ANALYTICS GRID */}

                    <section className="analytics-grid">


                        {/* STATUS */}

                        <div className="analytics-card">

                            <div className="analytics-card-header">

                                <div>

                                    <h3>
                                        Ticket Status
                                    </h3>

                                    <span>
                                        Current workflow distribution
                                    </span>

                                </div>

                            </div>


                            <div className="status-list">

                                {statusData.map(item => {

                                    const percentage =
                                        totalTickets
                                            ? Math.round(
                                                (item.count /
                                                    totalTickets) *
                                                100
                                            )
                                            : 0;

                                    return (

                                        <div
                                            className="status-row"
                                            key={item.name}
                                        >

                                            <div className="status-row-top">

                                                <span>
                                                    {item.name}
                                                </span>

                                                <strong>
                                                    {item.count}
                                                </strong>

                                            </div>

                                            <div className="status-progress">

                                                <div
                                                    className={`status-progress-fill ${item.name
                                                        .toLowerCase()
                                                        .replace(" ", "-")}`}
                                                    style={{
                                                        width: `${percentage}%`
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>


                        {/* PRIORITY */}

                        <div className="analytics-card">

                            <div className="analytics-card-header">

                                <div>

                                    <h3>
                                        Priority Distribution
                                    </h3>

                                    <span>
                                        Ticket urgency breakdown
                                    </span>

                                </div>

                            </div>


                            <div className="priority-list">

                                {priorityCounts.map(item => {

                                    const percentage =
                                        totalTickets
                                            ? Math.round(
                                                (item.count /
                                                    totalTickets) *
                                                100
                                            )
                                            : 0;

                                    return (

                                        <div
                                            className="priority-row"
                                            key={item.name}
                                        >

                                            <div>

                                                <span
                                                    className={`priority-dot ${item.name.toLowerCase()}`}
                                                />

                                                <span>
                                                    {item.name}
                                                </span>

                                            </div>

                                            <strong>
                                                {item.count}
                                            </strong>

                                            <small>
                                                {percentage}%
                                            </small>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>


                        {/* CATEGORIES */}

                        <div className="analytics-card category-card">

                            <div className="analytics-card-header">

                                <div>

                                    <h3>
                                        Categories
                                    </h3>

                                    <span>
                                        Most active support areas
                                    </span>

                                </div>

                            </div>


                            {categoryCounts.length === 0 ? (

                                <div className="empty-report">
                                    No category data available.
                                </div>

                            ) : (

                                <div className="category-list">

                                    {categoryCounts.map(
                                        ([category, count]) => {

                                            const percentage =
                                                totalTickets
                                                    ? Math.round(
                                                        (count /
                                                            totalTickets) *
                                                        100
                                                    )
                                                    : 0;

                                            return (

                                                <div
                                                    className="category-row"
                                                    key={category}
                                                >

                                                    <div className="category-info">

                                                        <span>
                                                            {category}
                                                        </span>

                                                        <strong>
                                                            {count}
                                                        </strong>

                                                    </div>

                                                    <div className="category-progress">

                                                        <div
                                                            style={{
                                                                width: `${percentage}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>


                        {/* RECENT TICKETS */}

                        <div className="analytics-card recent-card">

                            <div className="analytics-card-header">

                                <div>

                                    <h3>
                                        Recent Tickets
                                    </h3>

                                    <span>
                                        Latest support activity
                                    </span>

                                </div>

                            </div>


                            {recentTickets.length === 0 ? (

                                <div className="empty-report">
                                    No tickets available.
                                </div>

                            ) : (

                                <div className="recent-ticket-list">

                                    {recentTickets.map(ticket => (

                                        <div
                                            className="recent-ticket"
                                            key={ticket.id}
                                        >

                                            <div className="recent-ticket-id">
                                                #{ticket.id}
                                            </div>

                                            <div className="recent-ticket-info">

                                                <strong>
                                                    {ticket.ticket_title}
                                                </strong>

                                                <span>
                                                    {ticket.requester_name ||
                                                        ticket.full_name ||
                                                        "Unknown requester"}
                                                </span>

                                            </div>

                                            <span
                                                className={`recent-status ${ticket.status
                                                    ?.toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {ticket.status}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </div>

                    </section>

                </main>

            </div>

        </>

    );

}

export default Reports;

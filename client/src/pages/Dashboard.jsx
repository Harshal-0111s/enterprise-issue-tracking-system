import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import API from "../api/ticketApi";

import "../styles/Dashboard.css";
import "../styles/Card.css";

function Dashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        inProgress: 0,
        resolved: 0,
        closed: 0
    });

    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        fetchDashboardStats();
    }, [navigate]);

    const fetchDashboardStats = async () => {
        try {
            const statsResponse = await API.get("/tickets/stats");
            setStats(statsResponse.data.stats);

            const ticketResponse = await API.get("/tickets");
            setTickets(ticketResponse.data.tickets);
        } catch (error) {
            console.log(error);
        }
    };

    const handleCardClick = (status) => {
        if (status === "all") {
            navigate("/view-tickets");
        } else {
            navigate(`/view-tickets?status=${encodeURIComponent(status)}`);
        }
    };

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "open":
                return "status-open";
            case "in progress":
                return "status-progress";
            case "resolved":
                return "status-resolved";
            case "closed":
                return "status-closed";
            default:
                return "";
        }
    };

    return (
        <div>
            <Sidebar />

            <div className="dashboard-content">
                <Navbar />

                <div className="main-content">

                    <h1>Dashboard</h1>
                    <p>Welcome to Issue Tracking System</p>

                    {/* Dashboard Statistics */}
                    <div className="cards-container">

                        <div
                            onClick={() => handleCardClick("all")}
                            className="dashboard-card-clickable"
                        >
                            <DashboardCard
                                title="Total Tickets"
                                value={stats.total}
                                color="#2563EB"
                            />
                        </div>

                        <div
                            onClick={() => handleCardClick("Open")}
                            className="dashboard-card-clickable"
                        >
                            <DashboardCard
                                title="Open Tickets"
                                value={stats.open}
                                color="#F59E0B"
                            />
                        </div>

                        <div
                            onClick={() => handleCardClick("In Progress")}
                            className="dashboard-card-clickable"
                        >
                            <DashboardCard
                                title="In Progress"
                                value={stats.inProgress}
                                color="#8B5CF6"
                            />
                        </div>

                        <div
                            onClick={() => handleCardClick("Resolved")}
                            className="dashboard-card-clickable"
                        >
                            <DashboardCard
                                title="Resolved"
                                value={stats.resolved}
                                color="#22C55E"
                            />
                        </div>

                        <div
                            onClick={() => handleCardClick("Closed")}
                            className="dashboard-card-clickable"
                        >
                            <DashboardCard
                                title="Closed"
                                value={stats.closed}
                                color="#EF4444"
                            />
                        </div>

                    </div>

                    {/* Recent Tickets */}
                    <div className="recent-tickets-section">

                        <div className="section-header">
                            <h2>Recent Tickets</h2>

                            <button
                                className="view-all-button"
                                onClick={() => navigate("/view-tickets")}
                            >
                                View All
                            </button>
                        </div>

                        <div className="table-container">

                            <table className="tickets-table">

                                <thead>
                                    <tr>
                                        <th>Ticket ID</th>
                                        <th>Subject</th>
                                        <th>Ticket Owner</th>
                                        <th>Status</th>
                                        <th>Priority</th>
                                        <th>Date & Time</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {tickets.length === 0 ? (

                                        <tr>
                                            <td colSpan="6" className="no-tickets">
                                                No tickets available
                                            </td>
                                        </tr>

                                    ) : (

                                        tickets
                                            .slice()
                                            .sort(
                                                (a, b) =>
                                                    new Date(b.created_at) -
                                                    new Date(a.created_at)
                                            )
                                            .slice(0, 5)
                                            .map((ticket) => (

                                                <tr
                                                    key={ticket.id}
                                                    onClick={() =>
                                                        navigate("/view-tickets")
                                                    }
                                                    className="ticket-row"
                                                >

                                                    <td className="ticket-id">
                                                        #{ticket.id}
                                                    </td>

                                                    <td>
                                                        {ticket.ticket_title}
                                                    </td>

                                                    <td>
                                                        {ticket.email ||
                                                            ticket.created_by ||
                                                            "N/A"}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={`status-badge ${getStatusClass(
                                                                ticket.status
                                                            )}`}
                                                        >
                                                            {ticket.status}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {ticket.priority || "Normal"}
                                                    </td>

                                                    <td>
                                                        {ticket.created_at
                                                            ? new Date(
                                                                ticket.created_at
                                                            ).toLocaleString()
                                                            : "N/A"}
                                                    </td>

                                                </tr>

                                            ))
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;

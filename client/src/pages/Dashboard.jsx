import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import API from "../api/ticketApi";
import TicketStatusChart from "../charts/TicketStatusChart";

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
            alert("Unable to load dashboard.");

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

                    <div className="cards-container">

                        <DashboardCard
                            title="Total Tickets"
                            value={stats.total}
                            color="#2563EB"
                        />

                        <DashboardCard
                            title="Open Tickets"
                            value={stats.open}
                            color="#F59E0B"
                        />

                        <DashboardCard
                            title="In Progress"
                            value={stats.inProgress}
                            color="#8B5CF6"
                        />

                        <DashboardCard
                            title="Resolved"
                            value={stats.resolved}
                            color="#22C55E"
                        />

                        <DashboardCard
                            title="Closed"
                            value={stats.closed}
                            color="#EF4444"
                        />

                    </div>

                    <br />

                    <h2>Ticket Analytics</h2>

                    <div
                        style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "10px",
                            height: "350px",
                            marginBottom: "30px"
                        }}
                    >
                        <TicketStatusChart stats={stats} />
                    </div>

                    <h2>Recent Tickets</h2>

                    <table>

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Priority</th>
                                <th>Status</th>
                            </tr>

                        </thead>

                        <tbody>

                            {tickets.slice(0, 5).map((ticket) => (

                                <tr key={ticket.id}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.ticket_title}</td>
                                    <td>{ticket.priority}</td>
                                    <td>{ticket.status}</td>
                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;